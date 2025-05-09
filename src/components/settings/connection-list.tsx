
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
import { Trash2, FileKey } from 'lucide-react';

interface ConnectionListProps {
  connections: AzureConnectionClient[]; 
  onDeleteConnection: (id: string) => Promise<void>; 
  keyVaultUnavailable?: boolean; // Prop remains for potential internal logic
}

export function ConnectionList({ connections, onDeleteConnection, keyVaultUnavailable }: ConnectionListProps) {

  if (connections.length === 0 && !keyVaultUnavailable) { // Only show if KV is available but no connections
    return <p className="text-muted-foreground text-center py-4">No Azure tenant connections configured.</p>;
  }
  // If keyVaultUnavailable is true, the main page shows a warning.
  // The list might be empty due to KV issue or genuinely no connections.
  // The hook handles errors for loading connections.

  const handleDelete = async (connection: AzureConnectionClient) => {
    // Server action will handle failure if Key Vault is unavailable
    try {
      await onDeleteConnection(connection.id);
    } catch (error) {
      console.error("Error in handleDelete ConnectionList:", error);
      // Error is handled by the useConnections hook and displayed as a toast.
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
            <TableHead className="text-right pr-4 w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((conn) => (
            <TableRow key={conn.id}>
              <TableCell className="pl-4"><FileKey className="h-5 w-5 text-primary" /></TableCell>
              <TableCell className="font-medium">{conn.name}</TableCell>
              <TableCell className="truncate max-w-xs">{conn.tenantId}</TableCell>
              <TableCell className="truncate max-w-xs">{conn.clientId}</TableCell>
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

