import { RemediationForm } from "@/components/remediation/remediation-form";

export default function RemediationPage() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Remediation Assistant</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Leverage AI to generate step-by-step guidance or automation scripts for common Azure Policy violations.
        </p>
      </div>
      <RemediationForm />
    </div>
  );
}
