import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft, 
  CreditCard, 
  Truck,
  Calendar,
  Package,
  Clock,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import PaymentGateway from "@/components/PaymentGateway";
import { useState } from "react";

const CartPage = () => {
  const { toast } = useToast();
  const { 
    cartItems, 
    removeFromCart, 
    updateRentalDays, 
    updateDeliveryOption, 
    updateInsuranceOption,
    getDeliveryCost,
    getInsuranceCost,
    calculateItemTotal,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
    clearCart
  } = useCart();

  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  const removeItem = (itemId: string) => {
    removeFromCart(itemId);
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    setShowPaymentGateway(true);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Your cart is empty</h1>
              <p className="text-muted-foreground">
                Looks like you haven't added any equipment to your cart yet.
              </p>
            </div>
            <Link to="/products">
              <Button className="w-full">
                <Package className="h-4 w-4 mr-2" />
                Browse Equipment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Item Image */}
                    <div className="w-full md:w-32 h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Rental Configuration */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Rental Days */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Rental Days</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateRentalDays(item.id, item.rentalDays - 1)}
                              disabled={item.rentalDays <= item.minRentalDays}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.rentalDays}
                              onChange={(e) => updateRentalDays(item.id, parseInt(e.target.value) || item.minRentalDays)}
                              min={item.minRentalDays}
                              className="w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateRentalDays(item.id, item.rentalDays + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Min. {item.minRentalDays} days
                          </p>
                        </div>

                        {/* Delivery Option */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Delivery</Label>
                          <Select value={item.deliveryOption} onValueChange={(value: 'standard' | 'express' | 'same-day') => updateDeliveryOption(item.id, value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard (Free)</SelectItem>
                              <SelectItem value="express">Express (+₹500)</SelectItem>
                              <SelectItem value="same-day">Same Day (+₹1000)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Insurance Option */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Insurance</Label>
                          <Select value={item.insuranceOption} onValueChange={(value: 'basic' | 'premium') => updateInsuranceOption(item.id, value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic (Included)</SelectItem>
                              <SelectItem value="premium">Premium (+₹200/day)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          ₹{item.pricePerDay} × {item.rentalDays} days
                        </div>
                        <div className="text-lg font-semibold text-primary">
                          ₹{calculateItemTotal(item)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground">
                          {item.rentalDays} days × ₹{item.pricePerDay}
                        </div>
                      </div>
                      <div className="font-medium">₹{calculateItemTotal(item)}</div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>₹{calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Additional Info */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Free cancellation within 24 hours
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    Free delivery for orders over ₹200
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {showPaymentGateway && (
        <PaymentGateway
          onNavigate={(action) => {
            setShowPaymentGateway(false);
            if (action === 'success') {
              clearCart();
              toast({
                title: "Payment Successful!",
                description: "Your order has been placed.",
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default CartPage;
