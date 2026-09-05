import { motion, type Variants } from "framer-motion";
import { MessageCircle, BarChart3, Users, Shield, TrendingUp, CheckCircle, Mail, Twitter, Linkedin, Instagram, ArrowRight, ChevronDown, Heart, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import veevakLogo from "@/assets/veevak-logo.png";
import heroIllustration from "@/assets/hero-illustration.jpg";
import teamOmosomi from "@/assets/team-omosomi.jpg";
import teamVeralyn from "@/assets/team-veralyn.jpg";
import teamVeronica from "@/assets/team-veronica.jpg";
import WaitlistForm from "@/components/WaitlistForm";
import MobileMenu from "@/components/MobileMenu";
import SolutionsCarousel from "@/components/SolutionsCarousel";
import HeroCarousel from "@/components/HeroCarousel";
import ValuesMarquee from "@/components/ValuesMarquee";
import { CinematicShowcase } from "@/components/CinematicShowcase";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="section-container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={veevakLogo} alt="VeeVak" className="h-10 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Problem</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Features</a>
            <a href="#solution" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Solution</a>
            <a href="#team" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Team</a>
            <a href="#values" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Values</a>
          </div>
          <div className="hidden md:block">
            <Button variant="coral" size="sm" onClick={() => scrollToSection("waitlist")}>
              Join Waitlist
            </Button>
          </div>
          <MobileMenu logo={veevakLogo} />
        </div>
      </nav>

      {/* Hero Section with Warm Background */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <motion.h1 
              className="heading-1 text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              AI clarity for small businesses that sell through chats
            </motion.h1>
            <motion.p
              className="body-large text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              VeeVak helps informal sellers turn WhatsApp, Instagram, Facebook, TikTok, and offline sales into clear insights without complex tools or accounting stress.
            </motion.p>
            
            {/* Hero Image */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <img 
                src={heroIllustration} 
                alt="VeeVak helps small businesses" 
                className="w-full max-w-2xl mx-auto rounded-2xl shadow-elevated"
              />
            </motion.div>
            
            {/* Hero Carousel below image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <HeroCarousel 
                onJoinWaitlist={() => scrollToSection("waitlist")}
                onHowItWorks={() => scrollToSection("features")}
              />
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-8 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button variant="coral" size="lg" className="group" onClick={() => scrollToSection("waitlist")}>
                Join the waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="soft" size="lg" onClick={() => scrollToSection("features")}>
                How VeeVak works
                <ChevronDown className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="heading-2 text-foreground mb-4">
              Small businesses work hard but operate blindly
            </h2>
            <p className="body-large text-muted-foreground">
              Across Nigeria and other emerging markets, many small businesses run entirely through messaging apps and offline sales.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInScale} className="card-elevated">
              <h3 className="heading-3 text-foreground mb-4">Where sales live</h3>
              <ul className="space-y-2">
                {["WhatsApp & Instagram chats", "Facebook & TikTok messages", "Voice notes & screenshots", "Notebooks & memory"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <MessageCircle className="w-4 h-4 text-coral mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div variants={fadeInScale} className="card-elevated">
              <h3 className="heading-3 text-foreground mb-4">What owners can't see</h3>
              <ul className="space-y-2">
                {["What actually sells best", "Weekly/monthly earnings", "Top-performing platforms", "Growth trends"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <BarChart2 className="w-4 h-4 text-coral mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInScale} className="card-elevated">
              <h3 className="heading-3 text-foreground mb-4">What this causes</h3>
              <ul className="space-y-2">
                {["Poor business decisions", "Financial stress", "Missed opportunities", "Preventable failures"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Showcase */}
      <CinematicShowcase />

      {/* Why Existing Tools Don't Work */}
      <section className="section-padding">
        <div className="section-container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="heading-2 text-foreground mb-4">
              Why current solutions fall short
            </h2>
            <p className="body-large text-muted-foreground">
              Most existing business tools are built for formal companies with websites, staff, and structured systems.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInScale}
          >
            <SolutionsCarousel />
          </motion.div>
          
          <motion.p 
            className="text-center body-text text-muted-foreground max-w-2xl mx-auto mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            These tools don't reflect how small businesses actually operate today across chats, platforms, and offline sales.
          </motion.p>
        </div>
      </section>

      {/* Feature Snapshot - Grid Layout */}
      <section id="features" className="section-padding bg-accent/50">
        <div className="section-container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="heading-2 text-foreground mb-4">
              What VeeVak Does (Today)
            </h2>
            <p className="body-large text-muted-foreground">
              Simple tools designed for how you actually work. No spreadsheets, no accounting jargon.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              { icon: MessageCircle, title: "Extract sales from chats", desc: "Turn conversations into data" },
              { icon: TrendingUp, title: "Track offline sales", desc: "Log offline sales easily" },
              { icon: BarChart3, title: "Revenue over time", desc: "See your earnings trend" },
              { icon: Heart, title: "Best-selling products", desc: "Know what moves fastest" },
              { icon: BarChart2, title: "Platform performance", desc: "Compare sales channels" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInScale} className="card-elevated text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p 
            className="text-center body-text text-muted-foreground max-w-xl mx-auto mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            All without spreadsheets, accounting tools, or complex setup.
          </motion.p>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="section-padding bg-primary text-primary-foreground">
        <div className="section-container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="heading-2 mb-4">
              Clarity without complexity
            </h2>
            <p className="body-large opacity-90">
              VeeVak is an AI-powered operations assistant designed specifically for informal and small businesses.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="heading-3 opacity-90">With user permission, VeeVak:</h3>
              <ul className="space-y-4">
                {[
                  "Extracts sales data from chat conversations",
                  "Allows simple logging of offline sales",
                  "Organizes this information into clear summaries"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                    <span className="opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="heading-3 opacity-90">Business owners can see:</h3>
              <ul className="space-y-4">
                {[
                  "Revenue over time",
                  "Best-selling products",
                  "Repeat customers",
                  "Performance across sales channels"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                    <span className="opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-center body-large opacity-90 max-w-xl mx-auto mt-12 font-medium"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            No spreadsheets. No accounting jargon. Just clarity.
          </motion.p>
        </div>
      </section>

      {/* Why AI Section */}
      <section className="section-padding">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="heading-2 text-foreground mb-4">
                Why AI Is Necessary and Used Responsibly
              </h2>
              <p className="body-large text-muted-foreground">
                Sales conversations are informal, unstructured, and scattered across platforms. Manually tracking this information is time-consuming and often inaccurate.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInScale} className="card-elevated">
                <h3 className="heading-3 text-foreground mb-4">VeeVak uses AI to:</h3>
                <ul className="space-y-3">
                  {[
                    "Identify sales-related messages (products, prices, quantities)",
                    "Structure that information into summaries",
                    "Reduce manual record-keeping for business owners"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={fadeInScale} className="card-elevated border-2 border-primary/20">
                <h3 className="heading-3 text-foreground mb-4">VeeVak's AI is designed responsibly:</h3>
                <ul className="space-y-3">
                  {[
                    "Works only with explicit user permission",
                    "Processes data for the user's own insights",
                    "Does not sell or publicly share data",
                    "Assists decision-making, not replaces human judgment"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-primary font-medium mt-4">Clarity, not surveillance.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="heading-2 text-foreground mb-4">
              How VeeVak Grows
            </h2>
            <p className="body-large text-muted-foreground mb-8">
              VeeVak starts by helping small businesses clearly understand their sales.
            </p>
            
            <motion.div variants={fadeInScale} className="card-elevated">
              <p className="body-text text-muted-foreground mb-6">
                As sales data becomes structured over time, VeeVak plans to expand into:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {["Financial health alerts", "Cash flow warnings", "Early signals when a business may be at risk"].map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
              <p className="body-text text-muted-foreground mt-6">
                This long-term vision helps small businesses act early, not when it's already too late.
              </p>
              <p className="body-text text-foreground mt-4 font-medium">
                Internally, we refer to this future expansion as <span className="text-primary">BizSentry</span>, our vision for proactive business health insights.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MVP Section */}
      <section className="section-padding">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="heading-2 text-foreground mb-4">
                Focused by design
              </h2>
              <p className="body-large text-muted-foreground">
                We believe clarity comes before complexity.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInScale} className="card-elevated bg-accent/50">
                <h3 className="heading-3 text-foreground mb-4">Our first version focuses on:</h3>
                <ul className="space-y-3">
                  {[
                    "Chat-based sales visibility",
                    "Offline sales tracking",
                    "Simple, actionable insights"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={fadeInScale} className="card-elevated">
                <h3 className="heading-3 text-foreground mb-4">We are intentionally not building:</h3>
                <ul className="space-y-3">
                  {[
                    "Lending tools",
                    "Full accounting systems",
                    "Complex enterprise features"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="heading-2 text-foreground mb-4">
              Built by people who understand the problem
            </h2>
            <p className="body-large text-muted-foreground">
              VeeVak is built by a team of young women passionate about solving real problems for small businesses in Nigeria using responsible AI.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Omosomi */}
            <motion.div variants={fadeInScale} className="card-elevated text-center">
              <img 
                src={teamOmosomi} 
                alt="Omosomi Ann Hassan" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-card"
              />
              <h3 className="font-semibold text-foreground">Omosomi Ann Hassan</h3>
              <p className="text-sm text-primary mb-3">Product & Operations Lead</p>
              <div className="flex justify-center gap-3">
                <a href="https://x.com/Somi_the_VA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/in/omosomi-hassan" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="mailto:omosomi.assist@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
            
            {/* Veronica */}
            <motion.div variants={fadeInScale} className="card-elevated text-center">
              <img 
                src={teamVeronica} 
                alt="Veronica Oremeyi Amunega" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover object-top shadow-card"
              />
              <h3 className="font-semibold text-foreground">Veronica Oremeyi Amunega</h3>
              <p className="text-sm text-primary mb-3">Community & Growth Manager</p>
              <div className="flex justify-center gap-3">
                <a href="https://www.linkedin.com/in/veronicaamunega" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="mailto:amunegaveronica@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
            
            {/* Veralyn */}
            <motion.div variants={fadeInScale} className="card-elevated text-center sm:col-span-2 lg:col-span-1">
              <img 
                src={teamVeralyn} 
                alt="Veralyn Imeegwu Imarhia" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover object-top shadow-card"
              />
              <h3 className="font-semibold text-foreground">Veralyn Imeegwu Imarhia</h3>
              <p className="text-sm text-primary mb-3">User Research Specialist</p>
              <div className="flex justify-center gap-3">
                <a href="https://x.com/ImarhiaVeraa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/in/vera-imarhia-89679b2b3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="mailto:godwinvera2002@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section - Moving Marquee */}
      <section id="values" className="section-padding overflow-hidden">
        <div className="section-container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="heading-2 text-foreground mb-4">
              What we stand for
            </h2>
          </motion.div>
        </div>
        
        <ValuesMarquee />
      </section>

      {/* Final CTA Section with Waitlist */}
      <section id="waitlist" className="section-padding bg-primary text-primary-foreground">
        <div className="section-container">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="heading-2 mb-4">
              Clarity shouldn't be a luxury
            </h2>
            <p className="body-large opacity-90 mb-8">
              We believe every small business deserves to understand its own performance. Join us as we build tools that make clarity accessible.
            </p>
            
            <WaitlistForm variant="dark" className="max-w-md mx-auto mb-6 justify-center" />
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground"
                onClick={() => window.location.href = "mailto:info.veevak@gmail.com"}
              >
                Talk to the team
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-muted/50">
        <div className="section-container">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="heading-2 text-foreground mb-4">
              Get in touch
            </h2>
            <p className="body-large text-muted-foreground mb-8">
              Have questions or want to learn more? Reach out to us.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a 
                href="mailto:info.veevak@gmail.com" 
                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-card transition-all group"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-foreground group-hover:text-primary transition-colors">info.veevak@gmail.com</span>
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.linkedin.com/company/veevak-official" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-background border border-border hover:border-primary/50 hover:shadow-card transition-all group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a 
                href="https://www.instagram.com/veevak.official" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-background border border-border hover:border-primary/50 hover:shadow-card transition-all group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a 
                href="https://x.com/VeeVak_official" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-background border border-border hover:border-primary/50 hover:shadow-card transition-all group"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="section-container">
          <div className="flex flex-col gap-8">
            {/* SDG Support */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center pb-8 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <a 
                    href="https://sdgs.un.org/goals/goal8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#A21942] text-white font-bold text-sm hover:opacity-80 transition-opacity"
                  >
                    8
                  </a>
                  <a 
                    href="https://sdgs.un.org/goals/goal9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#FD6925] text-white font-bold text-sm hover:opacity-80 transition-opacity"
                  >
                    9
                  </a>
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Supporting UN SDGs</p>
                  <p className="text-sm text-foreground">Decent Work & Economic Growth • Industry, Innovation & Infrastructure</p>
                </div>
              </div>
            </div>
            
            {/* Bottom row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img src={veevakLogo} alt="VeeVak" className="h-8 w-auto" />
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} VeeVak. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
