import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface MapViewProps {
  location: string;
  coordinates: { lat: number; lng: number } | null;
  isLoading: boolean;
}

const MapView = ({ location, coordinates, isLoading }: MapViewProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (coordinates) {
      setIsMapLoaded(true);
    }
  }, [coordinates]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pickup Location</CardTitle>
        <CardDescription>
          {location || "Location not specified"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : coordinates ? (
          <div className="h-64 relative rounded-lg overflow-hidden">
            {isMapLoaded && (
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng-0.01},${coordinates.lat-0.01},${coordinates.lng+0.01},${coordinates.lat+0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
              />
            )}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <MapPin className="h-8 w-8 mr-2" />
            <p>Location not available</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            if (coordinates) {
              window.open(
                `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=15/${coordinates.lat}/${coordinates.lng}`,
                '_blank'
              );
            }
          }}
          disabled={!coordinates}
        >
          <MapPin className="h-4 w-4 mr-2" />
          View on OpenStreetMap
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MapView; 