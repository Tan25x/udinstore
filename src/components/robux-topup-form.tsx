'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calculator, CheckCircle, Gem, Loader2, QrCode } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const RobuxTopUpSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  robuxAmount: z.number().min(100, { message: 'Minimum 100 Robux.' }).max(10000, { message: 'Maximum 10,000 Robux.' }),
  gamepassUrl: z.string().url({ message: 'Please enter a valid Game Pass URL.' }),
});

type RobuxTopUpFormValues = z.infer<typeof RobuxTopUpSchema>;

const ROBUX_TAX_RATE = 0.3;

const presetAmounts = [400, 800, 1700, 4500];

export function RobuxTopUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<RobuxTopUpFormValues>({
    resolver: zodResolver(RobuxTopUpSchema),
    defaultValues: {
      username: '',
      robuxAmount: 400,
      gamepassUrl: '',
    },
  });

  const robuxAmount = form.watch('robuxAmount');
  const gamepassPrice = Math.ceil(robuxAmount / (1 - ROBUX_TAX_RATE));
  const taxAmount = gamepassPrice - robuxAmount;

  const onSubmit: SubmitHandler<RobuxTopUpFormValues> = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // On success:
    const newOrderId = `UDN-${Date.now()}`;
    setOrderId(newOrderId);
    setShowConfirmation(true);
    setIsLoading(false);
    toast({
      title: 'Order Ready for Payment!',
      description: 'Please scan the QR code to complete your purchase.',
    });
  };

  const resetForm = () => {
    form.reset();
    setShowConfirmation(false);
    setOrderId(null);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10">
      <AnimatePresence mode="wait">
        {showConfirmation && orderId ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Dialog open={showConfirmation} onOpenChange={resetForm}>
              <DialogContent className="bg-background/80 backdrop-blur-lg border-primary/30">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <CheckCircle className="text-green-500" />
                    Order Confirmation
                  </DialogTitle>
                  <DialogDescription>
                    Your order <span className="font-bold text-primary">{orderId}</span> is ready. Scan the QR code to pay.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 text-center">
                  <div className="flex justify-center">
                    <Image src="https://placehold.co/256x256.png" data-ai-hint="payment qrcode" alt="QRIS Payment Code" width={256} height={256} className="rounded-lg border-4 border-primary/50" />
                  </div>
                  <p className="mt-4 text-lg font-bold">Total: Rp {gamepassPrice.toLocaleString('id-ID')}</p>
                  <p className="text-sm text-muted-foreground">Expires in 5 minutes</p>
                </div>
                 <Button onClick={resetForm} variant="outline" className="w-full">
                    Create a New Order
                  </Button>
              </DialogContent>
            </Dialog>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="text-primary" />
                <span>Custom Top-Up</span>
              </CardTitle>
              <CardDescription>
                Enter your details below to start the top-up process.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {presetAmounts.map(amount => (
                        <Button key={amount} type="button" variant={robuxAmount === amount ? "default" : "outline"} onClick={() => form.setValue('robuxAmount', amount, { shouldValidate: true })}>
                            {amount} R$
                        </Button>
                    ))}
                  </div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roblox Username</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. builderman" {...field} className="bg-black/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="robuxAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount of Robux (R$)</FormLabel>
                        <FormControl>
                           <div className="flex items-center gap-4">
                               <Slider
                                 min={100}
                                 max={10000}
                                 step={50}
                                 value={[field.value]}
                                 onValueChange={(value) => field.onChange(value[0])}
                               />
                               <span className="font-bold text-primary w-24 text-center">{field.value.toLocaleString()} R$</span>
                           </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Alert className="bg-primary/5 border-primary/20">
                    <Calculator className="h-4 w-4 text-primary" />
                    <AlertTitle>Price Calculation</AlertTitle>
                    <AlertDescription>
                        <div className="space-y-1 text-sm mt-2">
                            <p>You receive: <span className="font-bold text-foreground">{robuxAmount.toLocaleString()} R$</span></p>
                            <p>30% Roblox Tax: <span className="font-bold text-foreground">{taxAmount.toLocaleString()} R$</span></p>
                            <p className="font-bold text-primary">Set Game Pass Price to: <span className="text-lg">{gamepassPrice.toLocaleString()} R$</span></p>
                        </div>
                    </AlertDescription>
                  </Alert>
                  <FormField
                    control={form.control}
                    name="gamepassUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Game Pass URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.roblox.com/game-pass/..." {...field} className="bg-black/20" />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="w-full shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
