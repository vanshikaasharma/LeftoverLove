import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Phone, Mail, MapPin, Users, Clock, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

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

const ProviderEmergencyRequestsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load emergency requests from localStorage
    const loadRequests = () => {
      const allRequests = JSON.parse(localStorage.getItem("emergencyRequests") || "[]");
      // Sort by urgency and creation date
      const sortedRequests = allRequests
        .sort((a: EmergencyRequest, b: EmergencyRequest) => {
          const urgencyOrder = { high: 0, medium: 1, low: 2 };
          if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      setRequests(sortedRequests);
      setLoading(false);
    };

    loadRequests();
    // Set up an interval to check for new requests
    const interval = setInterval(loadRequests, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRequestAction = (requestId: string, action: "approve" | "reject") => {
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return { ...request, status: action === "approve" ? "approved" : "rejected" };
      }
      return request;
    });

    // Update localStorage
    localStorage.setItem("emergencyRequests", JSON.stringify(updatedRequests));
    setRequests(updatedRequests);

    // Show toast notification
    toast({
      title: action === "approve" ? "Request Approved" : "Request Rejected",
      description: action === "approve" 
        ? "You can now contact the requester to arrange food delivery."
        : "The request has been marked as rejected.",
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Requests</h1>
            <p className="text-gray-600">
              View and respond to emergency food requests from your community
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Emergency Requests</h2>
              <p className="text-gray-600">There are currently no emergency food requests.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <Card key={request.id} className="border-l-4 border-red-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {request.name}
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Requested {new Date(request.createdAt).toLocaleString()}
                        </CardDescription>
                      </div>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestAction(request.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestAction(request.id, "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{request.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{request.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{request.location}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{request.numberOfPeople} people</span>
                        </div>
                        {request.dietaryRestrictions && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <AlertCircle className="h-4 w-4 mt-0.5" />
                            <span>Dietary Restrictions: {request.dietaryRestrictions}</span>
                          </div>
                        )}
                        {request.additionalInfo && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <AlertCircle className="h-4 w-4 mt-0.5" />
                            <span>Additional Info: {request.additionalInfo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProviderEmergencyRequestsPage; 