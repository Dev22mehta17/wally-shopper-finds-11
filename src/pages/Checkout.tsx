import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, ShoppingBag, Check, Star } from "lucide-react";
import { toast } from "sonner";

// Mock data for stored payment methods
const mockPaymentMethods = [
  {
    id: "card_1",
    type: "visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: "card_2", 
    type: "mastercard",
    last4: "8888",
    expiry: "09/26",
    isDefault: false,
  },
];

// Mock loyalty wallet data
const loyaltyWallet = {
  points: 2450,
  cashValue: 24.50, // $0.01 per point
  tier: "Gold",
  nextTier: "Platinum",
  pointsToNextTier: 550,
};

// Mock cart items
const cartItems = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    quantity: 1,
    image: "🎧",
  },
  {
    id: 2,
    name: "Smart Water Bottle",
    price: 34.99,
    quantity: 2,
    image: "💧",
  },
];

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState("card_1");
  const [usePoints, setUsePoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const pointsDiscount = usePoints ? Math.min(loyaltyWallet.cashValue, subtotal) : 0;
  const total = subtotal + tax - pointsDiscount;

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Mock purchase processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Purchase completed successfully!");
    setIsProcessing(false);
  };

  const handleVoicePurchase = () => {
    toast.success("Voice purchase activated! Say 'Buy this now' to complete your order.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Review and complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Payment & Loyalty */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Loyalty Wallet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Loyalty Wallet
                </CardTitle>
                <CardDescription>Use your points for instant savings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="font-semibold text-amber-700 dark:text-amber-300">{loyaltyWallet.tier} Member</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                      {loyaltyWallet.points.toLocaleString()} points
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Worth ${loyaltyWallet.cashValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      {loyaltyWallet.pointsToNextTier} points to {loyaltyWallet.nextTier}
                    </p>
                    <div className="w-24 h-2 bg-amber-200 dark:bg-amber-800 rounded-full mt-1">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(loyaltyWallet.points / (loyaltyWallet.points + loyaltyWallet.pointsToNextTier)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="usePoints"
                    checked={usePoints}
                    onChange={(e) => setUsePoints(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="usePoints" className="text-sm">
                    Use ${loyaltyWallet.cashValue.toFixed(2)} in points ({loyaltyWallet.points.toLocaleString()} points)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  {mockPaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded text-white text-xs flex items-center justify-center">
                              {method.type === "visa" ? "VISA" : "MC"}
                            </div>
                            <div>
                              <p className="font-medium">•••• •••• •••• {method.last4}</p>
                              <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                            </div>
                          </div>
                          {method.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Voice Purchase */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎤 Voice Purchase
                </CardTitle>
                <CardDescription>Enable one-click voice purchasing</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleVoicePurchase} variant="outline" className="w-full">
                  Activate Voice Purchase
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Once activated, say "Buy this now" to complete your order instantly
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl">{item.image}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {usePoints && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Points Discount</span>
                      <span>-${pointsDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchase} 
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                  {!isProcessing && <Check className="ml-2 h-4 w-4" />}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Secure checkout powered by advanced encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}