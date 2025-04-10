import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Phone, Mail, MapPin, Users, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmergencyRequest {
  id: string;
  name: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  urgency: "high" | "medium" | "low";
  numberOfPeople: number;
  dietaryRestrictions: string;
  additionalInfo: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface ProviderEmergencyDashboardProps {
  providerId: string;
}

const ProviderEmergencyDashboard = ({ providerId }: ProviderEmergencyDashboardProps) => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get all emergency requests
    const allRequests = JSON.parse(localStorage.getItem("emergencyRequests") || "[]");
    
    // Filter requests by status and sort by urgency and creation date
    const sortedRequests = allRequests
      .filter((request: EmergencyRequest) => request.status === "pending")
      .sort((a: EmergencyRequest, b: EmergencyRequest) => {
        // First sort by urgency
        const urgencyOrder = { high: 0, medium: 1, low: 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        // Then sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
    setRequests(sortedRequests);
    setLoading(false);
  }, []);

  const handleRequestAction = (requestId: string, action: "approve" | "reject") => {
    // Get all requests
    const allRequests = JSON.parse(localStorage.getItem("emergencyRequests") || "[]");
    
    // Find and update the request
    const updatedRequests = allRequests.map((request: EmergencyRequest) => {
      if (request.id === requestId) {
        return { ...request, status: action === "approve" ? "approved" : "rejected" };
      }
      return request;
    });
    
    // Save back to localStorage
    localStorage.setItem("emergencyRequests", JSON.stringify(updatedRequests));
    
    // Update local state
    setRequests(requests.filter(request => request.id !== requestId));
    
    // Show success message
    toast({
      title: `Request ${action === "approve" ? "Approved" : "Rejected"}`,
      description: `You have ${action === "approve" ? "accepted" : "declined"} the emergency request.`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Requests</h3>
        <p className="text-gray-500">There are no pending emergency food requests at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Requests</h2>
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {requests.length} Pending
        </Badge>
      </div>

      <div className="grid gap-6">
        {requests.map((request) => (
          <Card key={request.id} className="border-l-4 border-red-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{request.name}</CardTitle>
                  <CardDescription>
                    Requested {new Date(request.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    request.urgency === "high" ? "bg-red-50 text-red-700 border-red-200" :
                    request.urgency === "medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {request.urgency === "high" ? "High Priority" :
                   request.urgency === "medium" ? "Medium Priority" :
                   "Low Priority"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{request.numberOfPeople} people</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{request.location}</span>
                  </div>
                  {request.dietaryRestrictions && (
                    <div className="flex items-start text-sm">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <span>{request.dietaryRestrictions}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{request.contactPhone}</span>
                  </div>
                  {request.contactEmail && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{request.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {request.additionalInfo && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{request.additionalInfo}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleRequestAction(request.id, "reject")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleRequestAction(request.id, "approve")}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Accept
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderEmergencyDashboard; 