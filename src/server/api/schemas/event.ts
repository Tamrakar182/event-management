import { z } from "zod";

export const eventSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  totalParticipants: z.number().min(1, "At least one participant is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export const createEventSchema = eventSchema.omit({ id: true });

export const updateEventSchema = eventSchema;
