import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Loader2, Star, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Product {
  name: string;
  price: number;
  category: string;
  description: string;
  rating: number;
}

interface AIResponse {
  message: string;
  products: Product[];
}

export const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      toast.success("Listening... Speak your request!");
    } catch (error) {
      toast.error("Failed to access microphone");
      console.error(error);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    }
  };

  const handleVoicePurchase = () => {
    toast.success("Voice purchase confirmed! Redirecting to checkout...");
    setTimeout(() => {
      navigate('/checkout');
    }, 1500);
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { audio: base64Audio },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Check for purchase commands in transcription
      const transcriptionText = data.transcription?.toLowerCase() || '';
      if (transcriptionText.includes('buy this now') || transcriptionText.includes('purchase this')) {
        setTranscription(data.transcription);
        handleVoicePurchase();
        return;
      }

      setTranscription(data.transcription);
      setAiResponse(data.response);
      toast.success("Found some great suggestions for you!");
    } catch (error) {
      toast.error("Failed to process your request");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processTextQuery = async (query: string) => {
    if (!query.trim()) return;
    
    // Check for purchase commands
    if (query.toLowerCase().includes('buy this now') || query.toLowerCase().includes('purchase this')) {
      handleVoicePurchase();
      return;
    }
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { query },
      });

      if (error) {
        throw new Error(error.message);
      }

      setTranscription(data.transcription);
      setAiResponse(data.response);
      toast.success("Found some great suggestions for you!");
    } catch (error) {
      toast.error("Failed to process your request");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Voice Input Controls */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Shopping Assistant
          </CardTitle>
          <CardDescription>
            Ask me anything! "Suggest gifts for my brother", "I want something comfy for rainy days", or say "Buy this now" for voice purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              size="lg"
              variant={isListening ? "destructive" : "default"}
              className="min-w-32"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : isListening ? (
                <MicOff className="h-4 w-4 mr-2" />
              ) : (
                <Mic className="h-4 w-4 mr-2" />
              )}
              {isProcessing ? "Processing..." : isListening ? "Stop" : "Start Voice"}
            </Button>
          </div>

          {/* Text Input Alternative */}
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">Or type your request:</p>
            <div className="flex gap-2">
              <input
                id="text-input"
                type="text"
                placeholder="Type your shopping request..."
                className="flex-1 px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    processTextQuery(target.value);
                    target.value = '';
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.getElementById('text-input') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    processTextQuery(input.value);
                    input.value = '';
                  }
                }}
                disabled={isProcessing}
              >
                Ask
              </Button>
            </div>
          </div>

          {transcription && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm">
                <strong>You said:</strong> "{transcription}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Response */}
      {aiResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Your Personal Shopping Assistant</CardTitle>
            <CardDescription>{aiResponse.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiResponse.products.map((product, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs font-medium">{product.rating}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        <Button size="sm" className="h-8 px-3">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};