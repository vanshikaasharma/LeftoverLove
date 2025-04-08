
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { toast } from "sonner";
import { MOCK_FOOD_LISTINGS, FOOD_CATEGORIES, suggestCategoriesByKeywords } from "@/utils/foodUtils";
import useLocation from "@/hooks/useLocation";
import LocationPermissionDialog from "@/components/LocationPermissionDialog";
import FoodSearchInput from "@/components/FoodSearchInput";
import CategorySuggestions from "@/components/CategorySuggestions";
import FoodListingGrid from "@/components/FoodListingGrid";

const BrowseFoodPage = () => {
  const {
    location,
    setLocation,
    userCoordinates,
    locationStatus,
    isLoadingLocation,
    showLocationDialog,
    setShowLocationDialog,
    getCurrentLocation,
    handleDenyLocation
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState([5]);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = () => {
    if (location.trim()) {
      filterListingsByLocation(location);
    } else {
      searchListings(searchQuery);
    }
  };

  const filterListingsByLocation = (locationQuery: string) => {
    const locationFiltered = allListings.filter(listing => 
      listing.location?.toLowerCase().includes(locationQuery.toLowerCase())
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
        listing.location?.toLowerCase().includes(location.toLowerCase())
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
        
        <LocationPermissionDialog
          showDialog={showLocationDialog}
          setShowDialog={setShowLocationDialog}
          isLoadingLocation={isLoadingLocation}
          locationStatus={locationStatus}
          onGetLocation={getCurrentLocation}
          onDenyLocation={handleDenyLocation}
        />
        
        <FoodSearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          location={location}
          setLocation={setLocation}
          radius={radius}
          setRadius={setRadius}
          handleSearch={handleSearch}
          locationStatus={locationStatus}
          setShowLocationDialog={setShowLocationDialog}
        />
        
        <CategorySuggestions
          searchQuery={searchQuery}
          suggestedCategories={suggestedCategories}
          onCategoryClick={handleCategorySuggestionClick}
        />
        
        <FoodListingGrid
          isSearching={isSearching}
          isLoadingLocation={isLoadingLocation}
          filteredListings={filteredListings}
        />
      </main>
    </div>
  );
};

export default BrowseFoodPage;
