import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, MapPin, CreditCard } from "lucide-react";

interface DeliveryIntegrationProps {
  listingId: string;
  onRequestDelivery: (address: string, deliveryService: string) => void;
}

const deliveryServices = [
  { id: "uber", name: "Uber Eats", icon: "🚗" },
  { id: "doordash", name: "DoorDash", icon: "🚚" },
  { id: "grubhub", name: "Grubhub", icon: "🍔" },
  { id: "postmates", name: "Postmates", icon: "📦" },
];

const DeliveryIntegration = ({ listingId, onRequestDelivery }: DeliveryIntegrationProps) => {
  const [address, setAddress] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (address && selectedService) {
      onRequestDelivery(address, selectedService);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 hover:bg-blue-600">
          <Truck className="mr-2 h-4 w-4" />
          Request Delivery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Delivery</DialogTitle>
          <DialogDescription>
            Choose a delivery service and provide your delivery address
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Delivery Address</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <Input
                id="address"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Select Delivery Service</Label>
            <div className="grid grid-cols-2 gap-2">
              {deliveryServices.map((service) => (
                <Button
                  key={service.id}
                  variant={selectedService === service.id ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => setSelectedService(service.id)}
                >
                  <span>{service.icon}</span>
                  {service.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="h-4 w-4" />
              <span>Delivery fees will be charged by the selected service</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!address || !selectedService}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Request Delivery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryIntegration; 