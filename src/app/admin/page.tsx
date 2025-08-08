'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Order = {
  orderId: string;
  username: string;
  robuxAmount: number;
  gamepassPrice: number;
  status: 'Pending' | 'Completed' | 'Failed';
  createdAt: Date;
};

// Mock data for recent orders
const mockOrders: Order[] = [
  { orderId: 'UDN-1678886400', username: 'PlayerOne', robuxAmount: 800, gamepassPrice: 1143, status: 'Completed', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
  { orderId: 'UDN-1678882800', username: 'NoobMaster69', robuxAmount: 400, gamepassPrice: 572, status: 'Completed', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { orderId: 'UDN-1678879200', username: 'Guest1337', robuxAmount: 1700, gamepassPrice: 2429, status: 'Pending', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { orderId: 'UDN-1678875600', username: 'ProGamer', robuxAmount: 4500, gamepassPrice: 6429, status: 'Failed', createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) },
  { orderId: 'UDN-1678872000', username: 'BuilderMan', robuxAmount: 10000, gamepassPrice: 14286, status: 'Completed', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
];


export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1500);
  }, []);

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Pending': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
       <div className="fixed inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(109,40,217,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(217,40,159,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Recent Top-Up Orders</CardTitle>
            <CardDescription>A list of the most recent Robux top-up transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Robux Amount</TableHead>
                  <TableHead className="text-right">Game Pass Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>{order.username}</TableCell>
                      <TableCell className="text-right">{order.robuxAmount.toLocaleString()} R$</TableCell>
                      <TableCell className="text-right">{order.gamepassPrice.toLocaleString()} R$</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>{order.createdAt.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
