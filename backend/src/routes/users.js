import express from 'express';
import { authenticate } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(location && { location })
      },
      include: {
        farmerProfile: true,
        merchantProfile: true,
        expertProfile: true
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get farmers (for merchants and experts)
router.get('/farmers', authenticate, async (req, res) => {
  try {
    if (!['MERCHANT', 'EXPERT', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { search, location, cropType, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      role: 'FARMER',
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(location && { location: { contains: location, mode: 'insensitive' } })
    };

    const farmers = await prisma.user.findMany({
      where,
      include: {
        farmerProfile: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        isVerified: true,
        createdAt: true,
        farmerProfile: {
          select: {
            farmSize: true,
            cropTypes: true,
            experience: true,
            latitude: true,
            longitude: true
          }
        }
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where });

    res.json({
      farmers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get farmers error:', error);
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

export default router;