import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Share2, Package, Clock, TrendingUp, Users, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>("consumer");
  const [userData, setUserData] = useState<any>({});
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDonationsListed: 0,
    activeDonations: 0,
    pendingRequests: 0,
    totalConnections: 0
  });
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isRequestsDialogOpen, setIsRequestsDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("userRole");
    
    if (!user || !JSON.parse(user).isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    const userData = JSON.parse(user);
    setUserData(userData);
    setUserRole(role || "consumer");
    
    // Load recent listings from localStorage
    const allListings = JSON.parse(localStorage.getItem("foodListings") || "[]");
    
    // Sort listings by creation date (newest first)
    const sortedListings = [...allListings].sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    
    // Get the 3 most recent listings
    setRecentListings(sortedListings.slice(0, 3));
    
    // Get user's donation history
    const userEmail = userData.email;
    const donationHistory = JSON.parse(localStorage.getItem(`donationHistory_${userEmail}`) || "[]");
    
    // Count active donations (status is "Active")
    const activeDonations = donationHistory.filter((donation: any) => donation.status === "Active").length;
    
    // Get pending requests for the user's listings
    const userListings = allListings.filter((listing: any) => listing.providerEmail === userEmail);
    const allRequests = JSON.parse(localStorage.getItem("foodRequests") || "[]");
    
    // Filter requests for the user's listings that are pending
    // This includes requests where the user is the provider (either by email or userId)
    const userPendingRequests = allRequests.filter((request: any) => {
      // Check if the request is for one of the user's listings
      const listing = userListings.find((l: any) => l.id === request.listingId);
      
      // Also check if the request has the user's ID as the provider
      const isProviderById = request.providerId === userData.id;
      
      return (listing || isProviderById) && request.status === "Pending";
    });
    
    setPendingRequests(userPendingRequests);
    
    // Set stats based on actual data
    setStats({
      totalDonationsListed: donationHistory.length,
      activeDonations: activeDonations,
      pendingRequests: userPendingRequests.length,
      totalConnections: 8
    });
  }, [navigate]);

  const handleAction = (action: string) => {
    switch (action) {
      case "find-food":
        navigate("/browse-food");
        break;
      case "share-food":
        navigate("/create-listing");
        break;
      case "view-profile":
        navigate("/profile");
        break;
      default:
        break;
    }
  };

  const handleRequestAction = (requestId: string, action: "approve" | "reject") => {
    // Get all requests
    const allRequests = JSON.parse(localStorage.getItem("foodRequests") || "[]");
    
    // Find the request to update
    const requestIndex = allRequests.findIndex((r: any) => r.id === requestId);
    if (requestIndex === -1) return;
    
    // Update the request status
    allRequests[requestIndex].status = action === "approve" ? "Approved" : "Rejected";
    allRequests[requestIndex].updatedAt = new Date().toISOString();
    
    // Save back to localStorage
    localStorage.setItem("foodRequests", JSON.stringify(allRequests));
    
    // If the request is approved, add it to the requester's purchase history
    if (action === "approve") {
      const request = allRequests[requestIndex];
      
      // Get the listing details
      const allListings = JSON.parse(localStorage.getItem("foodListings") || "[]");
      const listing = allListings.find((l: any) => l.id === request.listingId);
      
      if (listing) {
        // Get the requester's purchase history
        const requesterEmail = request.requesterEmail;
        const purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${requesterEmail}`) || "[]");
        
        // Create a new purchase record
        const newPurchase = {
          id: `purchase_${Date.now()}`,
          listingId: listing.id,
          listingName: listing.name,
          quantity: listing.quantity,
          price: listing.listingType === "donate" ? "Free" : listing.price,
          status: "Completed",
          purchaseDate: new Date().toISOString(),
          providerName: listing.providerName || "Food Provider",
          providerEmail: listing.providerEmail,
          category: listing.category
        };
        
        // Add to purchase history
        purchaseHistory.push(newPurchase);
        
        // Save back to localStorage
        localStorage.setItem(`purchaseHistory_${requesterEmail}`, JSON.stringify(purchaseHistory));
        
        // Show toast notification to the requester (in a real app, this would be a push notification)
        toast.success(`Your request for "${listing.name}" has been approved!`);
      }
    }
    
    // Update the pending requests list
    const updatedPendingRequests = pendingRequests.filter(r => r.id !== requestId);
    setPendingRequests(updatedPendingRequests);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      pendingRequests: updatedPendingRequests.length
    }));
    
    // Show toast notification
    toast.success(`Request ${action === "approve" ? "approved" : "rejected"} successfully`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name || "User"}!
          </h1>
          <p className="text-gray-600">
            {userRole === "provider" 
              ? "Manage your food listings and connect with those in need." 
              : "Find food resources and connect with providers in your community."}
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 hover:border-green-500 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {userRole === "provider" ? (
                  <>
                    <Share2 className="text-green-500" />
                    Share More Food
                  </>
                ) : (
                  <>
                    <ShoppingBag className="text-green-500" />
                    Find Food
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {userRole === "provider" 
                  ? "List your excess food to help those in need" 
                  : "Browse available food donations and products"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {userRole === "provider" 
                  ? "Create a new listing to share your surplus food with the community." 
                  : "Find free or low-cost food items available in your community."}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => handleAction(userRole === "provider" ? "share-food" : "find-food")}
              >
                {userRole === "provider" ? "Create New Listing" : "Browse Food"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-2 hover:border-green-500 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-green-500" />
                Your Profile
              </CardTitle>
              <CardDescription>
                View and manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Update your profile, view your history, and manage your account settings.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => handleAction("view-profile")}
              >
                Go to Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Stats Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Donations Listed</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalDonationsListed}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Donations</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.activeDonations}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setIsRequestsDialogOpen(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</p>
                </div>
                <div className="bg-amber-100 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Connections</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalConnections}</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Listings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent {userRole === "provider" ? "Listings" : "Available Items"}</h2>
          
          {recentListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentListings.map((listing, index) => (
                <div 
                  key={index} 
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/food-listing/${listing.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800 hover:text-green-700 hover:underline">{listing.name}</h3>
                    <Badge className={listing.listingType === "donate" ? "bg-green-500" : "bg-blue-500"}>
                      {listing.listingType === "donate" ? "Free" : "Reduced Price"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Quantity: {listing.quantity}</p>
                  <p className="text-sm text-gray-600 mb-2">Category: {listing.category}</p>
                  <p className="text-xs text-gray-500">Posted: {new Date(listing.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">
                {userRole === "provider" 
                  ? "You haven't created any listings yet. Click 'Share Food' to get started!" 
                  : "No food items are available at the moment. Check back later!"}
              </p>
              <Button 
                className="mt-4 bg-green-500 hover:bg-green-600"
                onClick={() => handleAction(userRole === "provider" ? "share-food" : "find-food")}
              >
                {userRole === "provider" ? "Create Your First Listing" : "Browse Food"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Pending Requests Dialog */}
      <Dialog open={isRequestsDialogOpen} onOpenChange={setIsRequestsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pending Requests</DialogTitle>
            <DialogDescription>
              Review and manage requests for your food listings
            </DialogDescription>
          </DialogHeader>
          
          {pendingRequests.length > 0 ? (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {pendingRequests.map((request) => {
                  // Find the listing details
                  const allListings = JSON.parse(localStorage.getItem("foodListings") || "[]");
                  const listing = allListings.find((l: any) => l.id === request.listingId);
                  
                  return (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{listing?.name || request.listingName || "Food Item"}</h3>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          Pending
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Requested by:</span> {request.requesterName}</p>
                        <p><span className="font-medium">Contact:</span> {request.requesterEmail}</p>
                        <p><span className="font-medium">Message:</span> {request.message || "No message provided"}</p>
                        <p><span className="font-medium">Requested on:</span> {new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleRequestAction(request.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRequestAction(request.id, "reject")}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">You have no pending requests at the moment.</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage; 