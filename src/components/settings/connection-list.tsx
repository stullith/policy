
'use client';

import type { AzureConnectionClient } from '@/lib/types'; 
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, FileKey, Lock, Repeat } from 'lucide-react'; // Added Lock for Client Secret, Repeat for OIDC
import { Badge } from '@/components/ui/badge';

interface ConnectionListProps {
  connections: AzureConnectionClient[]; 
  onDeleteConnection: (id: string) => Promise<void>; 
  keyVaultUnavailable?: boolean;
}

export function ConnectionList({ connections, onDeleteConnection, keyVaultUnavailable }: ConnectionListProps) {

  if (connections.length === 0 && !keyVaultUnavailable) {
    return <p className="text-muted-foreground text-center py-4">No Azure tenant connections configured.</p>;
  }

  const handleDelete = async (connection: AzureConnectionClient) => {
    try {
      await onDeleteConnection(connection.id);
    } catch (error) {
      console.error("Error in handleDelete ConnectionList:", error);
    }
  };

  const getAuthMethodDisplay = (authMethod: 'clientSecret' | 'oidcFederated') => {
    switch (authMethod) {
      case 'clientSecret':
        return (
          <Badge variant="secondary" className="whitespace-nowrap">
            <Lock className="mr-1 h-3 w-3" />
            Client Secret
          </Badge>
        );
      case 'oidcFederated':
        return (
          <Badge variant="outline" className="whitespace-nowrap border-accent text-accent">
             <Repeat className="mr-1 h-3 w-3" />
            OIDC Federated
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] pl-4"><FileKey className="h-5 w-5 text-muted-foreground" /></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Tenant ID</TableHead>
            <TableHead>Client ID</TableHead>
            <TableHead>Auth Method</TableHead>
            <TableHead className="text-right pr-4 w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((conn) => (
            <TableRow key={conn.id}>
              <TableCell className="pl-4"><FileKey className="h-5 w-5 text-primary" /></TableCell>
              <TableCell className="font-medium">{conn.name}</TableCell>
              <TableCell className="truncate max-w-[200px] sm:max-w-xs">{conn.tenantId}</TableCell>
              <TableCell className="truncate max-w-[200px] sm:max-w-xs">{conn.clientId}</TableCell>
              <TableCell>{getAuthMethodDisplay(conn.authMethod)}</TableCell>
              <TableCell className="text-right pr-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Delete connection ${conn.name}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the connection "{conn.name}" from Azure Key Vault? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(conn)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive"
                      >
                        Delete Connection
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {connections.length === 0 && keyVaultUnavailable && (
         <p className="text-muted-foreground text-center py-4">Connections cannot be loaded because Azure Key Vault is not configured. Please check the warning at the top of the page.</p>
      )}
    </div>
  );
}

