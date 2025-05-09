
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
  type: 'policy' | 'initiative'; // Added type field
  history: HistoricalComplianceDataPoint[];
}

export interface SubscriptionComplianceHistory {
  subscriptionId: string;
  subscriptionName: string;
  history: HistoricalComplianceDataPoint[];
}


// AI Backend Configuration Types
export type AIBackendType = 'default' | 'azure_openai' | 'vertex_ai';

// Base client-safe AI configuration
export interface AIBackendConfigBaseClient {
  type: AIBackendType;
}

// Azure OpenAI client-safe configuration
export interface AzureOpenAIConfigClient extends AIBackendConfigBaseClient {
  type: 'azure_openai';
  endpoint: string;
  deploymentName: string;
  isApiKeySet: boolean; // Indicates if an API key is configured in Key Vault
}

// Vertex AI client-safe configuration
export interface VertexAIConfigClient extends AIBackendConfigBaseClient {
  type: 'vertex_ai';
  projectId: string;
  location: string;
  modelId: string;
}

// Union type for client-safe AI configuration
export type AIConfigurationClient = AIBackendConfigBaseClient | AzureOpenAIConfigClient | VertexAIConfigClient;

// Input type for the AI configuration form (can include API key for update)
export interface AIBackendConfigInput {
  type: AIBackendType;
  azureOpenAIEndpoint?: string;
  azureOpenAIDeploymentName?: string;
  azureOpenAIApiKey?: string; // Optional: user might not want to update it, or clear it
  vertexAIProjectId?: string;
  vertexAILocation?: string;
  vertexAIModelId?: string;
}

// Stored type for AI configuration in Key Vault (includes sensitive data if applicable)
export interface AIConfigurationStored {
  type: AIBackendType;
  azureOpenAIEndpoint?: string;
  azureOpenAIDeploymentName?: string;
  azureOpenAIApiKey?: string; // Stored if provided for Azure OpenAI
  vertexAIProjectId?: string;
  vertexAILocation?: string;
  vertexAIModelId?: string;
}

