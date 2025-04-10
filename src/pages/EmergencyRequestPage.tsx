import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import EmergencyRequestForm from "@/components/EmergencyRequestForm";
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

const EmergencyRequestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitRequest = (request: any) => {
    // Create a new emergency request
    const newRequest: EmergencyRequest = {
      ...request,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Get existing requests
    const allRequests = JSON.parse(localStorage.getItem("emergencyRequests") || "[]");
    
    // Add the new request
    allRequests.push(newRequest);
    
    // Save back to localStorage
    localStorage.setItem("emergencyRequests", JSON.stringify(allRequests));
    
    // Notify local providers
    notifyProviders(newRequest);
    
    // Show success message
    toast({
      title: "Emergency Request Submitted",
      description: "Your request has been sent to local providers. They will contact you shortly.",
    });
    
    setIsSubmitted(true);
  };

  const notifyProviders = (request: EmergencyRequest) => {
    // Get all providers
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const providers = allUsers.filter((user: any) => user.role === "provider");
    
    // Get all food listings
    const allListings = JSON.parse(localStorage.getItem("foodListings") || "[]");
    
    // Find providers with available food
    const providersWithFood = providers.filter((provider: any) => 
      allListings.some((listing: any) => 
        listing.userId === provider.id && listing.status === "Active"
      )
    );
    
    // Create notifications for providers
    const notifications = providersWithFood.map((provider: any) => ({
      id: Date.now().toString() + provider.id,
      providerId: provider.id,
      requestId: request.id,
      type: "emergency_request",
      message: `New emergency food request from ${request.name}`,
      createdAt: new Date().toISOString(),
      read: false,
    }));
    
    // Save notifications
    const allNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    localStorage.setItem("notifications", JSON.stringify([...allNotifications, ...notifications]));
  };

  const handleBack = () => {
    navigate(-1);
  };

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

          {!isSubmitted ? (
            <div>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-2">Emergency Food Request</h1>
                <p className="text-gray-600">
                  If you're in urgent need of food, fill out this form. Your request will be prioritized and shared with local providers.
                </p>
              </div>
              
              <EmergencyRequestForm onSubmit={handleSubmitRequest} />
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
              <p className="text-gray-600 mb-6">
                Your emergency food request has been submitted. Local providers will be notified and will contact you shortly.
              </p>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="bg-amber-50 p-4 rounded-lg text-left">
                  <h3 className="font-medium text-amber-800 mb-2">What happens next?</h3>
                  <ul className="space-y-2 text-amber-700">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <span>Local providers will review your request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <span>You'll receive a call or email from providers who can help</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <span>Coordinate pickup details with the provider</span>
                    </li>
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/browse-food")}
                >
                  Browse Available Food
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmergencyRequestPage; 