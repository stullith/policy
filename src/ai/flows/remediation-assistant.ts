// src/ai/flows/remediation-assistant.ts
'use server';

/**
 * @fileOverview A GenAI Remediation Assistant that suggests remediations for common Azure Policy violations.
 *
 * - getRemediationSuggestions - A function that takes a policy violation description and returns remediation suggestions.
 * - RemediationAssistantInput - The input type for the getRemediationSuggestions function.
 * - RemediationAssistantOutput - The return type for the getRemediationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemediationAssistantInputSchema = z.object({
  policyViolationDescription: z
    .string()
    .describe('A description of the Azure Policy violation.'),
  resourceDetails: z
    .string()
    .optional()
    .describe('Details about the non-compliant resource.'),
});
export type RemediationAssistantInput = z.infer<typeof RemediationAssistantInputSchema>;

const RemediationAssistantOutputSchema = z.object({
  remediationSuggestions: z
    .string()
    .describe('Suggested remediations for the policy violation.'),
});
export type RemediationAssistantOutput = z.infer<typeof RemediationAssistantOutputSchema>;

export async function getRemediationSuggestions(
  input: RemediationAssistantInput
): Promise<RemediationAssistantOutput> {
  return remediationAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'remediationAssistantPrompt',
  input: {schema: RemediationAssistantInputSchema},
  output: {schema: RemediationAssistantOutputSchema},
  prompt: `You are an Azure Policy remediation expert. Given a description of a policy violation and details about the resource, provide clear and concise remediation suggestions.

Policy Violation Description: {{{policyViolationDescription}}}
Resource Details: {{{resourceDetails}}}

Remediation Suggestions:`,
});

const remediationAssistantFlow = ai.defineFlow(
  {
    name: 'remediationAssistantFlow',
    inputSchema: RemediationAssistantInputSchema,
    outputSchema: RemediationAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
