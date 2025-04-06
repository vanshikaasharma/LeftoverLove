import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Phone, Mail, Package, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Header from "@/components/Header";

interface FoodListing {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: string;
  expireDate: string;
  company: string;
  listingType: "donate" | "sell";
  price: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
  image?: string;
  createdAt: string;
  userId: string;
}

const FoodListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<FoodListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch the listing from an API
    // For now, we'll get it from localStorage
    const fetchListing = () => {
      try {
        setLoading(true);
        
        // Get all listings from localStorage
        const allListings = JSON.parse(localStorage.getItem("foodListings") || "[]");
        
        // Find the specific listing by ID
        const foundListing = allListings.find((item: FoodListing) => item.id === id);
        
        if (foundListing) {
          setListing(foundListing);
        } else {
          setError("Listing not found");
        }
      } catch (err) {
        setError("Failed to load listing");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (err) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading listing details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-lg text-red-500 mb-4">{error || "Listing not found"}</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{listing.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {listing.category}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={listing.listingType === "donate" ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {listing.listingType === "donate" ? "Donation" : "For Sale"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Image */}
                {listing.image ? (
                  <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg">
                    <img 
                      src={listing.image} 
                      alt={listing.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {listing.description || "No description provided."}
                  </p>
                </div>
                
                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Quantity</p>
                      <p className="text-gray-700">{listing.quantity}</p>
                    </div>
                  </div>
                  
                  {listing.listingType === "sell" && (
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Price</p>
                        <p className="text-gray-700">${listing.price}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Expiration Date</p>
                      <p className="text-gray-700">{formatDate(listing.expireDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-gray-700">{listing.location || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Listed On</p>
                      <p className="text-gray-700">{formatDate(listing.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Get in touch with the provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-gray-700">{listing.contactPhone || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-gray-700">{listing.contactEmail || "Not provided"}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium mb-2">About the Provider</p>
                  <p className="text-gray-700">
                    {listing.company || "Individual provider"}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {listing.listingType === "donate" ? "Request Item" : "Purchase Item"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodListingDetailPage; 