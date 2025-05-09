import { ComplianceSummaryCard } from "@/components/compliance/compliance-summary-card";
import { FilterControls } from "@/components/compliance/filter-controls";
import { ExportButton } from "@/components/compliance/export-button";
import { ComplianceDataTable } from "@/components/compliance/compliance-data-table";
import { placeholderComplianceItems, placeholderComplianceSummary } from "@/lib/placeholder-data";
import { Package, ShieldCheck, ShieldAlert, Percent, FileText, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const summary = placeholderComplianceSummary;
  const items = placeholderComplianceItems;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Compliance Overview</h1>
        <ExportButton data={items} filenamePrefix="dashboard-compliance-report" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ComplianceSummaryCard
          title="Total Resources"
          value={summary.totalResources.toLocaleString()}
          icon={Package}
          description="Tracked across all subscriptions"
        />
        <ComplianceSummaryCard
          title="Compliant Resources"
          value={summary.compliantResources.toLocaleString()}
          icon={ShieldCheck}
          iconColorClass="text-accent"
          trend={`Represents ${summary.compliancePercentage}% of total`}
        />
        <ComplianceSummaryCard
          title="Non-Compliant Resources"
          value={summary.nonCompliantResources.toLocaleString()}
          icon={ShieldAlert}
          iconColorClass="text-destructive"
          description={`${summary.criticalViolations} critical violations`}
        />
        <ComplianceSummaryCard
          title="Overall Compliance"
          value={`${summary.compliancePercentage}%`}
          icon={Percent}
          iconColorClass="text-primary"
          description={`${summary.totalPolicies} policies evaluated`}
        />
      </div>

      <FilterControls />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Resource Compliance Status</h2>
        <ComplianceDataTable data={items} />
      </div>
    </div>
  );
}
