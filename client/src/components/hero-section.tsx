import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const scrollToContent = () => {
    const element = document.getElementById('content-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 hero-gradient">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold mb-6 text-white">Creative Assets & Tools</h2>
        <p className="text-xl text-zinrai-muted mb-8 max-w-2xl mx-auto">
          Access our premium collection of graphics, videos, and creative resources designed to elevate your brand and message.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="relative max-w-md w-full">
            <SearchInput onSearch={onSearch} />
          </div>
          <Button 
            onClick={scrollToContent}
            className="bg-zinrai-accent text-zinrai-dark px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            Explore Collection
          </Button>
        </div>
      </div>
    </section>
  );
}
