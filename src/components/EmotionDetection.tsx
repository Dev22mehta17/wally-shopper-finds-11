import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Brain, Sparkles, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: Date;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  emotionMatch: string;
}

// Emotion-based product recommendations
const emotionProducts = {
  happy: [
    { id: 1, name: "Party Decorations Set", price: 29.99, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400", category: "Party", emotionMatch: "happy" },
    { id: 2, name: "Celebration Cake Mix", price: 12.99, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", category: "Food", emotionMatch: "happy" }
  ],
  sad: [
    { id: 3, name: "Comfort Tea Collection", price: 24.99, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", category: "Wellness", emotionMatch: "sad" },
    { id: 4, name: "Cozy Blanket", price: 39.99, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", category: "Home", emotionMatch: "sad" }
  ],
  neutral: [
    { id: 5, name: "Daily Essentials Bundle", price: 19.99, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400", category: "Essentials", emotionMatch: "neutral" },
    { id: 6, name: "Multi-Purpose Tool", price: 15.99, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400", category: "Tools", emotionMatch: "neutral" }
  ]
};

export const EmotionDetection = () => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState<EmotionResult | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDetected, setHasDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addItem } = useCart();

  const handleAddToCart = (product: Product) => {
    addItem({
      name: product.name,
      price: product.price,
      image: "🛍️",
      category: product.category,
      rating: 4.5
    });
    toast.success(`${product.name} added to cart!`);
  };

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsActive(true);
          // Start emotion detection immediately when video is ready
          setTimeout(() => {
            detectEmotionNow();
          }, 1000);
        };
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      toast.error('Camera access denied. Please allow camera access to use emotion detection.');
    } finally {
      setIsLoading(false);
    }
  };

  const detectEmotionNow = () => {
    if (!videoRef.current) return;
    
    // Mock emotion detection - this will trigger immediately
    const mockEmotions = ['happy', 'sad', 'neutral', 'surprised', 'angry'];
    const randomEmotion = mockEmotions[Math.floor(Math.random() * mockEmotions.length)];
    const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
    
    const newEmotion: EmotionResult = {
      emotion: randomEmotion,
      confidence: confidence,
      timestamp: new Date()
    };
    
    setEmotion(newEmotion);
    setHasDetected(true);
    updateRecommendations(newEmotion.emotion);
    
    toast.success(`Detected ${randomEmotion} emotion! Check recommendations below.`);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    // Keep showing recommendations after stopping camera
    if (emotion && recommendedProducts.length > 0) {
      setHasDetected(true);
      toast.success('Emotion detected! Check out our recommendations below.');
    }
  };

  const startEmotionDetection = async () => {
    if (!videoRef.current) return;

    const detectEmotion = async () => {
      if (!isActive || !videoRef.current) return;
      
      try {
        // Mock emotion detection for demo purposes
        const mockEmotions = ['happy', 'sad', 'neutral', 'surprised', 'angry'];
        const randomEmotion = mockEmotions[Math.floor(Math.random() * mockEmotions.length)];
        const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
        
        const newEmotion: EmotionResult = {
          emotion: randomEmotion,
          confidence: confidence,
          timestamp: new Date()
        };
        
        setEmotion(newEmotion);
        setHasDetected(true);
        updateRecommendations(newEmotion.emotion);
        
        toast.success(`Detected ${randomEmotion} emotion! Processing recommendations...`);
      } catch (error) {
        console.error('Emotion detection error:', error);
      }
      
      // Continue detection every 3 seconds
      if (isActive) {
        setTimeout(detectEmotion, 3000);
      }
    };

    // Start detection after video is ready
    setTimeout(detectEmotion, 2000);
  };

  const updateRecommendations = (detectedEmotion: string) => {
    // Map detected emotions to our categories
    let emotionKey = 'neutral';
    if (detectedEmotion.includes('happy') || detectedEmotion.includes('joy') || detectedEmotion.includes('surprised')) {
      emotionKey = 'happy';
    } else if (detectedEmotion.includes('sad') || detectedEmotion.includes('angry')) {
      emotionKey = 'sad';
    }
    
    const products = emotionProducts[emotionKey as keyof typeof emotionProducts] || [];
    setRecommendedProducts(products);
    
    if (products.length > 0) {
      // Show a helpful message
      const emotionMessage = emotionKey === 'happy' ? 'celebrate' : 
                            emotionKey === 'sad' ? 'comfort yourself' : 
                            'treat yourself';
      console.log(`Detected ${detectedEmotion} emotion - time to ${emotionMessage}!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Camera Section */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-primary" />
            Emotion-Based Shopping Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
                style={{ display: isActive ? 'block' : 'none' }}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Camera not active</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button onClick={startCamera} disabled={isLoading} className="flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  {isLoading ? 'Starting...' : 'Start Camera'}
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="destructive" className="flex items-center">
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Camera
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emotion Results */}
      {emotion && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-walmart-gold" />
              Detected Emotion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge className="text-lg px-4 py-2 bg-gradient-primary">
                  {emotion.emotion}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Confidence: {(emotion.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {emotion.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Recommendations */}
      {recommendedProducts.length > 0 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <p className="text-muted-foreground">
              Based on your current mood, here are some perfect picks. Click on any product to view details or add to cart:
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary">${product.price}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline">
                      {product.category}
                    </Badge>
                    <Button 
                      size="sm" 
                      className="px-3"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};