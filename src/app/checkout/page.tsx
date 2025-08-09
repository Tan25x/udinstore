'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/header';
import Footer from '@/components/footer';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Gem, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const RobuxCheckoutSchema = z.object({
  username: z.string(),
  robuxAmount: z.number(),
  gamepassUrl: z.string().url({ message: 'Please enter a valid Game Pass URL.' }),
  coupon: z.string().optional(),
  discordUsername: z.string().optional(),
});

type RobuxCheckoutFormValues = z.infer<typeof RobuxCheckoutSchema>;

function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const username = searchParams.get('username') || '';
  const robuxAmount = Number(searchParams.get('robuxAmount')) || 0;
  const gamepassPrice = Number(searchParams.get('gamepassPrice')) || 0;
  const gamepassUrl = searchParams.get('gamepassUrl') || '';
  const discordUsername = searchParams.get('discordUsername') || '';
  const totalPrice = Number(searchParams.get('totalPayment')) || 0;

  const form = useForm<RobuxCheckoutFormValues>({
    resolver: zodResolver(RobuxCheckoutSchema),
    defaultValues: {
      username: username,
      robuxAmount: robuxAmount,
      gamepassUrl: gamepassUrl,
      coupon: '',
      discordUsername: discordUsername,
    },
  });

  useEffect(() => {
    if (!username || !robuxAmount || !gamepassUrl || !totalPrice) {
        toast({
            title: 'Error',
            description: 'Missing order details. Please start again.',
            variant: 'destructive',
        });
        router.push('/');
    }
  }, [username, robuxAmount, gamepassUrl, totalPrice, router, toast]);
  

  const onSubmit: SubmitHandler<RobuxCheckoutFormValues> = async (data) => {
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
    setShowConfirmation(false);
    setOrderId(null);
    router.push('/');
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
                       <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input readOnly value={username} className="bg-input" />
                          </FormControl>
                        </FormItem>
                      <FormField
                        control={form.control}
                        name="gamepassUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gamepass Link</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.roblox.com/game-pass/..." {...field} className="bg-input" readOnly/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormItem>
                            <FormLabel>Jumlah</FormLabel>
                                <div className="relative">
                                    <Input readOnly type="number" value={robuxAmount} className="bg-input pl-10" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                                </div>
                        </FormItem>
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
                       {discordUsername && <FormItem>
                          <FormLabel>Discord Username</FormLabel>
                          <FormControl>
                            <Input readOnly value={discordUsername} className="bg-input" />
                          </FormControl>
                        </FormItem>}
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

export default function CheckoutPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="fixed inset-0 -z-10 h-full w-full bg-background">
                <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(109,40,217,0.3),rgba(255,255,255,0))]"></div>
                <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(217,40,159,0.3),rgba(255,255,255,0))]"></div>
            </div>
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
                <div className="mx-auto max-w-4xl text-center mb-12">
                     <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl font-headline">
                        Checkout
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                        Please confirm your order details and proceed with the payment.
                    </p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <CheckoutForm />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
