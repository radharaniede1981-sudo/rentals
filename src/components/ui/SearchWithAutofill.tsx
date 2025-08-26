import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockProducts, mockCategories } from '@/data/mockData';

interface SearchWithAutofillProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  onSelect?: (item: any) => void;
  showSuggestions?: boolean;
}

const SearchWithAutofill: React.FC<SearchWithAutofillProps> = ({
  placeholder = "Search equipment...",
  className = "",
  onSearch,
  onSelect,
  showSuggestions = true
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate search suggestions based on products and categories
  const generateSuggestions = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return [];
    }

    const term = searchTerm.toLowerCase();
    const results: any[] = [];

    // Search in product names
    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(term)) {
        results.push({
          type: 'product',
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.pricePerDay,
          display: product.name
        });
      }
    });

    // Search in categories
    mockCategories.forEach(category => {
      if (category.name.toLowerCase().includes(term)) {
        results.push({
          type: 'category',
          id: category.id,
          name: category.name,
          display: `${category.name} (Category)`
        });
      }
    });

    // Search in product descriptions
    mockProducts.forEach(product => {
      if (product.description.toLowerCase().includes(term) && 
          !results.some(r => r.id === product.id)) {
        results.push({
          type: 'product',
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.pricePerDay,
          display: `${product.name} - ${product.description.substring(0, 50)}...`
        });
      }
    });

    // Remove duplicates and limit results
    const uniqueResults = results.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );

    return uniqueResults.slice(0, 8);
  };

  useEffect(() => {
    if (query.trim()) {
      const newSuggestions = generateSuggestions(query);
      setSuggestions(newSuggestions);
      setShowDropdown(newSuggestions.length > 0 && showSuggestions);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  }, [query, showSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.name);
    setShowDropdown(false);
    onSelect?.(suggestion);
    onSearch?.(suggestion.name);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    onSearch?.('');
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && suggestions.length > 0 && setShowDropdown(true)}
          className="pl-10 pr-10 bg-background"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.id}`}
              className={`px-3 py-2 cursor-pointer hover:bg-muted transition-colors ${
                index === selectedIndex ? 'bg-muted' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{suggestion.name}</span>
                  {suggestion.type === 'category' && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Category
                    </span>
                  )}
                </div>
                {suggestion.price && (
                  <span className="text-xs text-muted-foreground">
                    ₹{suggestion.price}/day
                  </span>
                )}
              </div>
              {suggestion.category && suggestion.type === 'product' && (
                <div className="text-xs text-muted-foreground ml-5">
                  {suggestion.category}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWithAutofill;
