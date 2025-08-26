import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/rental/ProductCard";
import { mockProducts, mockCategories } from "@/data/mockData";
import heroImage from "@/assets/rental-hero.jpg";
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Truck
} from "lucide-react";

const HomePage = () => {
  const featuredProducts = mockProducts.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary-accent/10"></div>
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Equipment rental hero" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🚀 Trusted by 10,000+ businesses
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold">
                Rent Equipment.{" "}
                <span className="bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent">
                  Simplified.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From construction equipment to party supplies, find everything you need to rent 
                with competitive pricing, reliable delivery, and 24/7 support.
              </p>
            </div>



            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                  Browse Equipment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-md">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Fully Insured</h3>
                <p className="text-muted-foreground">
                  All equipment is fully insured and regularly maintained for your peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-md">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Free Delivery</h3>
                <p className="text-muted-foreground">
                  Complimentary delivery and pickup within 25 miles for rentals over ₹200.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-md">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Round-the-clock customer support to help you with any questions or issues.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Browse by Category</h2>
            <p className="text-xl text-muted-foreground">
              Find the perfect equipment for your project
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockCategories.map((category) => (
              <Link key={category.id} to={`/products?category=${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/30">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="text-3xl">{category.icon}</div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>

                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Featured Rentals</h2>
            <p className="text-xl text-muted-foreground">
              Popular equipment ready for immediate rental
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Equipment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary-accent text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust RentHub for their equipment rental needs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                Browse Equipment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;