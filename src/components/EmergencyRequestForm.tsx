import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Clock, Users, MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmergencyRequestFormProps {
  onSubmit: (request: EmergencyRequestData) => void;
}

interface EmergencyRequestData {
  name: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  urgency: "high" | "medium" | "low";
  numberOfPeople: number;
  dietaryRestrictions: string;
  additionalInfo: string;
}

const EmergencyRequestForm = ({ onSubmit }: EmergencyRequestFormProps) => {
  const [request, setRequest] = useState<EmergencyRequestData>({
    name: "",
    contactPhone: "",
    contactEmail: "",
    location: "",
    urgency: "medium",
    numberOfPeople: 1,
    dietaryRestrictions: "",
    additionalInfo: "",
  });

  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setRequest((prev) => ({ ...prev, numberOfPeople: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!request.name || !request.contactPhone || !request.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit(request);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-6 w-6" />
          Emergency Food Request
        </CardTitle>
        <CardDescription>
          Fill out this form to request emergency food assistance. Your request will be prioritized and shared with local providers.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={request.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select
                value={request.urgency}
                onValueChange={(value) => handleSelectChange("urgency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high" className="text-red-600">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      High - Immediate Need
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="text-amber-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Medium - Within 24 Hours
                    </div>
                  </SelectItem>
                  <SelectItem value="low" className="text-green-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Low - Can Wait
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number *</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                placeholder="(123) 456-7890"
                value={request.contactPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="your@email.com"
                value={request.contactEmail}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                placeholder="Where can you pick up the food?"
                value={request.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Number of People *</Label>
              <Input
                id="numberOfPeople"
                name="numberOfPeople"
                type="number"
                min="1"
                value={request.numberOfPeople}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
            <Input
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              placeholder="e.g., Vegetarian, Gluten-free, Allergies"
              value={request.dietaryRestrictions}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              placeholder="Any other important details about your situation"
              value={request.additionalInfo}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Submit Emergency Request
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmergencyRequestForm; 