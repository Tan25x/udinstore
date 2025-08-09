'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import { AnimatedGradientText } from './ui/animated-gradient-text';

export default function Hero() {
  return (
    <section className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-20 md:px-6 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline">
          The <span className="text-primary">Cheapest & Safest</span> Robux Top-Ups.
        </h1>
        <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
          Get the best prices for Robux with our secure and automated top-up service. No passwords, no hassle. Just pure gaming fuel.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <Link href="#top-up">
            <AnimatedGradientText>
                Buy Now
            </AnimatedGradientText>
          </Link>
          <Link href="/tutorial">
             <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all hover:bg-primary/10 hover:text-primary-foreground hover:scale-105">
              Tutorial
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
