import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activity.js';
import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configure multer for AI image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'ai-images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `ai-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Crop recommendation based on location and soil data
router.post('/recommend-crops', authenticate, logActivity, async (req, res) => {
  try {
    const { location, soilType, season, farmSize, experience } = req.body;

    // Mock AI recommendation logic
    const recommendations = generateCropRecommendations({
      location,
      soilType,
      season,
      farmSize,
      experience,
      userRole: req.user.role
    });

    // Save recommendation to database
    for (const rec of recommendations) {
      await prisma.aiRecommendation.create({
        data: {
          userId: req.user.id,
          type: 'crop',
          title: rec.crop,
          description: rec.reason,
          confidence: rec.confidence,
          data: JSON.stringify(rec)
        }
      });
    }

    res.json({ recommendations });
  } catch (error) {
    logger.error('Crop recommendation error:', error);
    res.status(500).json({ error: 'Failed to generate crop recommendations' });
  }
});

// Crop disease detection from image
router.post('/detect-disease', authenticate, upload.single('image'), logActivity, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const { cropType } = req.body;

    // Mock disease detection (in real app, would use ML model)
    const detection = detectCropDisease(req.file.filename, cropType);

    // Clean up uploaded file after processing
    setTimeout(() => {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }, 60000); // Delete after 1 minute

    res.json({ detection });
  } catch (error) {
    logger.error('Disease detection error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to detect disease' });
  }
});

// Get AI suggestions for farmers
router.get('/suggestions', authenticate, async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;

    const where = {
      userId: req.user.id,
      isActive: true,
      ...(type && { type })
    };

    const suggestions = await prisma.aiRecommendation.findMany({
      where,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({ suggestions });
  } catch (error) {
    logger.error('Get suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Generate yield prediction
router.post('/predict-yield', authenticate, logActivity, async (req, res) => {
  try {
    const { cropType, farmSize, soilQuality, irrigation, fertilizer, weather } = req.body;

    // Mock yield prediction
    const prediction = predictCropYield({
      cropType,
      farmSize,
      soilQuality,
      irrigation,
      fertilizer,
      weather
    });

    res.json({ prediction });
  } catch (error) {
    logger.error('Yield prediction error:', error);
    res.status(500).json({ error: 'Failed to predict yield' });
  }
});

// Get preventive tips for experts dashboard
router.get('/preventive-tips', authenticate, async (req, res) => {
  try {
    if (!['EXPERT', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { category, season } = req.query;

    const tips = getPreventiveTips(category, season);

    res.json({ tips });
  } catch (error) {
    logger.error('Get preventive tips error:', error);
    res.status(500).json({ error: 'Failed to fetch preventive tips' });
  }
});

// Helper functions for AI logic (mock implementations)
const generateCropRecommendations = (params) => {
  const { location, soilType, season, farmSize, experience } = params;

  const crops = {
    'winter': ['wheat', 'barley', 'peas', 'mustard'],
    'summer': ['rice', 'cotton', 'sugarcane', 'maize'],
    'monsoon': ['rice', 'cotton', 'pulses', 'vegetables']
  };

  const seasonCrops = crops[season] || crops['summer'];
  
  return seasonCrops.map(crop => ({
    crop,
    suitability: Math.random() * 40 + 60, // 60-100%
    confidence: Math.random() * 30 + 70,  // 70-100%
    reason: `${crop} is well-suited for ${season} season in ${location} with ${soilType} soil.`,
    expectedYield: `${Math.floor(Math.random() * 20 + 10)} quintals per acre`,
    growthPeriod: `${Math.floor(Math.random() * 60 + 90)} days`,
    investmentRequired: `₹${Math.floor(Math.random() * 50000 + 25000)} per acre`
  }));
};

const detectCropDisease = (imageFilename, cropType) => {
  // Mock disease detection results
  const diseases = [
    {
      disease: 'Late Blight',
      confidence: 85,
      severity: 'high',
      description: 'Fungal infection affecting leaves and stems',
      treatment: 'Apply copper-based fungicide immediately',
      prevention: 'Ensure proper spacing and ventilation'
    },
    {
      disease: 'Powdery Mildew',
      confidence: 72,
      severity: 'medium',
      description: 'White powdery growth on leaf surfaces',
      treatment: 'Spray with neem oil or sulfur-based fungicide',
      prevention: 'Avoid overhead watering and improve air circulation'
    }
  ];

  return diseases[Math.floor(Math.random() * diseases.length)];
};

const predictCropYield = (params) => {
  const { cropType, farmSize, soilQuality, irrigation, fertilizer } = params;
  
  const baseYield = {
    'rice': 25,
    'wheat': 30,
    'cotton': 20,
    'sugarcane': 60,
    'maize': 35
  };

  const base = baseYield[cropType] || 25;
  const qualityMultiplier = soilQuality === 'good' ? 1.2 : soilQuality === 'fair' ? 1.0 : 0.8;
  const irrigationMultiplier = irrigation === 'adequate' ? 1.1 : 0.9;
  const fertilizerMultiplier = fertilizer === 'optimal' ? 1.15 : 1.0;

  const predictedYield = base * qualityMultiplier * irrigationMultiplier * fertilizerMultiplier;
  const totalYield = predictedYield * farmSize;

  return {
    yieldPerAcre: Math.round(predictedYield * 10) / 10,
    totalYield: Math.round(totalYield * 10) / 10,
    unit: 'quintals',
    confidence: 78,
    factors: {
      soilQuality: qualityMultiplier,
      irrigation: irrigationMultiplier,
      fertilizer: fertilizerMultiplier
    }
  };
};

const getPreventiveTips = (category, season) => {
  const tipsByCategory = {
    'pest-control': [
      'Regular field monitoring for early pest detection',
      'Use pheromone traps for specific pests',
      'Encourage beneficial insects through habitat creation',
      'Rotate crops to break pest cycles'
    ],
    'disease-prevention': [
      'Maintain proper plant spacing for air circulation',
      'Use disease-resistant varieties when available',
      'Practice crop rotation to reduce soil-borne diseases',
      'Remove and destroy infected plant debris'
    ],
    'soil-health': [
      'Regular soil testing for nutrient levels',
      'Apply organic matter to improve soil structure',
      'Practice minimum tillage to preserve soil health',
      'Use cover crops to prevent soil erosion'
    ],
    'irrigation': [
      'Monitor soil moisture levels regularly',
      'Use drip irrigation for water efficiency',
      'Avoid overwatering to prevent root diseases',
      'Time irrigation based on crop growth stages'
    ]
  };

  return tipsByCategory[category] || tipsByCategory['pest-control'];
};

export default router;