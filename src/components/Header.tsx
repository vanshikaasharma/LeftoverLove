import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  ShoppingBag, 
  Package, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell,
  HelpCircle,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const userRole = localStorage.getItem("userRole") || "consumer";
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const notificationsEnabled = localStorage.getItem("notificationsEnabled") === "true";
  
  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user");
    setIsAuthenticated(user && JSON.parse(user).isAuthenticated);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault();
      navigate("/dashboard");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={handleHomeClick}>
              <span className="text-green-600 font-bold text-xl">Leftover Love</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={cn(
                "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive("/") || isActive("/dashboard")
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              )}
              onClick={handleHomeClick}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            
            {userRole === "consumer" ? (
              <Link 
                to="/browse-food" 
                className={cn(
                  "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("/browse-food") 
                    ? "bg-green-50 text-green-700" 
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                )}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                Find Food
              </Link>
            ) : null}
            
            <Link 
              to="/create-listing" 
              className={cn(
                "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive("/create-listing") 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              )}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share Food
            </Link>
            
            <Link 
              to="/help" 
              className={cn(
                "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive("/help") 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              )}
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Help
            </Link>
            
            <Link 
              to="/profile" 
              className={cn(
                "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive("/profile") 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              )}
            >
              <User className="h-4 w-4 mr-1" />
              My Account
            </Link>
            
            {notificationsEnabled && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500">
                  2
                </Badge>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              className="inline-flex items-center text-gray-700 hover:text-green-600 hover:bg-green-50" 
              onClick={handleLogout}
            >
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
        <div className="md:hidden bg-white shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={cn(
                "block px-3 py-2 text-base font-medium",
                isActive("/") || isActive("/dashboard")
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-600"
              )}
              onClick={(e) => {
                handleHomeClick(e);
                setMobileMenuOpen(false);
              }}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Home
              </div>
            </Link>
            
            {userRole === "consumer" ? (
              <Link 
                to="/browse-food" 
                className={cn(
                  "block px-3 py-2 text-base font-medium",
                  isActive("/browse-food") 
                    ? "bg-green-50 text-green-700" 
                    : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Find Food
                </div>
              </Link>
            ) : null}
            
            <Link 
              to="/create-listing" 
              className={cn(
                "block px-3 py-2 text-base font-medium",
                isActive("/create-listing") 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-600"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Share Food
              </div>
            </Link>
            
            <Link 
              to="/help" 
              className={cn(
                "block px-3 py-2 text-base font-medium",
                isActive("/help") 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-600"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Help
              </div>
            </Link>
            
            <Link 
              to="/profile" 
              className={cn(
                "block px-3 py-2 text-base font-medium",
                isActive("/profile") 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-600"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                My Account
              </div>
            </Link>
            
            {notificationsEnabled && (
              <div className="px-3 py-2 text-base font-medium text-gray-700">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                    2
                  </Badge>
                </div>
              </div>
            )}
            
            <button 
              className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
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
