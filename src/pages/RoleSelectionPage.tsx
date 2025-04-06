
import { useNavigate } from "react-router-dom";
import RoleSelection from "@/components/RoleSelection";
import { useToast } from "@/components/ui/use-toast";

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelection = (role: "consumer" | "provider") => {
    // Store the selected role in localStorage
    localStorage.setItem("userRole", role);
    
    // Navigate to the appropriate page based on role
    if (role === "provider") {
      navigate("/create-listing");
    } else {
      // In a real app, this would go to a page to browse food listings
      // For now, let's show a toast message
      toast({
        title: "Feature coming soon",
        description: "The food browsing feature is under development.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">How would you like to proceed?</h1>
        <p className="text-lg text-gray-600 max-w-md">
          Choose whether you'd like to find food or share food with others
        </p>
      </div>
      
      <RoleSelection onSelectRole={handleRoleSelection} />
    </div>
  );
};

export default RoleSelectionPage;
