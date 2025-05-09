
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { AzureConnectionInput, AzureConnectionClient } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
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
  keyVaultUnavailable?: boolean;
}

export function NewConnectionForm({ onAddConnection, keyVaultUnavailable }: NewConnectionFormProps) {
  // toast is now handled by useConnections hook upon success/failure of server action
  // const { toast } = useToast(); 
  
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
      // This case should ideally be prevented by disabling the button,
      // but as a safeguard:
      form.setError("_form" as any, { // Using "any" for _form to avoid excessive type wrestling for this specific case
        type: "manual",
        message: "Cannot add connection: Azure Key Vault is not configured."
      });
      // Optionally, show a toast here if desired, though the main page already warns.
      // toast({ title: "Operation Failed", description: "Azure Key Vault is not configured.", variant: "destructive" });
      return;
    }
    try {
      const newConnectionClientData = await onAddConnection(data);
      if (newConnectionClientData) { 
        form.reset(); 
      }
    } catch (error) {
      console.error("Error in onSubmit NewConnectionForm:", error);
      // Error is typically handled by the hook, but if specific form errors are needed:
      // if (error instanceof Error) {
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
                <Input placeholder="e.g., Contoso Production Tenant" {...field} disabled={keyVaultUnavailable} />
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
                <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} disabled={keyVaultUnavailable} />
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
                <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} disabled={keyVaultUnavailable} />
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
                <Input type="password" placeholder="Enter Client Secret Value" {...field} disabled={keyVaultUnavailable} />
              </FormControl>
              <FormDescription className="text-accent">
                This secret will be securely stored in Azure Key Vault using your application's Managed Identity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors["_form" as any] && (
          <p className="text-sm font-medium text-destructive">
            {(form.formState.errors["_form"as any] as any).message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting || keyVaultUnavailable} className="w-full sm:w-auto">
          {form.formState.isSubmitting ? 'Adding...' : <><PlusCircle className="mr-2 h-4 w-4" /> Add Connection</>}
        </Button>
      </form>
    </Form>
  );
}
