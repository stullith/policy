import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary px-2">
      <ShieldCheck className="h-7 w-7 text-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 transition-all" />
      <span className="group-data-[collapsible=icon]:hidden">PolicyPulse</span>
    </Link>
  );
}
