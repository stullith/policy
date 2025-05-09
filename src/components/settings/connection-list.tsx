
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
  keyVaultUnavailable?: boolean;
}

export function ConnectionList({ connections, onDeleteConnection, keyVaultUnavailable }: ConnectionListProps) {

  if (connections.length === 0) {
    if (keyVaultUnavailable) {
      return <p className="text-muted-foreground text-center py-4">Azure Key Vault is not configured. Connections cannot be loaded or managed.</p>;
    }
    return <p className="text-muted-foreground text-center py-4">No Azure tenant connections configured in Key Vault.</p>;
  }

  const handleDelete = async (connection: AzureConnectionClient) => {
    if (keyVaultUnavailable) return; // Should be prevented by disabled button
    try {
      await onDeleteConnection(connection.id);
    } catch (error) {
      console.error("Error in handleDelete ConnectionList:", error);
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
                  <AlertDialogTrigger asChild disabled={keyVaultUnavailable}>
                    <Button variant="ghost" size="icon" aria-label={`Delete connection ${conn.name}`} disabled={keyVaultUnavailable}>
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
    </div>
  );
}
