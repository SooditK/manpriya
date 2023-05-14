import { protectedProcedure, t } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const clientRouter = t.router({
  createClient: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        date: z.date(),
        invoice: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, date } = input;
      const { prisma, session } = ctx;
      const ifUserIsFromOren = session.email.includes("@orennow.com");
      if (!ifUserIsFromOren) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to do this",
        });
      } else {
        const newClient = await prisma.client.create({
          data: {
            name,
            email,
            invoice: input.invoice,
            billduedate: date,
            lastUpdatedBy: {
              connect: {
                email: session.email,
              },
            },
          },
        });
        return {
          id: newClient.id,
          name: newClient.name,
          email: newClient.email,
          success: true,
          message: "Client created successfully",
        };
      }
    }),

  allClients: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const allClients = await prisma.client.findMany({});
    return allClients;
  }),

  updateClient: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        date: z.date(),
        invoice: z.string(),
        sendemail: z.boolean().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, email, date, sendemail } = input;
      const { prisma, session } = ctx;
      const ifUserIsFromOren = session.email.includes("@orennow.com");
      if (!ifUserIsFromOren) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to do this",
        });
      } else {
        const findClient = await prisma.client.findUnique({
          where: { email },
        });
        if (!findClient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Client not found",
          });
        } else {
          const updateClient = await prisma.client.update({
            where: { id },
            data: {
              name,
              email,
              billduedate: date,
              sendemail,
              invoice: input.invoice,
              lastUpdatedBy: {
                connect: {
                  email: session.email,
                },
              },
            },
          });
          return {
            id: updateClient.id,
            name: updateClient.name,
            email: updateClient.email,
            success: true,
            message: "Client updated successfully",
          };
        }
      }
    }),

  sendEmail: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        sendemail: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, sendemail } = input;
      const { prisma, session } = ctx;
      const ifUserIsFromOren = session.email.includes("@orennow.com");
      if (!ifUserIsFromOren) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to do this",
        });
      } else {
        const findClient = await prisma.client.findUnique({
          where: { id },
        });
        if (!findClient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Client not found",
          });
        } else {
          const updateClient = await prisma.client.update({
            where: { id },
            data: {
              sendemail,
              lastUpdatedBy: {
                connect: {
                  email: session.email,
                },
              },
            },
          });
          return {
            id: updateClient.id,
            name: updateClient.name,
            email: updateClient.email,
            success: true,
            message: "Client updated successfully",
          };
        }
      }
    }),

  deleteClient: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { prisma, session } = ctx;
      const ifUserIsFromOren = session.email.includes("@orennow.com");
      if (!ifUserIsFromOren) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to do this",
        });
      } else {
        const findClient = await prisma.client.findUnique({
          where: { id },
        });
        if (!findClient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Client not found",
          });
        } else {
          const deleteClient = await prisma.client.delete({
            where: { id },
          });
          return {
            id: deleteClient.id,
            name: deleteClient.name,
            email: deleteClient.email,
            success: true,
            message: "Client deleted successfully",
          };
        }
      }
    }),
});
