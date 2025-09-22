import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, Phone, RefreshCw, MapPin, Hash, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const orderDetails = location.state;
  
  const [currentStatus, setCurrentStatus] = useState(orderDetails?.status || "received");
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
    }
  }, [orderDetails, navigate]);

  useEffect(() => {
    // Simulate order status updates
    const statusFlow = ["received", "preparing", "ready", "picked_up"];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex < statusFlow.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = statusFlow[currentIndex + 1];
        setCurrentStatus(nextStatus);
        setLastUpdated(new Date().toISOString());
        
        // Show notification for status change
        const statusMessages = {
          preparing: "Your order is being prepared!",
          ready: "Your order is ready for pickup!",
          picked_up: "Order completed. Thank you!"
        };
        
        if (statusMessages[nextStatus as keyof typeof statusMessages]) {
          toast({
            title: "Order Update",
            description: statusMessages[nextStatus as keyof typeof statusMessages],
          });
        }
      }, Math.random() * 30000 + 60000); // Random time between 1-1.5 minutes
      
      return () => clearTimeout(timer);
    }
  }, [currentStatus, toast]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <Button onClick={() => navigate("/")}>Go Back to Home</Button>
        </div>
      </div>
    );
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusProgress = () => {
    const statusFlow = ["received", "preparing", "ready", "picked_up"];
    return statusFlow.indexOf(currentStatus) + 1;
  };

  const getEstimatedMinutes = () => {
    if (currentStatus === "ready" || currentStatus === "picked_up") return 0;
    
    const now = new Date();
    const estimated = new Date(orderDetails.estimatedTime);
    const diffMinutes = Math.ceil((estimated.getTime() - now.getTime()) / (1000 * 60));
    return Math.max(0, diffMinutes);
  };

  const handleCallVendor = () => {
    toast({
      title: "Calling Vendor",
      description: "Connecting you to the vendor...",
    });
  };

  const handleRemindVendor = () => {
    toast({
      title: "Reminder Sent",
      description: "The vendor has been notified about your order.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return currentStatus === status ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary";
      case "preparing":
        return currentStatus === status ? "bg-warning text-warning-foreground" : 
               getStatusProgress() > 2 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground";
      case "ready":
        return currentStatus === status ? "bg-success text-success-foreground" : 
               getStatusProgress() > 3 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground";
      case "picked_up":
        return currentStatus === status ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Track Order</h1>
              <p className="text-sm text-muted-foreground">
                Token: {orderDetails.token} • {orderDetails.vendor.name}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        {/* Current Status */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mb-4">
                {currentStatus === "picked_up" ? (
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold mb-2 capitalize">
                {currentStatus === "picked_up" ? "Order Completed" : currentStatus.replace("_", " ")}
              </h2>
              
              {currentStatus === "ready" && (
                <div className="space-y-2">
                  <p className="text-success font-medium text-lg">Your order is ready for pickup!</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Token: {orderDetails.token}
                    </Badge>
                  </div>
                </div>
              )}
              
              {currentStatus === "picked_up" && (
                <p className="text-muted-foreground">Thank you for your order!</p>
              )}
              
              {currentStatus !== "ready" && currentStatus !== "picked_up" && (
                <p className="text-muted-foreground">
                  Estimated time: {getEstimatedMinutes()} minutes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: "received", label: "Order Received", time: orderDetails.orderTime },
                { key: "preparing", label: "Preparing Your Order", time: currentStatus !== "received" ? lastUpdated : null },
                { key: "ready", label: "Ready for Pickup", time: getStatusProgress() >= 3 ? lastUpdated : null },
                { key: "picked_up", label: "Order Completed", time: currentStatus === "picked_up" ? lastUpdated : null }
              ].map((step, index) => (
                <div key={step.key} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.key)}`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step.label}</p>
                    {step.time && (
                      <p className="text-sm text-muted-foreground">
                        {formatTime(step.time)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Order ID</span>
                </div>
                <p className="font-mono">{orderDetails.orderId}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <QrCode className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Token</span>
                </div>
                <p className="text-lg font-bold text-primary">{orderDetails.token}</p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Pickup Location</span>
              </div>
              <div>
                <p className="font-medium">{orderDetails.vendor.name}</p>
                <p className="text-sm text-muted-foreground">
                  {orderDetails.vendor.floor} • {orderDetails.vendor.stallNumber}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-lg font-semibold">₹{orderDetails.total}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {orderDetails.paymentStatus === "completed" ? "Paid" : "Pay at counter"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions for delayed orders */}
        {currentStatus === "received" && (
          <Card>
            <CardHeader>
              <CardTitle>Order Taking Too Long?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If your order is taking longer than expected, you can remind the vendor or call them directly.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleRemindVendor}>
                  Remind Vendor
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleCallVendor}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Vendor
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Fixed Bottom Bar */}
      {currentStatus === "picked_up" ? (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="container mx-auto">
            <Button className="w-full" onClick={() => navigate("/")}>
              Order Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="container mx-auto flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
              Order More
            </Button>
            {currentStatus === "ready" && (
              <Button className="flex-1" onClick={handleCallVendor}>
                <Phone className="w-4 h-4 mr-2" />
                Call if Needed
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;