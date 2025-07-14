import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Eye, Zap } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  badge?: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export const ProductCard = ({ product, viewMode = "grid" }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist");
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <Card 
        className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-background to-background/50 hover:to-primary/5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            {/* Product Image */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl text-3xl">
                {product.image}
              </div>
              {product.badge && (
                <Badge 
                  className={`absolute -top-2 -right-2 text-xs px-2 py-1 ${
                    product.badge === "Sale" ? "bg-red-500" :
                    product.badge === "New" ? "bg-green-500" :
                    product.badge === "Best Seller" ? "bg-yellow-500" :
                    "bg-primary"
                  }`}
                >
                  {product.badge}
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {product.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleLike}
                  className="flex-shrink-0 ml-2"
                >
                  <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-3">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Category */}
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        {discount}% off
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleAddToCart} size="sm" className="animate-pulse">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-background to-background/80 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <CardHeader className="p-0 relative">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-6xl transition-all duration-500 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
              {product.image}
            </div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Actions */}
          <div className={`absolute top-4 right-4 flex flex-col gap-2 transform transition-all duration-300 ${
            isHovered ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleLike}
              className="w-8 h-8 rounded-full p-0 bg-white/90 hover:bg-white shadow-lg"
            >
              <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-8 h-8 rounded-full p-0 bg-white/90 hover:bg-white shadow-lg"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Badge */}
          {product.badge && (
            <Badge 
              className={`absolute top-4 left-4 px-3 py-1 shadow-lg animate-pulse ${
                product.badge === "Sale" ? "bg-gradient-to-r from-red-500 to-red-600" :
                product.badge === "New" ? "bg-gradient-to-r from-green-500 to-green-600" :
                product.badge === "Best Seller" ? "bg-gradient-to-r from-yellow-500 to-yellow-600" :
                product.badge === "Limited" ? "bg-gradient-to-r from-purple-500 to-purple-600" :
                product.badge === "Popular" ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                "bg-gradient-to-r from-primary to-primary/80"
              }`}
            >
              {product.badge === "Sale" && <Zap className="h-3 w-3 mr-1" />}
              {product.badge}
            </Badge>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute bottom-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
              {discount}% OFF
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Product Details */}
      <CardContent className="p-4 space-y-3">
        {/* Category */}
        <Badge variant="outline" className="text-xs">
          {product.category}
        </Badge>

        {/* Product Name */}
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-2xl font-bold text-primary">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4 mr-2 group-hover:animate-bounce" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};