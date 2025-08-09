'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calculator, Gem, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const RobuxTopUpSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  robuxAmount: z.preprocess(
    (val) => Number(String(val)),
    z.number().min(70, { message: 'Minimum 70 Robux.' }).max(10000, { message: 'Maximum 10,000 Robux.' })
  ),
  gamepassUrl: z.string().url({ message: 'Please enter a valid Game Pass URL.' }),
  discordUsername: z.string().optional(),
});

type RobuxTopUpFormValues = z.infer<typeof RobuxTopUpSchema>;

const ROBUX_TAX_RATE = 0.3;

const priceList = [
    { robux: 70, price: 10000 },
    { robux: 100, price: 12500, discount: "12.5%" },
    { robux: 200, price: 28600 },
    { robux: 400, price: 57100 },
    { robux: 700, price: 100000 },
    { robux: 1000, price: 125000, discount: "12.5%" },
];

export function RobuxTopUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RobuxTopUpFormValues>({
    resolver: zodResolver(RobuxTopUpSchema),
    defaultValues: {
      username: '',
      robuxAmount: 100,
      gamepassUrl: '',
      discordUsername: '',
    },
  });
  
  const handlePriceSelect = (robux: number) => {
    form.setValue('robuxAmount', robux, { shouldValidate: true });
  };

  const robuxAmount = form.watch('robuxAmount');
  const gamepassPrice = robuxAmount > 0 ? Math.ceil(robuxAmount / (1 - ROBUX_TAX_RATE)) : 0;
  const taxAmount = gamepassPrice - robuxAmount;
  const selectedPriceItem = priceList.find(p => p.robux === robuxAmount);
  const totalPayment = selectedPriceItem ? selectedPriceItem.price : 'N/A';

  const onSubmit: SubmitHandler<RobuxTopUpFormValues> = async (data) => {
    setIsLoading(true);
    
    const params = new URLSearchParams({
      username: data.username,
      robuxAmount: data.robuxAmount.toString(),
      gamepassPrice: gamepassPrice.toString(),
      gamepassUrl: data.gamepassUrl,
    });

    if (data.discordUsername) {
        params.set('discordUsername', data.discordUsername);
    }
    
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto glass-card">
      <div className="glass-card-blob"></div>
      <div className="glass-card-bg">
        <div className="relative z-10 w-full">
            <Card className="w-full bg-transparent backdrop-blur-none border-none shadow-none">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Start Your Top-Up</CardTitle>
                    <CardDescription>Select a preset amount or enter details. We include the 30% Roblox tax.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                         <FormLabel>Price List</FormLabel>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                            {priceList.map(({ robux, price, discount }) => (
                                <div
                                    key={robux}
                                    onClick={() => handlePriceSelect(robux)}
                                    className={cn(
                                        "relative cursor-pointer rounded-lg border-2 bg-input/50 p-4 text-center transition-all hover:border-primary/80 hover:bg-input",
                                        robuxAmount === robux ? "border-primary bg-input" : "border-input"
                                    )}
                                >
                                    {discount && (
                                        <Badge variant="destructive" className="absolute -top-3 -right-3 text-xs">
                                            {discount}
                                        </Badge>
                                    )}
                                    <div className="mb-2 flex justify-center">
                                        <Gem className="h-8 w-8 text-primary" />
                                    </div>
                                    <p className="font-semibold">{robux} Robux</p>
                                    <p className="text-xs text-muted-foreground">Rp {price.toLocaleString('id-ID')}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Roblox Username</FormLabel>
                                <FormControl>
                                <Input placeholder="Your Roblox Username" {...field} className="bg-input" />
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
                        <FormField
                            control={form.control}
                            name="discordUsername"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discord Username (Optional)</FormLabel>
                                <FormControl>
                                <Input placeholder="your_discord_name" {...field} className="bg-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>

                    <div className="rounded-lg bg-input p-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-semibold">
                            <Calculator className="h-5 w-5 text-primary" />
                            <h3>Price Calculation</h3>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">You receive:</span>
                            <span>{robuxAmount > 0 ? robuxAmount.toLocaleString() : '...'} R$</span>
                        </div>
                            <div className="flex justify-between">
                            <span className="text-muted-foreground">30% Roblox Tax:</span>
                            <span>{taxAmount > 0 ? taxAmount.toLocaleString() : '...'} R$</span>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2 mt-2">
                            <span>Set Game Pass Price to:</span>
                            <span className='text-primary'>{gamepassPrice > 0 ? gamepassPrice.toLocaleString() : '...'} R$</span>
                        </div>
                         <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2 mt-2">
                            <span>You will pay:</span>
                            <span className='text-primary'>Rp {typeof totalPayment === 'number' ? totalPayment.toLocaleString('id-ID') : '...'}</span>
                        </div>
                        <FormDescription className="pt-2">
                            You must set your Game Pass to the exact price shown above.
                            <Link href="/tutorial" className="text-primary hover:underline ml-1">
                            Need help?
                            </Link>
                        </FormDescription>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full text-lg h-12 shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                        {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Proceeding...
                        </>
                        ) : (
                        'Proceed to Payment'
                        )}
                    </Button>
                </CardFooter>
            </form>
            </Form>
        </Card>
        </div>
      </div>
    </div>
  );
}
