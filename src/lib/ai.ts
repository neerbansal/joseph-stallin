/**
 * AI Module
 *
 * This is a prepared interface for future AI integration (e.g., Groq).
 * Currently, it returns mock data.
 */

const mockDialogs = [
  "Hmph, it's not like I wanted you to drag me!",
  "Don't touch me! ...b-baka.",
  "Are you even paying attention to the terminal?!",
  "Ugh, I guess I can stay here. But don't get the wrong idea!",
  "You're so slow! Hurry up and type something.",
];

export async function generateRoselineReply(event: string): Promise<string> {
  console.log(`[AI] Generating reply for event: ${event}`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const randomIndex = Math.floor(Math.random() * mockDialogs.length);
  return mockDialogs[randomIndex];
}
