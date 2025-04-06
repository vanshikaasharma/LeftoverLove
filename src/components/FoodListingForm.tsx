
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface FoodListingFormProps {
  onSubmit: (foodItem: FoodItemData) => void;
}

const FoodListingForm = ({ onSubmit }: FoodListingFormProps) => {
  const [foodItem, setFoodItem] = useState<FoodItemData>({
    name: "",
    description: "",
    category: "",
    quantity: "",
    expireDate: undefined,
    company: "",
    listingType: "donate",
    price: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
  });
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFoodItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFoodItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFoodItem((prev) => ({ ...prev, expireDate: date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!foodItem.name || !foodItem.category || !foodItem.quantity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (foodItem.listingType === "sell" && !foodItem.price) {
      toast({
        title: "Price required",
        description: "Please enter a price for items you wish to sell",
        variant: "destructive",
      });
      return;
    }

    onSubmit(foodItem);
  };

  const foodCategories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Breads & Baked Goods",
    "Meat & Protein",
    "Pantry Items",
    "Prepared Meals",
    "Beverages",
    "Snacks",
    "Baby Food",
    "Other",
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>List Food Item</CardTitle>
        <CardDescription>
          Share details about the food you want to donate or sell
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="listingType" className="text-base font-medium">
                Listing Type
              </Label>
              <RadioGroup
                id="listingType"
                defaultValue="donate"
                className="flex gap-6 mt-2"
                onValueChange={(value) => handleSelectChange("listingType", value as "donate" | "sell")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="donate" id="donate" />
                  <Label htmlFor="donate" className="font-normal">
                    Donate (Free)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell" className="font-normal">
                    Sell
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {foodItem.listingType === "sell" && (
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={foodItem.price}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Food Item Name*</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Fresh Apples, Bread Loaves"
                value={foodItem.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Source/Company</Label>
              <Input
                id="company"
                name="company"
                placeholder="e.g., Local Farm, Grocery Store, Homemade"
                value={foodItem.company}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <Select
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {foodCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity*</Label>
              <Input
                id="quantity"
                name="quantity"
                placeholder="e.g., 5 lbs, 3 boxes, 10 meals"
                value={foodItem.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expireDate">Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !foodItem.expireDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {foodItem.expireDate ? (
                      format(foodItem.expireDate, "PPP")
                    ) : (
                      <span>Select expiration date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={foodItem.expireDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide more details about the food item"
                value={foodItem.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Pickup Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Downtown area, Community center"
                value={foodItem.location}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={foodItem.contactPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="contact@example.com"
                  value={foodItem.contactEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Submit Listing
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FoodListingForm;
