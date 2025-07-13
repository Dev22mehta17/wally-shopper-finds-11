import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";

const featuredProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999.99,
    originalPrice: 1099.99,
    rating: 4.8,
    reviews: 1234,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    discount: "9% OFF",
    featured: true
  },
  {
    id: 2,
    name: "Nike Air Max 270",
    price: 129.99,
    originalPrice: 149.99,
    rating: 4.6,
    reviews: 856,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    discount: "13% OFF",
    featured: true
  },
  {
    id: 3,
    name: "KitchenAid Stand Mixer",
    price: 279.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviews: 2103,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    discount: "20% OFF",
    featured: true
  },
  {
    id: 4,
    name: "Samsung 55\" 4K TV",
    price: 449.99,
    originalPrice: 599.99,
    rating: 4.7,
    reviews: 743,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    discount: "25% OFF",
    featured: true
  }
];

export const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked deals and trending items just for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="p-0 relative overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                    {product.discount}
                  </Badge>
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 bg-white/80 hover:bg-white">
                      <Eye className="h-4 w-4" />
                    </Button>
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
                
                <div className="flex items-center mb-2">
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
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ${product.originalPrice}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" variant="default">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};