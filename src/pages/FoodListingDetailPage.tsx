import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Phone, Mail, Package, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Header from "@/components/Header";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

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

    // Get current user info
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.email) {
      setUserEmail(user.email);
      setUserName(user.name || "User");
    }

    // Check if user has already requested this item
    const checkRequestStatus = () => {
      if (!id || !user.email) return;
      
      const allRequests = JSON.parse(localStorage.getItem("foodRequests") || "[]");
      const userRequest = allRequests.find((request: any) => 
        request.listingId === id && request.requesterEmail === user.email
      );
      
      if (userRequest) {
        setRequestStatus(userRequest.status.toLowerCase());
      }
    };

    fetchListing();
    checkRequestStatus();
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

  const handleRequestClick = () => {
    if (requestStatus === "none") {
      setIsRequestDialogOpen(true);
    }
  };

  const handleSubmitRequest = () => {
    if (!listing || !userEmail || !userName) return;
    
    // Create a new request
    const newRequest = {
      id: Date.now().toString(),
      listingId: listing.id,
      listingName: listing.name,
      requesterName: userName,
      requesterEmail: userEmail,
      providerEmail: listing.contactEmail,
      providerId: listing.userId,
      message: requestMessage,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Get existing requests
    const allRequests = JSON.parse(localStorage.getItem("foodRequests") || "[]");
    
    // Add the new request
    allRequests.push(newRequest);
    
    // Save back to localStorage
    localStorage.setItem("foodRequests", JSON.stringify(allRequests));
    
    // Add to user's purchase history
    const purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${userEmail}`) || "[]");
    
    // Create a purchase history entry
    const purchaseEntry = {
      id: Date.now().toString(),
      listingId: listing.id,
      itemName: listing.name,
      quantity: listing.quantity,
      price: listing.listingType === "donate" ? "Free" : listing.price,
      status: "Pending",
      date: new Date().toISOString(),
      providerName: "Food Provider",
      providerEmail: listing.contactEmail,
      requestId: newRequest.id
    };
    
    // Add to purchase history
    purchaseHistory.push(purchaseEntry);
    
    // Save back to localStorage
    localStorage.setItem(`purchaseHistory_${userEmail}`, JSON.stringify(purchaseHistory));
    
    // Update request status
    setRequestStatus("pending");
    
    // Close dialog
    setIsRequestDialogOpen(false);
    
    // Show success message
    toast.success("Your request has been sent to the provider");
  };

  // Function to get coordinates from location
  const getCoordinates = async (location: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setMapCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      }
    } catch (error) {
      console.error("Error getting coordinates:", error);
      toast.error("Could not load map location");
    } finally {
      setIsMapLoading(false);
    }
  };

  useEffect(() => {
    if (listing?.location) {
      getCoordinates(listing.location);
    }
  }, [listing?.location]);

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
            <Button onClick={handleBack} variant="outline">
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
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Item Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left column - Image */}
                <div className="md:col-span-1">
                  <div className="bg-gray-100 rounded-lg overflow-hidden h-64 md:h-full">
                    {listing.image ? (
                      <img 
                        src={listing.image} 
                        alt={listing.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="h-16 w-16" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right column - Details */}
                <div className="md:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{listing.name}</h1>
                    <Badge className={listing.listingType === "donate" ? "bg-green-500" : "bg-blue-500"}>
                      {listing.listingType === "donate" ? "Free" : "Reduced Price"}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{listing.description}</p>
                  
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
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3">Provider Information</h2>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-gray-700">{listing.contactEmail}</p>
                      </div>
                      {listing.contactPhone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          <p className="text-gray-700">{listing.contactPhone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Request this item</CardTitle>
                      <CardDescription>
                        {listing.listingType === "donate" 
                          ? "Request this food item for pickup" 
                          : "Request to purchase this food item"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-4">
                        {listing.listingType === "donate" 
                          ? "The provider will review your request and get back to you with pickup details." 
                          : "The provider will review your request and get back to you with payment and pickup details."}
                      </p>
                      
                      {requestStatus !== "none" && (
                        <div className="mb-4">
                          <Badge 
                            className={
                              requestStatus === "pending" ? "bg-amber-100 text-amber-800" :
                              requestStatus === "approved" ? "bg-green-100 text-green-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {requestStatus === "pending" ? "Request Pending" :
                             requestStatus === "approved" ? "Request Approved" :
                             "Request Rejected"}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={handleRequestClick}
                        disabled={requestStatus !== "none"}
                        variant={requestStatus !== "none" ? "outline" : "default"}
                      >
                        {requestStatus === "none" ? (
                          listing.listingType === "donate" ? "Request Item" : "Purchase Item"
                        ) : (
                          requestStatus === "pending" ? "Request Pending" :
                          requestStatus === "approved" ? "Request Approved" :
                          "Request Rejected"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle>Pickup Location</CardTitle>
                  <CardDescription>
                    {listing?.location || "Location not specified"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isMapLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                  ) : mapCoordinates ? (
                    <div className="h-64 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoordinates.lng-0.01},${mapCoordinates.lat-0.01},${mapCoordinates.lng+0.01},${mapCoordinates.lat+0.01}&layer=mapnik&marker=${mapCoordinates.lat},${mapCoordinates.lng}`}
                      ></iframe>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <MapPin className="h-8 w-8 mr-2" />
                      <p>Location not available</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      if (mapCoordinates) {
                        window.open(
                          `https://www.openstreetmap.org/?mlat=${mapCoordinates.lat}&mlon=${mapCoordinates.lng}#map=15/${mapCoordinates.lat}/${mapCoordinates.lng}`,
                          '_blank'
                        );
                      }
                    }}
                    disabled={!mapCoordinates}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View on OpenStreetMap
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request {listing.name}</DialogTitle>
            <DialogDescription>
              {listing.listingType === "donate" 
                ? "Send a request to the provider to pick up this food item" 
                : "Send a request to the provider to purchase this food item"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message to Provider (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add any additional information or questions for the provider"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FoodListingDetailPage; 