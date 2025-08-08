'use client';

import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {
  const navItems = [
    { name: 'Top-Up', href: '#top-up' },
    { name: 'Tutorial', href: '#' },
    { name: 'Calculator', href: '#' },
    { name: 'Admin', href: '#' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/50 backdrop-blur-lg"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Gem className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">RbxTopUp</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <Button asChild className="hidden md:flex" size="sm">
            <Link href="#top-up">Get Started</Link>
        </Button>
      </div>
    </motion.header>
  );
}
