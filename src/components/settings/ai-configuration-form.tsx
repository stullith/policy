
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AIBackendConfigInput, AIConfigurationClient, AIBackendType, AzureOpenAIConfigClient, VertexAIConfigClient } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Save, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

const aiConfigFormSchema = z.object({
  type: z.custom<AIBackendType>(val => ['default', 'azure_openai', 'vertex_ai'].includes(val as string), 'Invalid AI backend type'),
  azureOpenAIEndpoint: z.string().optional(),
  azureOpenAIDeploymentName: z.string().optional(),
  azureOpenAIApiKey: z.string().optional(),
  vertexAIProjectId: z.string().optional(),
  vertexAILocation: z.string().optional(),
  vertexAIModelId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'azure_openai') {
    if (!data.azureOpenAIEndpoint?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['azureOpenAIEndpoint'], message: 'Azure OpenAI Endpoint is required.' });
    }
    if (!data.azureOpenAIDeploymentName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['azureOpenAIDeploymentName'], message: 'Azure OpenAI Deployment Name is required.' });
    }
  } else if (data.type === 'vertex_ai') {
    if (!data.vertexAIProjectId?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['vertexAIProjectId'], message: 'Vertex AI Project ID is required.' });
    }
    if (!data.vertexAILocation?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['vertexAILocation'], message: 'Vertex AI Location is required.' });
    }
    if (!data.vertexAIModelId?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['vertexAIModelId'], message: 'Vertex AI Model ID is required.' });
    }
  }
});

type AIConfigFormValues = z.infer<typeof aiConfigFormSchema>;

interface AIConfigurationFormProps {
  currentConfig: AIConfigurationClient | null;
  onSaveConfiguration: (config: AIBackendConfigInput) => Promise<AIConfigurationClient | undefined>;
  isLoading: boolean; 
  keyVaultUnavailable?: boolean;
}

