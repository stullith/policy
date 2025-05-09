
'use client';

import type { AzureConnectionClient } from '@/lib/types'; // Updated type
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
// Toast is now handled by useConnections hook
// import { useToast } from '@/hooks/use-toast'; 

interface ConnectionListProps {
  connections: AzureConnectionClient[]; // Updated type
  onDeleteConnection: (id: string) => Promise<void>; // Updated to be async
}

export function ConnectionList({ connections, onDeleteConnection }: ConnectionListProps) {
  // const { toast } = useToast(); // Toast is now handled by useConnections

  if (connections.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No Azure tenant connections configured in Key Vault.</p>;
  }

  const handleDelete = async (connection: AzureConnectionClient) => {
    try {
      await onDeleteConnection(connection.id);
      // Success toast is handled by useConnections hook
    } catch (error) {
      // Error toast is handled by useConnections hook
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
            {/* Client Secret column removed for security */}
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
              {/* Client Secret cell removed */}
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
    </div>
  );
}
