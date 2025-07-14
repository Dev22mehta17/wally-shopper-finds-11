import { Header } from "@/components/Header";
import { VoiceAssistant } from "@/components/VoiceAssistant";

export default function VoiceShopping() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Voice Shopping Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Speak naturally and get personalized product recommendations powered by AI
          </p>
        </div>
        
        <VoiceAssistant />
      </div>
    </div>
  );
}