import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Zap,
  Target,
  BarChart3,
  Activity,
  TrendingUp,
  BookOpen,
  Code,
  Lightbulb,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  Users,
} from "lucide-react";

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

const AnimatedOrb = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const x = (e.clientY - rect.top - centerY) * 0.1;
      const y = (e.clientX - rect.left - centerX) * 0.1;

      setRotation({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute w-64 h-64 rounded-full border border-cyan-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle glow ring */}
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-purple-500/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner core with gradient */}
      <motion.div
        className="relative w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400/40 to-purple-600/40 flex items-center justify-center"
        style={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          boxShadow:
            "0 0 60px rgba(0, 212, 255, 0.4), inset 0 0 60px rgba(124, 58, 237, 0.2)",
        }}
        animate={{
          y: [0, -20, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Brain className="w-20 h-20 text-cyan-300" />

        {/* Floating data particles into orb */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: [100 * Math.cos((i / 8) * Math.PI * 2), 0],
              y: [100 * Math.sin((i / 8) * Math.PI * 2), 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: (i / 8) * 3,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Animated background gradients */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div style={{ y }} className="relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent leading-tight">
                AI-Powered Adaptive Learning System
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                Experience personalized learning powered by advanced AI. Our system tracks your behavior, understands your learning style, and adapts in real-time to maximize your progress.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button className="px-8 py-4 border-2 border-cyan-400/50 text-cyan-300 font-semibold rounded-xl hover:bg-cyan-400/10 transition-all hover:border-cyan-400">
                  Explore Demo
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <span>Trusted by 10,000+ students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span>99% improvement rate</span>
                </div>
              </div>
            </motion.div>

            {/* Right side - 3D AI Orb */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-96 lg:h-full min-h-96"
            >
              <AnimatedOrb />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const ProblemSection = () => {
  const problems = [
    {
      icon: Users,
      title: "Same Learning for Everyone",
      description: "Traditional systems use one-size-fits-all approaches that don't work for diverse learners",
    },
    {
      icon: Target,
      title: "Lack of Personalization",
      description: "Without understanding individual needs, learners get stuck with irrelevant content",
    },
    {
      icon: Zap,
      title: "Low Engagement",
      description: "Boring, static learning experiences lead to dropout and poor retention",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            The Problem
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Most learning platforms fail to adapt to individual students' needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, idx) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass rounded-2xl p-8 group cursor-pointer"
              >
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
                  <Icon className="w-12 h-12 text-cyan-400 relative z-10" />
                </div>

                <h3 className="text-xl font-bold mb-3 text-white">
                  {problem.title}
                </h3>
                <p className="text-gray-400">{problem.description}</p>

                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full group-hover:w-full transition-all" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SolutionSection = () => {
  const solutions = [
    {
      icon: Brain,
      title: "Learning Style Detection",
      description: "AI analyzes how you learn best - visual, auditory, kinesthetic, or reading-based",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Lightbulb,
      title: "Personalized Recommendations",
      description: "Get content and resources tailored specifically to your goals and preferences",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: RefreshCw,
      title: "Adaptive Difficulty",
      description: "Challenge level adjusts in real-time to keep you in the optimal learning zone",
      color: "from-cyan-500 to-purple-500",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Our AI Solution
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Intelligent features designed to accelerate your learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, idx) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -15,
                  boxShadow:
                    "0 0 40px rgba(0, 212, 255, 0.3), 0 0 60px rgba(124, 58, 237, 0.2)",
                }}
                className="glass rounded-2xl p-8 group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative z-10">
                  <div className="mb-6 p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl w-fit group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-colors">
                    <Icon className="w-8 h-8 text-cyan-300" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white">
                    {solution.title}
                  </h3>
                  <p className="text-gray-400">{solution.description}</p>

                  <div className="mt-6 flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <span className="text-sm font-semibold">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const WorkflowSection = () => {
  const steps = [
    { label: "Input", icon: BookOpen },
    { label: "Analysis", icon: BarChart3 },
    { label: "Prediction", icon: TrendingUp },
    { label: "Output", icon: Activity },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-600/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            AI Workflow Pipeline
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            How our intelligent system processes and optimizes your learning experience
          </p>
        </motion.div>

        <div className="overflow-x-auto">
          <div className="flex items-center justify-center gap-4 md:gap-8 min-w-max md:min-w-full px-4 md:px-0">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-center gap-4 md:gap-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity" />
                    <div className="relative w-24 h-24 md:w-32 md:h-32 glass rounded-full flex items-center justify-center cursor-pointer">
                      <div className="text-center">
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 mx-auto mb-2" />
                        <span className="text-xs md:text-sm font-semibold text-cyan-300">
                          {step.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {idx < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      whileInView={{ opacity: 1, width: 32 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                      className="relative h-1 bg-gradient-to-r from-cyan-500 to-transparent hidden md:block"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500"
                        animate={{ x: [-50, 50] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    { icon: Brain, title: "AI Recommendations", description: "Smart content suggestions based on your learning patterns" },
    { icon: Activity, title: "Progress Tracking", description: "Real-time insights into your learning journey and milestones" },
    { icon: Code, title: "Smart Dashboard", description: "Intuitive interface with all your learning data at a glance" },
    { icon: BarChart3, title: "Real-time Analytics", description: "Detailed metrics on engagement, retention, and performance" },
    { icon: Zap, title: "Adaptive Tests", description: "Assessments that adjust to measure your true understanding" },
    { icon: TrendingUp, title: "Performance Insights", description: "Actionable feedback to optimize your study approach" },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need for intelligent, personalized learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-xl p-6 group cursor-pointer"
              >
                <Icon className="w-8 h-8 text-cyan-400 mb-4 group-hover:text-cyan-300 transition-colors" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ImpactSection = () => {
  return (
    <section className="relative py-32 overflow-hidden flex items-center justify-center min-h-screen">
      <div className="absolute inset-0">
        {/* Gradient backgrounds */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              Knowledge Explosion
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              Watch how our AI transforms raw data into personalized learning breakthroughs
            </p>
          </motion.div>

          {/* Central core with splash particles */}
          <div className="relative w-full h-96 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Central book/core */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-purple-600/40 rounded-2xl flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 40px rgba(0, 212, 255, 0.4)",
                      "0 0 60px rgba(0, 212, 255, 0.6)",
                      "0 0 40px rgba(0, 212, 255, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen className="w-16 h-16 text-cyan-300" />
                </motion.div>

                {/* Burst particles */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i / 12) * Math.PI * 2;
                  const distance = 150;
                  const x = Math.cos(angle) * distance;
                  const y = Math.sin(angle) * distance;

                  return (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        background: i % 2 === 0
                          ? "rgba(0, 212, 255, 0.8)"
                          : "rgba(124, 58, 237, 0.8)",
                      }}
                      animate={{
                        x: [0, x],
                        y: [0, y],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                        delay: (i / 12) * 0.5,
                      }}
                    />
                  );
                })}

                {/* Floating elements around core */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={`float-${i}`}
                    className="absolute w-4 h-4"
                    initial={{
                      x: Math.cos((i / 6) * Math.PI * 2) * 100,
                      y: Math.sin((i / 6) * Math.PI * 2) * 100,
                    }}
                    animate={{
                      x: [
                        Math.cos((i / 6) * Math.PI * 2) * 100,
                        Math.cos((i / 6) * Math.PI * 2) * 150,
                        Math.cos((i / 6) * Math.PI * 2) * 100,
                      ],
                      y: [
                        Math.sin((i / 6) * Math.PI * 2) * 100,
                        Math.sin((i / 6) * Math.PI * 2) * 150,
                        Math.sin((i / 6) * Math.PI * 2) * 100,
                      ],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: (i / 6) * 0.67,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background: i % 3 === 0
                          ? "rgba(0, 212, 255, 0.6)"
                          : i % 3 === 1
                            ? "rgba(124, 58, 237, 0.6)"
                            : "rgba(0, 212, 255, 0.4)",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Data flowing through our neural network system
          </p>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Start Your Learning Journey Today
          </h2>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of students who've transformed their education with AI-powered personalized learning
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-10 py-5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button className="px-10 py-5 border-2 border-purple-400/50 text-purple-300 font-bold rounded-xl hover:bg-purple-400/10 transition-all hover:border-purple-400 text-lg">
              Schedule Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function Index() {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#0A0F1C] to-[#000000] text-white">
      <FloatingParticles />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            LearnAI
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button className="text-gray-300 hover:text-cyan-400 transition-colors">
              Features
            </button>
            <button className="text-gray-300 hover:text-cyan-400 transition-colors">
              About
            </button>
            <button className="text-gray-300 hover:text-cyan-400 transition-colors">
              Pricing
            </button>
          </div>
          <Link
            to="/login"
            className="px-6 py-2 border border-cyan-400/50 text-cyan-300 rounded-lg hover:bg-cyan-400/10 transition-all"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <WorkflowSection />
      <FeaturesSection />
      <ImpactSection />
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-white/20 py-12 bg-black/50 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4 text-cyan-400">LearnAI</h4>
              <p className="text-gray-400 text-sm">
                AI-powered adaptive learning for the modern student
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 LearnAI. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
