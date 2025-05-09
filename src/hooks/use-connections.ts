
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AzureConnection {
  id: string;
  name: string;
  tenantId: string;
  clientId: string;
  clientSecret: string; // Reminder: Highly insecure to store in localStorage
}

const LOCAL_STORAGE_KEY = 'azureConnections';

// WARNING: SECURITY RISK
// Storing sensitive credentials like Client ID and Client Secret in localStorage
// is HIGHLY INSECURE and NOT SUITABLE for production environments.
// This implementation is for demonstration and local development purposes ONLY.
// In a real application, use a secure backend (e.g., server-side storage with encryption,
// or a secrets manager) to store and manage these credentials.
// Frontend applications should never directly handle or store client secrets.

export function useConnections() {
  const [connections, setConnections] = useState<AzureConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure localStorage is accessed only on the client side
    if (typeof window !== 'undefined') {
      try {
        const storedConnections = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedConnections) {
          setConnections(JSON.parse(storedConnections));
        }
      } catch (error) {
        console.error("Failed to load connections from localStorage:", error);
        // Optionally, clear corrupted data:
        // localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      setIsLoading(false);
    }
  }, []);

  const saveConnections = useCallback((updatedConnections: AzureConnection[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedConnections));
        setConnections(updatedConnections);
      } catch (error) {
        console.error("Failed to save connections to localStorage:", error);
      }
    }
  }, []);

  const addConnection = useCallback((newConnection: Omit<AzureConnection, 'id'>) => {
    const connectionWithId = { ...newConnection, id: crypto.randomUUID() };
    const updatedConnections = [...connections, connectionWithId];
    saveConnections(updatedConnections);
    return connectionWithId; // Return the new connection with ID
  }, [connections, saveConnections]);

  const removeConnection = useCallback((connectionId: string) => {
    const updatedConnections = connections.filter(conn => conn.id !== connectionId);
    saveConnections(updatedConnections);
  }, [connections, saveConnections]);

  // Placeholder for future update functionality
  // const updateConnection = useCallback((updatedConn: AzureConnection) => {
  //   const updatedConnections = connections.map(conn => conn.id === updatedConn.id ? updatedConn : conn);
  //   saveConnections(updatedConnections);
  // }, [connections, saveConnections]);

  return {
    connections,
    addConnection,
    removeConnection,
    isLoading,
    // updateConnection (if implemented)
  };
}
