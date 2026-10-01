import Link from "next/link";
export function SiteHeader(){return <header className="site-header"><Link href="/" className="brand">Weather Damage Studio</Link><nav><Link href="/analyze">Analyze</Link><Link href="/methodology">Methodology</Link></nav></header>}
