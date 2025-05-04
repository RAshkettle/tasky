import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Eye, Lock, Server, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your Privacy Is Our Priority
          </h1>
          <p className="text-xl text-muted-foreground">
            We take a radically different approach to your data
          </p>
        </div>

        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl font-bold text-center">
              Our Privacy Commitment
            </CardTitle>
            <CardDescription className="text-center text-lg font-medium">
              Unlike most companies, we truly respect your privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-xl font-semibold text-center mb-6">
              We do not keep your data or use cookies. Period.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 mt-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Local Storage Only</CardTitle>
                <CardDescription>
                  Your data never leaves your device
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                All your information is stored exclusively in your browser's
                local storage. This means your data stays on your device and is
                never transmitted to our servers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Server className="h-8 w-8 text-primary" strokeWidth={1.5} />
              <div>
                <CardTitle>No Server Storage</CardTitle>
                <CardDescription>
                  We maintain zero databases of user information
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                We don't operate databases that store your personal information.
                Your data is never collected, aggregated, or analyzed on our
                end.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Shield className="h-8 w-8 text-primary" strokeWidth={1.5} />
              <div>
                <CardTitle>No Cookies</CardTitle>
                <CardDescription>
                  We don't track you across the web
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Our site operates without cookies. We don't track your browsing
                habits, create user profiles, or monitor your activity across
                different websites.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Eye className="h-8 w-8 text-primary" strokeWidth={1.5} />
              <div>
                <CardTitle>Zero Access</CardTitle>
                <CardDescription>
                  We cannot see your data, even if we wanted to
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Our system is designed so that we have absolutely no ability to
                access your data. We've built technical barriers that make it
                impossible for us to view your information.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Our Ironclad Promise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              <span className="font-bold">
                We will never access your data in any way.
              </span>{" "}
              This isn't just a policy that could change—it's built into the
              very architecture of our service. We've intentionally designed our
              systems so that we <span className="italic">cannot</span> access
              your information, even if requested by third parties.
            </p>
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="font-medium flex items-center">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                Your privacy isn't just a feature—it's our foundation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
