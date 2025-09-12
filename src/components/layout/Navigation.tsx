'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Instructions', href: '/instructions' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        pathname === href
          ? 'text-primary border-b-2 border-primary pb-1'
          : 'text-muted-foreground'
      )}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => (
    <Link
      href={href}
      className={cn(
        'block px-4 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted rounded-md',
        pathname === href
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground'
      )}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navigationItems.map((item) => (
          <NavLink key={item.href} href={item.href}>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden p-2"
            size="sm"
            aria-label="Open menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col space-y-4 mt-8">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <MobileNavLink key={item.href} href={item.href}>
                  {item.name}
                </MobileNavLink>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-6">
              <div className="space-y-2">
                <MobileNavLink href="/terms">Terms & Conditions</MobileNavLink>
                <MobileNavLink href="/privacy">Privacy Policy</MobileNavLink>
                <MobileNavLink href="/disclaimer">Disclaimer</MobileNavLink>
                <MobileNavLink href="/dmca">DMCA</MobileNavLink>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}