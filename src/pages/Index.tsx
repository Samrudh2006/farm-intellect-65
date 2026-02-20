import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wheat, 
  Brain, 
  CloudSun, 
  TrendingUp, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized crop advice powered by machine learning algorithms",
      color: "text-saffron",
    },
    {
      icon: CloudSun,
      title: "Weather Integration",
      description: "Real-time weather data and forecasts for optimal farming decisions",
      color: "text-navy",
    },
    {
      icon: TrendingUp,
      title: "Yield Optimization",
      description: "Maximize your crop yields with data-driven insights",
      color: "text-india-green",
    },
    {
      icon: Shield,
      title: "Pest & Disease Control",
      description: "Early detection and prevention of crop threats",
      color: "text-saffron",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Tricolor top bar */}
      <div className="tricolor-bar h-1.5" />

      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <Wheat className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Smart Crop Advisory</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Smart farming technology"
            className="w-full h-full object-cover opacity-8"
          />
          {/* Saffron-green gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 via-background/90 to-india-green/5" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/30" variant="outline">
              🇮🇳 Next-Generation Farm Management
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
              Smart Crop Advisory
              <span className="block text-gradient-tricolor">System</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionize your farming with AI-powered recommendations, 
              real-time monitoring, and expert guidance for optimal crop yields.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/5">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Everything You Need for <span className="text-gradient-tricolor">Smart Farming</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and insights to help you make data-driven decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 border-border hover:shadow-lg transition-shadow hover:border-primary/30">
                <CardContent className="space-y-4 pt-6">
                  <div className={`inline-flex p-3 rounded-xl ${index % 2 === 0 ? 'bg-accent/10' : 'bg-primary/10'}`}>
                    <feature.icon className={`h-10 w-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Join Thousands of <span className="text-gradient-tricolor">Smart Farmers</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Our platform has helped farmers increase yields by up to 35% 
                while reducing costs and environmental impact.
              </p>
              <div className="space-y-4">
                {[
                  "AI-powered crop recommendations",
                  "Real-time weather monitoring",
                  "Pest and disease alerts",
                  "Expert consultation network"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-lg text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to="/login">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <Card className="p-8 border-border shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">10,000+</div>
                      <div className="text-muted-foreground">Active Farmers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <TrendingUp className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">35%</div>
                      <div className="text-muted-foreground">Average Yield Increase</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-navy/10">
                      <Shield className="h-8 w-8 text-navy" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">98%</div>
                      <div className="text-muted-foreground">Problem Detection Rate</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with tricolor */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wheat className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Smart Crop Advisory</span>
          </div>
          <p className="text-muted-foreground">
            Empowering farmers with intelligent technology for sustainable agriculture 🇮🇳
          </p>
        </div>
        <div className="tricolor-bar h-1 mt-8" />
      </footer>
    </div>
  );
};

export default Index;
