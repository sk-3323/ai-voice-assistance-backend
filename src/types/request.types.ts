import { Request as ExpresesRequest } from "express";

export interface Request extends ExpresesRequest {
  admin?: boolean;
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UserUsage {
  bql: number;
  aql: number;
  bqu: number;
  aqu: number;
  plan: string;
}
