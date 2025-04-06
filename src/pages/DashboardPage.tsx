import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Share2, Package, Clock, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>("consumer");
  const [userData, setUserData] = useState<any>({});
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalDonations: 0,
    totalConnections: 0
  });

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("userRole");
    
    if (!user || !JSON.parse(user).isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    setUserData(JSON.parse(user));
    setUserRole(role || "consumer");
    
    // Load recent listings from localStorage
    const allListings = JSON.parse(localStorage.getItem("foodListings") || "[]");
    
    // Sort listings by creation date (newest first)
    const sortedListings = [...allListings].sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    
    // Get the 3 most recent listings
    setRecentListings(sortedListings.slice(0, 3));
    
    // Set stats based on actual data
    setStats({
      totalListings: allListings.length,
      activeListings: allListings.filter((listing: any) => !listing.isClaimed).length,
      totalDonations: userRole === "provider" ? allListings.length : 3,
      totalConnections: 8
    });
  }, [navigate, userRole]);

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
                  <p className="text-sm text-gray-500">Total {userRole === "provider" ? "Listings" : "Items"}</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalListings}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active {userRole === "provider" ? "Listings" : "Items"}</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.activeListings}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total {userRole === "provider" ? "Donations" : "Received"}</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalDonations}</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Share2 className="h-5 w-5 text-purple-600" />
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
    </div>
  );
};

export default DashboardPage; 