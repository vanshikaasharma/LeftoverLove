
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, 
  ShoppingBag, 
  Package, 
  User, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const userRole = localStorage.getItem("userRole") || "consumer";
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    navigate("/auth");
  };

  return (
    <header className="bg-leftover-cream shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-leftover-teal font-bold text-xl">Leftover Love</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-leftover-coral">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            
            {userRole === "consumer" ? (
              <Link to="/browse-food" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-leftover-coral">
                <ShoppingBag className="h-4 w-4 mr-1" />
                Find Food
              </Link>
            ) : (
              <Link to="/create-listing" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-leftover-coral">
                <Package className="h-4 w-4 mr-1" />
                Share Food
              </Link>
            )}
            
            <Link to="/profile" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-leftover-coral">
              <User className="h-4 w-4 mr-1" />
              My Account
            </Link>
            
            <Button variant="ghost" className="inline-flex items-center hover:text-leftover-coral" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="inline-flex items-center" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-leftover-cream shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-leftover-pink/20 hover:text-leftover-coral"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Home
              </div>
            </Link>
            
            {userRole === "consumer" ? (
              <Link 
                to="/browse-food" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-leftover-pink/20 hover:text-leftover-coral"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Find Food
                </div>
              </Link>
            ) : (
              <Link 
                to="/create-listing" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-leftover-pink/20 hover:text-leftover-coral"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Share Food
                </div>
              </Link>
            )}
            
            <Link 
              to="/profile" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-leftover-pink/20 hover:text-leftover-coral"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                My Account
              </div>
            </Link>
            
            <button 
              className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 hover:bg-leftover-pink/20 hover:text-leftover-coral"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
