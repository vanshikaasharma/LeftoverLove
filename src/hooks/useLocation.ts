
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Coordinates {
  lat: number;
  lng: number;
}

const useLocation = () => {
  const [location, setLocation] = useState("");
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  useEffect(() => {
    const savedLocationPermission = localStorage.getItem('locationPermission');
    if (savedLocationPermission) {
      setLocationStatus(savedLocationPermission as 'granted' | 'denied');
      if (savedLocationPermission === 'denied') {
        setLocation("Vancouver, BC");
      } else if (savedLocationPermission === 'granted') {
        const savedCoords = localStorage.getItem('userCoordinates');
        if (savedCoords) {
          setUserCoordinates(JSON.parse(savedCoords));
          setLocation("Your Current Location");
        }
      }
    } else {
      setShowLocationDialog(true);
    }
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoordinates(coords);
        setLocationStatus('granted');
        localStorage.setItem('locationPermission', 'granted');
        localStorage.setItem('userCoordinates', JSON.stringify(coords));
        
        reverseGeocode(coords);
        setIsLoadingLocation(false);
        setShowLocationDialog(false);
        
        toast.success("Using your current location to find nearby food");
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationStatus('denied');
        localStorage.setItem('locationPermission', 'denied');
        setIsLoadingLocation(false);
        
        toast.error("Location access denied. Please enter your location manually");
      }
    );
  };

  const reverseGeocode = async (coords: Coordinates) => {
    setLocation("Your Current Location");
    // This would be where you'd integrate with a real geocoding API
  };

  const handleDenyLocation = () => {
    setLocationStatus('denied');
    localStorage.setItem('locationPermission', 'denied');
    setShowLocationDialog(false);
    setLocation("Vancouver, BC");
    toast.info("You can search for food by entering specific locations in Vancouver");
  };

  return {
    location,
    setLocation,
    userCoordinates,
    setUserCoordinates,
    locationStatus,
    setLocationStatus,
    isLoadingLocation,
    showLocationDialog,
    setShowLocationDialog,
    getCurrentLocation,
    handleDenyLocation
  };
};

export default useLocation;
