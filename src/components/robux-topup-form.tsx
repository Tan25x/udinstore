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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Gem, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const RobuxTopUpSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  robuxAmount: z.preprocess(
    (val) => Number(String(val)),
    z.number().min(100, { message: 'Minimum 100 Robux.' }).max(10000, { message: 'Maximum 10,000 Robux.' })
  ),
  gamepassUrl: z.string().url({ message: 'Please enter a valid Game Pass URL.' }),
  coupon: z.string().optional(),
});

type RobuxTopUpFormValues = z.infer<typeof RobuxTopUpSchema>;

const ROBUX_TAX_RATE = 0.3;
const PRICE_PER_ROBUX = 150; // Example: Rp 150 per Robux

export function RobuxTopUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<RobuxTopUpFormValues>({
    resolver: zodResolver(RobuxTopUpSchema),
    defaultValues: {
      username: '',
      robuxAmount: 100,
      gamepassUrl: '',
      coupon: '',
    },
  });

  const robuxAmount = form.watch('robuxAmount');
  const gamepassPrice = Math.ceil(robuxAmount / (1 - ROBUX_TAX_RATE));
  const totalPrice = robuxAmount * PRICE_PER_ROBUX;

  const onSubmit: SubmitHandler<RobuxTopUpFormValues> = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
    <>
      <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
              {/* Left Side */}
              <div className="md:col-span-3 p-6 md:border-r md:border-primary/20">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Detail Information</h3>
                    <div className="mt-4 space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Example. BeliRbx123" {...field} className="bg-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gamepassUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gamepass Link</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.roblox.com/game-pass/..." {...field} className="bg-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="robuxAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jumlah</FormLabel>
                              <FormControl>
                                  <div className="relative">
                                      <Input type="number" {...field} className="bg-input pl-10" />
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                                  </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <div className="relative">
                                <Input readOnly value={gamepassPrice.toLocaleString('id-ID')} className="bg-input pl-10" />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              This is the Game Pass price to set on Roblox.
                            </p>
                        </FormItem>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-primary">Payment Method</h3>
                    <div className="mt-4">
                        <div className="flex items-center justify-between p-3 rounded-md border border-primary/30 bg-input">
                          <div className="flex items-center gap-3">
                            <Image src="https://placehold.co/100x25.png" alt="QRIS" width={60} height={15} data-ai-hint="payment method" />
                            <span className="font-semibold">QRIS</span>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="md:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-primary">Payment Summary</h3>
                <div className="mt-4 space-y-4">
                    <div>
                      <FormLabel>Discount Coupon</FormLabel>
                      <div className="flex gap-2 mt-1">
                        <FormField
                            control={form.control}
                            name="coupon"
                            render={({ field }) => (
                              <FormControl>
                                <Input placeholder="Enter Code Here" {...field} className="bg-input" />
                              </FormControl>
                            )}
                          />
                        <Button type="button" variant="secondary" className="shrink-0">Submit</Button>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-primary/20 pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount</span>
                            <span>Rp 0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Biaya Admin</span>
                            <span>Rp 0</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    
                    <Button type="submit" disabled={isLoading} className="w-full text-lg h-12 shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Beli Sekarang'
                      )}
                    </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </Card>
      
      <AnimatePresence>
        {showConfirmation && orderId && (
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
                <p className="mt-4 text-lg font-bold">Total: Rp {totalPrice.toLocaleString('id-ID')}</p>
                <p className="text-sm text-muted-foreground">Expires in 5 minutes</p>
              </div>
              <Button onClick={resetForm} variant="outline" className="w-full">
                  Create a New Order
                </Button>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
