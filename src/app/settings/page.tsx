
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
      </div>

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
          <NewConnectionForm onAddConnection={addConnection} />
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Managed Azure Tenant Connections</CardTitle>
          <CardDescription>View and manage Azure tenant connections stored in Key Vault.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingConnections && !errorConnections && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          )}
          {errorConnections && !isLoadingConnections && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Connections</AlertTitle>
              <AlertDescription>
                {errorConnections}
                <Button onClick={retryFetchConnections} variant="link" className="p-0 h-auto ml-2 text-destructive-foreground underline">
                   <RotateCw className="mr-1 h-3 w-3" /> Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {!isLoadingConnections && !errorConnections && (
            <ConnectionList connections={connections} onDeleteConnection={removeConnection} />
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
          {isLoadingAIConfig && !aiConfig && !errorAIConfig && ( // Show skeleton only on initial load
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/3 rounded-md mt-1.5" /> {/* Mimic Select */}
              <Skeleton className="h-10 w-full rounded-md mt-4" /> {/* Mimic Input field */}
              <Skeleton className="h-10 w-full rounded-md mt-4" /> {/* Mimic another Input field */}
              <Skeleton className="h-10 w-1/4 rounded-md mt-6" /> {/* Mimic Button */}
            </div>
          )}
          {errorAIConfig && ( // Show error if error state is set
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading AI Configuration</AlertTitle>
              <AlertDescription>
                {errorAIConfig}
                <Button onClick={retryFetchAIConfig} variant="link" className="p-0 h-auto ml-2 text-destructive-foreground underline">
                   <RotateCw className="mr-1 h-3 w-3" /> Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {/* Render form once initial load is done (isLoadingAIConfig is false OR aiConfig is available) and no critical error preventing form display */}
          {((!isLoadingAIConfig || aiConfig) && !errorAIConfig) && (
            <AIConfigurationForm
              currentConfig={aiConfig}
              onSaveConfiguration={updateAIConfig}
              isLoading={isLoadingAIConfig} 
            />
          )}
        </CardContent>
      </Card>

    </div>
  );
}
