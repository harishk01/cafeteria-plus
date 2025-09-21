import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Star, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvailabilityBadge } from "./AvailabilityBadge";

interface Vendor {
  id: string;
  name: string;
  floor: string;
  stallNumber: string;
  category: string;
  rating: number;
  preparationTime: string;
  isOpen: boolean;
  popularItems: string[];
  dietaryOptions: string[];
}

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard = ({ vendor }: VendorCardProps) => {
  const navigate = useNavigate();
  
  const getDietaryColor = (option: string) => {
    switch (option) {
      case "Veg": return "bg-success text-success-foreground";
      case "Egg": return "bg-warning text-warning-foreground";
      case "Non-Veg": return "bg-destructive text-destructive-foreground";
      case "Jain": return "bg-accent text-accent-foreground";
      case "Vegan": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 cursor-pointer animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {vendor.name}
              </h3>
              <AvailabilityBadge isOpen={vendor.isOpen} />
            </div>
            <p className="text-sm text-muted-foreground mb-2">{vendor.category}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{vendor.floor} • {vendor.stallNumber}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-current" />
                <span>{vendor.rating}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>

        <div className="space-y-3">
          {/* Preparation Time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Prep time:</span>
            <span className="font-medium text-foreground">{vendor.preparationTime}</span>
          </div>

          {/* Popular Items */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Popular items:</p>
            <div className="flex flex-wrap gap-1">
              {vendor.popularItems.slice(0, 3).map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dietary Options */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Available options:</p>
            <div className="flex flex-wrap gap-1">
              {vendor.dietaryOptions.map((option, index) => (
                <Badge 
                  key={index} 
                  className={`text-xs ${getDietaryColor(option)}`}
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full mt-4" 
          disabled={!vendor.isOpen}
          variant={vendor.isOpen ? "default" : "secondary"}
          onClick={() => vendor.isOpen && navigate(`/menu/${vendor.id}`)}
        >
          {vendor.isOpen ? "View Menu" : "Closed"}
        </Button>
      </CardContent>
    </Card>
  );
};