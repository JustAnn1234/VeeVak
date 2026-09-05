import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  logo: string;
}

const MobileMenu = ({ logo }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#problem", label: "Problem" },
    { href: "#features", label: "Features" },
    { href: "#solution", label: "Solution" },
    { href: "#team", label: "Team" },
    { href: "#values", label: "Values" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="relative bg-background border-b border-border shadow-elevated">
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="text-foreground hover:text-primary transition-colors text-lg font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#waitlist"
                onClick={handleLinkClick}
              >
                <Button variant="coral" className="w-full mt-2">
                  Join Waitlist
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
