import Link from "next/link";
import { ArrowRight, Check, CloudRain, Gauge, GitBranch, ShieldCheck, Sparkles, Waves, Wind } from "lucide-react";

const steps = [
  ["01", "Input", "Weather + property context", CloudRain],
  ["02", "Reason", "Boolean rule evaluation", GitBranch],
  ["03", "Assess", "Risk, damage + severity", Gauge],
  ["04", "Act", "Cost range + next steps", ShieldCheck],
] as const;

export default function HomePage() {
  return <div className="overflow-hidden">
    <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="pointer-events-none absolute -right-40 -top-28 h-[520px] w-[520px] rounded-full bg-[#d6f1ed]/70 blur-3xl" />
      <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <div className="section-label"><Sparkles size={13} aria-hidden="true" /> decision support, made clear</div>
          <h1 className="max-w-3xl text-[clamp(2.75rem,6vw,5.75rem)] font-bold leading-[0.98] tracking-[-0.065em] text-ink">Read the weather.<br /><span className="text-ocean">Protect what matters.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#617286] sm:text-xl">Stormwise turns weather and property details into an explainable risk simulation — with every threshold and decision visible.</p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
             <Link href="/analyze" className="focus-ring group inline-flex items-center gap-3 rounded-2xl bg-ink px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-ink/15 transition hover:-translate-y-0.5 hover:bg-[#1c3a57]">Run a scenario <ArrowRight size={17} aria-hidden="true" className="transition group-hover:translate-x-1" /></Link>
             <Link href="/analyze?mode=live" className="focus-ring inline-flex items-center gap-2 rounded-2xl border border-[#dbe5eb] bg-white px-4 py-3.5 text-sm font-bold text-ink transition hover:border-ocean">Analyze My Area</Link>
            <Link href="/methodology" className="focus-ring inline-flex items-center gap-2 rounded-2xl px-3 py-3.5 text-sm font-bold text-[#607386] transition hover:text-ink">See the method <span aria-hidden="true">↗</span></Link>
          </div>
          <p className="mt-7 flex items-center gap-2 text-xs font-medium text-[#8292a1]"><Check size={14} className="text-[#139b8e]" aria-hidden="true" /> Academic simulation · not an insurance or engineering assessment</p>
        </div>
        <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
          <div className="panel relative overflow-hidden bg-white/90 p-5 sm:p-7">
            <div className="flex items-start justify-between border-b border-[#e8eef1] pb-5"><div><p className="eyebrow">live scenario preview</p><h2 className="mt-2 text-xl font-bold tracking-tight text-ink">Kochi, Kerala</h2></div><span className="rounded-full bg-[#fff1dc] px-3 py-1.5 text-[11px] font-bold text-[#a65c2d]">HIGH SIGNAL</span></div>
            <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-4"><Metric label="Rain" value="120 mm" tone="teal" /><Metric label="Wind" value="75 km/h" tone="blue" /><Metric label="Temp" value="29°C" tone="gold" /><Metric label="Humidity" value="88%" tone="coral" /></div>
            <div className="rounded-2xl bg-[#f5f8f9] p-4"><div className="flex items-center justify-between text-xs font-bold text-[#748596]"><span>RULE TRACE</span><span className="text-[#139b8e]">5 checks complete</span></div><div className="mt-4 space-y-3"><TraceLine label="HeavyRain" expression="TRUE" /><TraceLine label="HighWind" expression="TRUE" /><TraceLine label="HeavyRain AND HighWind" expression="HIGH RISK" strong /></div></div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-ink px-4 py-4 text-white"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9db2c3]">simulated outlook</p><p className="mt-1 text-lg font-bold">Combined weather damage</p></div><Waves size={28} className="text-[#77d3c7]" aria-hidden="true" /></div>
          </div>
        </div>
      </div>
    </section>
    <section className="border-y border-[#dfe9ed] bg-white"><div className="mx-auto grid max-w-7xl gap-0 px-5 lg:grid-cols-4 lg:px-8">{steps.map(([number, title, copy, Icon], index) => <div key={number} className={`relative flex gap-4 py-6 lg:flex-col lg:gap-5 lg:py-10 ${index !== 0 ? "border-t border-[#e8eef1] lg:border-l lg:border-t-0 lg:pl-8" : ""}`}><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef8f6] text-ocean"><Icon size={18} aria-hidden="true" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8ca0ae]">{number}</p><p className="mt-1 font-bold text-ink">{title}</p><p className="mt-1 text-sm text-[#718293]">{copy}</p></div></div>)}</div></section>
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><p className="eyebrow">built for clear decisions</p><h2 className="mt-4 max-w-lg text-4xl font-bold leading-tight tracking-[-0.04em] text-ink sm:text-5xl">No black box. Just a trail you can follow.</h2></div><p className="max-w-xl text-lg leading-8 text-[#617286] lg:justify-self-end">Every output is a deterministic simulation. Inspect the conditions, see which AND / OR / NOT rules fired, and understand how the result became a cost range.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3"><FeatureCard icon={<GitBranch size={19} />} title="Explainable by design" copy="Threshold checks and Boolean expressions stay visible from input to recommendation." /><FeatureCard icon={<Wind size={19} />} title="Manual-first resilience" copy="No live weather key? No problem. Enter a scenario directly and keep moving." /><FeatureCard icon={<ShieldCheck size={19} />} title="Careful with claims" copy="Estimates are clearly labelled as an academic simulation, not a professional quote." /></div></section>
  </div>;
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "teal" | "blue" | "gold" | "coral" }) { const toneClass = { teal: "bg-[#e7f8f4] text-[#13766e]", blue: "bg-[#eaf2fb] text-[#32628a]", gold: "bg-[#fff4df] text-[#97652c]", coral: "bg-[#fff0eb] text-[#a85b49]" }[tone]; return <div className={`rounded-xl p-3 ${toneClass}`}><p className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>; }
function TraceLine({ label, expression, strong }: { label: string; expression: string; strong?: boolean }) { return <div className={`flex items-center justify-between gap-3 text-xs ${strong ? "rounded-lg bg-white px-3 py-2.5 font-bold text-ink" : "text-[#718293]"}`}><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#139b8e]" />{label}</span><span className="text-[#139b8e]">{expression}</span></div>; }
function FeatureCard({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) { return <div className="panel p-6 transition hover:-translate-y-1"><div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">{icon}</div><h3 className="mt-5 text-lg font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-[#718293]">{copy}</p></div>; }
