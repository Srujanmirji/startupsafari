"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { ArrowRight, ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

const STEPS = [
  { 
    title: "The Problem", 
    description: "What pain point are you solving?",
    fields: [
        { name: "problem", label: "Describe the core problem", placeholder: "e.g. Small businesses struggle to manage inventory across multiple channels...", type: "textarea" },
        { name: "audience", label: "Who is your target audience?", placeholder: "e.g. SMB owners, E-commerce sellers...", type: "text" }
    ]
  },
  { 
    title: "The Solution", 
    description: "How does your idea fix it?",
    fields: [
        { name: "solution", label: "Your product solution", placeholder: "e.g. An AI-powered dashboard that syncs inventory in real-time...", type: "textarea" },
        { name: "uniqueValue", label: "What is your unfair advantage?", placeholder: "e.g. Proprietary algorithm, exclusive data access...", type: "text" }
    ]
  },
  { 
    title: "Market & Model", 
    description: "How big is it and how do you make money?",
    fields: [
        { name: "marketSize", label: "Estimated market size", placeholder: "e.g. $5B in the US alone...", type: "text" },
        { name: "revenueModel", label: "Revenue model", placeholder: "e.g. SaaS subscription, Transaction fee...", type: "text" }
    ]
  }
];

export default function SubmitIdea() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await api.submitIdea(formData);
      router.push(`/analysis?id=${data.id}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050f] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        {/* Stepper Header */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -z-10 -translate-y-1/2"></div>
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  i <= currentStep ? "bg-electric-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-900 text-zinc-600 border border-white/10"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold mt-2 ${i <= currentStep ? "text-white" : "text-zinc-600"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Area */}
        <div className="p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2 font-heading">{STEPS[currentStep].title}</h2>
                <p className="text-zinc-500">{STEPS[currentStep].description}</p>
              </div>

              <div className="space-y-6">
                {STEPS[currentStep].fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue/50 transition-colors resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue/50 transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:bg-white/5 text-zinc-400"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isSubmitting ? "Processing..." : currentStep === STEPS.length - 1 ? "Start Safari" : "Next Step"}
              {currentStep < STEPS.length - 1 && !isSubmitting && <ArrowRight className="w-5 h-5" />}
              {currentStep === STEPS.length - 1 && !isSubmitting && <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
