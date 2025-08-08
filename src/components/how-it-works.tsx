'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator, Gamepad, QrCode } from 'lucide-react'

const steps = [
  {
    icon: <Calculator className="h-8 w-8 text-primary" />,
    title: 'Calculate & Price',
    description: 'Enter your username and desired Robux amount. We calculate the Game Pass price, including the 30% tax.',
  },
  {
    icon: <Gamepad className="h-8 w-8 text-primary" />,
    title: 'Create Game Pass',
    description: 'Create a new Game Pass on Roblox and set the price to the exact amount we calculated for you.',
  },
  {
    icon: <QrCode className="h-8 w-8 text-primary" />,
    title: 'Pay & Receive',
    description: 'Submit your Game Pass link and pay via QRIS. Your Robux are sent automatically after payment confirmation.',
  },
]

export function HowItWorks() {
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  }

  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">How It Works</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Topping up your Robux is a simple three-step process.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              custom={index}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full bg-white/5 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 transition-all hover:border-primary/40 hover:shadow-primary/20">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    {step.icon}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  {step.description}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
