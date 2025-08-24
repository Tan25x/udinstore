import Footer from "@/components/footer";
import Header from "@/components/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const tutorialSteps = [
    {
        title: "Step 1: Create a Game Pass",
        content: [
            "Open the Roblox website and log in to your account.",
            "Click on the 'Create' tab in the top menu.",
            "Find your game under the 'Creations' tab. It's usually named '[Your Username]'s Place'. Click on it.",
            "In the left menu of your game's page, scroll down and click on 'Passes'.",
            "Click the 'Create a Pass' button."
        ],
    },
    {
        title: "Step 2: Configure Your Game Pass",
        content: [
            "Upload an image for your Game Pass (any image will do).",
            "Enter a name for your pass (e.g., 'Top-Up Pass').",
            "Add a description if you want (optional).",
            "Click 'Create Pass'. Your pass is now created but not for sale yet."
        ],
    },
    {
        title: "Step 3: Set the Price",
        content: [
            "After creating the pass, you'll be taken back to the Passes list. Find your newly created pass and click on it.",
            "In the left menu, click on 'Sales'.",
            "Toggle the 'Item for Sale' switch to ON.",
            "Enter the exact price that was calculated on our Top-Up page. This is crucial for the transaction to work.",
            "Roblox will show you the amount you'll receive after their 30% fee. This should match the Robux amount you entered on our site.",
            "Click 'Save changes'."
        ],
    },
    {
        title: "Step 4: Get the Game Pass URL",
        content: [
            "Go back to your Game Pass page (the public one, not the configuration page).",
            "Copy the URL from your browser's address bar.",
            "This is the link you need to paste into the 'Game Pass URL' field on our Top-Up form."
        ],
    }
];

export default function TutorialPage() {
    return (
      <div className="flex min-h-screen w-full flex-col">
         <div className="fixed inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(109,40,217,0.3),rgba(255,255,255,0))]"></div>
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(217,40,159,0.3),rgba(255,255,255,0))]"></div>
        </div>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl font-headline">
                    How to Create a Game Pass
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                    Follow this video guide or the steps below to create a Game Pass on Roblox.
                </p>
            </div>

            <div className="mb-12">
                <div className="aspect-video w-full">
                    <iframe 
                        className="w-full h-full rounded-lg shadow-2xl shadow-primary/20 border-2 border-primary/20"
                        src="https://www.youtube.com/embed/Hl9QPHIXWHk" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen>
                    </iframe>
                </div>
            </div>

            <Card className="bg-white/5 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10">
                <CardContent className="p-6">
                    <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                        {tutorialSteps.map((step, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                    {step.title}
                                </AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="space-y-3 text-muted-foreground">
                                        {step.content.map((line, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                                                <p>{line}</p>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
             <p className="text-center text-muted-foreground mt-8">
                Still have questions? <Link href="https://discord.gg/vfnXNNPvXq" target="_blank" className="text-primary hover:underline">Contact us on Discord!</Link>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
