import { AnalysisWorkspace } from "@/components/analysis-workspace";

export const metadata = { title: "Analyze | Stormwise" };

export default function AnalyzePage() {
  return <div className="min-h-[calc(100vh-72px)] bg-[#f7fafb]"><div className="mx-auto max-w-7xl px-5 pt-10 lg:px-8 lg:pt-14"><p className="eyebrow">manual-first analysis</p><p className="mt-3 max-w-2xl text-sm leading-6 text-[#718293]">A calm, transparent workflow for exploring how weather conditions may affect a property. Use live weather only when a provider is configured.</p></div><AnalysisWorkspace /></div>;
}
