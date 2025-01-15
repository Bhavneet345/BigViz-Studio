import { Button } from './button'

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-b from-background to-primary/10 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Transform Your Data?</h2>
        <p className="text-xl mb-8 text-muted-foreground">Start creating powerful visualizations today with BigViz Studio</p>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started Now</Button>
      </div>
    </section>
  )
}

