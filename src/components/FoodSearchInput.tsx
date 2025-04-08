
import React, { useState, useEffect } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FoodSearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: string;
  setLocation: (location: string) => void;
  radius: number[];
  setRadius: (radius: number[]) => void;
  handleSearch: () => void;
  locationStatus: 'prompt' | 'granted' | 'denied' | 'unsupported';
  setShowLocationDialog: (show: boolean) => void;
}

const VANCOUVER_ADDRESSES = [
  "555 W Hastings St, Vancouver, BC",
  "800 Robson St, Vancouver, BC",
  "601 W Cordova St, Vancouver, BC",
  "1055 Canada Pl, Vancouver, BC",
  "750 Hornby St, Vancouver, BC",
  "900 W Georgia St, Vancouver, BC",
  "375 Water St, Vancouver, BC",
  "639 Hornby St, Vancouver, BC",
  "8181 Cambie Rd, Vancouver, BC",
  "3211 Grant McConachie Way, Vancouver, BC",
  "201 W Hastings St, Vancouver, BC",
  "125 E 10th Ave, Vancouver, BC",
  "1669 Johnston St, Vancouver, BC",
  "2000 W 10th Ave, Vancouver, BC",
  "88 W Pender St, Vancouver, BC",
  "1181 Seymour St, Vancouver, BC",
  "401 Burrard St, Vancouver, BC",
  "6200 University Blvd, Vancouver, BC",
  "3663 Crowley Dr, Vancouver, BC",
  "3883 Rupert St, Vancouver, BC"
];

const FoodSearchInput: React.FC<FoodSearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  radius,
  setRadius,
  handleSearch,
  locationStatus,
  setShowLocationDialog,
}) => {
  const [openLocationPopover, setOpenLocationPopover] = useState(false);
  const [vancouverAddressSuggestions, setVancouverAddressSuggestions] = useState<string[]>([]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const locationQuery = e.target.value;
    setLocation(locationQuery);
    
    if (!locationQuery.trim()) {
      setVancouverAddressSuggestions([]);
      setOpenLocationPopover(false);
      return;
    }
    
    // Filter Vancouver addresses based on input
    const matchingAddresses = VANCOUVER_ADDRESSES.filter(address => 
      address.toLowerCase().includes(locationQuery.toLowerCase())
    );
    
    setVancouverAddressSuggestions(matchingAddresses);
    setOpenLocationPopover(matchingAddresses.length > 0);
  };

  const handleSelectVancouverAddress = (address: string) => {
    setLocation(address);
    setOpenLocationPopover(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="pl-10"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Popover open={openLocationPopover && vancouverAddressSuggestions.length > 0} onOpenChange={setOpenLocationPopover}>
            <PopoverTrigger asChild>
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="Enter Vancouver location"
                  value={location}
                  onChange={handleLocationInputChange}
                  className="pl-10 w-full"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandGroup heading="Vancouver Addresses">
                    {vancouverAddressSuggestions.length > 0 ? (
                      vancouverAddressSuggestions.map((address, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => handleSelectVancouverAddress(address)}
                          className="flex items-center cursor-pointer"
                        >
                          <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                          <span>{address}</span>
                        </CommandItem>
                      ))
                    ) : (
                      <CommandEmpty>No addresses found</CommandEmpty>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Radius: {radius} mi</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Search Radius</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Distance: {radius} miles</h4>
                    <Slider
                      value={radius}
                      onValueChange={setRadius}
                      max={25}
                      min={1}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={handleSearch} 
            className="bg-teal-600 hover:bg-teal-700"
          >
            Search
          </Button>
        </div>
      </div>
      
      {locationStatus !== 'granted' && (
        <div className="mt-3 flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-teal-600" 
            onClick={() => setShowLocationDialog(true)}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Use my current location
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodSearchInput;
