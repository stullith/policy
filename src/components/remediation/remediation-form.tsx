'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateRemediation, type RemediationFormState } from '@/app/remediation/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wand2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: RemediationFormState = {
  message: null,
  suggestions: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Get Remediation Suggestions
    </Button>
  );
}

export function RemediationForm() {
  const [state, formAction] = useFormState(generateRemediation, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && !state.errors) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
  }, [state, toast]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Wand2 className="h-7 w-7 text-primary" />
            AI Remediation Assistant
          </CardTitle>
          <CardDescription>
            Describe the Azure Policy violation and provide resource details to get AI-powered remediation suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="policyViolationDescription" className="text-base font-medium">Policy Violation Description</Label>
            <Textarea
              id="policyViolationDescription"
              name="policyViolationDescription"
              placeholder="e.g., 'Virtual machines should have disks encrypted with customer-managed keys.'"
              rows={5}
              required
              className="text-base"
            />
            {state?.errors?.policyViolationDescription && (
              <p className="text-sm text-destructive">{state.errors.policyViolationDescription.join(', ')}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="resourceDetails" className="text-base font-medium">Resource Details (Optional)</Label>
            <Textarea
              id="resourceDetails"
              name="resourceDetails"
              placeholder="e.g., 'VM Name: myVM, Resource Group: myRG, Subscription ID: xxxxx-xxxx-xxxx'"
              rows={3}
              className="text-base"
            />
            {state?.errors?.resourceDetails && (
              <p className="text-sm text-destructive">{state.errors.resourceDetails.join(', ')}</p>
            )}
          </div>
          
          {state?.errors?._form && (
             <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
             </Alert>
           )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>

      {state?.suggestions && (
        <CardContent className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-accent" />
            Suggested Remediations
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 p-4 rounded-md whitespace-pre-wrap text-sm">
            {state.suggestions}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