export function AIConfigurationForm({ currentConfig, onSaveConfiguration, isLoading, keyVaultUnavailable }: AIConfigurationFormProps) {
  const form = useForm<AIConfigFormValues>({
    resolver: zodResolver(aiConfigFormSchema),
  });

  const selectedBackendType = form.watch('type');
  const [showApiKeyField, setShowApiKeyField] = useState(false);

  useEffect(() => {
    const conf = currentConfig || { type: 'default' }; 
    form.reset({
      type: conf.type,
      azureOpenAIEndpoint: conf.type === 'azure_openai' ? (conf as AzureOpenAIConfigClient).endpoint : '',
      azureOpenAIDeploymentName: conf.type === 'azure_openai' ? (conf as AzureOpenAIConfigClient).deploymentName : '',
      azureOpenAIApiKey: '', 
      vertexAIProjectId: conf.type === 'vertex_ai' ? (conf as VertexAIConfigClient).projectId : '',
      vertexAILocation: conf.type === 'vertex_ai' ? (conf as VertexAIConfigClient).location : '',
      vertexAIModelId: conf.type === 'vertex_ai' ? (conf as VertexAIConfigClient).modelId : '',
    });
    setShowApiKeyField(false); 
  }, [currentConfig, form]);


  async function onSubmit(data: AIConfigFormValues) {
    if (keyVaultUnavailable) {
       form.setError("_form" as any, { // Using "any" for _form to avoid excessive type wrestling
        type: "manual",
        message: "Cannot save configuration: Azure Key Vault is not configured."
      });
      return;
    }

    const submissionData: AIBackendConfigInput = { ...data };

    if (data.type === 'azure_openai') {
      if (!showApiKeyField && currentConfig?.type === 'azure_openai' && (currentConfig as AzureOpenAIConfigClient).isApiKeySet) {
        submissionData.azureOpenAIApiKey = undefined;
      }
    }

    try {
      await onSaveConfiguration(submissionData);
    } catch (error) {
      console.error("Error in AIConfigurationForm onSubmit:", error);
       if (error instanceof Error) {
        form.setError("_form" as any, { type: "manual", message: error.message });
      }
    }
  }

  const isApiKeyCurrentlySet = currentConfig?.type === 'azure_openai' && (currentConfig as AzureOpenAIConfigClient).isApiKeySet;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Backend Type</FormLabel>
              <Select
                disabled={keyVaultUnavailable}
                onValueChange={(newTypeValue) => {
                  const newType = newTypeValue as AIBackendType;
                  field.onChange(newType);
                  setShowApiKeyField(false);
                  form.reset({
                    type: newType,
                    azureOpenAIEndpoint: (newType === 'azure_openai' && currentConfig?.type === 'azure_openai') ? (currentConfig as AzureOpenAIConfigClient).endpoint : '',
                    azureOpenAIDeploymentName: (newType === 'azure_openai' && currentConfig?.type === 'azure_openai') ? (currentConfig as AzureOpenAIConfigClient).deploymentName : '',
                    azureOpenAIApiKey: '', 
                    vertexAIProjectId: (newType === 'vertex_ai' && currentConfig?.type === 'vertex_ai') ? (currentConfig as VertexAIConfigClient).projectId : '',
                    vertexAILocation: (newType === 'vertex_ai' && currentConfig?.type === 'vertex_ai') ? (currentConfig as VertexAIConfigClient).location : '',
                    vertexAIModelId: (newType === 'vertex_ai' && currentConfig?.type === 'vertex_ai') ? (currentConfig as VertexAIConfigClient).modelId : '',
                  });
                  form.trigger(); 
                }}
                value={field.value || 'default'} 
              >
                <FormControl>
                  <SelectTrigger disabled={keyVaultUnavailable}><SelectValue placeholder="Select AI Backend" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="default">Default (Google Gemini - Public API)</SelectItem>
                  <SelectItem value="azure_openai">Private Azure OpenAI</SelectItem>
                  <SelectItem value="vertex_ai">Private Google Cloud Vertex AI</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the AI backend for remediation suggestions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedBackendType === 'azure_openai' && (
          <>
            <FormField control={form.control} name="azureOpenAIEndpoint" render={({ field }) => (
                <FormItem>
                  <FormLabel>Azure OpenAI Endpoint</FormLabel>
                  <FormControl><Input placeholder="https://your-aoai-resource.openai.azure.com/" {...field} disabled={keyVaultUnavailable} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="azureOpenAIDeploymentName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Azure OpenAI Deployment Name (Model Name)</FormLabel>
                  <FormControl><Input placeholder="your-model-deployment-name" {...field} disabled={keyVaultUnavailable} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isApiKeyCurrentlySet && !showApiKeyField && (
              <Button type="button" variant="outline" size="sm" onClick={() => setShowApiKeyField(true)} disabled={keyVaultUnavailable}>
                Update API Key
              </Button>
            )}

            {(!isApiKeyCurrentlySet || showApiKeyField) && (
              <FormField control={form.control} name="azureOpenAIApiKey" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Azure OpenAI API Key {isApiKeyCurrentlySet && showApiKeyField ? "(Leave blank to keep existing)" : ""}</FormLabel>
                    <FormControl><Input type="password" placeholder={isApiKeyCurrentlySet ? "Enter new key to change" : "Enter API Key"} {...field} disabled={keyVaultUnavailable} /></FormControl>
                    <FormDescription className="text-muted-foreground">
                      {isApiKeyCurrentlySet && showApiKeyField ? "If you leave this blank, the existing API key will be retained. " : ""}
                      API Key will be stored securely in Azure Key Vault.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
             <Alert variant="default" className="border-accent mt-4">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">Using Managed Identity with Azure OpenAI</AlertTitle>
              <AlertDescription>
                If your Azure OpenAI service is configured for Microsoft Entra ID authentication,
                you might not need an API key. Ensure this application's Managed Identity has the 'Cognitive Services User' (or similar) role on your Azure OpenAI resource.
                If an API key is provided, it will be used. Otherwise, the application may attempt to use its Managed Identity.
              </AlertDescription>
            </Alert>
          </>
        )}

        {selectedBackendType === 'vertex_ai' && (
          <>
            <FormField control={form.control} name="vertexAIProjectId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Cloud Project ID</FormLabel>
                  <FormControl><Input placeholder="your-gcp-project-id" {...field} disabled={keyVaultUnavailable} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="vertexAILocation" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vertex AI Location</FormLabel>
                  <FormControl><Input placeholder="e.g., us-central1" {...field} disabled={keyVaultUnavailable} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="vertexAIModelId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vertex AI Model ID</FormLabel>
                  <FormControl><Input placeholder="e.g., gemini-1.5-flash-001" {...field} disabled={keyVaultUnavailable} /></FormControl>
                  <FormDescription>Ensure this application's service account (if applicable) or compute environment has 'Vertex AI User' permissions on the project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {form.formState.errors["_form" as any] && (
          <p className="text-sm font-medium text-destructive">
            {(form.formState.errors["_form" as any] as any).message}
          </p>
        )}
        <Button type="submit" disabled={isLoading || form.formState.isSubmitting || keyVaultUnavailable} className="w-full sm:w-auto">
          {isLoading || form.formState.isSubmitting ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save AI Configuration</>}
        </Button>
      </form>
    </Form>
  );
}
