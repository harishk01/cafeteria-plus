import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Wallet, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state;

  const [paymentOption, setPaymentOption] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!orderData) {
      navigate("/");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid order data</h2>
          <Button onClick={() => navigate("/")}>Go Back to Home</Button>
        </div>
      </div>
    );
  }

  const generateOrderId = () => {
    return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const generateTrackingId = () => {
    return `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const generateToken = () => {
    return Math.floor(Math.random() * 999) + 1;
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderDetails = {
      orderId: generateOrderId(),
      trackingId: generateTrackingId(),
      token: generateToken(),
      ...orderData,
      paymentStatus: orderData.paymentMethod === "online" ? "completed" : "pending",
      paymentOption: orderData.paymentMethod === "online" ? paymentOption : "cash",
      upiId: orderData.paymentMethod === "online" && paymentOption === "upi" ? upiId : "",
      orderTime: new Date().toISOString(),
      estimatedTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
      status: "received"
    };

    navigate("/order-confirmation", { state: orderDetails });
  };

  const handleCashOrder = () => {
    handlePayment();
  };

  if (orderData.paymentMethod === "cash") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/cart", { state: { vendorId: orderData.vendorId, cart: orderData.items } })}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">Confirm Order</h1>
                <p className="text-sm text-muted-foreground">Cash on Pickup</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 pb-32">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{orderData.vendor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {orderData.vendor.floor} • {orderData.vendor.stallNumber}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Items:</h4>
                  <p className="text-sm text-muted-foreground">{orderData.totalItems} items</p>
                </div>

                {orderData.orderNotes && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Special Instructions:</h4>
                    <p className="text-sm text-muted-foreground">{orderData.orderNotes}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>₹{orderData.total}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay at counter during pickup
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="container mx-auto">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCashOrder}
              disabled={isProcessing}
            >
              {isProcessing ? "Placing Order..." : "Confirm Order"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/cart", { state: { vendorId: orderData.vendorId, cart: orderData.items } })}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Payment</h1>
              <p className="text-sm text-muted-foreground">Choose your payment method</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{orderData.vendor.name}</span>
                <span>{orderData.totalItems} items</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total Amount</span>
                <span>₹{orderData.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentOption} onValueChange={setPaymentOption}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="w-4 h-4" />
                  <div>
                    <div className="font-medium">UPI</div>
                    <div className="text-sm text-muted-foreground">Pay using UPI ID or QR code</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Wallet className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Digital Wallets</div>
                    <div className="text-sm text-muted-foreground">Paytm, PhonePe, Google Pay</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {paymentOption === "upi" && (
              <div className="mt-4">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="Enter your UPI ID (e.g., 9876543210@paytm)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Secure Payment</p>
                <p className="text-muted-foreground">
                  Your payment is processed securely through Razorpay. We don't store your payment information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="container mx-auto">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handlePayment}
            disabled={isProcessing || (paymentOption === "upi" && !upiId.trim())}
          >
            {isProcessing ? "Processing Payment..." : `Pay ₹${orderData.total}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;