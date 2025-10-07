import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Wifi, Car, Coffee } from "lucide-react";
import { Property } from "@/data/cityData";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const getFeatureIcon = (feature: string) => {
    if (feature.includes("WiFi") || feature.includes("Internet")) return <Wifi className="w-4 h-4" />;
    if (feature.includes("Parking")) return <Car className="w-4 h-4" />;
    if (feature.includes("Pantry") || feature.includes("Coffee")) return <Coffee className="w-4 h-4" />;
    if (feature.includes("Meeting") || feature.includes("Collaboration")) return <Users className="w-4 h-4" />;
    return <div className="w-2 h-2 bg-primary rounded-full" />;
  };

  return (
    <Card className="group relative overflow-hidden hover-scale transition-all duration-300 border border-border/50 hover:border-primary/30 hover:shadow-lg">
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            {property.type}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge
            variant={property.availability === "Available" ? "default" : "secondary"}
            className={property.availability === "Available" ? "bg-green-500" : "bg-[#EDB003]"}
          >
            {property.availability}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
              {property.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {property.address}
            </CardDescription>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{property.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({property.reviews} reviews)</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-primary">{property.price}</div>
          <div className="text-sm text-muted-foreground">Starting price</div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          <h4 className="font-semibold text-sm">Features:</h4>
          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, 4).map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md"
              >
                {getFeatureIcon(feature)}
                <span>{feature}</span>
              </div>
            ))}
            {property.features.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{property.features.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            View Details
          </Button>
          <Button variant="outline" size="sm">
            Book Tour
          </Button>
        </div>
      </CardContent>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
};

export default PropertyCard;