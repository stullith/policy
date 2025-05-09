
'use client';

import { NewConnectionForm } from '@/components/settings/new-connection-form';
import { ConnectionList } from '@/components/settings/connection-list';
import { useConnections } from '@/hooks/use-connections';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Settings as SettingsIcon } from 'lucide-react'; // Renamed Settings to SettingsIcon to avoid conflict
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const { connections, addConnection, removeConnection, isLoading } = useConnections();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
      </div>

      <Alert variant="destructive" className="max-w-3xl">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Warning</AlertTitle>
        <AlertDescription>
          Storing Azure credentials (Client ID, Client Secret) in browser localStorage is highly insecure and intended for local development/demonstration purposes only. 
          Do not use this method in production environments. Credentials should be managed by a secure backend system.
        </AlertDescription>
      </Alert>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Add New Azure Tenant Connection</CardTitle>
          <CardDescription>Configure connections to your Azure tenants for compliance monitoring. Credentials are stored locally in your browser.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewConnectionForm onAddConnection={addConnection} />
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Managed Connections</CardTitle>
          <CardDescription>View and manage your configured Azure tenant connections.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ) : (
            <ConnectionList connections={connections} onDeleteConnection={removeConnection} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
