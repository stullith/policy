export type ComplianceStatus = "Compliant" | "Non-Compliant" | "Pending";

export interface ComplianceItem {
  id: string;
  resourceName: string;
  resourceType: string;
  resourceGroup: string;
  subscription: string;
  policyDefinition: string;
  complianceStatus: ComplianceStatus;
  lastScanned: string; 
  details?: string;
}

export interface ComplianceSummary {
  totalResources: number;
  compliantResources: number;
  nonCompliantResources: number;
  pendingResources: number;
  compliancePercentage: number;
  totalPolicies: number;
  criticalViolations: number;
}

const sampleSubscriptions = ["Sub-Alpha", "Sub-Bravo", "Sub-Charlie"];
const sampleResourceGroups = ["RG-WebApp", "RG-Database", "RG-Network", "RG-Storage-Prod", "RG-Storage-Dev"];
const sampleResourceTypes = ["Virtual Machine", "Storage Account", "SQL Database", "Virtual Network", "App Service"];
const samplePolicyDefinitions = [
  "Allowed locations",
  "Audit VMs without disaster recovery",
  "Enforce HTTPS only",
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
