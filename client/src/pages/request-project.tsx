import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import ProjectRequestForm from '@/components/project-request-form';

export default function RequestProject() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-zinrai-dark">
      {/* Header */}
      <header className="bg-zinrai-dark/90 backdrop-blur-xl border-b border-zinrai-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setLocation('/')}
                variant="ghost"
                className="text-zinrai-muted hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-zinrai-border"></div>
              <div className="flex items-center space-x-4">
                <img 
                  src="https://zinrai.com/assets/Untitled%20design-BMaEhOTq.png" 
                  alt="ZiNRAi Logo" 
                  className="h-8 w-auto"
                />
                <div>
                  <h1 className="text-lg font-semibold text-white">ZiNRAi Creative Suite</h1>
                  <p className="text-xs text-zinrai-muted">Request Custom Project</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-yellow-500/10 via-zinrai-dark to-zinrai-dark">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-6">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Request Custom Project
          </h1>
          <p className="text-xl text-zinrai-muted max-w-2xl mx-auto mb-8">
            Need something unique? Our creative team specializes in custom designs, videos, and branded materials tailored to your vision.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-zinrai-surface rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-white font-semibold mb-2">Custom Graphics</h3>
              <p className="text-zinrai-muted text-sm">Logos, branding, social media graphics, and print materials</p>
            </div>
            <div className="bg-zinrai-surface rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
              <div className="text-3xl mb-4">🎥</div>
              <h3 className="text-white font-semibold mb-2">Video Production</h3>
              <p className="text-zinrai-muted text-sm">Promotional videos, animations, and event coverage</p>
            </div>
            <div className="bg-zinrai-surface rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-white font-semibold mb-2">Digital Assets</h3>
              <p className="text-zinrai-muted text-sm">Templates, mockups, and interactive content</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Request Form */}
      <section className="py-16 px-6 bg-zinrai-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <ProjectRequestForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinrai-surface border-t border-zinrai-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-zinrai-muted text-sm">
            © 2024 ZiNRAi Creative Suite. Live With Passion. Lead With Purpose.
          </p>
        </div>
      </footer>
    </div>
  );
}