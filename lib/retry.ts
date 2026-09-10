/**
 * Runs an async operation with exponential backoff.
 * Used for external calls (Supabase, Resend, WhatsApp) so a transient
 * network blip never loses a lead.
 */
export async function withBackoff<T>(
  operation: () => Promise<T>,
  { retries = 3, baseDelayMs = 400 }: { retries?: number; baseDelayMs?: number } = {},
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const delay = baseDelayMs * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
