import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/rental/ProductCard";
import { mockProducts, mockCategories } from "@/data/mockData";
import { Filter, SlidersHorizontal, Grid, List, Search } from "lucide-react";
import SearchWithAutofill from "@/components/ui/SearchWithAutofill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter((product) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDescription = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesFeatures = product.features.some(feature => 
          feature.toLowerCase().includes(query)
        );
        
        if (!matchesName && !matchesDescription && !matchesCategory && !matchesFeatures) {
          return false;
        }
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const selectedCategoryNames = selectedCategories.map(catId => {
          const category = mockCategories.find(c => c.id === catId);
          return category ? category.name : catId;
        });
        if (!selectedCategoryNames.includes(product.category)) {
          return false;
        }
      }

      // Price range filter
      if (product.pricePerDay < priceRange[0] || product.pricePerDay > priceRange[1]) {
        return false;
      }

      // Availability filter
      if (availability.length > 0 && !availability.includes(product.availability)) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricePerDay - b.pricePerDay;
        case "price-high":
          return b.pricePerDay - a.pricePerDay;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchQuery, selectedCategories, priceRange, availability, sortBy]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAvailabilityToggle = (availabilityStatus: string) => {
    setAvailability(prev => 
      prev.includes(availabilityStatus) 
        ? prev.filter(status => status !== availabilityStatus)
        : [...prev, availabilityStatus]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setAvailability([]);
    setSortBy("name");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold">Categories</h3>
        <div className="space-y-2">
          {mockCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <label htmlFor={category.id} className="text-sm cursor-pointer flex-1">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold">Price per Day</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            min={0}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-3">
        <h3 className="font-semibold">Availability</h3>
        <div className="space-y-2">
          {["available", "limited", "unavailable"].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={status}
                checked={availability.includes(status)}
                onCheckedChange={() => handleAvailabilityToggle(status)}
              />
              <label htmlFor={status} className="text-sm cursor-pointer flex-1 capitalize">
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="space-y-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Equipment Rental</h1>
            <p className="text-muted-foreground">
              Browse our extensive collection of rental equipment
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <SearchWithAutofill
                placeholder="Search equipment..."
                onSearch={setSearchQuery}
                showSuggestions={true}
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your equipment search
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || availability.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = mockCategories.find(c => c.id === categoryId);
                return (
                  <Badge key={categoryId} variant="secondary" className="cursor-pointer" onClick={() => handleCategoryToggle(categoryId)}>
                    {category?.name} ×
                  </Badge>
                );
              })}
              {availability.map((status) => (
                <Badge key={status} variant="secondary" className="cursor-pointer capitalize" onClick={() => handleAvailabilityToggle(status)}>
                  {status} ×
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange([0, 1000])}>
                  ₹{priceRange[0]} - ₹{priceRange[1]} ×
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block lg:w-64">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {mockProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              </Card>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-6"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className={viewMode === "list" ? "flex flex-row" : ""}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;