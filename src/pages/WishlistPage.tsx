import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bookmark, 
  ShoppingCart, 
  Calendar, 
  Clock, 
  Star, 
  Trash2,
  ArrowRight,
  Package
} from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist.`,
    });
  };

  const handleClearWishlist = () => {
    setIsClearing(true);
    clearWishlist();
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    });
    setIsClearing(false);
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      pricePerDay: product.pricePerDay,
      rentalDays: product.minRentalDays,
      deliveryOption: 'standard' as const,
      insuranceOption: 'basic' as const,
      availability: product.availability,
      minRentalDays: product.minRentalDays,
    };

    addToCart(cartItem);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge variant="success" className="bg-green-100 text-green-800">Available</Badge>;
      case "limited":
        return <Badge variant="warning">Limited</Badge>;
      case "unavailable":
        return <Badge variant="destructive">Unavailable</Badge>;
      default:
        return null;
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Bookmark className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start building your wishlist by browsing our equipment and adding items you're interested in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/products">
                  Browse Equipment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={handleClearWishlist}
              disabled={isClearing}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button asChild>
              <Link to="/products">
                Browse More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 left-3">
                  {getAvailabilityBadge(product.availability)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                >
                  <Bookmark className="h-4 w-4 fill-primary text-primary" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                      </div>
                    </div>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg mt-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        ₹{product.pricePerDay}
                        <span className="text-sm font-normal text-muted-foreground">/day</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Min. {product.minRentalDays} days
                      </div>
                    </div>
                  </div>

                  {product.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Link to={`/products/${product.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    variant="default" 
                    className="w-full"
                    disabled={product.availability === "unavailable"}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-12">
          <Separator className="mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p className="text-muted-foreground">
                Total items: <span className="font-semibold text-foreground">{wishlistItems.length}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Cart
                </Link>
              </Button>
              <Button asChild>
                <Link to="/products">
                  <Package className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
