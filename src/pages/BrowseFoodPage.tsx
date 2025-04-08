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
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

const VANCOUVER_LOCATIONS = [
  "Downtown",
  "West End",
  "Yaletown",
  "Gastown",
  "Coal Harbour",
  "Chinatown",
  "Strathcona",
  "Mount Pleasant",
  "Main Street",
  "Kitsilano",
  "Point Grey",
  "Dunbar",
  "Kerrisdale",
  "Marpole",
  "Oakridge",
  "Shaughnessy",
  "Fairview",
  "South Granville",
  "Commercial Drive",
  "Hastings-Sunrise",
  "Renfrew-Collingwood",
  "Kensington-Cedar Cottage",
  "Riley Park",
  "South Cambie",
  "Arbutus Ridge",
  "West Point Grey",
  "University Endowment Lands",
  "Sunset",
  "Victoria-Fraserview",
  "Killarney"
];

const VANCOUVER_ADDRESSES = [
  "555 W Hastings St, Vancouver, BC",
  "800 Robson St, Vancouver, BC",
  "601 W Cordova St, Vancouver, BC",
  "1055 Canada Pl, Vancouver, BC",
  "750 Hornby St, Vancouver, BC",
  "900 W Georgia St, Vancouver, BC",
  "375 Water St, Vancouver, BC",
  "639 Hornby St, Vancouver, BC",
  "8181 Cambie Rd, Vancouver, BC",
  "3211 Grant McConachie Way, Vancouver, BC",
  "201 W Hastings St, Vancouver, BC",
  "125 E 10th Ave, Vancouver, BC",
  "1669 Johnston St, Vancouver, BC",
  "2000 W 10th Ave, Vancouver, BC",
  "88 W Pender St, Vancouver, BC",
  "1181 Seymour St, Vancouver, BC",
  "401 Burrard St, Vancouver, BC",
  "6200 University Blvd, Vancouver, BC",
  "3663 Crowley Dr, Vancouver, BC",
  "3883 Rupert St, Vancouver, BC"
];

const BrowseFoodPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState([5]);
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
  const [openLocationPopover, setOpenLocationPopover] = useState(false);
  const [vancouverAddressSuggestions, setVancouverAddressSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const savedLocationPermission = localStorage.getItem('locationPermission');
    if (savedLocationPermission) {
      setLocationStatus(savedLocationPermission as 'granted' | 'denied');
      if (savedLocationPermission === 'denied') {
        setLocation("Vancouver, BC");
      }
    } else {
      setShowLocationDialog(true);
    }
  }, []);

  useEffect(() => {
    const storedListings = JSON.parse(localStorage.getItem("foodListings") || "[]");
    if (storedListings.length > 0) {
      const formattedListings = storedListings.map((listing: any) => ({
        id: listing.id,
        name: listing.name,
        provider: listing.company || "Individual Provider",
        distance: "Near you",
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

  useEffect(() => {
    if (userCoordinates) {
      findNearbyFood(userCoordinates);
    }
  }, [userCoordinates, allListings]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      toast.error("Geolocation is not supported by your browser");
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
        
        toast.error("Location access denied. Please enter your location manually");
      }
    );
  };

  const reverseGeocode = async (coords: { lat: number; lng: number }) => {
    setLocation("Your Current Location");
  };

  const findNearbyFood = (coords: { lat: number; lng: number }) => {
    const listingsWithDistance = allListings.map(listing => {
      const distance = (Math.random() * radius[0]).toFixed(1);
      return {
        ...listing,
        distance: `${distance} mi`
      };
    });
    
    const sortedListings = listingsWithDistance.sort((a, b) => {
      const distA = parseFloat(a.distance);
      const distB = parseFloat(b.distance);
      return distA - distB;
    });
    
    setFilteredListings(sortedListings);
  };

  const handleDenyLocation = () => {
    setLocationStatus('denied');
    localStorage.setItem('locationPermission', 'denied');
    setShowLocationDialog(false);
    setLocation("Vancouver, BC");
    toast.info("You can search for food by entering specific locations in Vancouver");
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredListings(allListings);
      setSuggestedCategories([]);
      return;
    }
    
    searchListings(query);
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const locationQuery = e.target.value;
    setLocation(locationQuery);
    
    if (!locationQuery.trim()) {
      setVancouverAddressSuggestions([]);
      setOpenLocationPopover(false);
      return;
    }
    
    generateLocationSuggestions(locationQuery);
  };

  const generateLocationSuggestions = (query: string) => {
    if (!query.trim()) {
      setVancouverAddressSuggestions([]);
      setOpenLocationPopover(false);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    const matchingLocations = VANCOUVER_LOCATIONS.filter(
      loc => loc.toLowerCase().includes(lowerQuery)
    );
    
    const matchingAddresses = VANCOUVER_ADDRESSES.filter(
      addr => addr.toLowerCase().includes(lowerQuery)
    );
    
    const combinedSuggestions = [...matchingLocations, ...matchingAddresses].slice(0, 10);
    
    setVancouverAddressSuggestions(combinedSuggestions);
    setOpenLocationPopover(combinedSuggestions.length > 0);
  };

  const handleSelectVancouverAddress = (address: string) => {
    setLocation(address);
    setOpenLocationPopover(false);
    
    const mockCoordinates = {
      lat: 49.2827 + (Math.random() - 0.5) * 0.1,
      lng: -123.1207 + (Math.random() - 0.5) * 0.1
    };
    
    findNearbyFood(mockCoordinates);
    toast.success(`Showing food near ${address}`);
  };

  const handleLocationSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setShowLocationSuggestions(false);
    
    filterListingsByLocation(suggestion);
  };

  const filterListingsByLocation = (locationQuery: string) => {
    const locationFiltered = allListings.filter(listing => 
      listing.location.toLowerCase().includes(locationQuery.toLowerCase())
    );
    
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
    
    toast.info(`Showing results for location: "${locationQuery}"`);
  };

  const searchListings = (query: string) => {
    setIsSearching(true);
    
    const filtered = allListings.filter(listing => 
      listing.name.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase()) ||
      listing.category?.toLowerCase().includes(query.toLowerCase())
    );
    
    if (location.trim()) {
      const locationFiltered = filtered.filter(listing => 
        listing.location.toLowerCase().includes(location.toLowerCase())
      );
      
      setFilteredListings(locationFiltered);
    } else {
      setFilteredListings(filtered);
    }
    
    if (filtered.length === 0) {
      const matchingCategories = FOOD_CATEGORIES.filter(category => 
        category.toLowerCase().includes(query.toLowerCase())
      );
      
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

  const suggestCategoriesByKeywords = (query: string) => {
    const keywords = query.toLowerCase().split(' ');
    const suggestions: string[] = [];
    
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
    
    keywords.forEach(keyword => {
      if (keywordToCategory[keyword]) {
        suggestions.push(...keywordToCategory[keyword]);
      }
    });
    
    return [...new Set(suggestions)];
  };

  const handleSearch = () => {
    if (location.trim()) {
      filterListingsByLocation(location);
    } else {
      searchListings(searchQuery);
    }
  };

  const handleCategorySuggestionClick = (category: string) => {
    const categoryListings = allListings.filter(listing => 
      listing.category === category
    );
    
    setFilteredListings(categoryListings);
    setSearchQuery(category);
    setSuggestedCategories([]);
    
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
                  <p className="text-sm text-teal-700 font-medium">
                    If you decline, you can still search by entering Vancouver locations manually.
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
                No Thanks, I'll Enter My Location
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
              <Popover open={openLocationPopover} onOpenChange={setOpenLocationPopover}>
                <PopoverTrigger asChild>
                  <div className="w-full">
                    <Input
                      type="text"
                      placeholder="Enter Vancouver location"
                      value={location}
                      onChange={handleLocationInputChange}
                      className="pl-10 w-full"
                      onFocus={() => {
                        if (location.trim() && vancouverAddressSuggestions.length > 0) {
                          setOpenLocationPopover(true);
                        }
                      }}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup heading="Vancouver Locations">
                        {vancouverAddressSuggestions.length > 0 ? (
                          vancouverAddressSuggestions.map((address, index) => (
                            <CommandItem
                              key={index}
                              onSelect={() => handleSelectVancouverAddress(address)}
                              className="flex items-center cursor-pointer"
                            >
                              <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                              <span>{address}</span>
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No locations found</CommandEmpty>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
