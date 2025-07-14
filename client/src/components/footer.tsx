import { Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-zinrai-secondary/50 border-t border-zinrai-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src="https://zinrai.com/assets/Untitled%20design-BMaEhOTq.png" 
              alt="ZiNRAi Logo" 
              className="h-8 w-auto mb-4"
            />
            <p className="text-zinrai-muted text-sm">
              Live With Passion. Lead With Purpose.
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://www.instagram.com/zinrai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinrai-muted hover:text-zinrai-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com/zinrai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinrai-muted hover:text-zinrai-accent transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.youtube.com/@ZiNRAi.official" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinrai-muted hover:text-zinrai-accent transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Creative Suite</h4>
            <ul className="space-y-2 text-sm text-zinrai-muted">
              <li>
                <button 
                  onClick={() => scrollToSection('social-media')}
                  className="hover:text-white transition-colors"
                >
                  Social Media
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('field-tools')}
                  className="hover:text-white transition-colors"
                >
                  Field Tools
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('events')}
                  className="hover:text-white transition-colors"
                >
                  Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('store')}
                  className="hover:text-white transition-colors"
                >
                  ZiNRAi Store
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm text-zinrai-muted">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Download Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  License Info
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('request')}
                  className="hover:text-white transition-colors"
                >
                  Request Project
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-zinrai-muted">
              <li>
                <a 
                  href="https://zinrai.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  About ZiNRAi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Brand Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinrai-border mt-8 pt-8 text-center text-sm text-zinrai-muted">
          <p>&copy; 2024 ZiNRAi™. All rights reserved. Live With Passion. Lead With Purpose.</p>
        </div>
      </div>
    </footer>
  );
}
