import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Clock, MapPin, Hash, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state;

  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
    }
  }, [orderDetails, navigate]);

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

  const getEstimatedMinutes = () => {
    const now = new Date();
    const estimated = new Date(orderDetails.estimatedTime);
    const diffMinutes = Math.ceil((estimated.getTime() - now.getTime()) / (1000 * 60));
    return Math.max(0, diffMinutes);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Your order has been placed successfully
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Order ID</span>
                </div>
                <p className="font-mono text-sm">{orderDetails.orderId}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <QrCode className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Token</span>
                </div>
                <p className="text-2xl font-bold text-primary">{orderDetails.token}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tracking ID</span>
              </div>
              <p className="font-mono text-sm">{orderDetails.trackingId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Vendor & Pickup Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Pickup Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{orderDetails.vendor.name}</h3>
              <p className="text-muted-foreground">
                {orderDetails.vendor.category}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="font-medium">Floor:</span> {orderDetails.vendor.floor}
              </div>
              <div>
                <span className="font-medium">Stall:</span> {orderDetails.vendor.stallNumber}
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Estimated Pickup Time</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {formatTime(orderDetails.estimatedTime)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  (~{getEstimatedMinutes()} minutes)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">₹{orderDetails.total}</p>
                <p className="text-sm text-muted-foreground">
                  {orderDetails.paymentMethod === "online" ? (
                    `Paid via ${orderDetails.paymentOption.toUpperCase()}`
                  ) : (
                    "Pay at counter during pickup"
                  )}
                </p>
              </div>
              <Badge 
                variant={orderDetails.paymentStatus === "completed" ? "default" : "secondary"}
                className="capitalize"
              >
                {orderDetails.paymentStatus === "completed" ? "Paid" : "Pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Order Received</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(orderDetails.orderTime)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Preparing</p>
                  <p className="text-sm text-muted-foreground">
                    Vendor will start preparing soon
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Ready for Pickup</p>
                  <p className="text-sm text-muted-foreground">
                    We'll notify you when ready
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Show your <strong>Token Number ({orderDetails.token})</strong> at the counter for pickup</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>You can cancel within 2 minutes for auto-refund (if prepaid)</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>You'll receive notifications when your order is ready</p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="container mx-auto flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate("/order-tracking", { state: orderDetails })}
          >
            Track Order
          </Button>
          <Button 
            className="flex-1"
            onClick={() => navigate("/")}
          >
            Order More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;