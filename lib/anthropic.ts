import Anthropic from "@anthropic-ai/sdk";

// Reads ANTHROPIC_API_KEY from the environment.
export const anthropic = new Anthropic();

// Default model for content generation. Swap to "claude-haiku-4-5" if you want
// a cheaper/faster model for these short, high-volume generations.
export const AI_MODEL = "claude-opus-4-8";
