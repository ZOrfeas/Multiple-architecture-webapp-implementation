import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function getCustomLogger(controllerClassName: string) {
  const logger = new Logger(controllerClassName, true);
  return (req: Request, res: Response, next: NextFunction) => {
    logger.log(`${req.method} on ${req.path}`);
    next();
  };
}
