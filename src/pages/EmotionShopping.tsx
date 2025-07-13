import { Header } from "@/components/Header";
import { EmotionDetection } from "@/components/EmotionDetection";

export default function EmotionShopping() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            AI Emotion Shopping
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let our AI detect your mood and recommend the perfect products for you
          </p>
        </div>
        
        <EmotionDetection />
      </div>
    </div>
  );
}