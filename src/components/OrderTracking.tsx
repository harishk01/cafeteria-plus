import React from "react";
import { X, Clock, CheckCircle, Package, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OrderTrackingProps {
  onClose: () => void;
}

// Mock order data
const mockOrder = {
  orderId: "ORD-2024-0001",
  trackingId: "TRK-ABC123", 
  token: "A15",
  vendor: {
    name: "South Delights",
    floor: "Ground Floor",
    stallNumber: "G-01",
    phone: "+91 98765 43210"
  },
  items: [
    { name: "Masala Dosa", quantity: 1, notes: "Extra sambhar" },
    { name: "Filter Coffee", quantity: 2, notes: "" }
  ],
  status: "preparing",
  eta: "8 min",
  stages: [
    { name: "Order Received", status: "completed", time: "2:15 PM" },
    { name: "Preparing", status: "current", time: "2:18 PM" },
    { name: "Ready for Pickup", status: "pending", time: "" },
    { name: "Picked Up", status: "pending", time: "" }
  ],
  total: "₹185",
  paymentMethod: "UPI"
};

export const OrderTracking = ({ onClose }: OrderTrackingProps) => {
  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "current":
        return <Package className="w-4 h-4 text-primary animate-pulse" />;
      default:
        return <div className="w-4 h-4 border-2 border-muted rounded-full" />;
    }
  };

  const currentStageIndex = mockOrder.stages.findIndex(stage => stage.status === "current");
  const progress = ((currentStageIndex + 1) / mockOrder.stages.length) * 100;

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Order Tracking</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="bg-accent/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Token #{mockOrder.token}</p>
              <p className="text-sm text-muted-foreground">Order ID: {mockOrder.orderId}</p>
            </div>
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              <Clock className="w-3 h-3 mr-1" />
              ETA: {mockOrder.eta}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{mockOrder.vendor.name} • {mockOrder.vendor.floor} • {mockOrder.vendor.stallNumber}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Order Stages */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Order Status</h4>
          <div className="space-y-3">
            {mockOrder.stages.map((stage, index) => (
              <div key={index} className="flex items-center gap-3">
                {getStageIcon(stage.status)}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    stage.status === "completed" ? "text-success" :
                    stage.status === "current" ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {stage.name}
                  </p>
                  {stage.time && (
                    <p className="text-xs text-muted-foreground">{stage.time}</p>
                  )}
                </div>
                {stage.status === "current" && (
                  <Badge variant="secondary" className="text-xs">
                    In Progress
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Items Ordered</h4>
          <div className="space-y-2">
            {mockOrder.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{item.quantity}x {item.name}</span>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground">Note: {item.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 flex items-center justify-between font-medium">
            <span>Total Paid ({mockOrder.paymentMethod})</span>
            <span>{mockOrder.total}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Call Vendor
          </Button>
          <Button variant="outline" className="flex-1">
            Get Directions
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground text-center p-3 bg-muted/50 rounded-lg">
          <p>Please collect your order from <strong>{mockOrder.vendor.name}</strong> at <strong>{mockOrder.vendor.stallNumber}</strong> when ready.</p>
          <p className="mt-1">Show this token number to the vendor: <strong>#{mockOrder.token}</strong></p>
        </div>
      </CardContent>
    </Card>
  );
};