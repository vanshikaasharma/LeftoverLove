
import { useNavigate } from "react-router-dom";
import FoodListingForm from "@/components/FoodListingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FoodItemData {
  name: string;
  description: string;
  category: string;
  quantity: string;
  expireDate: Date | undefined;
  company: string;
  listingType: "donate" | "sell";
  price: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
}

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitListing = (foodItem: FoodItemData) => {
    // In a real app, this would save the food listing to a database
    console.log("Food listing submitted:", foodItem);
    
    // For demonstration, store in localStorage
    const listings = JSON.parse(localStorage.getItem("foodListings") || "[]");
    listings.push({
      ...foodItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("foodListings", JSON.stringify(listings));
    
    toast({
      title: "Listing created",
      description: `Your food listing for "${foodItem.name}" has been created successfully.`,
    });
    
    // Navigate back to role selection
    navigate("/role-selection");
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-green-50 to-white">
      <Button 
        variant="ghost" 
        className="self-start mb-4 flex items-center"
        onClick={() => navigate("/role-selection")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">List Food to Share</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Provide details about the food you're donating or selling
        </p>
      </div>
      
      <FoodListingForm onSubmit={handleSubmitListing} />
    </div>
  );
};

export default CreateListingPage;
