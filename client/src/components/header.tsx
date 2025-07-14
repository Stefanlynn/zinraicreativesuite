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
    <header className="bg-zinrai-dark/95 backdrop-blur-xl border-b border-zinrai-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-br from-zinrai-accent/20 to-zinrai-accent/10 rounded-xl backdrop-blur-sm">
              <img 
                src="https://zinrai.com/assets/Untitled%20design-BMaEhOTq.png" 
                alt="ZiNRAi Logo" 
                className="h-8 w-auto"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">ZiNRAi Creative Suite</h1>
              <p className="text-sm text-zinrai-muted/80">Live With Passion. Lead With Purpose.</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.slice(0, -1).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                {item.label}
              </button>
            ))}
            
            {/* Request Project Button - Special Design */}
            <button
              onClick={() => scrollToSection('request')}
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 transform hover:-translate-y-0.5"
            >
              Request Project
            </button>
            
            {/* Admin Button */}
            <button
              onClick={() => window.location.href = '/admin/login'}
              className="ml-2 px-3 py-2 text-xs text-zinrai-muted/60 hover:text-zinrai-accent hover:bg-zinrai-accent/10 rounded-lg transition-all duration-200"
            >
              Admin
            </button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinrai-dark/95 backdrop-blur-xl border-zinrai-border/20">
              <div className="flex flex-col space-y-3 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left transition-all duration-200 py-3 px-4 rounded-lg ${
                      item.id === 'request' 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold shadow-lg' 
                        : 'text-white hover:text-zinrai-accent hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-zinrai-border/20">
                  <button
                    onClick={() => window.location.href = '/admin/login'}
                    className="text-sm text-zinrai-muted/60 hover:text-zinrai-accent transition-colors"
                  >
                    Admin Login
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
