import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navItems = [
    { label: 'General', id: 'general' },
    { label: 'Social Media', id: 'social-media' },
    { label: 'Field Tools', id: 'field-tools' },
    { label: 'Events', id: 'events' },
    { label: 'ZiNRAi Store', id: 'store' },
    { label: 'Request Project', id: 'request' },
  ];

  return (
    <header className="bg-zinrai-secondary border-b border-zinrai-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://zinrai.com/assets/Untitled%20design-BMaEhOTq.png" 
              alt="ZiNRAi Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-zinrai-accent">ZiNRAi Creative Suite</h1>
              <p className="text-sm text-zinrai-muted">Live With Passion. Lead With Purpose.</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`transition-colors ${
                  item.id === 'request' 
                    ? 'text-yellow-400 hover:text-yellow-300 font-semibold' 
                    : 'text-white hover:text-zinrai-accent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinrai-secondary border-zinrai-border">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left transition-colors py-2 ${
                      item.id === 'request' 
                        ? 'text-yellow-400 hover:text-yellow-300 font-semibold' 
                        : 'text-white hover:text-zinrai-accent'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
