import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WaitlistFormProps {
  variant?: "light" | "dark";
  className?: string;
}

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfymXSQbDN_r1KQffryRvsHxRE0ZmkkD3BViMDz9GBV5NY7qA/viewform";

const WaitlistForm = ({ variant = "light", className = "" }: WaitlistFormProps) => {
  const handleJoinWaitlist = () => {
    window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <Button 
        onClick={handleJoinWaitlist}
        variant="coral" 
        size="lg" 
        className="group h-12"
      >
        Join waitlist
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default WaitlistForm;
