// app/components/ImageDetailChatbox.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '../../app/context/CartContext';
import { Dialog } from '@/components/ui/dialog';

interface ImageDetailChatboxProps {
  src: string;
  alt: string;
  title: string;
  philosophy: string;
  hashtags?: string[];
  path: string; // Include path for display
  date: string; // Add date to interface
  itemId: string | number;
}

const TypingEffect: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Add a guard for undefined or null text
    if (!text) {
      setTypedText('');
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [text, delay, currentIndex]);

  return <span>{typedText}</span>;
};

export default function ImageDetailChatbox({ src, alt, title, philosophy, hashtags, path, date, itemId }: ImageDetailChatboxProps) {
  const { addToCart, cartItems } = useCart();
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [imageAnimated, setImageAnimated] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({ itemId, title, src, quantity: 1 }); // Pass quantity: 1
      setIsSuccessOpen(true);
      setTimeout(() => setIsSuccessOpen(false), 2000);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleBuyItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phoneNumber = '6285711134864';
    
    let itemsForMessage = [...cartItems];
    if (!itemsForMessage.find(i => i.itemId === itemId)) {
      itemsForMessage.push({ itemId, title, src, quantity: 1, price: 25000 });
    }

    const itemsText = itemsForMessage
      .map(item => `- Card Item ${item.itemId} (x${item.quantity || 1})`)
      .join('\n');

    const messageTemplate = `Hi, I'm interested in purchasing:\n${itemsText}\n\nWhat's the total price? Do you ship internationally?\n\nThanks!`;
    const message = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    // Reset typing effect when component mounts/remounts or props change
    setShowPhilosophy(false);
    setShowDate(false);
    setImageAnimated(false); // Reset image animation state

    const titleTypingDelay = title.length * 70;
    const philosophyDelay = titleTypingDelay + 500;
    const dateDelay = titleTypingDelay + 200;

    const timerPhilosophy = setTimeout(() => setShowPhilosophy(true), philosophyDelay);
    const timerDate = setTimeout(() => setShowDate(true), dateDelay);
    const timerImageAnimation = setTimeout(() => setImageAnimated(true), 100); // Trigger image animation shortly after modal opens

    return () => {
      clearTimeout(timerPhilosophy);
      clearTimeout(timerDate);
      clearTimeout(timerImageAnimation);
    };
  }, [title, philosophy, date]);

  return (
    <>
      <DialogContent className="sm:max-w-[900px] p-6 pt-10">
        <DialogHeader>
          <div className="flex justify-between items-center mb-2">
            <DialogTitle className="font-pacifico text-3xl">
              <TypingEffect text={title} delay={70} />
            </DialogTitle>
            <p className="text-gray-500 dark:text-gray-400 font-poppins text-sm flex-shrink-0">
              {showDate && <TypingEffect text={date} delay={50} />}
            </p>
          </div>
          <DialogDescription className="font-poppins text-base text-gray-700 dark:text-gray-300">
            {showPhilosophy && <TypingEffect text={philosophy} delay={30} />}
          </DialogDescription>
        </DialogHeader>
        <div className={`relative w-full h-[400px] sm:h-[500px] bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden my-4 ${imageAnimated ? 'animate-brush-reveal' : 'clip-hidden'}`}>
          <Image
            src={src}
            alt={alt}
            layout="fill"
            objectFit="contain"
            className="p-2"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {hashtags && hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <span key={index} className="text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-800 dark:text-blue-100 font-poppins">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-center">
            <div className="text-right mr-4">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-poppins">Rp 25.000</p>
              <p className="text-xs text-gray-400 italic font-poppins text-right">Bisa Nego</p>
            </div>
            <Button variant="outline" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add To Cart
            </Button>
            <Button onClick={handleBuyItem}>
              Buy Item
            </Button>
          </div>        </div>
        {/* Contextual Path/Origin Element */}
        <p className="text-sm text-gray-500 dark:text-gray-400 font-poppins mt-2">
          Origin: <span className="font-mono break-all text-blue-500 hover:underline cursor-pointer">#{hashtags?.[0] || 'unknown_source'}</span>
        </p>
      </DialogContent>

      {/* Success Notification Modal (Internal to Detail Modal) */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[425px] z-[100]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" /> Added to Cart!
            </DialogTitle>
            <DialogDescription>
              Item <strong>"{title}"</strong> successfully added to your cart.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
             <div className="relative w-16 h-16 rounded bg-gray-100 overflow-hidden border">
                <img src={src} alt={title} className="object-cover w-full h-full" />
             </div>
             <div>
                <p className="font-bold">{title}</p>
                <p className="text-sm text-gray-500">ID: {itemId}</p>
             </div>
          </div>
          <DialogFooter>
             <Button onClick={() => setIsSuccessOpen(false)} className="w-full">
                Close
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
