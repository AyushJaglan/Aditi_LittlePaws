import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGetProducts } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Store() {
  const { data, isLoading } = useGetProducts();
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({ title: "Added to Cart", description: "Proceed to checkout to fund rescue operations." });
  };

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center mb-16 max-w-2xl mx-auto">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Pet Essentials Store</h1>
          <p className="text-lg text-muted-foreground">
            100% of profits from this store directly fund emergency rescue operations and government shelter upgrades. Shop for your pet, save another.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.products?.map((product) => (
              <Card key={product.id} className="rounded-3xl border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="p-6 pb-0 flex-grow">
                  <div className="aspect-square bg-muted/30 rounded-2xl mb-6 overflow-hidden relative">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80"} 
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-xs font-bold text-primary tracking-wider uppercase mb-2">{product.category}</div>
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="text-sm font-bold">{product.rating || "4.8"}</span>
                    <span className="text-sm text-muted-foreground">({product.reviewCount || 124})</span>
                  </div>
                </div>
                
                <CardContent className="p-6 pt-0 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-display font-bold">₹{product.price}</div>
                    <Button onClick={handleAddToCart} size="sm" className="rounded-full px-6 font-bold shadow-md hover:shadow-lg">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
