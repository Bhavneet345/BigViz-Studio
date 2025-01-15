import { Card, CardHeader, CardTitle, CardDescription } from './card'
import { BarChart, PieChart, LineChart } from 'lucide-react'

const features = [
  {
    title: 'Interactive Charts',
    description: 'Create dynamic, clickable charts that respond to user input',
    icon: BarChart,
  },
  {
    title: 'Real-time Updates',
    description: 'Visualize live data streams with automatic updates',
    icon: LineChart,
  },
  {
    title: 'Custom Dashboards',
    description: 'Build personalized dashboards tailored to your needs',
    icon: PieChart,
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-primary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-10 h-10 mb-4 text-primary" />
                <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

