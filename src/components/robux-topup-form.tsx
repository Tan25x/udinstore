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
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const RobuxTopUpSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  robuxAmount: z.preprocess(
    (val) => Number(String(val)),
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
  
  const handlePriceSelect = (robux: number) => {
    form.setValue('robuxAmount', robux);
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Price List */}
        <div className="lg:col-span-1">
            <Card className="w-full bg-card/80 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10">
                <CardHeader>
                    <CardTitle>Price List</CardTitle>
                    <CardDescription>Select a preset amount for a quick top-up.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Robux</TableHead>
                                <TableHead>Price (Rp)</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {priceList.map(({ robux, price, discount }) => (
                                <TableRow key={robux}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {robux} R$
                                        {discount && <Badge variant="destructive" className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> {discount}</Badge>}
                                    </TableCell>
                                    <TableCell>{price.toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost" onClick={() => handlePriceSelect(robux)}>
                                            Select
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        {/* Calculator */}
        <div className="lg:col-span-1">
             <Card className="w-full bg-card/80 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Gamepass Price Calculator</CardTitle>
                        <CardDescription>Enter your details for a custom top-up amount.</CardDescription>
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
                                You must set your Game Pass to this exact price.
                                <Link href="/tutorial" className="text-primary hover:underline ml-1">
                                Need help?
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
        </div>
    </div>
  );
}
