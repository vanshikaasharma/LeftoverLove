import { useState, useEffect } from "react";
import { User, History, ShoppingBag, Package, Key, Gift } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ProfilePage = () => {
  const userRole = localStorage.getItem("userRole") || "consumer";
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  
  // Generate a unique user ID if not already present
  useEffect(() => {
    if (userData.email && !userData.userId) {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const updatedUserData = { ...userData, userId };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
    }
  }, [userData]);
  
  useEffect(() => {
    // Load user's donation and purchase history
    if (userData.email) {
      // Load donation history
      const userDonationHistory = JSON.parse(localStorage.getItem(`donationHistory_${userData.email}`) || "[]");
      setDonationHistory(userDonationHistory);
      
      // Load purchase history (mock data for now)
      const mockPurchaseHistory = [
        { id: 1, date: "2025-04-05", item: "Brioche bread", quantity: 2, status: "Completed" },
        { id: 2, date: "2025-04-03", item: "Vegetables", quantity: 5, status: "Completed" },
        { id: 3, date: "2025-03-28", item: "Canned Goods", quantity: 10, status: "Completed" }
      ];
      setPurchaseHistory(mockPurchaseHistory);
    }
  }, [userData.email]);

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* User Profile Card */}
          <Card className="md:w-1/3">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" alt={userData.name} />
                <AvatarFallback className="text-2xl bg-green-100 text-green-800">
                  {userData.name ? userData.name.split(' ').map(n => n[0]).join('') : 'U'}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold">{userData.name || "User"}</CardTitle>
              <CardDescription className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <User size={16} /> {userData.email || "No email provided"}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <History size={16} /> Member since {userData.joinDate || "Recently"}
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Key size={16} /> ID: <Badge variant="outline" className="ml-1 font-mono text-xs">{userData.userId || "Not assigned"}</Badge>
                </div>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                  {userRole === "consumer" ? "Food Receiver" : "Food Provider"}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Activity Tabs */}
          <div className="flex-1">
            <Tabs defaultValue="purchase-history">
              <TabsList className="w-full">
                <TabsTrigger value="purchase-history" className="flex-1">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Purchase History</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="donation-history" className="flex-1">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    <span>Donation History</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="purchase-history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Purchase History</CardTitle>
                    <CardDescription>
                      View all your past purchases.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchaseHistory.length > 0 ? (
                          purchaseHistory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>{item.item}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {item.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                              No purchase history found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="donation-history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Donation History</CardTitle>
                    <CardDescription>
                      View all your past donations and sales.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donationHistory.length > 0 ? (
                          donationHistory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>{item.item}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {item.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {item.listingType === "donate" ? "Donation" : "Sale"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {item.category || "Uncategorized"}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No donation history found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Account settings options will be available soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
