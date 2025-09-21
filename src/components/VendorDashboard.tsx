import React, { useState } from "react";
import { Bell, Clock, DollarSign, Package, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock vendor data
const mockVendor = {
  name: "South Delights",
  isOpen: true,
  todayStats: {
    orders: 24,
    revenue: "₹3,240",
    avgTime: "12 min"
  }
};

const mockOrders = [
  {
    id: "1",
    token: "A15",
    orderId: "ORD-2024-0001",
    customerName: "Rahul S.",
    items: ["1x Masala Dosa", "2x Filter Coffee"],
    total: "₹185",
    paymentMethod: "UPI",
    status: "received",
    timestamp: "2:18 PM",
    eta: "12 min",
    notes: "Extra sambhar for dosa"
  },
  {
    id: "2", 
    token: "A16",
    orderId: "ORD-2024-0002",
    customerName: "Priya M.",
    items: ["2x Idli", "1x Vada", "1x Coffee"],
    total: "₹140",
    paymentMethod: "Cash",
    status: "preparing", 
    timestamp: "2:20 PM",
    eta: "8 min",
    notes: ""
  },
  {
    id: "3",
    token: "A17", 
    orderId: "ORD-2024-0003",
    customerName: "Amit K.",
    items: ["1x Rava Dosa", "1x Coconut Chutney"],
    total: "₹95",
    paymentMethod: "UPI",
    status: "ready",
    timestamp: "2:22 PM", 
    eta: "Ready",
    notes: "Less spicy"
  }
];

export const VendorDashboard = () => {
  const [isOpen, setIsOpen] = useState(mockVendor.isOpen);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "received": return "bg-primary text-primary-foreground";
      case "preparing": return "bg-warning text-warning-foreground";
      case "ready": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received": return <Bell className="w-4 h-4" />;
      case "preparing": return <Package className="w-4 h-4" />;
      case "ready": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{mockVendor.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Vendor Dashboard</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Switch 
                    checked={isOpen} 
                    onCheckedChange={setIsOpen}
                  />
                  <Badge className={isOpen ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                    {isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Orders</p>
                <p className="text-2xl font-bold">{mockVendor.todayStats.orders}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-success/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{mockVendor.todayStats.revenue}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Prep Time</p>
                <p className="text-2xl font-bold">{mockVendor.todayStats.avgTime}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Live Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Orders</h3>
              <Badge variant="secondary" className="animate-pulse-success">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                {mockOrders.length} Active
              </Badge>
            </div>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id} className="animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-primary">#{order.token}</div>
                        <div>
                          <p className="font-semibold">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.orderId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{order.timestamp}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Items:</p>
                        <div className="flex flex-wrap gap-1">
                          {order.items.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {order.notes && (
                        <div>
                          <p className="text-sm font-medium mb-1">Special Notes:</p>
                          <p className="text-sm text-muted-foreground bg-accent/50 p-2 rounded">
                            {order.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium">Total: {order.total}</span>
                          <span className="text-muted-foreground">({order.paymentMethod})</span>
                          <span className="text-muted-foreground">ETA: {order.eta}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {order.status === "received" && (
                        <Button size="sm" className="flex-1">
                          Accept Order
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button size="sm" className="flex-1">
                          Mark Ready
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button size="sm" variant="outline" className="flex-1">
                          Mark Picked Up
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Menu Management</h3>
                  <p className="text-muted-foreground">Manage your menu items, prices, and availability here.</p>
                  <Button className="mt-4">Add New Item</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Reports & Analytics</h3>
                  <p className="text-muted-foreground">View detailed reports on sales, popular items, and performance.</p>
                  <Button className="mt-4">View Reports</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};