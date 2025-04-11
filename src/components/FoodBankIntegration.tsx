import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Phone, Globe, Heart } from "lucide-react";

interface FoodBank {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  distance: string;
  accepts: string[];
}

const mockFoodBanks: FoodBank[] = [
  {
    id: "1",
    name: "Community Food Bank",
    address: "123 Main St, City, State 12345",
    phone: "(555) 123-4567",
    website: "https://communityfoodbank.org",
    distance: "2.5 miles",
    accepts: ["Non-perishables", "Fresh produce", "Dairy", "Baked goods"]
  },
  {
    id: "2",
    name: "Hope Food Pantry",
    address: "456 Oak Ave, City, State 12345",
    phone: "(555) 987-6543",
    website: "https://hopefoodpantry.org",
    distance: "3.1 miles",
    accepts: ["Non-perishables", "Fresh produce", "Meat", "Dairy"]
  },
  {
    id: "3",
    name: "Neighborhood Food Share",
    address: "789 Pine St, City, State 12345",
    phone: "(555) 456-7890",
    website: "https://neighborhoodfoodshare.org",
    distance: "1.8 miles",
    accepts: ["Non-perishables", "Fresh produce", "Baked goods"]
  }
];

const FoodBankIntegration = () => {
  const [zipCode, setZipCode] = useState("");
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    if (zipCode.length === 5) {
      setIsLoading(true);
      setTimeout(() => {
        setFoodBanks(mockFoodBanks);
        setIsLoading(false);
      }, 1000);
    }
  }, [zipCode]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Enter your ZIP code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="max-w-[200px]"
        />
        <Button 
          className="bg-green-500 hover:bg-green-600"
          disabled={zipCode.length !== 5}
        >
          Find Food Banks
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Finding food banks near you...</p>
        </div>
      ) : foodBanks.length > 0 ? (
        <div className="grid gap-4">
          {foodBanks.map((bank) => (
            <Card key={bank.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-500" />
                  {bank.name}
                </CardTitle>
                <CardDescription>
                  {bank.distance} away
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{bank.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{bank.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a 
                      href={bank.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">
                      Accepts: {bank.accepts.join(", ")}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => window.open(`tel:${bank.phone.replace(/\D/g, '')}`, '_blank')}
                >
                  Contact Food Bank
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : zipCode.length === 5 ? (
        <div className="text-center py-8 text-gray-600">
          No food banks found in your area. Try a different ZIP code.
        </div>
      ) : null}
    </div>
  );
};

export default FoodBankIntegration; 