import React, { useState } from "react";
import { Search, MapPin, Clock, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VendorCard } from "@/components/VendorCard";
import { OrderTracking } from "@/components/OrderTracking";

// Mock data for demonstration
const vendors = [
  {
    id: "1",
    name: "South Delights",
    floor: "Ground Floor",
    stallNumber: "G-01",
    category: "South Indian",
    rating: 4.5,
    preparationTime: "12-15 min",
    isOpen: true,
    popularItems: ["Dosa", "Idli", "Vada"],
    dietaryOptions: ["Veg", "Jain"]
  },
  {
    id: "2", 
    name: "North Spice Corner",
    floor: "1st Floor",
    stallNumber: "F1-03",
    category: "North Indian",
    rating: 4.2,
    preparationTime: "15-20 min",
    isOpen: true,
    popularItems: ["Roti", "Dal", "Paneer"],
    dietaryOptions: ["Veg", "Non-Veg"]
  },
  {
    id: "3",
    name: "Healthy Bites",
    floor: "Ground Floor", 
    stallNumber: "G-05",
    category: "Salads & Healthy",
    rating: 4.7,
    preparationTime: "8-10 min",
    isOpen: false,
    popularItems: ["Caesar Salad", "Protein Bowl", "Fresh Juice"],
    dietaryOptions: ["Veg", "Vegan"]
  },
  {
    id: "4",
    name: "Snack Station",
    floor: "2nd Floor",
    stallNumber: "F2-01", 
    category: "Snacks & Beverages",
    rating: 4.0,
    preparationTime: "5-8 min",
    isOpen: true,
    popularItems: ["Sandwich", "Tea", "Coffee"],
    dietaryOptions: ["Veg", "Egg", "Non-Veg"]
  }
];

const floors = ["All Floors", "Ground Floor", "1st Floor", "2nd Floor"];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("All Floors");
  const [showTracking, setShowTracking] = useState(false);

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFloor = selectedFloor === "All Floors" || vendor.floor === selectedFloor;
    return matchesSearch && matchesFloor;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comcast Cafeteria</h1>
            <p className="text-sm text-muted-foreground">Order fresh food, skip the line</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/vendor', '_blank')}
            >
              Vendor Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTracking(!showTracking)}
            >
              <Clock className="w-4 h-4 mr-2" />
              Track Order
            </Button>
          </div>
        </div>

          {/* Search and Filters */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search vendors or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {floors.map((floor) => (
                <Button
                  key={floor}
                  variant={selectedFloor === floor ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFloor(floor)}
                  className="whitespace-nowrap"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {floor}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Order Tracking Overlay */}
      {showTracking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <OrderTracking onClose={() => setShowTracking(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Available Vendors
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredVendors.length} vendors {selectedFloor !== "All Floors" ? `on ${selectedFloor}` : ""}
            </p>
          </div>
          <Badge variant="secondary" className="animate-pulse-success">
            <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
            Live Updates
          </Badge>
        </div>

        {/* Vendors Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No vendors found</div>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or floor filter
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-accent/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Star className="w-4 h-4 mr-2" />
              My Favorites
            </Button>
            <Button variant="outline" className="justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Order History
            </Button>
            <Button variant="outline" className="justify-start">
              <Filter className="w-4 h-4 mr-2" />
              Dietary Preferences
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;