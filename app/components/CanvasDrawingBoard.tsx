"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button"; // Assuming Shadcn UI button
import { Input } from "@/components/ui/input";   // Assuming Shadcn UI input for color/stroke
import { Slider } from "@/components/ui/slider"; // Assuming Shadcn UI slider for stroke width
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming Shadcn UI dropdown for tools

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  color: string;
  width: number;
  points: Point[];
}

const CanvasDrawingBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set canvas resolution for sharper images
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        contextRef.current = ctx;

        // Save initial blank state to history
        if (historyIndex === -1) {
          saveState();
        }
      }
    }
  }, [color, strokeWidth, historyIndex]);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      // Clear redo history if a new stroke is started after undo
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(contextRef.current.getImageData(0, 0, canvas.width, canvas.height));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex]);


  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      if (contextRef.current && canvasRef.current) {
        contextRef.current.closePath();
        saveState();
      }
    }
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      saveState(); // Save cleared state
    }
  }, [saveState]);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "daipics-drawing.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0 && contextRef.current && canvasRef.current) {
      const newIndex = historyIndex - 1;
      contextRef.current.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && contextRef.current && canvasRef.current) {
      const newIndex = historyIndex + 1;
      contextRef.current.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);


  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-20 h-10 p-1 cursor-pointer"
          title="Select Color"
        />
        <div className="w-32 flex items-center space-x-2">
          <label htmlFor="stroke-width" className="text-sm dark:text-gray-200">Width:</label>
          <Slider
            id="stroke-width"
            min={1}
            max={20}
            step={1}
            value={[strokeWidth]}
            onValueChange={(val) => setStrokeWidth(val[0])}
            className="w-[100px]"
            aria-label="Stroke width"
          />
          <span className="text-sm dark:text-gray-200">{strokeWidth}</span>
        </div>
        <Button onClick={undo} disabled={historyIndex <= 0}>Undo</Button>
        <Button onClick={redo} disabled={historyIndex >= history.length - 1}>Redo</Button>
        <Button onClick={clearCanvas}>Clear</Button>
        <Button onClick={downloadImage}>Download</Button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md touch-none"
        style={{ width: "100%", height: "500px" }} // Fixed height, width will be handled by canvas.offsetWidth
      ></canvas>
    </div>
  );
};

export default CanvasDrawingBoard;
