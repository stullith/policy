import { FilterControls } from "@/components/compliance/filter-controls";
import { ExportButton } from "@/components/compliance/export-button";
import { ComplianceDataTable } from "@/components/compliance/compliance-data-table";
import { placeholderComplianceItems } from "@/lib/placeholder-data";

export default function DetailedReportsPage() {
  // For this page, we might filter for non-compliant items or show more details.
  const nonCompliantItems = placeholderComplianceItems.filter(
    item => item.complianceStatus === "Non-Compliant"
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Detailed Compliance Reports</h1>
        <ExportButton data={nonCompliantItems} filenamePrefix="detailed-non-compliant-report" />
      </div>
      
      <FilterControls />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Non-Compliant Resources Breakdown</h2>
        <ComplianceDataTable data={nonCompliantItems} isDetailedView={true} />
      </div>
    </div>
  );
}
