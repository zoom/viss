import { NextApiRequest, NextApiResponse } from "next";
import { createMiddlewareDecorator, NextFunction } from "next-api-decorators";

export const AllowCORS = createMiddlewareDecorator(
  (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    res.setHeader("access-control-allow-origin", '*');

    next();
  }
);