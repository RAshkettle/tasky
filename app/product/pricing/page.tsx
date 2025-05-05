import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <span className="block">ABSOLUTELY FREE</span>
            <span className="block text-primary">No Charges Whatsoever</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            We believe in providing value without any hidden fees or future
            charges. Everything we offer is 100% free, forever.
          </p>
        </div>

        <div className="mt-16">
          <Card className="mx-auto max-w-lg border-primary border-2 shadow-lg">
            <CardHeader className="text-center bg-primary/10 border-b border-primary/20">
              <CardTitle className="text-3xl font-bold text-primary">
                Free Forever Plan
              </CardTitle>
              <CardDescription className="text-lg">
                No credit card required. No hidden fees.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <span className="text-5xl font-extrabold text-foreground">
                  $0
                </span>
                <span className="text-xl font-medium text-muted-foreground">
                  /forever
                </span>
              </div>

              <ul className="space-y-4 mt-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="ml-3 text-base text-foreground">
                    Full access to all features
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="ml-3 text-base text-foreground">
                    Unlimited usage with no restrictions
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="ml-3 text-base text-foreground">
                    Premium customer support
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="ml-3 text-base text-foreground">
                    Regular updates and new features
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="ml-3 text-base text-foreground">
                    No credit card required
                  </p>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="bg-primary/10 border-t border-primary/20 flex justify-center">
              <Button className="w-full text-lg py-6">
                Get Started Now - It's Free!
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-foreground text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h3 className="text-lg font-medium text-foreground">
                Is it really free?
              </h3>
              <p className="mt-2 text-muted-foreground">
                Yes! Everything is absolutely free. There are no hidden charges,
                no premium tiers, and no credit card required.
              </p>
            </div>
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h3 className="text-lg font-medium text-foreground">
                Will you charge in the future?
              </h3>
              <p className="mt-2 text-muted-foreground">
                No. Our service will remain completely free forever. We are
                committed to providing value without any charges whatsoever.
              </p>
            </div>
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h3 className="text-lg font-medium text-foreground">
                Are there any usage limits?
              </h3>
              <p className="mt-2 text-muted-foreground">
                No limits! Use our service as much as you want. There are no
                restrictions on usage or features.
              </p>
            </div>
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h3 className="text-lg font-medium text-foreground">
                How do you make money?
              </h3>
              <p className="mt-2 text-muted-foreground">
                We're funded through other means that allow us to offer this
                service completely free to all users without compromising on
                quality or features.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold text-foreground mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of happy users who pay absolutely nothing.
          </p>
          <Button className="text-lg py-6 px-8">
            Sign Up Now - 100% Free!
          </Button>
        </div>
      </div>
    </div>
  );
}
