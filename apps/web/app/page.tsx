import { brand, Logo } from "@syner/ui/branding"
import { Button } from "@syner/ui/components/button"

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-8">
      <Logo className="size-16 text-foreground" />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{brand.name}</h1>
        <p className="text-muted-foreground">{brand.tagline}</p>
      </div>
      <Button render={<a href="https://github.com/synerops/syner" />}>GitHub</Button>
    </main>
  )
}
