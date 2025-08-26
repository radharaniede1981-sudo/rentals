import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  Star, 
  Bookmark,
  ShoppingCart, 
  ArrowLeft,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Shield,
  Truck,
  Clock as ClockIcon,
  X
} from "lucide-react";

import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { mockProducts } from "@/data/mockData";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [product, setProduct] = useState<typeof mockProducts[0] | null>(null);
  const [rentalDays, setRentalDays] = useState(1);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express' | 'same-day'>('standard');
  const [insuranceOption, setInsuranceOption] = useState<'basic' | 'premium'>('basic');

  useEffect(() => {
    if (id) {
      const foundProduct = mockProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setRentalDays(foundProduct.minRentalDays);
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    );
  }



  const handleAddToCart = () => {
    // Create cart item with default rental configuration
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
      description: `${product.name} has been added to your cart with ${product.minRentalDays} day rental.`,
    });
  };

  const getAvailabilityBadge = () => {
    switch (product.availability) {
      case "available":
        return <Badge variant="success" className="bg-success text-success-foreground">Available</Badge>;
      case "limited":
        return <Badge variant="warning">Limited</Badge>;
      case "unavailable":
        return <Badge variant="destructive">Unavailable</Badge>;
      default:
        return null;
    }
  };

  const totalPrice = product.pricePerDay * rentalDays;

  const isFavorited = isInWishlist(product.id);

  const handleWishlistToggle = () => {
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4">
              {getAvailabilityBadge()}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleWishlistToggle}
            >
              <Bookmark 
                className={cn(
                  "h-5 w-5 transition-colors",
                  isFavorited ? "fill-primary text-primary" : "text-muted-foreground"
                )}
              />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary">{product.category}</Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-3">{product.name}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              {product.description}
            </p>

            <div className="text-3xl font-bold text-primary mb-6">
              ₹{product.pricePerDay}
              <span className="text-lg font-normal text-muted-foreground">/day</span>
            </div>
          </div>

          {/* Rental Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Rental Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="rental-days" className="text-sm font-medium">
                  Number of Days
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                    disabled={rentalDays <= product.minRentalDays}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{rentalDays}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRentalDays(rentalDays + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total Price:</span>
                <span className="text-primary">₹{totalPrice}</span>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={product.availability === "unavailable"}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsRentalModalOpen(true)}
                  disabled={product.availability === "unavailable"}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Rent Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features & Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rental Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Rental Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Minimum rental: {product.minRentalDays} day{product.minRentalDays !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Security deposit may be required</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Delivery and pickup available</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company Info */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>About RentHub</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">123 Equipment St, City, State</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">(555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">info@renthub.com</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rental Modal */}
      {isRentalModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Complete Your Rental</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRentalModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Product Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rental Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-lg font-bold text-primary">₹{product.pricePerDay}/day</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rental Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rental Dates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().split('T')[0]}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                    {startDate && endDate && (
                      <div className="text-sm text-muted-foreground">
                        Total rental days: {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Delivery Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          value="standard"
                          checked={deliveryOption === 'standard'}
                          onChange={(e) => setDeliveryOption(e.target.value as any)}
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Standard Delivery</div>
                          <div className="text-sm text-muted-foreground">Free delivery within 25 miles</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          value="express"
                          checked={deliveryOption === 'express'}
                          onChange={(e) => setDeliveryOption(e.target.value as any)}
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Express Delivery</div>
                          <div className="text-sm text-muted-foreground">+₹500 - Same day delivery</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          value="same-day"
                          checked={deliveryOption === 'same-day'}
                          onChange={(e) => setDeliveryOption(e.target.value as any)}
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Same Day Delivery</div>
                          <div className="text-sm text-muted-foreground">+₹1000 - Within 4 hours</div>
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Insurance Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Insurance Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="insurance"
                          value="basic"
                          checked={insuranceOption === 'basic'}
                          onChange={(e) => setInsuranceOption(e.target.value as any)}
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Basic Insurance</div>
                          <div className="text-sm text-muted-foreground">Included in rental price</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="insurance"
                          value="premium"
                          checked={insuranceOption === 'premium'}
                          onChange={(e) => setInsuranceOption(e.target.value as any)}
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Premium Insurance</div>
                          <div className="text-sm text-muted-foreground">+₹200/day - Full coverage</div>
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Calculation */}
                {startDate && endDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Total Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Rental ({Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days)</span>
                          <span>₹{product.pricePerDay * Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                        </div>
                        {deliveryOption === 'express' && (
                          <div className="flex justify-between">
                            <span>Express Delivery</span>
                            <span>+₹500</span>
                          </div>
                        )}
                        {deliveryOption === 'same-day' && (
                          <div className="flex justify-between">
                            <span>Same Day Delivery</span>
                            <span>+₹1000</span>
                          </div>
                        )}
                        {insuranceOption === 'premium' && (
                          <div className="flex justify-between">
                            <span>Premium Insurance</span>
                            <span>+₹{200 * Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-primary">
                            ₹{(() => {
                              const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
                              let total = product.pricePerDay * days;
                              if (deliveryOption === 'express') total += 500;
                              if (deliveryOption === 'same-day') total += 1000;
                              if (insuranceOption === 'premium') total += 200 * days;
                              return total;
                            })()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsRentalModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!startDate || !endDate) {
                        toast({
                          title: "Please select dates",
                          description: "Please select both start and end dates for your rental.",
                        });
                        return;
                      }
                      
                      const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
                      if (days < product.minRentalDays) {
                        toast({
                          title: "Invalid rental period",
                          description: `Minimum rental period is ${product.minRentalDays} day${product.minRentalDays !== 1 ? 's' : ''}.`,
                        });
                        return;
                      }

                      // Add to cart with all selected options
                      const cartItem = {
                        id: product.id,
                        name: product.name,
                        category: product.category,
                        image: product.image,
                        pricePerDay: product.pricePerDay,
                        rentalDays: days,
                        deliveryOption: deliveryOption,
                        insuranceOption: insuranceOption,
                        availability: product.availability,
                        minRentalDays: product.minRentalDays,
                      };

                      addToCart(cartItem);
                      
                      toast({
                        title: "Added to Cart!",
                        description: `${product.name} has been added to your cart with your selected options.`,
                      });
                      setIsRentalModalOpen(false);
                    }}
                    className="flex-1"
                    disabled={!startDate || !endDate}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
