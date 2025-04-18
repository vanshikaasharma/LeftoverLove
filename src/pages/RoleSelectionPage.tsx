import { useNavigate } from "react-router-dom";
import RoleSelection from "@/components/RoleSelection";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelection = (role: "consumer" | "provider") => {
    // Store the selected role in localStorage
    localStorage.setItem("userRole", role);
    
    // Show success message
    toast({
      title: "Role Updated",
      description: `You are now in ${role} mode. You can switch roles at any time.`,
    });
    
    // Navigate to the appropriate page based on role
    if (role === "provider") {
      navigate("/create-listing");
    } else {
      // Navigate to the browse food page
      navigate("/browse-food");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">Choose Your Mode</h1>
          <p className="text-lg text-gray-600 max-w-md">
            You can switch between these modes at any time to either find food or share food with others
          </p>
        </div>
        
        <RoleSelection onSelectRole={handleRoleSelection} />
      </div>
    </>
  );
};

export default RoleSelectionPage;
