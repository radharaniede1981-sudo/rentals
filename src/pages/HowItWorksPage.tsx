import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  CreditCard, 
  Truck, 
  Package, 
  Clock, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Browse & Select",
      description: "Search through our extensive catalog of equipment. Filter by category, price, or availability to find exactly what you need.",
      details: ["Browse by category", "Use advanced filters", "Compare options", "Check availability"]
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Book Your Rental",
      description: "Choose your rental dates and any additional services. Our flexible booking system accommodates both short-term and long-term rentals.",
      details: ["Select dates", "Choose delivery options", "Add insurance", "Review terms"]
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Secure Payment",
      description: "Complete your booking with our secure payment system. We accept all major credit cards and digital payment methods.",
      details: ["Multiple payment options", "Secure transactions", "Instant confirmation", "Digital receipts"]
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Delivery & Setup",
      description: "We'll deliver your equipment to your location and set it up for you. Free delivery within 25 miles for rentals over ₹200.",
      details: ["Professional delivery", "Equipment setup", "Safety briefing", "Quality check"]
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Enjoy Your Rental",
      description: "Use your equipment with confidence. Our team is available 24/7 for support and assistance throughout your rental period.",
      details: ["24/7 support", "Technical assistance", "Emergency contacts", "Usage guidance"]
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Return & Pickup",
      description: "When your rental period ends, we'll pick up the equipment from your location. No hassle, no stress.",
      details: ["Scheduled pickup", "Equipment inspection", "Damage assessment", "Final payment"]
    }
  ];

  const benefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Fully Insured",
      description: "All equipment comes with comprehensive insurance coverage for your peace of mind."
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Quality Guaranteed",
      description: "We maintain our equipment to the highest standards with regular inspections and maintenance."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Support",
      description: "Our team of professionals is available to help you with setup, operation, and troubleshooting."
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Wide Coverage",
      description: "We serve the entire region with reliable delivery and pickup services."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="text-sm">
              Simple & Transparent
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold">
              How RentHub Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get the equipment you need in just a few simple steps. Our streamlined process makes renting easy, reliable, and hassle-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Equipment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">6 Simple Steps</h2>
            <p className="text-xl text-muted-foreground">
              From browsing to returning, we've made the rental process as simple as possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      Step {index + 1}
                    </Badge>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-center">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Why Choose RentHub?</h2>
            <p className="text-xl text-muted-foreground">
              We're committed to providing the best rental experience possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-md">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Get answers to common questions about our rental process
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What documents do I need to rent equipment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You'll need a valid government-issued ID (driver's license, passport, or Aadhaar card) and a credit card for payment. For business rentals, we may require additional documentation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How far do you deliver?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer free delivery within 25 miles for rentals over ₹200. For longer distances, we charge a nominal delivery fee based on distance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if the equipment breaks down?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We provide 24/7 support and will replace or repair equipment immediately if it breaks down due to normal wear and tear. Our insurance covers most scenarios.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I extend my rental period?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can extend your rental period through your account dashboard or by contacting our support team. Extensions are subject to equipment availability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl opacity-90">
              Join thousands of satisfied customers who trust RentHub for their equipment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Browse Equipment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
