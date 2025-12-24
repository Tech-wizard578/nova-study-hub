import { Button } from '@/components/ui/button';
import { Sparkles, Twitter, Github, Linkedin, Instagram, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'AI Tools', 'Study Materials', 'Question Banks', 'Pricing'],
    Company: ['About Us', 'Careers', 'Blog', 'Press Kit', 'Partners'],
    Resources: ['Documentation', 'Help Center', 'Community', 'Tutorials', 'API'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="relative pt-24 pb-8 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <div className="glass-card p-8 md:p-12 mb-16 text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Stay Updated</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Join Our{' '}
            <span className="gradient-text">Learning Community</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Get weekly study tips, new materials, and exclusive AI features delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 bg-background/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            <Button variant="glow" className="group">
              Subscribe
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">VignanVerse</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering students with AI-powered learning tools for academic excellence.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 glass-card flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 VignanVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
