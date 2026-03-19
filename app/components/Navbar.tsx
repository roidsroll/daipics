// app/components/Navbar.tsx
"use client"; // This component needs client-side interactivity
import Link from 'next/link';
import { useState } from 'react';
import { Palette, Menu, ShoppingCart, Trash2, ExternalLink, Minus, Plus } from 'lucide-react'; 
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '../../app/context/CartContext';

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalQuantity, totalPrice, cartItems } = useCart();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Canvas", href: "/canvas" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (totalQuantity === 0) return;
    
    const phoneNumber = '6285711134864';
    
    const itemsText = cartItems
      .map(item => `- Card Item ${item.itemId} (x${item.quantity || 1})`)
      .join('\n');

    const messageTemplate = `Hi, I'm interested in purchasing:\n${itemsText}\n\nWhat's the total price? Do you ship internationally?\n\nThanks!`;
    const message = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setIsCartOpen(false);
  };

  const CartContent = () => {
    const { cartItems, totalQuantity, totalPrice, updateItemQuantity } = useCart(); // Get updateItemQuantity from context

    const handleDecreaseQuantity = (itemId: string | number, currentQuantity: number) => {
      updateItemQuantity(itemId, currentQuantity - 1);
    };

    const handleIncreaseQuantity = (itemId: string | number, currentQuantity: number) => {
      updateItemQuantity(itemId, currentQuantity + 1);
    };

    return (
      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center py-8 text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
              {cartItems.map((item, index) => (
                <div key={`${item.itemId}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded bg-gray-200 overflow-hidden">
                       <img src={item.src} alt={item.title} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-blue-500 font-mono">ID: {item.itemId}</p>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDecreaseQuantity(item.itemId, item.quantity)}
                            disabled={item.quantity <= 1} // Disable if quantity is 1
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 rounded-full font-bold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleIncreaseQuantity(item.itemId, item.quantity)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                <span className="font-bold">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Total Price:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md dark:bg-gray-800 sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <span className="flex items-center text-2xl font-bold text-gray-800 dark:text-white cursor-pointer font-pacifico">
            <Palette className="h-6 w-6 mr-2" />
            daipics
          </span>
        </Link>
      </div>
      <div className="hidden md:flex space-x-6 items-center">
        {navLinks.map((link) => (
          <Link href={link.href} key={link.name}>
            <span className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-colors duration-200">
              {link.name}
            </span>
          </Link>
        ))}
        
        {/* Desktop Cart Dialog */}
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogTrigger asChild>
            <button className="relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-colors duration-200 flex items-center">
              <ShoppingCart className="h-6 w-6" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in">
                  {totalQuantity}
                </span>
              )}
              {totalPrice > 0 && (
                <span className="ml-2 text-sm font-semibold hidden lg:inline">
                  {formatPrice(totalPrice)}
                </span>
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> Shopping Cart
              </DialogTitle>
              <DialogDescription>
                Review your items and proceed to WhatsApp checkout.
              </DialogDescription>
            </DialogHeader>
            <CartContent />
            <DialogFooter className="mt-6">
              <Button onClick={handleCheckout} className="w-full" disabled={cartItems.length === 0}>
                Checkout via WhatsApp <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ThemeToggle />
      </div>

      {/* Mobile menu */}
      <div className="md:hidden flex items-center space-x-2">
        {/* Mobile Cart Dialog */}
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogTrigger asChild>
            <button className="relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-colors duration-200 p-2 rounded-md">
              <ShoppingCart className="h-6 w-6" />
              {totalQuantity > 0 && (
                <span className="absolute -top-0 -right-0 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in">
                  {totalQuantity}
                </span>
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Shopping Cart</DialogTitle>
            </DialogHeader>
            <CartContent />
            <DialogFooter className="mt-6">
              <Button onClick={handleCheckout} className="w-full" disabled={cartItems.length === 0}>
                Checkout via WhatsApp
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="font-pacifico text-2xl">daipics Menu</SheetTitle>

            </SheetHeader>
            <nav className="flex flex-col gap-6 mt-8 p-4">
              {navLinks.map((link) => (
                <Link href={link.href} key={link.name} onClick={() => setIsSheetOpen(false)}>
                  <span className="text-xl font-semibold text-gray-800 dark:text-gray-200 hover:text-primary transition-colors duration-200 block py-2">
                    {link.name}
                  </span>
                </Link>
              ))}
              <div className="mt-4 border-t pt-4">
                <ThemeToggle />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
