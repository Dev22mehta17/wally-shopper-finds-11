import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Star, 
  ShoppingCart, 
  Filter,
  SlidersHorizontal
} from "lucide-react";
import { Header } from "@/components/Header";

const recommendedProducts = [
  {
    id: 1,
    name: "Apple MacBook Air M2",
    price: 1199.99,
    originalPrice: 1299.99,
    rating: 4.8,
    category: "Electronics",
    reason: "Based on your recent laptop searches",
    confidence: 95,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    discount: "8% OFF"
  },
  {
    id: 2,
    name: "Dyson V15 Vacuum",
    price: 599.99,
    originalPrice: 749.99,
    rating: 4.7,
    category: "Home & Garden",
    reason: "Perfect for your home size",
    confidence: 88,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    discount: "20% OFF"
  },
  {
    id: 3,
    name: "Levi's 501 Original Jeans",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.6,
    category: "Clothing",
    reason: "Matches your style preferences",
    confidence: 92,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    discount: "25% OFF"
  },
  {
    id: 4,
    name: "Instant Pot Duo 7-in-1",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.9,
    category: "Kitchen",
    reason: "Popular with families like yours",
    confidence: 90,
    image: "https://images.unsplash.com/photo-1556909252-f5d4aeea80a3?w=400",
    discount: "20% OFF"
  }
];

const trendingProducts = [
  {
    id: 5,
    name: "PlayStation 5",
    price: 499.99,
    rating: 4.8,
    category: "Gaming",
    trendScore: 98,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400"
  },
  {
    id: 6,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    rating: 4.9,
    category: "Electronics",
    trendScore: 96,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"
  },
  {
    id: 7,
    name: "Stanley Tumbler 40oz",
    price: 44.95,
    rating: 4.7,
    category: "Lifestyle",
    trendScore: 94,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
  }
];

export default function Recommendations() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-walmart-gold mr-3 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Smart Recommendations
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Personalized product suggestions powered by AI and your shopping preferences
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by category:</span>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-input rounded-md px-3 py-1 text-sm bg-background"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Garden</option>
              <option value="kitchen">Kitchen</option>
            </select>
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="for-you" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="for-you" className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
          </TabsList>

          {/* Personalized Recommendations */}
          <TabsContent value="for-you">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">Recommended Just For You</h3>
              <p className="text-muted-foreground">
                Based on your browsing history, purchases, and preferences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 left-2 bg-primary">
                        {product.discount}
                      </Badge>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {product.confidence}% match
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {product.category}
                    </Badge>
                    
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                      {product.name}
                    </CardTitle>
                    
                    <p className="text-sm text-muted-foreground mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-walmart-gold" />
                      {product.reason}
                    </p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) 
                                ? 'text-walmart-gold fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        {product.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ${product.price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trending Products */}
          <TabsContent value="trending">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">Trending Now</h3>
              <p className="text-muted-foreground">
                Popular products that are trending among shoppers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-accent">
                          🔥 {product.trendScore}% hot
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {product.category}
                    </Badge>
                    
                    <CardTitle className="text-lg mb-2">
                      {product.name}
                    </CardTitle>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) 
                                ? 'text-walmart-gold fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        {product.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price}
                      </span>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    
                    <Button className="w-full" variant="gold">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Views */}
          <TabsContent value="recent">
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Recent Activity</h3>
              <p className="text-muted-foreground">
                Start shopping to see your recently viewed products here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}