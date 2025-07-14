import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CartItem, CartItemData } from "@/components/CartItem";
import { AbandonmentRiskModal } from "@/components/AbandonmentRiskModal";
import { useAbandonmentRisk } from "@/hooks/useAbandonmentRisk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart as ShoppingCartIcon, CreditCard, Truck, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Mock cart data for demo
const mockCartItems: CartItemData[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    quantity: 1,
    category: "Electronics",
    rating: 4.5,
    addedAt: new Date(Date.now() - 300000) // 5 minutes ago
  },
  {
    id: "2", 
    name: "Cozy Winter Sweater",
    price: 34.99,
    quantity: 2,
    category: "Clothing",
    rating: 4.2,
    addedAt: new Date(Date.now() - 180000) // 3 minutes ago
  },
  {
    id: "3",
    name: "Organic Green Tea",
    price: 12.99,
    quantity: 1,
    category: "Food",
    rating: 4.8,
    addedAt: new Date(Date.now() - 120000) // 2 minutes ago
  }
];

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItemData[]>(mockCartItems);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [hasShownRiskModal, setHasShownRiskModal] = useState(false);
  
  const riskData = useAbandonmentRisk(cartItems);

  // Show risk modal when score is high
  useEffect(() => {
    if (riskData && riskData.score > 70 && !hasShownRiskModal && cartItems.length > 0) {
      const timer = setTimeout(() => {
        setShowRiskModal(true);
        setHasShownRiskModal(true);
      }, 2000); // Delay to avoid immediate popup

      return () => clearTimeout(timer);
    }
  }, [riskData, hasShownRiskModal, cartItems.length]);

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const handleAcceptOffer = () => {
    toast.success("Special offer applied to your cart! 🎉");
    setShowRiskModal(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCartIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {itemCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </div>

        {/* ML Risk Indicator */}
        {riskData && cartItems.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">
                    ML Abandonment Risk: <span className="font-bold">{riskData.score}%</span>
                  </p>
                  <p className="text-xs text-orange-600">
                    Based on cart time, value, and browsing behavior
                  </p>
                </div>
                <Badge variant={riskData.score > 70 ? "destructive" : riskData.score > 40 ? "default" : "secondary"}>
                  {riskData.score > 70 ? "High Risk" : riskData.score > 40 ? "Medium Risk" : "Low Risk"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground">Add some items to get started!</p>
                </CardContent>
              </Card>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Link to="/checkout">
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={cartItems.length === 0}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                </Link>

                {subtotal < 50 && cartItems.length > 0 && (
                  <div className="text-xs text-muted-foreground text-center p-2 bg-muted/50 rounded">
                    <Truck className="h-3 w-3 inline mr-1" />
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  Secure 256-bit SSL encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Abandonment Risk Modal */}
      {riskData && (
        <AbandonmentRiskModal
          isOpen={showRiskModal}
          onClose={() => setShowRiskModal(false)}
          onAcceptOffer={handleAcceptOffer}
          riskScore={riskData.score}
          offer={riskData.recommendation}
        />
      )}
    </div>
  );
}