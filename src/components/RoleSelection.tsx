
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: "consumer" | "provider") => void;
}

const RoleSelection = ({ onSelectRole }: RoleSelectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card className="flex flex-col h-full border-2 hover:border-green-500 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="text-green-500" />
            Buy or Get Food
          </CardTitle>
          <CardDescription>
            Browse available food donations and products to find what you need
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">
            Access food resources donated by individuals, businesses, and organizations.
            Find free or low-cost food items in your community.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => onSelectRole("consumer")}
          >
            Continue as Food Seeker
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col h-full border-2 hover:border-earth-500 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="text-earth-500" />
            Donate or Sell Food
          </CardTitle>
          <CardDescription>
            List your excess food to help those in need or sell at reduced prices
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">
            Share your surplus food with the community. Help reduce food waste while
            supporting those facing food insecurity.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-earth-500 hover:bg-earth-600 text-white"
            onClick={() => onSelectRole("provider")}
          >
            Continue as Food Provider
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RoleSelection;
