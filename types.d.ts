// types.d.ts
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

declare global {
  namespace Express {
    export interface Request<
      P = ParamsDictionary,
      ResBody = any,
      ReqBody = any,
      ReqQuery = ParsedQs,
      Locals = Record<string, any>
    > extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {}

    export interface Response<
      ResBody = any,
      Locals = Record<string, any>
    > extends Response<ResBody, Locals> {}
  }
}
