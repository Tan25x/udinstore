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
import { Slider } from '@/components/ui/slider';

const RobuxTopUpSchema = z.object({
  robuxAmount: z.preprocess(
    (val) => Number(String(val).replace(/[^0-9]/g, '')),
    z.number().min(70, { message: 'Minimum 70 Robux.' }).max(10000, { message: 'Maximum 10,000 Robux.' })
  ),
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

const calculateCustomPrice = (amount: number) => {
    if (amount <= 0) return 0;
    
    // Find the closest smaller or equal price point
    let rateItem = priceList.reduce((prev, curr) => {
        return (curr.robux <= amount && curr.robux > prev.robux) ? curr : prev;
    });

    // For amounts over 1000, use the 1000 robux rate
    if (amount > 1000) {
        rateItem = priceList.find(p => p.robux === 1000)!;
    }

    const rate = rateItem.price / rateItem.robux;
    return Math.ceil(amount * rate);
};


export function RobuxTopUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RobuxTopUpFormValues>({
    resolver: zodResolver(RobuxTopUpSchema),
    defaultValues: {
      robuxAmount: 100,
    },
  });
  
  const robuxAmount = form.watch('robuxAmount');
  
  const handlePriceSelect = (robux: number) => {
    form.setValue('robuxAmount', robux, { shouldValidate: true, shouldDirty: true });
  };
  
  const handleSliderChange = (value: number[]) => {
    form.setValue('robuxAmount', value[0], { shouldValidate: true, shouldDirty: true });
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    form.setValue('robuxAmount', Number(value), { shouldValidate: true, shouldDirty: true });
  };

  const gamepassPrice = robuxAmount > 0 ? Math.ceil(robuxAmount / (1 - ROBUX_TAX_RATE)) : 0;
  const taxAmount = gamepassPrice - robuxAmount;
  
  const selectedPriceItem = priceList.find(p => p.robux === robuxAmount);
  const totalPayment = selectedPriceItem ? selectedPriceItem.price : calculateCustomPrice(robuxAmount);

  const onSubmit: SubmitHandler<RobuxTopUpFormValues> = async (data) => {
    setIsLoading(true);
    
    const params = new URLSearchParams({
      robuxAmount: data.robuxAmount.toString(),
      gamepassPrice: gamepassPrice.toString(),
      totalPayment: totalPayment.toString(),
    });
    
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Start Your Top-Up</CardTitle>
            <CardDescription>Select a preset amount or use the slider for a custom amount. We include the 30% Roblox tax.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
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

            <FormField
              control={form.control}
              name="robuxAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Robux Slider</FormLabel>
                   <div className="flex items-center gap-4">
                     <div className="relative w-full">
                      <Gem className="absolute left-3 top-1/2 -translate-y-1/2 text-primary h-5 w-5 pointer-events-none" />
                      <Input 
                        {...field}
                        onChange={handleInputChange}
                        value={field.value || ''}
                        className="pl-10 text-lg font-bold"
                        placeholder="Enter amount"
                      />
                     </div>
                   </div>
                  <Slider
                    min={70}
                    max={10000}
                    step={10}
                    value={[field.value || 70]}
                    onValueChange={handleSliderChange}
                    className="mt-4"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

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
                <span className='text-primary'>Rp {totalPayment > 0 ? totalPayment.toLocaleString('id-ID') : '...'}</span>
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
            <Button asChild disabled={!form.formState.isValid} className="w-full text-lg h-12 shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                <Link href="https://discord.gg/vfnXNNPvXq" target="_blank">
                    Join Discord to Pay
                </Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
