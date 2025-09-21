import React from "react";
import { Badge } from "@/components/ui/badge";

interface AvailabilityBadgeProps {
  isOpen?: boolean;
  status?: "available" | "low-stock" | "out-of-stock";
  size?: "sm" | "default";
}

export const AvailabilityBadge = ({ 
  isOpen, 
  status = "available", 
  size = "sm" 
}: AvailabilityBadgeProps) => {
  // For vendor open/close status
  if (typeof isOpen === "boolean") {
    return (
      <Badge 
        variant="secondary"
        className={`
          text-xs font-medium flex items-center gap-1
          ${isOpen 
            ? "bg-success-light text-success border-success/20" 
            : "bg-destructive-light text-destructive border-destructive/20"
          }
          ${size === "sm" ? "px-2 py-1" : "px-3 py-1"}
        `}
      >
        <div 
          className={`
            w-2 h-2 rounded-full 
            ${isOpen ? "bg-success" : "bg-destructive"}
          `}
        />
        {isOpen ? "Open" : "Closed"}
      </Badge>
    );
  }

  // For food item availability status
  const getStatusConfig = () => {
    switch (status) {
      case "available":
        return {
          text: "Available",
          bgClass: "bg-success-light text-success border-success/20",
          dotClass: "bg-success"
        };
      case "low-stock":
        return {
          text: "Low Stock",
          bgClass: "bg-warning-light text-warning border-warning/20", 
          dotClass: "bg-warning"
        };
      case "out-of-stock":
        return {
          text: "Out of Stock",
          bgClass: "bg-destructive-light text-destructive border-destructive/20",
          dotClass: "bg-destructive"
        };
      default:
        return {
          text: "Available",
          bgClass: "bg-success-light text-success border-success/20",
          dotClass: "bg-success"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="secondary"
      className={`
        text-xs font-medium flex items-center gap-1
        ${config.bgClass}
        ${size === "sm" ? "px-2 py-1" : "px-3 py-1"}
      `}
    >
      <div className={`w-2 h-2 rounded-full ${config.dotClass}`} />
      {config.text}
    </Badge>
  );
};