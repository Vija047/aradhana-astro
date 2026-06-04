import { Annotation } from "@langchain/langgraph";

/**
 * Shared state schema for the AstroAgent workflow.
 * Uses Annotation.Root with reducer functions to determine how values merge on state updates.
 */
export const StateAnnotation = Annotation.Root({
  // Accumulates messages in the conversation (standard chat history)
  messages: Annotation({
    reducer: (left, right) => {
      const current = left ?? [];
      if (!right) return current;
      const updates = Array.isArray(right) ? right : [right];
      return [...current, ...updates];
    },
    default: () => [],
  }),

  // Keeps track of the user's geocoded birth details (e.g., date, time, latitude, longitude, timezone)
  userBirthDetails: Annotation({
    reducer: (left, right) => {
      return { ...(left ?? {}), ...(right ?? {}) };
    },
    default: () => ({}),
  }),

  // Accumulates outputs and summaries returned from all tools run in this execution loop
  toolOutputs: Annotation({
    reducer: (left, right) => {
      const current = left ?? [];
      if (!right) return current;
      const updates = Array.isArray(right) ? right : [right];
      return [...current, ...updates];
    },
    default: () => [],
  }),

  // Overwrites the current active user intent (e.g. "compute_birth_chart", "get_daily_transits", "knowledge_lookup", "chitchat", "safety_refusal")
  currentIntent: Annotation({
    reducer: (left, right) => right ?? left ?? "",
    default: () => "",
  })
});
