import Header from '@/components/header';
import Hero from '@/components/hero';
import Pricing from '@/components/pricing';
import Footer from '@/components/footer';
import { HowItWorks } from '@/components/how-it-works';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="fixed inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(109,40,217,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(217,40,159,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
