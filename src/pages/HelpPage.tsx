import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const HelpPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600">Support and assistance for FoodShare Connect users</p>
        </div>
        
        <Alert className="mb-8 border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <AlertTitle className="text-yellow-700">Under Maintenance</AlertTitle>
          <AlertDescription className="text-yellow-600">
            Our help center is currently under maintenance. We're working to improve our support resources and will be back soon. Thank you for your patience.
          </AlertDescription>
        </Alert>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-4">
            While our help center is being updated, here are some common questions and answers:
          </p>
          
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-800 mb-2">How do I create a food listing?</h3>
              <p className="text-gray-600">
                To create a food listing, navigate to the "Share Food" page and fill out the form with details about your food item, including quantity, expiration date, and pickup location.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-800 mb-2">How do I find food listings?</h3>
              <p className="text-gray-600">
                Visit the "Find Food" page to browse available food listings. You can filter by category, distance, and other criteria to find what you're looking for.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-800 mb-2">How do I contact a food provider?</h3>
              <p className="text-gray-600">
                Once you find a food listing you're interested in, you can contact the provider through the messaging system on the listing details page.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Support</h2>
          <p className="text-gray-600 mb-4">
            If you need immediate assistance, please contact our support team:
          </p>
          
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> support@foodshareconnect.com
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> (555) 123-4567
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Hours:</span> Monday-Friday, 9am-5pm EST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 