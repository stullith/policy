
'use server';

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import type { AzureConnectionInput, AzureConnectionClient, AzureConnectionStored } from '@/lib/types';

const KEY_VAULT_SECRET_PREFIX = 'azure-connection-';

function getSecretClient(): SecretClient {
  const keyVaultUri = process.env.AZURE_KEYVAULT_URI;
  if (!keyVaultUri) {
    throw new Error('AZURE_KEYVAULT_URI environment variable is not set.');
  }
  const credential = new DefaultAzureCredential();
  return new SecretClient(keyVaultUri, credential);
}

export async function addAzureConnectionToKeyVault(
  connectionData: AzureConnectionInput
): Promise<AzureConnectionClient> {
  const client = getSecretClient();
  const connectionId = crypto.randomUUID();
  const secretName = `${KEY_VAULT_SECRET_PREFIX}${connectionId}`;
  
  const connectionToStore: AzureConnectionStored = {
    ...connectionData,
    id: connectionId,
  };

  try {
    await client.setSecret(secretName, JSON.stringify(connectionToStore));
    // Return only client-safe data
    return {
      id: connectionId,
      name: connectionData.name,
      tenantId: connectionData.tenantId,
      clientId: connectionData.clientId,
    };
  } catch (error) {
    console.error(`Failed to add connection ${connectionData.name} to Key Vault:`, error);
    throw new Error(`Failed to store connection in Key Vault. Ensure the application has 'Key Vault Secrets Officer' role and AZURE_KEYVAULT_URI is correct.`);
  }
}

export async function getAzureConnectionsFromKeyVault(): Promise<AzureConnectionClient[]> {
  const client = getSecretClient();
  const connections: AzureConnectionClient[] = [];

  try {
    for await (const secretProperties of client.listPropertiesOfSecrets()) {
      if (secretProperties.name.startsWith(KEY_VAULT_SECRET_PREFIX)) {
        const secret = await client.getSecret(secretProperties.name);
        if (secret.value) {
          const storedConnection: AzureConnectionStored = JSON.parse(secret.value);
          connections.push({
            id: storedConnection.id,
            name: storedConnection.name,
            tenantId: storedConnection.tenantId,
            clientId: storedConnection.clientId,
            // clientSecret is deliberately not included
          });
        }
      }
    }
    return connections;
  } catch (error) {
    console.error('Failed to retrieve connections from Key Vault:', error);
    // Return empty array or throw, depending on desired error handling for UI
    // For now, let's inform the user that fetching failed.
    throw new Error('Failed to retrieve connections from Key Vault. Check application permissions and Key Vault status.');
  }
}

export async function deleteAzureConnectionFromKeyVault(connectionId: string): Promise<void> {
  const client = getSecretClient();
  const secretName = `${KEY_VAULT_SECRET_PREFIX}${connectionId}`;
  try {
    const poller = await client.beginDeleteSecret(secretName);
    await poller.pollUntilDone();
  } catch (error) {
    console.error(`Failed to delete connection ${connectionId} from Key Vault:`, error);
    throw new Error(`Failed to delete connection from Key Vault.`);
  }
}
