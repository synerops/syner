import Link from 'next/link';
import { Button } from '@syner/ui/components/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Syner Design System</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Component documentation and design system for Syner UI
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/components">View Components</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com/synerops/syner" target="_blank">
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
