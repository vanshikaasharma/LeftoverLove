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
  isExpired: boolean;
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
    const listings = JSON.parse(localStorage.getItem("foodListings") || "[]");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const newListing = {
      ...foodItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "Active",
      userId: user.userId || "",
    };
    listings.push(newListing);
    localStorage.setItem("foodListings", JSON.stringify(listings));

    if (user.email) {
      const donationHistory = JSON.parse(
        localStorage.getItem(`donationHistory_${user.email}`) || "[]"
      );
      donationHistory.push({
        id: newListing.id,
        date: new Date().toISOString().split("T")[0],
        item: foodItem.name,
        quantity: foodItem.quantity,
        status: foodItem.isExpired ? "Expired" : "Active",
        listingType: foodItem.listingType,
        category: foodItem.category,
        isExpired: foodItem.isExpired,
      });
      localStorage.setItem(`donationHistory_${user.email}`, JSON.stringify(donationHistory));
    }

    toast({
      title: "Listing created",
      description: `Your food listing for "${foodItem.name}" has been created successfully.`,
    });

    navigate("/dashboard");
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
