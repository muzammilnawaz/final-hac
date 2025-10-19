import express from 'express';
import streamifier from 'streamifier';
import { protect } from '../middleware/middleware.js'; // Verify path
import upload from '../config/multer.js';
import cloudinary from '../config/cloudinary.js';
import { analyzeMedicalReport } from '../utils/geminiHelper.js';
import Report from '../model/reportModel.js'; // Verify path

const router = express.Router();

// POST /api/v1/reports/upload
router.post('/upload', protect, upload.single('reportFile'), async (req, res, next) => {
    if (!req.file) {
      const err = new Error('Please upload a file.');
      err.status = 400;
      return next(err);
    }
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
            const aiData = await analyzeMedicalReport(req.file.buffer, req.file.mimetype);
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
              member: memberId || undefined,
            });
            const createdReport = await report.save();
            res.status(201).json(createdReport);
          } catch (aiError) {
             await cloudinary.uploader.destroy(public_id);
             console.error('AI Error:', aiError);
             next(new Error('AI analysis failed. Please try again.'));
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (err) {
      next(err);
    }
});

// GET /api/v1/reports (Get all reports, filtered)
router.get('/', protect, async (req, res, next) => { // Path is '/'
  try {
    const filter = { user: req.user._id };
    if (req.query.memberId) filter.member = req.query.memberId;
    if (req.query.self === 'true') filter.member = { $exists: false };
    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/reports/:id (Get single report)
router.get('/:id', protect, async (req, res, next) => { // Path is '/:id'
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
    if (report) {
      res.json(report);
    } else {
      const err = new Error('Report not found');
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/reports/:id (Delete report)
router.delete('/:id', protect, async (req, res, next) => { // Path is '/:id'
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
        if (!report) {
            const err = new Error('Report not found');
            err.status = 404;
            return next(err);
        }
        await cloudinary.uploader.destroy(report.filePublicId);
        await report.deleteOne();
        res.json({ message: 'Report removed' });
    } catch (error) {
        next(error);
    }
});

export default router;