
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { AzureConnectionInput, AzureConnectionClient } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const connectionFormSchema = z.object({
  name: z.string().min(1, 'Connection name is required').max(50, 'Name can be at most 50 characters'),
  tenantId: z.string().uuid('Invalid Azure Tenant ID format (must be a UUID)'),
  clientId: z.string().uuid('Invalid Application (Client) ID format (must be a UUID)'),
  authMethod: z.enum(['clientSecret', 'oidcFederated'], {
    required_error: "You must select an authentication method.",
  }),
  clientSecret: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.authMethod === 'clientSecret') {
    if (!data.clientSecret || data.clientSecret.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['clientSecret'],
        message: 'Client Secret is required for Client Secret authentication.',
      });
    } else if (data.clientSecret.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['clientSecret'],
        message: 'Client Secret must be at least 10 characters.',
      });
    } else if (data.clientSecret.length > 128) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['clientSecret'],
            message: 'Client Secret too long (max 128 characters).',
        });
    }
  }
});

type ConnectionFormValues = z.infer<typeof connectionFormSchema>;

interface NewConnectionFormProps {
  onAddConnection: (connection: AzureConnectionInput) => Promise<AzureConnectionClient | undefined>;
  keyVaultUnavailable?: boolean;
}

export function NewConnectionForm({ onAddConnection, keyVaultUnavailable }: NewConnectionFormProps) {
  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionFormSchema),
    defaultValues: {
      name: '',
      tenantId: '',
      clientId: '',
      authMethod: 'clientSecret', // Default to client secret
      clientSecret: '',
    },
  });

  const authMethod = form.watch('authMethod');

  async function onSubmit(data: ConnectionFormValues) {
    if (keyVaultUnavailable) {
      console.warn("Attempted to add connection while Key Vault is unavailable.");
    }
    
    const submissionData: AzureConnectionInput = {
        name: data.name,
        tenantId: data.tenantId,
        clientId: data.clientId,
        authMethod: data.authMethod,
    };

    if (data.authMethod === 'clientSecret') {
        submissionData.clientSecret = data.clientSecret;
    }
    // If oidcFederated, clientSecret is not included

    try {
      const newConnectionClientData = await onAddConnection(submissionData);
      if (newConnectionClientData) { 
        form.reset(); 
        form.setValue('authMethod', 'clientSecret'); // Reset radio group to default
      }
    } catch (error) {
      console.error("Error in onSubmit NewConnectionForm:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Contoso Production Tenant" {...field} />
              </FormControl>
              <FormDescription>A friendly name to identify this Azure tenant connection.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Azure Tenant ID</FormLabel>
              <FormControl>
                <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application (Client) ID</FormLabel>
              <FormControl>
                <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} />
              </FormControl>
              <FormDescription>The Client ID of the Azure AD App Registration (Service Principal).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Authentication Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="clientSecret" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Client Secret
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="oidcFederated" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      OIDC Federated Credential (Workload Identity)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Choose how this application will authenticate to the Azure tenant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {authMethod === 'clientSecret' && (
          <FormField
            control={form.control}
            name="clientSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Secret Value</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter Client Secret Value" {...field} />
                </FormControl>
                <FormDescription className="text-accent">
                  This secret will be securely stored in Azure Key Vault.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
         {authMethod === 'oidcFederated' && (
           <FormDescription className="text-sm text-muted-foreground pt-2">
            For OIDC Federated Credentials, ensure your Azure AD App Registration is configured for federated identity and this application runs in an environment supporting workload identity (e.g., Azure Kubernetes Service, GitHub Actions). No client secret is needed.
          </FormDescription>
        )}


        {form.formState.errors["_form" as any] && 
         !((form.formState.errors["_form" as any] as any).message.includes("AZURE_KEYVAULT_URI")) && (
          <p className="text-sm font-medium text-destructive">
            {(form.formState.errors["_form"as any] as any).message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
          {form.formState.isSubmitting ? 'Adding...' : <><PlusCircle className="mr-2 h-4 w-4" /> Add Connection</>}
        </Button>
      </form>
    </Form>
  );
}

