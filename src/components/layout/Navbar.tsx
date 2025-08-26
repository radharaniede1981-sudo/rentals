import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  ShoppingCart, 
  Menu, 
  X, 
  Settings, 
  LogOut, 
  Package,
  Bookmark
} from "lucide-react";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"customer" | "admin">("customer"); // Mock role

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary-accent bg-clip-text text-transparent">
              RentHub
            </span>
          </Link>



          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              Browse
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors">
              How it Works
            </Link>
            <Link to="/pickup" className="text-foreground hover:text-primary transition-colors">
              Pickup
            </Link>
                          <Link to="/return" className="text-foreground hover:text-primary transition-colors">
                Return
              </Link>

              
              {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {userRole === "admin" && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                

                
                <Link to="/wishlist" className="relative">
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                        {wishlistCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                      {cartCount}
                    </Badge>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button 
                  variant="hero"
                  asChild
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-4">


              <div className="flex flex-col space-y-3">
                <Link 
                  to="/products" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Equipment
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How it Works
                </Link>

                <Link 
                  to="/wishlist" 
                  className="text-foreground hover:text-primary transition-colors flex items-center justify-between"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
                <Link 
                  to="/cart" 
                  className="text-foreground hover:text-primary transition-colors flex items-center justify-between"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Link>

                {isLoggedIn ? (
                  <div className="flex flex-col space-y-3 pt-3 border-t border-border">
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>

                    {userRole === "admin" && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-3 border-t border-border">
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="hero"
                      className="w-full"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;