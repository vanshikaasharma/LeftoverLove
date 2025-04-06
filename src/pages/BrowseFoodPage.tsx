import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Apple, Filter } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for food listings (fallback if no listings in localStorage)
const MOCK_FOOD_LISTINGS = [
  {
    id: 1,
    name: "Fresh Produce Box",
    provider: "Community Garden Co-op",
    distance: "0.8 mi",
    type: "Free",
    image: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Box of fresh vegetables and fruits. Available for pickup today."
  },
  {
    id: 2,
    name: "Bread and Pastries",
    provider: "Local Bakery",
    distance: "1.2 mi",
    type: "Reduced Price",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Day-old bread and pastries at 75% off regular price."
  },
  {
    id: 3,
    name: "Canned Food Bundle",
    provider: "Food Pantry Network",
    distance: "2.5 mi",
    type: "Free",
    image: "https://images.unsplash.com/photo-1584263347416-85a696b4eda7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Assorted canned goods including beans, vegetables, and soups."
  },
  {
    id: 4,
    name: "Restaurant Meal Kits",
    provider: "Sunshine Cafe",
    distance: "3.1 mi",
    type: "Reduced Price",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Prepared meal ingredients with instructions. $5 per kit."
  },
  {
    id: 5,
    name: "Organic Fruit Box",
    provider: "Green Farms",
    distance: "4.2 mi",
    type: "Reduced Price",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Seasonal organic fruits at 50% off market price."
  },
];

const BrowseFoodPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState([5]); // Default 5 miles radius
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);

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
        category: listing.category,
        quantity: listing.quantity,
        expireDate: listing.expireDate,
        location: listing.location,
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

  const handleSearch = () => {
    // Filter listings based on search query
    const filtered = allListings.filter(listing => 
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredListings(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Find Food Near You</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for free or reduced-price food available in your community
          </p>
        </div>
        
        {/* Search and filters section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
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
              
              <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </div>
          </div>
        </div>
        
        {/* Results section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.length > 0 ? (
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
                    <CardTitle className="text-xl text-green-700 hover:underline">{listing.name}</CardTitle>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      {listing.type}
                    </span>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {listing.distance} away · {listing.provider}
                  </CardDescription>
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
