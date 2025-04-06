
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already authenticated
    const user = localStorage.getItem("user");
    if (user && JSON.parse(user).isAuthenticated) {
      navigate("/role-selection");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="bg-green-500 md:w-1/2 p-8 md:p-16 flex items-center justify-center">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Connecting Food Resources with Those Who Need Them
            </h1>
            <p className="text-white text-lg mb-8">
              FoodShare Connect helps reduce food waste and fight hunger by connecting food donors with individuals and families facing food insecurity.
            </p>
            <Button 
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-6 py-6 h-auto rounded-full"
              onClick={() => navigate("/auth")}
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
        
        <div className="bg-earth-50 md:w-1/2 p-8 md:p-16 flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-2">Find Food</h3>
              <p className="text-gray-600">Access donated or discounted food from individuals, restaurants, and grocery stores.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-earth-700 mb-2">Share Food</h3>
              <p className="text-gray-600">Donate excess food or sell at reduced prices to help those in need.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-2">Reduce Waste</h3>
              <p className="text-gray-600">Help reduce food waste by connecting surplus food with people who can use it.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-earth-700 mb-2">Build Community</h3>
              <p className="text-gray-600">Create connections and strengthen your community through food sharing.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">Sign up with your name and email to access the platform.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Role</h3>
              <p className="text-gray-600">Decide if you want to find food or share food with others.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Share</h3>
              <p className="text-gray-600">List available food or find food resources in your community.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              className="bg-green-500 hover:bg-green-600 text-lg px-6 py-6 h-auto rounded-full"
              onClick={() => navigate("/auth")}
            >
              Join Now <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">FoodShare Connect</h2>
              <p className="text-gray-400">Reducing food waste, fighting hunger</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">How It Works</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">info@foodshare.example</li>
                  <li className="text-gray-400">(123) 456-7890</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} FoodShare Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
