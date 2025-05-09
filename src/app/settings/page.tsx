
'use client';

import { NewConnectionForm } from '@/components/settings/new-connection-form';
import { ConnectionList } from '@/components/settings/connection-list';
import { useConnections } from '@/hooks/use-connections';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Settings as SettingsIcon, RotateCw, Cpu } from 'lucide-react'; 
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIConfigurationForm } from '@/components/settings/ai-configuration-form';
import { useAIConfiguration } from '@/hooks/use-ai-configuration';

export default function SettingsPage() {
  const { connections, addConnection, removeConnection, isLoading: isLoadingConnections, error: errorConnections, retryFetch: retryFetchConnections } = useConnections();
  const { config: aiConfig, updateConfig: updateAIConfig, isLoading: isLoadingAIConfig, error: errorAIConfig, retryFetch: retryFetchAIConfig } = useAIConfiguration();

  const keyVaultUriMissingErrorText = "AZURE_KEYVAULT_URI environment variable is not set";
  const isKeyVaultUriMissing = 
    (errorConnections?.includes(keyVaultUriMissingErrorText)) || 
    (errorAIConfig?.includes(keyVaultUriMissingErrorText));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
      </div>

      {isKeyVaultUriMissing && (
        <Alert variant="destructive" className="mb-0"> {/* Reduced margin if it's the first prominent alert */}
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Azure Key Vault Configuration Missing</AlertTitle>
          <AlertDescription>
            The AZURE_KEYVAULT_URI environment variable is not set. 
            This application requires Azure Key Vault to store and manage sensitive connection information and AI configurations. 
            Please configure the Key Vault URI to enable these settings. Functionality will be limited, and settings cannot be saved or loaded.
          </AlertDescription>
        </Alert>
      )}

      <Alert variant="default" className="max-w-3xl border-accent">
         <AlertTriangle className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent">Secure Credential Management</AlertTitle>
        <AlertDescription>
          Azure Tenant connections and their credentials (Client ID, Client Secret), as well as AI backend configurations (like API keys), 
          are securely stored in Azure Key Vault. This application accesses Key Vault using its System-Assigned Managed Identity, 
          ensuring secrets are not exposed client-side or stored insecurely.
          Ensure your application's Managed Identity has the necessary permissions (e.g., 'Key Vault Secrets Officer') on the configured Key Vault.
        </AlertDescription>
      </Alert>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Add New Azure Tenant Connection</CardTitle>
          <CardDescription>Configure connections to your Azure tenants. Credentials will be stored securely in Azure Key Vault.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewConnectionForm 
            onAddConnection={addConnection} 
            keyVaultUnavailable={isKeyVaultUriMissing}
          />
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Managed Azure Tenant Connections</CardTitle>
          <CardDescription>View and manage Azure tenant connections stored in Key Vault.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingConnections && !connections.length && !errorConnections && ( // Show skeleton only on initial load and if no data/error yet
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          )}
          {errorConnections && ( // Always show error if present
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Connections</AlertTitle>
              <AlertDescription>
                {errorConnections}
                {!isKeyVaultUriMissing && ( // Don't show retry if URI is the root cause, as retry won't help
                  <Button onClick={retryFetchConnections} variant="link" className="p-0 h-auto ml-2 text-destructive-foreground underline">
                    <RotateCw className="mr-1 h-3 w-3" /> Retry
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}
          {/* Render ConnectionList if not in initial loading phase or if there's an error (it handles empty/error states internally) */}
          {(!isLoadingConnections || connections.length > 0 || errorConnections) && (
             <ConnectionList 
              connections={connections} 
              onDeleteConnection={removeConnection}
              keyVaultUnavailable={isKeyVaultUriMissing}
            />
          )}
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" />
            Remediation AI Backend Configuration
          </CardTitle>
          <CardDescription>
            Configure the backend service for generating AI-powered remediation suggestions.
            The 'Default' option uses the application's pre-configured Genkit settings (Google Gemini).
            For private instances, ensure the necessary credentials/permissions are correctly set up for this application's Managed Identity or provided API keys.
            Changes to the AI backend might require an application restart or redeployment to fully take effect in the AI processing flows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAIConfig && !aiConfig && !errorAIConfig && ( 
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/3 rounded-md mt-1.5" /> 
              <Skeleton className="h-10 w-full rounded-md mt-4" /> 
              <Skeleton className="h-10 w-full rounded-md mt-4" /> 
              <Skeleton className="h-10 w-1/4 rounded-md mt-6" /> 
            </div>
          )}
          {errorAIConfig && ( 
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading AI Configuration</AlertTitle>
              <AlertDescription>
                {errorAIConfig}
                {!isKeyVaultUriMissing && ( // Don't show retry if URI is the root cause
                  <Button onClick={retryFetchAIConfig} variant="link" className="p-0 h-auto ml-2 text-destructive-foreground underline">
                    <RotateCw className="mr-1 h-3 w-3" /> Retry
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}
          {/* Render form if aiConfig is available (hook provides a default even on error) 
              AND (not initial loading OR there's an error - to ensure form shows post-error) */}
          {(aiConfig && (!isLoadingAIConfig || errorAIConfig)) && (
            <AIConfigurationForm
              currentConfig={aiConfig} 
              onSaveConfiguration={updateAIConfig}
              isLoading={isLoadingAIConfig} 
              keyVaultUnavailable={isKeyVaultUriMissing}
            />
          )}
        </CardContent>
      </Card>

    </div>
  );
}
