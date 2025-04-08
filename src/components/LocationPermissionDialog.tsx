
import React from "react";
import { MapPin, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface LocationPermissionDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  isLoadingLocation: boolean;
  locationStatus: 'prompt' | 'granted' | 'denied' | 'unsupported';
  onGetLocation: () => void;
  onDenyLocation: () => void;
}

const LocationPermissionDialog: React.FC<LocationPermissionDialogProps> = ({
  showDialog,
  setShowDialog,
  isLoadingLocation,
  locationStatus,
  onGetLocation,
  onDenyLocation,
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Location</DialogTitle>
          <DialogDescription>
            Allow Leftover Love to access your location to find food available near you. This helps us show you the most relevant options in your area.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          {locationStatus === 'unsupported' ? (
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <MapPinOff className="h-12 w-12 text-amber-500 mx-auto mb-2" />
              <p className="text-amber-800">Location services are not supported by your browser.</p>
            </div>
          ) : (
            <div className="text-center">
              <MapPin className="h-16 w-16 text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                We'll only use your location while you're using this app to help you find nearby food sources.
              </p>
              <p className="text-sm text-teal-700 font-medium">
                If you decline, you can still search by entering Vancouver locations manually.
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={onDenyLocation}
            disabled={isLoadingLocation}
          >
            No Thanks, I'll Enter My Location
          </Button>
          <Button 
            onClick={onGetLocation} 
            className="bg-teal-600 hover:bg-teal-700"
            disabled={locationStatus === 'unsupported' || isLoadingLocation}
          >
            {isLoadingLocation ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Getting Location...
              </>
            ) : (
              "Share My Location"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPermissionDialog;
