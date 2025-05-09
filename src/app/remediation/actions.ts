// src/app/remediation/actions.ts
"use server";

import { getRemediationSuggestions, type RemediationAssistantInput, type RemediationAssistantOutput } from "@/ai/flows/remediation-assistant";
import { z } from "zod";

const RemediationFormSchema = z.object({
  policyViolationDescription: z.string().min(10, "Policy violation description must be at least 10 characters long.").max(2000, "Description too long."),
  resourceDetails: z.string().max(2000, "Resource details too long.").optional(),
});

export type RemediationFormState = {
  message: string | null;
  suggestions: string | null;
  success?: boolean;
  errors?: {
    policyViolationDescription?: string[];
    resourceDetails?: string[];
    _form?: string[];
  };
};

export async function generateRemediation(
  prevState: RemediationFormState | undefined, // Allow undefined for initial state
  formData: FormData
): Promise<RemediationFormState> {
  const validatedFields = RemediationFormSchema.safeParse({
    policyViolationDescription: formData.get("policyViolationDescription"),
    resourceDetails: formData.get("resourceDetails"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid input. Please check the fields.",
      suggestions: null,
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: RemediationAssistantInput = {
      policyViolationDescription: validatedFields.data.policyViolationDescription,
      resourceDetails: validatedFields.data.resourceDetails || undefined, // Pass undefined if empty
    };
    const result: RemediationAssistantOutput = await getRemediationSuggestions(input);
    return {
      message: "Suggestions generated successfully!",
      suggestions: result.remediationSuggestions,
      success: true,
    };
  } catch (error) {
    console.error("Error generating remediation suggestions:", error);
    let errorMessage = "Failed to generate suggestions due to an unexpected error. Please try again.";
    if (error instanceof Error) {
        errorMessage = `Failed to generate suggestions: ${error.message}. Please try again.`;
    }
    return {
      message: errorMessage,
      suggestions: null,
      success: false,
      errors: { _form: [errorMessage] }
    };
  }
}
