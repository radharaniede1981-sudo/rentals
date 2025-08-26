import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, Star, Bookmark, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  image: string;
  rating: number;
  reviewCount: number;
  availability: "available" | "unavailable" | "limited";
  features: string[];
  minRentalDays: number;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [rentalDays, setRentalDays] = useState(product.minRentalDays);
  const { toast } = useToast();

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const isFavorited = isInWishlist(product.id);
  


  const getAvailabilityBadge = () => {
    switch (product.availability) {
      case "available":
        return <Badge variant="default" className="bg-success text-success-foreground">Available</Badge>;
      case "limited":
        return <Badge variant="warning">Limited</Badge>;
      case "unavailable":
        return <Badge variant="destructive">Unavailable</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={cn("group overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          />
        </Link>
        <div className="absolute top-3 left-3">
          {getAvailabilityBadge()}
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => {
              if (isFavorited) {
                removeFromWishlist(product.id);
                toast({
                  title: "Removed from wishlist",
                  description: `${product.name} has been removed from your wishlist.`,
                });
              } else {
                addToWishlist(product);
                toast({
                  title: "Added to wishlist",
                  description: `${product.name} has been added to your wishlist.`,
                });
              }
            }}
          >
            <Bookmark 
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorited ? "fill-primary text-primary" : "text-muted-foreground"
              )}
            />
          </Button>
        </div>
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
              {product.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {product.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.features.length - 3} more
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
          <Dialog open={isRentalModalOpen} onOpenChange={setIsRentalModalOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="default" 
                className="w-full"
                disabled={product.availability === "unavailable"}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Rent Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Rent {product.name}</DialogTitle>
                <DialogDescription>
                  Configure your rental details and proceed to checkout.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rental-days" className="text-right">
                    Days
                  </Label>
                  <Input
                    id="rental-days"
                    type="number"
                    min={product.minRentalDays}
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value) || product.minRentalDays)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="delivery" className="text-right">
                    Delivery
                  </Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select delivery option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (Free)</SelectItem>
                      <SelectItem value="express">Express (+₹500)</SelectItem>
                      <SelectItem value="same-day">Same Day (+₹1000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="insurance" className="text-right">
                    Insurance
                  </Label>
                  <Select defaultValue="basic">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select insurance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Included)</SelectItem>
                      <SelectItem value="premium">Premium (+₹200/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost:</span>
                    <span className="text-xl font-bold text-primary">
                      ₹{product.pricePerDay * rentalDays}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rentalDays} days × ₹{product.pricePerDay}/day
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRentalModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // Create cart item with selected rental configuration
                    const cartItem = {
                      id: product.id,
                      name: product.name,
                      category: product.category,
                      image: product.image,
                      pricePerDay: product.pricePerDay,
                      rentalDays: rentalDays,
                      deliveryOption: 'standard' as const,
                      insuranceOption: 'basic' as const,
                      availability: product.availability,
                      minRentalDays: product.minRentalDays,
                    };

                    addToCart(cartItem);
                    
                    toast({
                      title: "Added to Cart!",
                      description: `${product.name} has been added to your cart for ${rentalDays} days.`,
                    });
                    setIsRentalModalOpen(false);
                  }}
                >
                  Add to Cart
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;