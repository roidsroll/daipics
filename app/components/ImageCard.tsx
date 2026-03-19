// app/components/ImageCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import ImageDetailChatbox from './ImageDetailChatbox';
import { useCart } from '../../app/context/CartContext'; // Import useCart
import { motion } from 'framer-motion';

interface ImageCardProps {
  src: string;
  alt: string;
  path: string;
  title: string;
  description?: string;
  hashtags?: string[];
  philosophy: string;
  date: string;
  itemId: string | number;
}

export default function ImageCard({ src, alt, path, title, description, hashtags, philosophy, date, itemId }: ImageCardProps) {
  const { addToCart, cartItems } = useCart();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to DialogTrigger
    try {
      await addToCart({ itemId, title, src, quantity: 1 }); // Pass quantity: 1
      setIsSuccessOpen(true);
      setTimeout(() => setIsSuccessOpen(false), 2000); // Close after 2 seconds
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleBuyItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to DialogTrigger
    const phoneNumber = '6285711134864';
    
    // Construct the items list for the message
    // If the current item is already in the cart, use its quantity
    // If not, add it with quantity 1 for the message context
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

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Card className="w-full shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer animate-fade-in-up flex flex-col justify-between h-full min-h-[400px]">
            <CardHeader className="p-0 relative">
              <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-2">
                <Image
                  src={src}
                  alt={alt}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-t-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 min-h-[160px] overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
              {description && <CardDescription className="text-sm text-gray-600 dark:text-gray-300 font-poppins mb-2">{description}</CardDescription>}
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 font-poppins whitespace-nowrap">Rp 25.000</p>
                  <p className="text-xs text-gray-400 italic font-poppins">Bisa Nego</p>
                </div>
                {hashtags && hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hashtags.map((tag, index) => (
                      <span key={index} className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-800 dark:text-blue-100 font-poppins">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t text-sm text-gray-500 dark:text-gray-400 font-poppins flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add To Cart
              </Button>
              <Button size="sm" onClick={handleBuyItem}>
                Buy Item
              </Button>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <ImageDetailChatbox
          src={src}
          alt={alt}
          title={title}
          philosophy={philosophy}
          hashtags={hashtags}
          path={path}
          date={date}
          itemId={itemId}
        />
      </Dialog>

      {/* Success Notification Modal */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.polyline
                    points="20 6 9 17 4 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </svg>
              </motion.div>
              Added to Cart!
            </DialogTitle>
            <DialogDescription>
              Item <strong>"{title}"</strong> successfully added to your cart.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            className="flex items-center gap-4 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
             <div className="relative w-16 h-16 rounded bg-gray-100 overflow-hidden border">
                <img src={src} alt={title} className="object-cover w-full h-full" />
             </div>
             <div>
                <p className="font-bold">{title}</p>
                <p className="text-sm text-gray-500">ID: {itemId}</p>
             </div>
          </motion.div>
          <DialogFooter>
             <Button onClick={() => setIsSuccessOpen(false)} className="w-full">
                Continue Shopping
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}