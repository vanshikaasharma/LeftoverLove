
import { useState } from "react";
import { User, History, ShoppingBag, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProfilePage = () => {
  const userRole = localStorage.getItem("userRole") || "consumer";
  const [userData] = useState({
    name: "Taylor Swift",
    email: "Taylor.swift@erasTour.com",
    joinDate: "April 5, 2025"
  });

  // Mock data for purchase/donation history
  const mockHistory = [
    { id: 1, date: "2025-04-05", item: "Brioche breadBread", quantity: 2, status: "Completed" },
    { id: 2, date: "2025-04-03", item: "Vegetables", quantity: 5, status: "Completed" },
    { id: 3, date: "2025-03-28", item: "Canned Goods", quantity: 10, status: "Completed" },
    { id: 3, date: "2025-03-28", item: "Canned Goods", quantity: 10, status: "Completed" }
  ];

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
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold">{userData.name}</CardTitle>
              <CardDescription className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <User size={16} /> {userData.email}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <History size={16} /> Member since {userData.joinDate}
                </div>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                  {userRole === "consumer" ? "Food Receiver" : "Food Provider"}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Activity Tabs */}
          <div className="flex-1">
            <Tabs defaultValue="history">
              <TabsList className="w-full">
                <TabsTrigger value="history" className="flex-1">
                  {userRole === "consumer" ? (
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      <span>Purchase History</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>Donation History</span>
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {userRole === "consumer" ? "Your Purchase History" : "Your Donation History"}
                    </CardTitle>
                    <CardDescription>
                      View all your past {userRole === "consumer" ? "purchases" : "donations"}.
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
                        {mockHistory.length > 0 ? (
                          mockHistory.map((item) => (
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
                              No history found
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
