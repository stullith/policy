
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { AzureConnectionInput, AzureConnectionClient } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

const connectionFormSchema = z.object({
  name: z.string().min(1, 'Connection name is required').max(50, 'Name can be at most 50 characters'),
  tenantId: z.string().uuid('Invalid Azure Tenant ID format (must be a UUID)'),
  clientId: z.string().uuid('Invalid Application (Client) ID format (must be a UUID)'),
  clientSecret: z.string().min(10, 'Client Secret must be at least 10 characters').max(128, 'Client Secret too long'),
});

type ConnectionFormValues = z.infer<typeof connectionFormSchema>;

interface NewConnectionFormProps {
  onAddConnection: (connection: AzureConnectionInput) => Promise<AzureConnectionClient | undefined>;
  keyVaultUnavailable?: boolean; // Prop remains for potential internal logic, but UI warnings/disabling removed
}

export function NewConnectionForm({ onAddConnection, keyVaultUnavailable }: NewConnectionFormProps) {
  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionFormSchema),
    defaultValues: {
      name: '',
      tenantId: '',
      clientId: '',
      clientSecret: '',
    },
  });

  async function onSubmit(data: ConnectionFormValues) {
    if (keyVaultUnavailable) {
      // The server action will fail and the useConnections hook will show a toast.
      // No need for a specific form error here if the page already has a global warning.
      console.warn("Attempted to add connection while Key Vault is unavailable.");
      // Optionally, you might want to prevent the call if you know it will fail,
      // but the problem asks to remove UI warnings from options.
      // The server action itself will throw an error which the hook handles.
    }
    try {
      const newConnectionClientData = await onAddConnection(data);
      if (newConnectionClientData) { 
        form.reset(); 
      }
    } catch (error) {
      console.error("Error in onSubmit NewConnectionForm:", error);
      // Error is typically handled by the hook, but if specific form errors are needed from server:
      // if (error instanceof Error && !(error.message.includes("AZURE_KEYVAULT_URI environment variable is not set"))) {
      //   form.setError("_form" as any, { type: "manual", message: error.message });
      // }
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
              <FormMessage />
            </FormItem>
          )}
        />
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
                This secret will be securely stored in Azure Key Vault using your application's Managed Identity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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

