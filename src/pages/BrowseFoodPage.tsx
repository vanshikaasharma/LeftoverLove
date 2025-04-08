import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Apple, Filter, AlertCircle, MapPinOff } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data for food listings (fallback if no listings in localStorage)
const MOCK_FOOD_LISTINGS = [
  {
    id: 1,
    name: "Fresh Produce Box",
    provider: "Community Garden Co-op",
    distance: "0.8 mi",
    type: "Free",
    image: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Box of fresh vegetables and fruits. Available for pickup today.",
    category: "Fruits & Vegetables"
  },
  {
    id: 2,
    name: "Bread and Pastries",
    provider: "Local Bakery",
    distance: "1.2 mi",
    type: "Reduced Price",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Day-old bread and pastries at 75% off regular price.",
    category: "Breads & Baked Goods"
  },
  {
    id: 3,
    name: "Canned Food Bundle",
    provider: "Food Pantry Network",
    distance: "2.5 mi",
    type: "Free",
    image: "https://images.unsplash.com/photo-1584263347416-85a696b4eda7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Assorted canned goods including beans, vegetables, and soups.",
    category: "Pantry Items"
  },
  {
    id: 4,
    name: "Restaurant Meal Kits",
    provider: "Sunshine Cafe",
    distance: "3.1 mi",
    type: "Reduced Price",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Prepared meal ingredients with instructions. $5 per kit.",
    category: "Prepared Meals"
  },
  {
    id: 5,
    name: "Organic Fruit Box",
    provider: "Green Farms",
    distance: "4.2 mi",
    type: "Reduced Price",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Seasonal organic fruits at 50% off market price.",
    category: "Fruits & Vegetables"
  },
];

// Food categories for suggestions
const FOOD_CATEGORIES = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Breads & Baked Goods",
  "Meat & Protein",
  "Pantry Items",
  "Prepared Meals",
  "Beverages",
  "Snacks",
  "Baby Food",
  "Other"
];

// Mock location API - in a real app, this would connect to a geocoding API
const geocodeLocation = async (locationName: string) => {
  console.log(`Geocoding location: ${locationName}`);
  // Mock response - in a real app, this would call a geocoding API
  if (locationName.toLowerCase().includes('vancouver')) {
    return {
      success: true,
      coordinates: { lat: 49.2827, lng: -123.1207 },
      formattedAddress: "Vancouver, BC, Canada"
    };
  }
  
  // Default response for unknown locations
  return {
    success: true,
    coordinates: { lat: 49.2827, lng: -123.1207 }, // Default to Vancouver
    formattedAddress: locationName
  };
};

// Mock reverse geocoding API - in a real app, this would connect to a geocoding API
const reverseGeocodeLocation = async (coords: { lat: number, lng: number }) => {
  console.log(`Reverse geocoding coordinates: ${coords.lat}, ${coords.lng}`);
  // Mock response - in a real app, this would call a reverse geocoding API
  return {
    success: true,
    formattedAddress: "Your Current Location",
    city: "Nearby City",
    region: "Region",
    country: "Country"
  };
};

const BrowseFoodPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState([5]); // Default 5 miles radius
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Check if location permission was previously granted
  useEffect(() => {
    const savedLocationPermission = localStorage.getItem('locationPermission');
    if (savedLocationPermission) {
      setLocationStatus(savedLocationPermission as 'granted' | 'denied');
      
      // If location was previously denied, set Vancouver as default location
      if (savedLocationPermission === 'denied' && !location) {
        handleDefaultLocation();
      }
    } else {
      // Show location dialog when the page loads for the first time
      setShowLocationDialog(true);
    }
  }, []);

  // Load food listings from localStorage on component mount
  useEffect(() => {
    // Get listings from localStorage
    const storedListings = JSON.parse(localStorage.getItem("foodListings") || "[]");
    
    // If there are stored listings, use them; otherwise use mock data
    if (storedListings.length > 0) {
      // Format the listings to match the expected structure
      const formattedListings = storedListings.map((listing: any) => ({
        id: listing.id,
        name: listing.name,
        provider: listing.company || "Individual Provider",
        distance: "Near you", // Default distance
        type: listing.listingType === "donate" ? "Free" : "Reduced Price",
        image: listing.image || "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        description: listing.description || "No description provided.",
        price: listing.price,
        category: listing.category || "Other",
        quantity: listing.quantity,
        expireDate: listing.expireDate,
        location: listing.location || "Not specified",
        contactPhone: listing.contactPhone,
        contactEmail: listing.contactEmail,
        listingType: listing.listingType,
        createdAt: listing.createdAt
      }));
      
      setAllListings(formattedListings);
      setFilteredListings(formattedListings);
    } else {
      setAllListings(MOCK_FOOD_LISTINGS);
      setFilteredListings(MOCK_FOOD_LISTINGS);
    }
  }, []);

  // When user coordinates change, update nearby food listings
  useEffect(() => {
    if (userCoordinates) {
      findNearbyFood(userCoordinates);
    }
  }, [userCoordinates, allListings]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      toast.error("Geolocation is not supported by your browser");
      handleDefaultLocation();
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoordinates(coords);
        setLocationStatus('granted');
        localStorage.setItem('locationPermission', 'granted');
        localStorage.setItem('userCoordinates', JSON.stringify(coords));
        
        // Get address from coordinates (reverse geocoding)
        reverseGeocode(coords);
        setIsLoadingLocation(false);
        setShowLocationDialog(false);
        
        toast.success("Using your current location to find nearby food");
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationStatus('denied');
        localStorage.setItem('locationPermission', 'denied');
        setIsLoadingLocation(false);
        
        handleDefaultLocation();
      }
    );
  };

  // Set Vancouver as the default location when permission is denied
  const handleDefaultLocation = async () => {
    const defaultCity = "Vancouver";
    setLocation(defaultCity);
    setShowLocationDialog(false);
    
    // Get coordinates for Vancouver using the geocoding API
    const locationData = await geocodeLocation(defaultCity);
    if (locationData.success) {
      setUserCoordinates(locationData.coordinates);
      toast.info(`Using ${defaultCity} as your location. You can change it anytime.`);
    }
  };

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (coords: { lat: number; lng: number }) => {
    try {
      // Call the mock reverse geocoding API
      const locationData = await reverseGeocodeLocation(coords);
      if (locationData.success) {
        setLocation(locationData.formattedAddress);
      } else {
        setLocation("Your Current Location");
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      setLocation("Your Current Location");
    }
  };

  // Find food listings near user's location
  const findNearbyFood = (coords: { lat: number; lng: number }) => {
    // In a real app, this would use distance calculations with the coordinates
    // For now, we'll simulate it by showing all listings with distances
    
    // Calculate mock distances for all listings
    const listingsWithDistance = allListings.map(listing => {
      // Generate a random distance between 0.1 and radius[0] miles
      const distance = (Math.random() * radius[0]).toFixed(1);
      return {
        ...listing,
        distance: `${distance} mi`
      };
    });
    
    // Sort by distance (closest first)
    const sortedListings = listingsWithDistance.sort((a, b) => {
      const distA = parseFloat(a.distance);
      const distB = parseFloat(b.distance);
      return distA - distB;
    });
    
    setFilteredListings(sortedListings);
  };

  // Handle location permission denial
  const handleDenyLocation = () => {
    setLocationStatus('denied');
    localStorage.setItem('locationPermission', 'denied');
    handleDefaultLocation();
  };

  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // If the search query is empty, show all listings
    if (!query.trim()) {
      setFilteredListings(allListings);
      setSuggestedCategories([]);
      return;
    }
    
    // Start searching as the user types
    searchListings(query);
  };

  // Handle location input changes
  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const locationQuery = e.target.value;
    setLocation(locationQuery);
    
    // If the location query is empty, hide suggestions
    if (!locationQuery.trim()) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }
    
    // Generate location suggestions based on the query
    generateLocationSuggestions(locationQuery);
  };

  // Generate location suggestions based on the query
  const generateLocationSuggestions = (query: string) => {
    // In a real app, this would call a geocoding API
    // For now, we'll use a simple filter on existing locations
    
    // Get unique locations from all listings
    const uniqueLocations = [...new Set(allListings.map(listing => listing.location))];
    
    // Filter locations that match the query
    const matchingLocations = uniqueLocations.filter(loc => 
      loc.toLowerCase().includes(query.toLowerCase())
    );
    
    // If we have matching locations, show them as suggestions
    if (matchingLocations.length > 0) {
      setLocationSuggestions(matchingLocations);
      setShowLocationSuggestions(true);
    } else {
      // If no matches, suggest some common locations
      const commonLocations = [
        "Downtown",
        "North Side",
        "South Side",
        "East Side",
        "West Side",
        "University Area",
        "Shopping District",
        "Residential Area"
      ];
      
      setLocationSuggestions(commonLocations);
      setShowLocationSuggestions(true);
    }
  };

  // Handle location suggestion click
  const handleLocationSuggestionClick = async (suggestion: string) => {
    setLocation(suggestion);
    setShowLocationSuggestions(false);
    
    // Get coordinates for the selected location
    const locationData = await geocodeLocation(suggestion);
    if (locationData.success) {
      setUserCoordinates(locationData.coordinates);
    }
    
    // Filter listings by location
    filterListingsByLocation(suggestion);
  };

  // Filter listings by location
  const filterListingsByLocation = (locationQuery: string) => {
    // Filter listings based on location
    const locationFiltered = allListings.filter(listing => 
      listing.location.toLowerCase().includes(locationQuery.toLowerCase())
    );
    
    // If we also have a search query, filter those results further
    if (searchQuery.trim()) {
      const searchFiltered = locationFiltered.filter(listing => 
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFilteredListings(searchFiltered);
    } else {
      setFilteredListings(locationFiltered);
    }
    
    // Show toast notification
    toast.info(`Showing results for location: "${locationQuery}"`);
  };

  // Search listings based on query
  const searchListings = (query: string) => {
    setIsSearching(true);
    
    // Filter listings based on search query
    const filtered = allListings.filter(listing => 
      listing.name.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase()) ||
      listing.category?.toLowerCase().includes(query.toLowerCase())
    );
    
    // If we also have a location filter, apply it
    if (location.trim()) {
      const locationFiltered = filtered.filter(listing => 
        listing.location.toLowerCase().includes(location.toLowerCase())
      );
      
      setFilteredListings(locationFiltered);
    } else {
      setFilteredListings(filtered);
    }
    
    // If no exact matches found, suggest similar categories
    if (filtered.length === 0) {
      // Find categories that contain the search query
      const matchingCategories = FOOD_CATEGORIES.filter(category => 
        category.toLowerCase().includes(query.toLowerCase())
      );
      
      // If no matching categories, suggest categories based on keywords
      if (matchingCategories.length === 0) {
        const keywordSuggestions = suggestCategoriesByKeywords(query);
        setSuggestedCategories(keywordSuggestions);
      } else {
        setSuggestedCategories(matchingCategories);
      }
    } else {
      setSuggestedCategories([]);
    }
    
    setIsSearching(false);
  };

  // Suggest categories based on keywords in the search query
  const suggestCategoriesByKeywords = (query: string) => {
    const keywords = query.toLowerCase().split(' ');
    const suggestions: string[] = [];
    
    // Map keywords to categories
    const keywordToCategory: Record<string, string[]> = {
      'fruit': ['Fruits & Vegetables'],
      'vegetable': ['Fruits & Vegetables'],
      'produce': ['Fruits & Vegetables'],
      'apple': ['Fruits & Vegetables'],
      'banana': ['Fruits & Vegetables'],
      'orange': ['Fruits & Vegetables'],
      'milk': ['Dairy & Eggs'],
      'cheese': ['Dairy & Eggs'],
      'yogurt': ['Dairy & Eggs'],
      'egg': ['Dairy & Eggs'],
      'bread': ['Breads & Baked Goods'],
      'pastry': ['Breads & Baked Goods'],
      'bakery': ['Breads & Baked Goods'],
      'meat': ['Meat & Protein'],
      'chicken': ['Meat & Protein'],
      'beef': ['Meat & Protein'],
      'fish': ['Meat & Protein'],
      'protein': ['Meat & Protein'],
      'can': ['Pantry Items'],
      'canned': ['Pantry Items'],
      'pantry': ['Pantry Items'],
      'soup': ['Pantry Items'],
      'meal': ['Prepared Meals'],
      'prepared': ['Prepared Meals'],
      'restaurant': ['Prepared Meals'],
      'drink': ['Beverages'],
      'beverage': ['Beverages'],
      'water': ['Beverages'],
      'soda': ['Beverages'],
      'snack': ['Snacks'],
      'chips': ['Snacks'],
      'candy': ['Snacks'],
      'baby': ['Baby Food'],
      'infant': ['Baby Food'],
      'formula': ['Baby Food']
    };
    
    // Check each keyword against the mapping
    keywords.forEach(keyword => {
      if (keywordToCategory[keyword]) {
        suggestions.push(...keywordToCategory[keyword]);
      }
    });
    
    // Remove duplicates
    return [...new Set(suggestions)];
  };

  // Handle search button click
  const handleSearch = () => {
    // If we have a location, filter by location first
    if (location.trim()) {
      filterListingsByLocation(location);
    } else {
      // Otherwise just search by query
      searchListings(searchQuery);
    }
  };

  // Handle category suggestion click
  const handleCategorySuggestionClick = (category: string) => {
    // Filter listings by the selected category
    const categoryListings = allListings.filter(listing => 
      listing.category === category
    );
    
    setFilteredListings(categoryListings);
    setSearchQuery(category);
    setSuggestedCategories([]);
    
    // Show toast notification
    toast.info(`Showing results for "${category}"`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700 mb-2">Find Food Near You</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for free or reduced-price food available in your community
          </p>
        </div>
        
        {/* Location permission dialog */}
        <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Your Location</DialogTitle>
              <DialogDescription>
                Allow Leftover Love to access your location to find food available near you. This helps us show you the most relevant options in your area.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-4">
              {locationStatus === 'unsupported' ? (
                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <MapPinOff className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                  <p className="text-amber-800">Location services are not supported by your browser.</p>
                </div>
              ) : (
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-teal-600 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    We'll only use your location while you're using this app to help you find nearby food sources.
                  </p>
                  <p className="text-gray-600 mb-4">
                    If you decline, we'll use Vancouver as your default location. You can change your location anytime.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
              <Button 
                variant="outline" 
                onClick={handleDenyLocation}
                disabled={isLoadingLocation}
              >
                Use Vancouver
              </Button>
              <Button 
                onClick={getCurrentLocation} 
                className="bg-teal-600 hover:bg-teal-700"
                disabled={locationStatus === 'unsupported' || isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Getting Location...
                  </>
                ) : (
                  "Share My Location"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Search and filters section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={handleLocationInputChange}
                className="pl-10"
              />
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                  {locationSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-sm"
                      onClick={() => handleLocationSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2 text-gray-500" />
                        {suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Radius: {radius} mi</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Search Radius</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-sm font-medium">Distance: {radius} miles</h4>
                        <Slider
                          value={radius}
                          onValueChange={setRadius}
                          max={25}
                          min={1}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={handleSearch} 
                className="bg-teal-600 hover:bg-teal-700"
              >
                Search
              </Button>
            </div>
          </div>
          
          {/* Current location button */}
          {locationStatus !== 'granted' && (
            <div className="mt-3 flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-teal-600" 
                onClick={() => setShowLocationDialog(true)}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Use my current location
              </Button>
            </div>
          )}
        </div>
        
        {/* Category suggestions */}
        {suggestedCategories.length > 0 && (
          <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 mb-2">No exact matches found for "{searchQuery}"</h3>
                <p className="text-sm text-amber-700 mb-3">Try these related categories instead:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedCategories.map((category, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-white text-amber-700 border-amber-300 hover:bg-amber-100 cursor-pointer"
                      onClick={() => handleCategorySuggestionClick(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Results section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isSearching || isLoadingLocation ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isLoadingLocation ? "Getting your location..." : "Searching for food items..."}
              </p>
            </div>
          ) : filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <Card 
                key={listing.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/food-listing/${listing.id}`)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={listing.image} 
                    alt={listing.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-teal-700 hover:underline">{listing.name}</CardTitle>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-teal-100 text-teal-800">
                      {listing.type}
                    </span>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.distance ? `${listing.distance} - ` : ""}{listing.location || "Not specified"}</span>
                  </CardDescription>
                  {listing.category && (
                    <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                      {listing.category}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{listing.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Apple className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No food listings found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search criteria or location.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrowseFoodPage;
