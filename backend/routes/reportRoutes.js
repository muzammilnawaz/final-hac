import express from 'express';
import streamifier from 'streamifier';
import { protect } from '../middleware/middleware.js'; // Sahi path
import upload from '../config/multer.js';
import cloudinary from '../config/cloudinary.js';
import { analyzeMedicalReport } from '../utils/geminiHelper.js';
import Report from '../model/reportModel.js'; // Sahi path

const router = express.Router();

// POST /api/v1/reports/upload
router.post('/upload', protect, upload.single('reportFile'), async (req, res, next) => {
    if (!req.file) {
      // file na hone pe error
      res.status(400);
      return next(new Error('Please upload a file.'));
    }

    // req.body se reportName aur memberId nikalein
    const { reportName, memberId } = req.body;

    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'healthmate_reports' },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary Error:', error);
            return next(new Error('Cloudinary upload failed'));
          }
          const { secure_url, public_id } = result;

          try {
            // 2. Gemini se analyze karo
            const aiData = await analyzeMedicalReport(req.file.buffer, req.file.mimetype);
            
            // 3. Database mein save karo
            const report = new Report({
              user: req.user._id,
              reportName: reportName || 'Untitled Report',
              fileUrl: secure_url,
              filePublicId: public_id,
              aiSummary: aiData.summary,
              aiRomanUrdu: aiData.romanUrdu,
              doctorQuestions: aiData.doctorQuestions,
              foodSuggestions: aiData.foodSuggestions,
              remedies: aiData.remedies,
              member: memberId, // YAHAN MEMBERID ADD HUA HAI
            });

            const createdReport = await report.save();
            res.status(201).json(createdReport);

          } catch (aiError) {
             // Agar AI fail ho tou bhi file upload ho chuki hai, usay delete karein
             await cloudinary.uploader.destroy(public_id);
             console.error('AI Error:', aiError);
             next(new Error('AI analysis failed. Please try again.'));
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (err) {
      next(err); // Error ko central handler ko bhejein
    }
  }
);

// GET /api/v1/reports (Filter by member)
router.get('/', protect, async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    // Agar query mein memberId hai, tou sirf us member ke reports bhejein
    if (req.query.memberId) {
      filter.member = req.query.memberId;
    }
    // Agar ?self=true hai, tou woh reports jinka koi member nahi (user ke apne)
    if (req.query.self === 'true') {
        filter.member = { $exists: false };
    }

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/reports/:id (Single report)
router.get('/:id', protect, async (req, res, next) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
    if (report) {
      res.json(report);
    } else {
      res.status(404);
      throw new Error('Report not found');
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/reports/:id (Delete report)
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user._id });

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        // 1. Cloudinary se file delete karein
        await cloudinary.uploader.destroy(report.filePublicId);
        
        // 2. Database se report delete karein
        await report.deleteOne();

        res.json({ message: 'Report removed' });
    } catch (error) {
        next(error);
    }
});


export default router;