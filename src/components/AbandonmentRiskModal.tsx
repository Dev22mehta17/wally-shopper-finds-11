import React from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, Percent } from "lucide-react";

interface AbandonmentRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptOffer: () => void;
  riskScore: number;
  offer: {
    type: 'discount' | 'loyalty' | 'shipping';
    value: string;
    description: string;
  };
}

export const AbandonmentRiskModal = ({ 
  isOpen, 
  onClose, 
  onAcceptOffer, 
  riskScore, 
  offer 
}: AbandonmentRiskModalProps) => {
  const getOfferIcon = () => {
    switch (offer.type) {
      case 'discount': return <Percent className="h-5 w-5" />;
      case 'loyalty': return <Gift className="h-5 w-5" />;
      case 'shipping': return <Clock className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  const getOfferColor = () => {
    switch (offer.type) {
      case 'discount': return 'bg-green-500';
      case 'loyalty': return 'bg-purple-500';
      case 'shipping': return 'bg-blue-500';
      default: return 'bg-primary';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white">
            {getOfferIcon()}
          </div>
          <AlertDialogTitle className="text-xl">
            Wait! Don't Leave Yet! 🛍️
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Our AI detected you might be leaving. Here's a special offer just for you!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-6 space-y-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium ${getOfferColor()}`}>
              {getOfferIcon()}
              {offer.value}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {offer.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground p-2 bg-muted/30 rounded">
            <span>Abandonment Risk Score:</span>
            <Badge variant={riskScore > 70 ? "destructive" : "secondary"}>
              {riskScore}%
            </Badge>
          </div>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose} className="w-full">
            No Thanks
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAcceptOffer} className="w-full">
            Claim Offer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};