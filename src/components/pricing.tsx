import { RobuxTopUpForm } from './robux-topup-form';

export default function Pricing() {
  return (
    <section id="top-up" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Calculate Your Robux
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Get the best market price. Choose a preset amount and we'll handle the tax calculations for you.
          </p>
        </div>
        <div className="mt-16">
          <RobuxTopUpForm />
        </div>
      </div>
    </section>
  );
}
