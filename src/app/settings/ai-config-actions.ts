
'use server';

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import type { AIBackendConfigInput, AIConfigurationClient, AIConfigurationStored } from '@/lib/types';

const AI_CONFIG_SECRET_NAME = 'remediation-ai-backend-config';

function getSecretClient(): SecretClient {
  const keyVaultUri = process.env.AZURE_KEYVAULT_URI;
  if (!keyVaultUri) {
    throw new Error('AZURE_KEYVAULT_URI environment variable is not set. Cannot manage AI configuration.');
  }
  const credential = new DefaultAzureCredential();
  return new SecretClient(keyVaultUri, credential);
}

function convertToClientConfig(storedConfig: AIConfigurationStored): AIConfigurationClient {
  switch (storedConfig.type) {
    case 'azure_openai':
      return {
        type: 'azure_openai',
        endpoint: storedConfig.azureOpenAIEndpoint || '',
        deploymentName: storedConfig.azureOpenAIDeploymentName || '',
        isApiKeySet: !!storedConfig.azureOpenAIApiKey, // True if API key string is non-empty
      };
    case 'vertex_ai':
      return {
        type: 'vertex_ai',
        projectId: storedConfig.vertexAIProjectId || '',
        location: storedConfig.vertexAILocation || '',
        modelId: storedConfig.vertexAIModelId || '',
      };
    default: // 'default' or unrecognized
      return { type: 'default' };
  }
}

export async function saveAIConfiguration(
  configInput: AIBackendConfigInput
): Promise<AIConfigurationClient> {
  const client = getSecretClient();
  
  let newStoredConfig: AIConfigurationStored = { type: configInput.type };
  let currentStoredConfig: AIConfigurationStored | null = null;

  // Fetch current config to preserve API key if not explicitly changed
  try {
    const currentSecret = await client.getSecret(AI_CONFIG_SECRET_NAME);
    if (currentSecret.value) {
      currentStoredConfig = JSON.parse(currentSecret.value);
    }
  } catch (error: any) {
    if (error.statusCode !== 404) { // It's okay if secret not found (first time save)
        console.warn("Could not fetch current AI config during save:", error);
    }
  }

  if (configInput.type === 'azure_openai') {
    if (!configInput.azureOpenAIEndpoint?.trim() || !configInput.azureOpenAIDeploymentName?.trim()) {
      throw new Error('Azure OpenAI Endpoint and Deployment Name are required.');
    }
    newStoredConfig.azureOpenAIEndpoint = configInput.azureOpenAIEndpoint;
    newStoredConfig.azureOpenAIDeploymentName = configInput.azureOpenAIDeploymentName;

    if (typeof configInput.azureOpenAIApiKey === 'string') {
      // If azureOpenAIApiKey is an explicit string (even empty), use it.
      // Empty string means user wants to clear the API key.
      newStoredConfig.azureOpenAIApiKey = configInput.azureOpenAIApiKey;
    } else if (currentStoredConfig && currentStoredConfig.type === 'azure_openai' && currentStoredConfig.azureOpenAIApiKey) {
      // If azureOpenAIApiKey is undefined in input, preserve existing key if types match.
      newStoredConfig.azureOpenAIApiKey = currentStoredConfig.azureOpenAIApiKey;
    } else {
      // No new key, no existing key to preserve, or type mismatch.
      newStoredConfig.azureOpenAIApiKey = undefined;
    }

  } else if (configInput.type === 'vertex_ai') {
    if (!configInput.vertexAIProjectId?.trim() || !configInput.vertexAILocation?.trim() || !configInput.vertexAIModelId?.trim()) {
      throw new Error('Vertex AI Project ID, Location, and Model ID are required.');
    }
    newStoredConfig.vertexAIProjectId = configInput.vertexAIProjectId;
    newStoredConfig.vertexAILocation = configInput.vertexAILocation;
    newStoredConfig.vertexAIModelId = configInput.vertexAIModelId;
  }
  // For 'default' type, no specific fields needed in newStoredConfig beyond `type`.

  try {
    await client.setSecret(AI_CONFIG_SECRET_NAME, JSON.stringify(newStoredConfig));
    return convertToClientConfig(newStoredConfig);
  } catch (error) {
    console.error('Failed to save AI configuration to Key Vault:', error);
    throw new Error('Failed to store AI configuration in Key Vault. Ensure the application has necessary permissions (e.g., Key Vault Secrets Officer).');
  }
}

export async function getAIConfiguration(): Promise<AIConfigurationClient | null> {
  const client = getSecretClient();
  try {
    const secret = await client.getSecret(AI_CONFIG_SECRET_NAME);
    if (secret.value) {
      const storedConfig: AIConfigurationStored = JSON.parse(secret.value);
      return convertToClientConfig(storedConfig);
    }
    return { type: 'default' }; // Secret exists but has no value, default to 'default'
  } catch (error: any) {
    if (error.statusCode === 404) {
      return { type: 'default' }; // Secret not found, implies default configuration
    }
    console.error('Failed to retrieve AI configuration from Key Vault:', error);
    throw new Error('Failed to retrieve AI configuration from Key Vault.');
  }
}

// Optional: Add a delete function if explicit deletion is needed.
// For now, saving a 'default' type effectively resets to default.
// export async function deleteAIConfiguration(): Promise<void> {
//   const client = getSecretClient();
//   try {
//     const poller = await client.beginDeleteSecret(AI_CONFIG_SECRET_NAME);
//     await poller.pollUntilDone();
//   } catch (error: any) {
//     if (error.statusCode === 404) return; // Already deleted or never existed
//     console.error('Failed to delete AI configuration from Key Vault:', error);
//     throw new Error('Failed to delete AI configuration from Key Vault.');
//   }
// }
