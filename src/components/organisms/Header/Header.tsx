"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCartItemCount } from "@/features/cart/redux/cartSelectors";
import { toggleCart } from "@/features/cart/redux/cartSlice";
import Logo from "@/components/atoms/Logo/Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartItemCount);

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  const navLinks = [
    { href: "/products", label: "Productos" },
    { href: "/products?filter=new", label: "Nuevos" },
    { href: "/products?filter=sale", label: "Ofertas" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {/* Primera Fila */}
      <div className="container relative mx-auto flex h-16 items-center px-4">
        {/* Lado Izquierdo: Menu (mobile) y Buscar */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Centro: Logo (Absoluto para centrado perfecto) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        {/* Lado Derecho: Carrito */}
        <div className="ml-auto flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Segunda Fila: Menu Desktop */}
      <nav className="hidden border-t md:block">
        <div className="container mx-auto flex h-10 items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Slidepanel */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
