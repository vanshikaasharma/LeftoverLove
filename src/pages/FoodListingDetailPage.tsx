import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Phone, Mail, Package, DollarSign, Clock, Heart, Share2, User } from "lucide-react";
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
import CalendarIntegration from "@/components/CalendarIntegration";
import DeliveryIntegration from "@/components/DeliveryIntegration";
import FoodBankIntegration from "@/components/FoodBankIntegration";
import { cn } from "@/lib/utils";
import { cache } from "@/lib/cache";
import { performanceMonitor } from "@/lib/performance";
import MapView from "@/components/MapView";

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
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        // Check cache first
        const cachedListing = cache.get<FoodListing>(`listing_${id}`);
        if (cachedListing) {
          setListing(cachedListing);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const listing = await performanceMonitor.measureAsync(
          'fetchListing',
          async () => {
            const allListings = JSON.parse(localStorage.getItem("foodListings") || "[]");
            return allListings.find((item: FoodListing) => item.id === id);
          }
        );
        
        if (listing) {
          setListing(listing);
          // Cache the listing for 5 minutes
          cache.set(`listing_${id}`, listing);
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
    performanceMonitor.measure('handleRequestClick', () => {
      if (requestStatus === "none") {
        setIsRequestDialogOpen(true);
      }
    });
  };

  const handleSubmitRequest = () => {
    performanceMonitor.measure('handleSubmitRequest', () => {
      if (!listing || !userEmail || !userName) return;
      
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
      
      const allRequests = JSON.parse(localStorage.getItem("foodRequests") || "[]");
      allRequests.push(newRequest);
      localStorage.setItem("foodRequests", JSON.stringify(allRequests));
      
      const purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${userEmail}`) || "[]");
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
      
      purchaseHistory.push(purchaseEntry);
      localStorage.setItem(`purchaseHistory_${userEmail}`, JSON.stringify(purchaseHistory));
      
      setRequestStatus("pending");
      setIsRequestDialogOpen(false);
      toast.success("Your request has been sent to the provider");
    });
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
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Left column - Image and Quick Actions */}
              <div className="space-y-6">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {listing.image ? (
                    <>
                      <img 
                        src={listing.image} 
                        alt={listing.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.opacity = '1';
                        }}
                        style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                      />
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="h-16 w-16" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="bg-white/80 backdrop-blur-sm hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="bg-white/80 backdrop-blur-sm hover:bg-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CalendarIntegration
                    listingId={listing.id}
                    onSchedulePickup={(date, time, notes) => {
                      console.log("Scheduled pickup:", { date, time, notes });
                      toast({
                        title: "Pickup Scheduled",
                        description: `Your pickup is scheduled for ${format(date, "PPP")} at ${time}`,
                      });
                    }}
                  />
                  <DeliveryIntegration
                    listingId={listing.id}
                    onRequestDelivery={(address, service) => {
                      console.log("Delivery requested:", { address, service });
                      toast({
                        title: "Delivery Requested",
                        description: `Your delivery request has been sent to ${service}`,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Right column - Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
                    <Badge 
                      className={cn(
                        "text-sm px-3 py-1",
                        listing.listingType === "donate" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {listing.listingType === "donate" ? "Free" : "Reduced Price"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Package className="h-4 w-4" />
                    <span>Category: {listing.category}</span>
                  </div>
                  
                  <p className="text-gray-700 text-lg mb-6">{listing.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">Quantity</span>
                      </div>
                      <p className="text-gray-700">{listing.quantity}</p>
                    </div>
                    
                    {listing.listingType === "sell" && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">Price</span>
                        </div>
                        <p className="text-gray-700">${listing.price}</p>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">Expiration</span>
                      </div>
                      <p className="text-gray-700">{formatDate(listing.expireDate)}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">Posted</span>
                      </div>
                      <p className="text-gray-700">{formatDate(listing.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Provider Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{listing.company}</p>
                        <p className="text-sm text-gray-600">Food Provider</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-600">{listing.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-sm text-gray-600">{listing.contactPhone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">{listing.contactEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map and Food Banks Section */}
            <div className="border-t">
              <Tabs defaultValue="location" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="foodbanks">Nearby Food Banks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="location" className="p-6">
                  <MapView 
                    location={listing?.location || "Location not specified"}
                    coordinates={mapCoordinates}
                    isLoading={isMapLoading}
                  />
                </TabsContent>
                
                <TabsContent value="foodbanks" className="p-6">
                  <FoodBankIntegration />
                </TabsContent>
              </Tabs>
            </div>
          </div>
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