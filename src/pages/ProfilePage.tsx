import { useState, useEffect } from "react";
import { User, History, ShoppingBag, Package, Key, Gift, Bell, BellOff, Mail, Lock, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const userRole = localStorage.getItem("userRole") || "consumer";
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [email, setEmail] = useState(userData.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notificationsEnabled") === "true"
  );
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  const handleEmailChange = () => {
    if (!email || email === userData.email) {
      toast({
        title: "No changes made",
        description: "Please enter a new email address to update.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would validate the email and update it in the database
    const updatedUserData = { ...userData, email };
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    
    toast({
      title: "Email updated",
      description: "Your email address has been updated successfully.",
    });
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "The new password and confirmation password don't match.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would validate the current password and update it in the database
    // For demonstration, we'll just show a success message
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
    
    // Clear the password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", newValue.toString());
    
    toast({
      title: newValue ? "Notifications enabled" : "Notifications disabled",
      description: newValue 
        ? "You will now receive notifications about your account and food listings." 
        : "You will no longer receive notifications.",
    });
  };

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
                            <TableRow 
                              key={item.id}
                              className="cursor-pointer hover:bg-green-50 transition-colors"
                              onClick={() => navigate(`/food-listing/${item.id}`)}
                            >
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="font-medium text-green-700 hover:underline">
                                {item.item}
                              </TableCell>
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
                  <CardContent className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                          />
                          <Button onClick={handleEmailChange} size="sm">
                            <Save className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-medium">Security</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <Button onClick={handlePasswordChange} className="mt-2">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-medium">Preferences</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {notificationsEnabled ? (
                            <Bell className="h-5 w-5 text-green-600" />
                          ) : (
                            <BellOff className="h-5 w-5 text-gray-400" />
                          )}
                          <div>
                            <Label htmlFor="notifications">Notifications</Label>
                            <p className="text-sm text-gray-500">
                              Receive updates about your account and food listings
                            </p>
                          </div>
                        </div>
                        <Switch
                          id="notifications"
                          checked={notificationsEnabled}
                          onCheckedChange={toggleNotifications}
                        />
                      </div>
                    </div>
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
