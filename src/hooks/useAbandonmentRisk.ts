import { useState, useEffect, useCallback } from 'react';
import { CartItemData } from '@/components/CartItem';

interface RiskFactors {
  timeInCart: number;
  cartValue: number;
  itemCount: number;
  categoryDiversity: number;
  userBehavior: {
    mouseMovements: number;
    scrollSpeed: number;
    idleTime: number;
  };
}

interface AbandonmentRisk {
  score: number;
  factors: RiskFactors;
  recommendation: {
    type: 'discount' | 'loyalty' | 'shipping';
    value: string;
    description: string;
  };
}

// ML-inspired risk scoring algorithm (simulates scikit-learn behavior)
const calculateRiskScore = (factors: RiskFactors): number => {
  // Feature weights (would come from trained ML model)
  const weights = {
    timeInCart: 0.3,
    cartValue: -0.2,  // higher value = lower risk
    itemCount: -0.15, // more items = lower risk
    categoryDiversity: -0.1,
    mouseActivity: -0.1,
    scrollBehavior: -0.1,
    idleTime: 0.25
  };

  // Normalize features (0-1 scale)
  const normalizedTime = Math.min(factors.timeInCart / 600, 1); // 10 min max
  const normalizedValue = Math.min(factors.cartValue / 500, 1); // $500 max
  const normalizedItems = Math.min(factors.itemCount / 10, 1); // 10 items max
  const normalizedDiversity = Math.min(factors.categoryDiversity / 5, 1); // 5 categories max
  const normalizedMouse = Math.min(factors.userBehavior.mouseMovements / 100, 1);
  const normalizedScroll = Math.min(factors.userBehavior.scrollSpeed / 50, 1);
  const normalizedIdle = Math.min(factors.userBehavior.idleTime / 300, 1); // 5 min max

  // Calculate weighted score
  const rawScore = 
    (weights.timeInCart * normalizedTime) +
    (weights.cartValue * normalizedValue) +
    (weights.itemCount * normalizedItems) +
    (weights.categoryDiversity * normalizedDiversity) +
    (weights.mouseActivity * normalizedMouse) +
    (weights.scrollBehavior * normalizedScroll) +
    (weights.idleTime * normalizedIdle);

  // Convert to 0-100 scale and add some randomness for realism
  const baseScore = Math.max(0, Math.min(100, (rawScore + 0.5) * 100));
  const noise = (Math.random() - 0.5) * 10; // ±5% noise
  
  return Math.round(Math.max(0, Math.min(100, baseScore + noise)));
};

const generateRecommendation = (score: number, cartValue: number) => {
  if (score > 80) {
    return {
      type: 'discount' as const,
      value: '20% OFF',
      description: 'Save 20% on your entire order - limited time offer!'
    };
  } else if (score > 60) {
    return {
      type: 'shipping' as const,
      value: 'FREE SHIPPING',
      description: 'Complete your order now and get free shipping!'
    };
  } else {
    return {
      type: 'loyalty' as const,
      value: '2X POINTS',
      description: 'Earn double loyalty points on this purchase!'
    };
  }
};

export const useAbandonmentRisk = (cartItems: CartItemData[]) => {
  const [riskData, setRiskData] = useState<AbandonmentRisk | null>(null);
  const [mouseMovements, setMouseMovements] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [idleTime, setIdleTime] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Track user behavior
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    
    const trackMouse = () => {
      setMouseMovements(prev => prev + 1);
      setLastActivity(Date.now());
      setIdleTime(0);
    };

    const trackScroll = () => {
      setScrollSpeed(prev => prev + 1);
      setLastActivity(Date.now());
      setIdleTime(0);
    };

    const updateIdleTime = () => {
      const now = Date.now();
      const timeSinceActivity = (now - lastActivity) / 1000;
      setIdleTime(timeSinceActivity);
    };

    document.addEventListener('mousemove', trackMouse);
    document.addEventListener('scroll', trackScroll);
    
    idleTimer = setInterval(updateIdleTime, 1000);

    return () => {
      document.removeEventListener('mousemove', trackMouse);
      document.removeEventListener('scroll', trackScroll);
      clearInterval(idleTimer);
    };
  }, [lastActivity]);

  const calculateRisk = useCallback(() => {
    if (cartItems.length === 0) {
      setRiskData(null);
      return;
    }

    const now = Date.now();
    const oldestItem = Math.min(...cartItems.map(item => item.addedAt.getTime()));
    const timeInCart = (now - oldestItem) / 1000; // seconds

    const cartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const categories = new Set(cartItems.map(item => item.category));
    const categoryDiversity = categories.size;

    const factors: RiskFactors = {
      timeInCart,
      cartValue,
      itemCount,
      categoryDiversity,
      userBehavior: {
        mouseMovements,
        scrollSpeed,
        idleTime
      }
    };

    const score = calculateRiskScore(factors);
    const recommendation = generateRecommendation(score, cartValue);

    setRiskData({
      score,
      factors,
      recommendation
    });
  }, [cartItems, mouseMovements, scrollSpeed, idleTime]);

  // Recalculate risk every 5 seconds
  useEffect(() => {
    const timer = setInterval(calculateRisk, 5000);
    calculateRisk(); // Initial calculation
    
    return () => clearInterval(timer);
  }, [calculateRisk]);

  return riskData;
};