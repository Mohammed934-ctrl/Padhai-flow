import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  CalendarCheck,
  Mail,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Clock,
  CheckCircle2,
 
} from "lucide-react";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity})`;
        ctx.fill();
      });

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const features = [
    {
      icon: <Brain className="w-5 h-5 text-primary" />,
      title: "AI-Generated Schedule",
      desc: "Just enter your subjects and exam date — AI builds a smart day-by-day plan tailored to you.",
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-primary" />,
      title: "Daily Progress Tracking",
      desc: "Mark topics as done, see your streak, and stay motivated with a clean progress dashboard.",
    },
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: "Email Reminders",
      desc: "Miss a session? We'll nudge you. Stay on track without needing to check the app every day.",
    },
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: "Smart Rescheduling",
      desc: "Fell behind? AI automatically adjusts your remaining schedule so you never feel lost.",
    },
    {
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      title: "Multi-Subject Support",
      desc: "Add as many subjects as you need. AI balances them evenly based on exam priority.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      title: "Personalized to You",
      desc: "Set your daily study hours and preferred pace — the plan adapts around your life.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Enter your subjects",
      desc: "Add your subjects, exam dates, and how many hours you can study per day.",
    },
    {
      number: "02",
      title: "AI builds your plan",
      desc: "Our AI generates a complete day-by-day schedule optimized for your exam timeline.",
    },
    {
      number: "03",
      title: "Study and track",
      desc: "Follow your plan, mark topics done, and watch your progress grow every day.",
    },
    {
      number: "04",
      title: "Stay on track",
      desc: "Get email reminders if you miss a session and let AI reschedule when life gets in the way.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">PadhaiFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.6 }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-150 h-150 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="mb-6 border-primary/30 text-primary bg-primary/5 px-4 py-1.5"
          >
            <Sparkles className="w-3 h-3 mr-1.5" />
            AI-Powered Study Planning
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.08]">
            Study smarter,{" "}
            <span className="text-primary">not harder</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter your subjects and exam date. PadhaiFlow builds a personalized
            day-by-day study schedule — and keeps you on track with smart
            reminders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2 px-8 text-base h-12">
                Start planning for free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8 text-base h-12 border-border/60"
              >
                See how it works
              </Button>
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            {["No credit card needed", "Free to start", "Takes 2 minutes"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {t}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-medium uppercase tracking-widest mb-3">
              Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to ace your exams
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              PadhaiFlow handles the planning so you can focus on what matters —
              actually studying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-28 px-6 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-medium uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              From zero to study plan in minutes
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No complicated setup. Just tell us about your exams and we handle
              the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-12px)] w-6 h-px bg-border/60 z-10" />
                )}
                <div className="p-6 rounded-xl border border-border/60 bg-card h-full">
                  <span className="text-3xl font-bold text-primary/20 mb-4 block">
                    {s.number}
                  </span>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center rounded-2xl border border-primary/20 bg-primary/5 p-14">
          <GraduationCap className="w-10 h-10 text-primary mx-auto mb-5" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to start studying smarter?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join students who stopped winging their exam prep and started
            actually planning it.
          </p>
          <Link to="/register">
            <Button size="lg" className="gap-2 px-10 h-12 text-base">
              Create your free plan
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/40 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-semibold">PadhaiFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PadhaiFlow. Built for students, by students.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a
              href="https://github.com/Mohammed934-ctrl"
              className="hover:text-foreground transition-colors"
            >
              <SiGithub size={16} />
            </a>
            <a
              href="https://x.com"
              className="hover:text-foreground transition-colors"
            >
              <SiX size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}