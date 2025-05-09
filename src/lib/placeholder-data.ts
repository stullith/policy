
// AzureConnection related types are now in src/lib/types.ts
import type { ComplianceStatus, ComplianceItem, ComplianceSummary, HistoricalComplianceDataPoint, PolicyComplianceHistory, SubscriptionComplianceHistory } from '@/lib/types';

const sampleSubscriptions = ["Sub-Alpha", "Sub-Bravo", "Sub-Charlie"];
const sampleResourceGroups = ["RG-WebApp", "RG-Database", "RG-Network", "RG-Storage-Prod", "RG-Storage-Dev"];
const sampleResourceTypes = ["Virtual Machine", "Storage Account", "SQL Database", "Virtual Network", "App Service"];
const samplePolicyDefinitions = [
  "Allowed locations",
  "Audit VMs without disaster recovery",
  "Enforce HTTPS only",
  "Require HTTPS only",
  "Require tags on resources",
  "Disk encryption should be applied on virtual machines",
  "Azure Defender should be enabled for SQL servers",
  "Network Watcher should be enabled"
];
const sampleComplianceStatuses: ComplianceStatus[] = ["Compliant", "Non-Compliant", "Pending"];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = (): string => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
};

export const placeholderComplianceItems: ComplianceItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `res-${i + 1}`,
  resourceName: `${getRandomElement(sampleResourceTypes).split(' ')[0].toLowerCase()}-${i + 1}`,
  resourceType: getRandomElement(sampleResourceTypes),
  resourceGroup: getRandomElement(sampleResourceGroups),
  subscription: getRandomElement(sampleSubscriptions),
  policyDefinition: getRandomElement(samplePolicyDefinitions),
  complianceStatus: getRandomElement(sampleComplianceStatuses),
  lastScanned: getRandomDate(),
  details: `This resource is ${getRandomElement(sampleComplianceStatuses).toLowerCase()} with the policy '${getRandomElement(samplePolicyDefinitions)}'. Affected component: ${Math.random() > 0.5 ? 'Primary Disk' : 'Network Interface'}. Action required: ${Math.random() > 0.5 ? 'Enable encryption' : 'Configure firewall'}.`
}));

export const placeholderComplianceSummary: ComplianceSummary = {
  totalResources: 1250,
  compliantResources: 980,
  nonCompliantResources: 220,
  pendingResources: 50,
  compliancePercentage: Math.round((980 / 1250) * 100),
  totalPolicies: 75,
  criticalViolations: 35,
};

// Placeholder data for historical compliance
const generateHistoricalData = (months: number): HistoricalComplianceDataPoint[] => {
  const data: HistoricalComplianceDataPoint[] = [];
  let currentCompliance = 70 + Math.random() * 10; // Start between 70-80%
  for (let i = months -1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    date.setDate(15); // Mid-month
    
    currentCompliance += (Math.random() - 0.45) * 5; // Fluctuate by up to +/- 2.5% generally, slight upward trend
    currentCompliance = Math.max(50, Math.min(98, currentCompliance)); // Keep within 50-98%

    data.push({
      date: date.toISOString().split('T')[0], // "YYYY-MM-DD"
      compliancePercentage: parseFloat(currentCompliance.toFixed(1)),
    });
  }
  return data;
};

export const placeholderPolicyHistoryData: PolicyComplianceHistory[] = [
  {
    policyId: "policy-locations-hist",
    policyName: "Allowed locations",
    type: "policy",
    history: generateHistoricalData(12), // 12 months of data
  },
  {
    policyId: "initiative-security-baseline-hist",
    policyName: "Security Baseline Initiative",
    type: "initiative",
    history: generateHistoricalData(12),
  },
  {
    policyId: "policy-disk-encryption-hist",
    policyName: "Disk encryption for VMs",
    type: "policy",
    history: generateHistoricalData(12),
  },
  {
    policyId: "initiative-data-protection-hist",
    policyName: "Data Protection Initiative",
    type: "initiative",
    history: generateHistoricalData(6), // 6 months of data
  },
   {
    policyId: "policy-mfa-admin-hist",
    policyName: "Require MFA for Admins",
    type: "policy",
    history: generateHistoricalData(9),
  },
  {
    policyId: "initiative-governance-hist",
    policyName: "Governance Initiative",
    type: "initiative",
    history: generateHistoricalData(10),
  },
];

export const placeholderSubscriptionHistoryData: SubscriptionComplianceHistory[] = sampleSubscriptions.map((subName, index) => ({
  subscriptionId: `sub-hist-${index + 1}`,
  subscriptionName: subName,
  history: generateHistoricalData(12), // 12 months of data for each subscription
}));


// Export types that were previously here but are now in lib/types
export type { ComplianceStatus, ComplianceItem, ComplianceSummary, HistoricalComplianceDataPoint, PolicyComplianceHistory, SubscriptionComplianceHistory };

