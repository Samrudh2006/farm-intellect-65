import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';

export const logActivity = async (req, res, next) => {
  // Store original end function
  const originalEnd = res.end;
  
  res.end = function(...args) {
    // Log activity after response is sent
    if (req.user && req.method !== 'GET') {
      setImmediate(async () => {
        try {
          await prisma.activity.create({
            data: {
              userId: req.user.id,
              action: `${req.method} ${req.originalUrl}`,
              description: `${req.method} request to ${req.originalUrl}`,
              ipAddress: req.ip || req.connection.remoteAddress,
              userAgent: req.get('User-Agent'),
              metadata: JSON.stringify({
                body: req.body,
                params: req.params,
                query: req.query
              })
            }
          });
        } catch (error) {
          logger.error('Failed to log activity:', error);
        }
      });
    }
    
    // Call original end function
    originalEnd.apply(this, args);
  };
  
  next();
};