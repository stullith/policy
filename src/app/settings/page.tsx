
'use client';

import { NewConnectionForm } from '@/components/settings/new-connection-form';
import { ConnectionList } from '@/components/settings/connection-list';
import { useConnections } from '@/hooks/use-connections';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Settings as SettingsIcon, RotateCw } from 'lucide-react'; 
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { connections, addConnection, removeConnection, isLoading, error, retryFetch } = useConnections();

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
          Azure Tenant connections and their credentials (Client ID, Client Secret) are securely stored in Azure Key Vault.
          This application accesses Key Vault using its System-Assigned Managed Identity, ensuring secrets are not exposed client-side or stored insecurely.
          Ensure your application's Managed Identity has the necessary permissions on the configured Key Vault.
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
          <CardTitle>Managed Connections</CardTitle>
          <CardDescription>View and manage Azure tenant connections stored in Key Vault.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !error && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          )}
          {error && !isLoading && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Connections</AlertTitle>
              <AlertDescription>
                {error}
                <Button onClick={retryFetch} variant="link" className="p-0 h-auto ml-2 text-destructive-foreground underline">
                   <RotateCw className="mr-1 h-3 w-3" /> Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && (
            <ConnectionList connections={connections} onDeleteConnection={removeConnection} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
