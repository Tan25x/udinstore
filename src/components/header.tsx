'use client';

import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {

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
          <span className="text-xl font-bold text-foreground">ud1nshp</span>
        </Link>
        <div className="hidden md:flex items-center gap-2">
             <Button asChild variant="secondary" size="sm">
                <Link href="/tutorial">Tutorial</Link>
            </Button>
            <Button asChild size="sm">
                <Link href="/#top-up">Buy Now</Link>
            </Button>
        </div>
      </div>
    </motion.header>
  );
}
