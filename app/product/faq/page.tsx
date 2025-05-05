import { Gamepad } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-20"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Gamepad className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
            <span className="text-xl block mt-2 text-primary">
              (That You Should Already Know)
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to the FAQ section where we answer the questions you were
            too lazy to Google. Prepare for answers with a side of sarcasm. It's
            free.
          </p>
        </header>

        {/* FAQ Section 
        <div className="max-w-3xl mx-auto bg-card/70 rounded-md p-6 border border-primary/20 shadow-lg">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border-b border-border">
              <AccordionTrigger className="text-lg font-medium text-foreground hover:text-primary flex gap-2 group">
                <Zap className="h-5 w-5 text-primary group-hover:text-primary flex-shrink-0" />
                <span>Why is my game lagging? Is it your servers?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-7">
                No, it's definitely not our perfectly optimized servers. Have
                you tried turning off the 15 Chrome tabs with YouTube videos
                you're running in the background? Or maybe it's time to upgrade
                that potato you call a gaming rig.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-border">
              <AccordionTrigger className="text-lg font-medium text-foreground hover:text-primary flex gap-2 group">
                <Skull className="h-5 w-5 text-primary group-hover:text-primary flex-shrink-0" />
                <span>Why do I keep dying in the first level?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-7">
                Have you tried not dying? Seriously though, the tutorial
                literally explains everything. Maybe try reading the on-screen
                prompts instead of button-mashing your way through them.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-border">
              <AccordionTrigger className="text-lg font-medium text-foreground hover:text-primary flex gap-2 group">
                <Trophy className="h-5 w-5 text-primary group-hover:text-primary flex-shrink-0" />
                <span>How do I unlock the secret achievement?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-7">
                If we told you, it wouldn't be a secret, would it? That's
                literally the point of a "secret" achievement. But fine, here's
                a hint: try playing the game instead of looking for shortcuts
                online.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-border">
              <AccordionTrigger className="text-lg font-medium text-foreground hover:text-primary flex gap-2 group">
                <Shield className="h-5 w-5 text-primary group-hover:text-primary flex-shrink-0" />
                <span>Is there a way to get free in-game currency?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-7">
                Yes, it's called "playing the game." Crazy concept, we know. If
                you're looking for exploits or hacks, enjoy your upcoming ban.
                Our anti-cheat system feeds on the tears of cheaters.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-border">
              <AccordionTrigger className="text-lg font-medium text-foreground hover:text-primary flex gap-2 group">
                <HelpCircle className="h-5 w-5 text-primary group-hover:text-primary flex-shrink-0" />
                <span>When is the next update coming out?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-7">
                When it's ready™. Asking repeatedly won't make it come any
                faster. Our developers are fueled by energy drinks and spite,
                not your impatience. Follow our social media for announcements,
                or don't. We'll release it either way.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>*/}

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground">
          <p>Still confused? That sounds like a you problem.</p>
          <p className="mt-2 text-sm">
            © {new Date().getFullYear()} Not Actually Helpful Gaming Co.
          </p>
        </footer>
      </div>
    </div>
  );
}
