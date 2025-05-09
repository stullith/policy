
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AzureConnectionClient, AzureConnectionInput } from '@/lib/types';
import { 
  addAzureConnectionToKeyVault, 
  getAzureConnectionsFromKeyVault, 
  deleteAzureConnectionFromKeyVault 
} from '@/app/settings/keyvault-actions';
import { useToast } from './use-toast';


export function useConnections() {
  const [connections, setConnections] = useState<AzureConnectionClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConnections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedConnections = await getAzureConnectionsFromKeyVault();
      setConnections(fetchedConnections);
    } catch (err) {
      console.error("Failed to load connections from Key Vault:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        title: "Error Loading Connections",
        description: errorMessage,
        variant: "destructive",
      });
      setConnections([]); // Clear connections on error
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const addConnection = useCallback(async (newConnectionData: AzureConnectionInput) => {
    setIsLoading(true); // Or a specific adding state
    setError(null);
    try {
      const newConnectionClientData = await addAzureConnectionToKeyVault(newConnectionData);
      setConnections((prevConnections) => [...prevConnections, newConnectionClientData]);
      toast({
        title: "Connection Added",
        description: `Connection "${newConnectionData.name}" has been successfully added and stored in Azure Key Vault.`,
      });
      return newConnectionClientData; // Return the client-safe data
    } catch (err) {
      console.error("Failed to add connection via Key Vault:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while adding connection.';
      setError(errorMessage); // Set general error state
      toast({
        title: "Error Adding Connection",
        description: errorMessage,
        variant: "destructive",
      });
      throw err; // Re-throw to be caught by form if necessary
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const removeConnection = useCallback(async (connectionId: string) => {
    // Optional: Add a specific loading state for deletion
    setError(null);
    const connectionToRemove = connections.find(c => c.id === connectionId);
    try {
      await deleteAzureConnectionFromKeyVault(connectionId);
      setConnections((prevConnections) => prevConnections.filter(conn => conn.id !== connectionId));
      toast({
        title: "Connection Removed",
        description: `Connection "${connectionToRemove?.name || connectionId}" has been successfully removed from Azure Key Vault.`,
      });
    } catch (err) {
      console.error("Failed to remove connection via Key Vault:", err);
       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while removing connection.';
      setError(errorMessage);
      toast({
        title: "Error Removing Connection",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [connections, toast]);


  return {
    connections,
    addConnection,
    removeConnection,
    isLoading,
    error,
    retryFetch: fetchConnections, // Expose a retry mechanism
  };
}
