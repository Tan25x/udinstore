'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const RobuxTopUpSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  robuxAmount: z.preprocess(
    (val) => Number(String(val)),
    z.number().min(100, { message: 'Minimum 100 Robux.' }).max(10000, { message: 'Maximum 10,000 Robux.' })
  ),
});

type RobuxTopUpFormValues = z.infer<typeof RobuxTopUpSchema>;

const ROBUX_TAX_RATE = 0.3;

export function RobuxTopUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RobuxTopUpFormValues>({
    resolver: zodResolver(RobuxTopUpSchema),
    defaultValues: {
      username: '',
      robuxAmount: 100,
    },
  });

  const robuxAmount = form.watch('robuxAmount');
  const gamepassPrice = Math.ceil(robuxAmount / (1 - ROBUX_TAX_RATE));

  const onSubmit: SubmitHandler<RobuxTopUpFormValues> = async (data) => {
    setIsLoading(true);
    
    const params = new URLSearchParams({
      username: data.username,
      robuxAmount: data.robuxAmount.toString(),
      gamepassPrice: gamepassPrice.toString(),
    });
    
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>Start Your Top-Up</CardTitle>
                <CardDescription>Enter your details to begin the top-up process.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    name="robuxAmount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Robux Amount</FormLabel>
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
                    <FormLabel>Required Game Pass Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                          <Input readOnly value={gamepassPrice.toLocaleString('id-ID')} className="bg-input pl-10 font-bold text-primary" />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                      </div>
                    </FormControl>
                    <FormDescription>
                        You must set your Game Pass to this exact price on Roblox. Need help? 
                        <Link href="/tutorial" className="text-primary hover:underline ml-1">
                           Follow our tutorial.
                        </Link>
                    </FormDescription>
                </FormItem>
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
    </>
  );
}
