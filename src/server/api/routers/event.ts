import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { env } from "@/env";

import { createEventSchema, updateEventSchema } from "../schemas/event";

import { promises as fs } from "fs";
import { Event } from "@/types/events";

const readEvents = async (): Promise<Event[]> => {
  const data = await fs.readFile(env.FILE_PATH, "utf-8");
  return JSON.parse(data);
};

const writeEvents = async (events: Event[]) => {
  await fs.writeFile(env.FILE_PATH, JSON.stringify(events, null, 2));
};

export const eventRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const events = await readEvents();
    return events;
  }),

  create: publicProcedure
    .input(createEventSchema)
    .mutation(async ({ input }) => {
      const events = await readEvents();
      const newEvent = { ...input, id: Date.now().toString() };
      events.push(newEvent);
      await writeEvents(events);
      return newEvent;
    }),

  update: publicProcedure
    .input(updateEventSchema)
    .mutation(async ({ input }) => {
      const events = await readEvents();
      const index = events.findIndex((event) => event.id === input.id);
      if (index === -1) {
        throw new Error("Event not found");
      }
      events[index] = input;
      await writeEvents(events);
      return input;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      let events = await readEvents();
      events = events.filter((event) => event.id !== input.id);
      await writeEvents(events);
      return { success: true };
    }),
});
