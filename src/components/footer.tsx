'use client'

import { Gem, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-primary/10 bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2">
              <Gem className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">ud1nshp</span>
            </Link>
            <p className="text-sm text-muted-foreground">Secure & Instant Robux Top-Ups.</p>
             <div className="flex gap-4 pt-2">
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-5 w-5" />
                <span>Need help? Hit me up on Discord!</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 space-y-4">
            <h4 className="font-semibold text-foreground">Disclaimers</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Roblox deducts a 30% fee on all Game Pass purchases. Our calculator accounts for this automatically.</li>
              <li>This service is not affiliated with or endorsed by Roblox Corporation.</li>
              <li>Please double-check your Roblox Username, Game Pass link, and pricing before submitting.</li>
              <li>Payments are final once confirmed. Keep your receipt and Order ID in case of any issues.</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary/10 pt-4 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ud1nshp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
