import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Minus, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Mock data - should match Menu.tsx
const menuData = {
  "1": {
    categories: [
      {
        name: "Main Dishes",
        items: [
          { id: "1", name: "Masala Dosa", price: 80, description: "Crispy dosa with spiced potato filling", available: true, dietary: ["Veg"] },
          { id: "2", name: "Rava Idli", price: 60, description: "Soft steamed idli made with semolina", available: true, dietary: ["Veg"] },
          { id: "3", name: "Medu Vada", price: 50, description: "Crispy lentil donuts", available: false, dietary: ["Veg"] }
        ]
      },
      {
        name: "Beverages",
        items: [
          { id: "4", name: "Filter Coffee", price: 25, description: "Traditional South Indian coffee", available: true, dietary: ["Veg"] },
          { id: "5", name: "Masala Chai", price: 20, description: "Spiced tea", available: true, dietary: ["Veg"] }
        ]
      }
    ]
  },
  "2": {
    categories: [
      {
        name: "Main Dishes",
        items: [
          { id: "6", name: "Butter Roti", price: 15, description: "Soft wheat bread with butter", available: true, dietary: ["Veg"] },
          { id: "7", name: "Dal Tadka", price: 90, description: "Yellow lentils with tempering", available: true, dietary: ["Veg"] },
          { id: "8", name: "Paneer Butter Masala", price: 140, description: "Cottage cheese in rich tomato gravy", available: true, dietary: ["Veg"] }
        ]
      }
    ]
  },
  "3": {
    categories: [
      {
        name: "Salads",
        items: [
          { id: "9", name: "Caesar Salad", price: 120, description: "Fresh lettuce with caesar dressing", available: true, dietary: ["Veg"] },
          { id: "10", name: "Protein Bowl", price: 150, description: "Quinoa with grilled vegetables", available: true, dietary: ["Vegan"] },
          { id: "11", name: "Fresh Juice", price: 60, description: "Seasonal fruit juice", available: false, dietary: ["Vegan"] }
        ]
      }
    ]
  },
  "4": {
    categories: [
      {
        name: "Snacks",
        items: [
          { id: "12", name: "Grilled Sandwich", price: 70, description: "Cheese and vegetable sandwich", available: true, dietary: ["Veg"] },
          { id: "13", name: "Masala Tea", price: 15, description: "Indian spiced tea", available: true, dietary: ["Veg"] },
          { id: "14", name: "Coffee", price: 20, description: "Black coffee", available: true, dietary: ["Vegan"] }
        ]
      }
    ]
  }
};

const vendors = [
  { id: "1", name: "South Delights", floor: "Ground Floor", stallNumber: "G-01", category: "South Indian", isOpen: true },
  { id: "2", name: "North Spice Corner", floor: "1st Floor", stallNumber: "F1-03", category: "North Indian", isOpen: true },
  { id: "3", name: "Healthy Bites", floor: "Ground Floor", stallNumber: "G-05", category: "Salads & Healthy", isOpen: false },
  { id: "4", name: "Snack Station", floor: "2nd Floor", stallNumber: "F2-01", category: "Snacks & Beverages", isOpen: true }
];

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vendorId, cart } = location.state || { vendorId: "", cart: {} };
  
  const [cartItems, setCartItems] = useState<{[key: string]: number}>(cart);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");

  const vendor = vendors.find(v => v.id === vendorId);
  const menu = menuData[vendorId as keyof typeof menuData];

  const getAllItems = () => {
    if (!menu) return [];
    return menu.categories.flatMap(category => category.items);
  };

  const getItemById = (itemId: string) => {
    return getAllItems().find(item => item.id === itemId);
  };

  const updateCart = (itemId: string, change: number) => {
    setCartItems(prev => {
      const current = prev[itemId] || 0;
      const newValue = Math.max(0, current + change);
      if (newValue === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newValue };
    });
  };

  const getTotal = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const item = getItemById(itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getTotalItems = (): number => Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const handleProceedToPayment = () => {
    const orderData = {
      vendorId,
      vendor,
      items: cartItems,
      orderNotes,
      paymentMethod,
      total: getTotal(),
      totalItems: getTotalItems()
    };
    
    navigate("/payment", { state: orderData });
  };

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

  if (!vendor || !menu || Object.keys(cartItems).length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Cart is empty</h2>
          <Button onClick={() => navigate("/")}>Go Back to Home</Button>
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
            <Button variant="ghost" size="sm" onClick={() => navigate(`/menu/${vendorId}`, { state: { cart: cartItems } })}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Your Cart</h1>
              <p className="text-sm text-muted-foreground">
                {vendor.name} • {vendor.floor} • {vendor.stallNumber}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        {/* Cart Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Order Items</h2>
          <div className="space-y-4">
            {Object.entries(cartItems).map(([itemId, quantity]) => {
              const item = getItemById(itemId);
              if (!item) return null;
              
              return (
                <Card key={itemId}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          <div className="flex gap-1">
                            {item.dietary.map((diet, index) => (
                              <Badge key={index} className={`text-xs ${getDietaryColor(diet)}`}>
                                {diet}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <p className="text-lg font-semibold text-foreground">₹{item.price} × {quantity} = ₹{item.price * quantity}</p>
                      </div>
                      
                      <div className="ml-4 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCart(itemId, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">{quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCart(itemId, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Order Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any special requests or dietary requirements..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Online Payment (UPI/Cards/Wallets)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                  <Banknote className="w-4 h-4" />
                  Cash on Pickup
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items ({getTotalItems()})</span>
                <span>₹{getTotal()}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span>₹{getTotal()}</span>
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
            onClick={handleProceedToPayment}
          >
            Proceed to {paymentMethod === "online" ? "Payment" : "Confirm Order"} • ₹{getTotal().toString()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;