// use server'
'use server';

/**
 * @fileOverview Generates personalized tips for maintaining credential security based on user activity.
 *
 * - generateCredentialSecurityHint - A function that generates credential security hints.
 * - CredentialSecurityHintInput - The input type for the generateCredentialSecurityHint function.
 * - CredentialSecurityHintOutput - The return type for the generateCredentialSecurityHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CredentialSecurityHintInputSchema = z.object({
  userActivity: z
    .string()
    .describe(
      'A description of the user\'s recent activity related to logins and account management.'
    ),
});
export type CredentialSecurityHintInput = z.infer<typeof CredentialSecurityHintInputSchema>;

const CredentialSecurityHintOutputSchema = z.object({
  hint: z.string().describe('A personalized tip for improving credential security.'),
});
export type CredentialSecurityHintOutput = z.infer<typeof CredentialSecurityHintOutputSchema>;

export async function generateCredentialSecurityHint(
  input: CredentialSecurityHintInput
): Promise<CredentialSecurityHintOutput> {
  return credentialSecurityHintFlow(input);
}

const credentialSecurityHintPrompt = ai.definePrompt({
  name: 'credentialSecurityHintPrompt',
  input: {schema: CredentialSecurityHintInputSchema},
  output: {schema: CredentialSecurityHintOutputSchema},
  prompt: `You are a security expert providing personalized advice to users based on their recent activity.

  Based on the following user activity:
  {{{userActivity}}}

  Generate a single, actionable tip to improve their credential security.  The tip should be concise and easy to understand.
  If the user activity contains no activities related to credential security, suggest a password update.
  `,
});

const credentialSecurityHintFlow = ai.defineFlow(
  {
    name: 'credentialSecurityHintFlow',
    inputSchema: CredentialSecurityHintInputSchema,
    outputSchema: CredentialSecurityHintOutputSchema,
  },
  async input => {
    const {output} = await credentialSecurityHintPrompt(input);
    return output!;
  }
);
