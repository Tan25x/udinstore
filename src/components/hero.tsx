'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-20 md:grid-cols-2 md:px-6 lg:py-32">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 text-center md:text-left"
      >
        <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline">
          Instant Robux Top-Ups, <span className="text-primary">Seamlessly</span>.
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          Get your Robux in minutes with our secure and automated top-up service. No passwords, no hassle. Just pure gaming fuel.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row justify-center md:justify-start">
          <Link href="#top-up">
            <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:scale-105">
              Top-Up Now
            </Button>
          </Link>
          <Link href="#">
             <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all hover:bg-primary/10 hover:text-primary-foreground hover:scale-105">
              Learn More
            </Button>
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex justify-center"
      >
        <Image
          src="https://placehold.co/500x500.png"
          alt="Robux Top-up Illustration"
          width={500}
          height={500}
          className="rounded-lg"
          data-ai-hint="gaming currency finance"
        />
      </motion.div>
    </section>
  );
}
