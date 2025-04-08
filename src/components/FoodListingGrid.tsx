
import React from "react";
import { useNavigate } from "react-router-dom";
import { Apple, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FoodListing {
  id: number;
  name: string;
  provider: string;
  distance: string;
  type: string;
  image: string;
  description: string;
  category?: string;
  location?: string;
}

interface FoodListingGridProps {
  isSearching: boolean;
  isLoadingLocation: boolean;
  filteredListings: FoodListing[];
}

const FoodListingGrid: React.FC<FoodListingGridProps> = ({
  isSearching,
  isLoadingLocation,
  filteredListings,
}) => {
  const navigate = useNavigate();

  if (isSearching || isLoadingLocation) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {isLoadingLocation ? "Getting your location..." : "Searching for food items..."}
        </p>
      </div>
    );
  }

  if (filteredListings.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <Apple className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No food listings found</h3>
        <p className="mt-1 text-gray-500">
          Try adjusting your search criteria or location.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredListings.map((listing) => (
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
      ))}
    </div>
  );
};

export default FoodListingGrid;
