import { ComplianceSummaryCard } from "@/components/compliance/compliance-summary-card";
import { FilterControls } from "@/components/compliance/filter-controls";
import { ExportButton } from "@/components/compliance/export-button";
import { ComplianceDataTable } from "@/components/compliance/compliance-data-table";
import { placeholderComplianceItems, placeholderComplianceSummary, placeholderSubscriptionHistoryData } from "@/lib/placeholder-data";
import { Package, ShieldCheck, ShieldAlert, Percent, TrendingUp } from "lucide-react";
import { OverallSubscriptionComplianceChart } from "@/components/trends/overall-subscription-compliance-chart"; // New import
import { Card, CardContent } from "@/components/ui/card";


export default function DashboardPage() {
  const summary = placeholderComplianceSummary;
  const items = placeholderComplianceItems;
  const subscriptionHistory = placeholderSubscriptionHistoryData;

  return (
    <div className="flex flex-col gap-8"> {/* Increased main gap */}
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

      <div>
        {/* Replaced individual charts with a single overview chart */}
        {subscriptionHistory.length > 0 ? (
          <OverallSubscriptionComplianceChart
            data={subscriptionHistory}
            title="Overall Subscription Compliance Trends"
            description="Historical compliance trends for all tracked subscriptions."
          />
        ) : (
          <Card>
             <CardHeader>
                <CardTitle className="flex items-center">
                    <TrendingUp className="mr-3 h-7 w-7 text-primary" />
                    Subscription Compliance Trends
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No subscription historical data available to display trends.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <FilterControls />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Resource Compliance Status</h2>
        <ComplianceDataTable data={items} />
      </div>
    </div>
  );
}
