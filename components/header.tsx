import Link from "next/link";
import { Button } from "./button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          BigViz Studio
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#demo"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Demo
              </Link>
            </li>
            <li>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <span>Loading...</span>
          ) : session ? (
            <>
              <span className="text-muted-foreground">
                Welcome, {session.user?.name || "User"}!
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signIn("github")} // Default provider
                className="hover:bg-primary/20"
              >
                Login
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => signIn()} // You can specify a provider like "google"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
