import { NextApiRequest, NextApiResponse } from "next";
import { NextFunction, UnauthorizedException, createMiddlewareDecorator } from "next-api-decorators";

export const X_ZOOM_HEADER = 'x-zoom';
export const X_ZOOM_HEADER_VALUE = 'viss';

export const XZoomHeaderGuard = createMiddlewareDecorator(
  (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    if (!req.headers[X_ZOOM_HEADER] || 
      req.headers[X_ZOOM_HEADER] !== X_ZOOM_HEADER_VALUE) {

      throw new UnauthorizedException('X-Zoom header not set');
    }

    next();
  }
);