
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AIConfigurationClient, AIBackendConfigInput } from '@/lib/types';
import { saveAIConfiguration, getAIConfiguration } from '@/app/settings/ai-config-actions';
import { useToast } from './use-toast';

export function useAIConfiguration() {
  const [config, setConfig] = useState<AIConfigurationClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedConfig = await getAIConfiguration();
      setConfig(fetchedConfig ?? { type: 'default' }); // Ensure config is not null, default if needed
    } catch (err) {
      console.error("Failed to load AI configuration:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while loading AI configuration.';
      setError(errorMessage);
      toast({
        title: "Error Loading AI Configuration",
        description: errorMessage,
        variant: "destructive",
      });
      setConfig({ type: 'default' }); // Fallback to default on error
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateConfig = useCallback(async (newConfigData: AIBackendConfigInput): Promise<AIConfigurationClient | undefined> => {
    setIsLoading(true); 
    setError(null);
    try {
      const savedConfigClient = await saveAIConfiguration(newConfigData);
      setConfig(savedConfigClient);
      toast({
        title: "AI Configuration Saved",
        description: `AI backend configuration has been successfully updated.`,
      });
      return savedConfigClient;
    } catch (err) {
      console.error("Failed to save AI configuration:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while saving AI configuration.';
      setError(errorMessage); // Set general error state
      toast({
        title: "Error Saving AI Configuration",
        description: errorMessage,
        variant: "destructive",
      });
      throw err; // Re-throw for form error handling
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    config,
    updateConfig,
    isLoading,
    error,
    retryFetch: fetchConfig,
  };
}
