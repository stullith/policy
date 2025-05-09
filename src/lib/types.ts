
// Defines the structure for connection data input by the user, including the client secret.
export interface AzureConnectionInput {
  name: string;
  tenantId: string;
  clientId: string;
  clientSecret: string; 
}

// Defines the structure for connection data as stored (e.g., in Key Vault, includes ID).
export interface AzureConnectionStored extends AzureConnectionInput {
  id: string;
}

// Defines the structure for connection data as used on the client-side (omits clientSecret).
export interface AzureConnectionClient {
  id: string;
  name: string;
  tenantId: string;
  clientId: string;
  // clientSecret is deliberately omitted for security
}

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

export interface HistoricalComplianceDataPoint {
  date: string; // "YYYY-MM-DD"
  compliancePercentage: number;
}

export interface PolicyComplianceHistory {
  policyId: string;
  policyName: string;
  history: HistoricalComplianceDataPoint[];
}
