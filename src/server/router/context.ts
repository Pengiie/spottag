import { PrismaClient } from '@prisma/client';
import { TRPCAbortError } from '@trpc/client';
import { NextApiResponse, NextApiRequest } from 'next';
import * as trpcNext from "@trpc/server/adapters/next";
import * as trpc from "@trpc/server"
import { prisma, Session } from "../db";

export interface Context {
  req: NextApiRequest,
  res: NextApiResponse,
  prisma: PrismaClient,
};

export const createContext = async (opts?: trpcNext.CreateNextContextOptions): Promise<Context> => {
  const { req, res } = { req: opts?.req!, res: opts?.res! };

  return {
    req,
    res,
    prisma
  }
}

export const createRouter = () => trpc.router<Context>();