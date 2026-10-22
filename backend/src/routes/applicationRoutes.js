const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// POST /api/applications - Apply for a Job (Protected)
router.post('/', auth, async (req, res, next) => {
  try {
    const { jobId, coverNote, resumeUrl, portfolioUrl } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    // Check if user already applied
    const existing = await Application.findOne({
      jobId,
      userId: req.user.id
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already applied for this position"
      });
    }

    const application = await Application.create({
      jobId,
      userId: req.user.id,
      status: "Submitted",
      coverNote: coverNote || "Excited about this opportunity!",
      resumeUrl: resumeUrl || "",
      portfolioUrl: portfolioUrl || ""
    });

    res.status(201).json({
      message: "Application Submitted",
      application
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/applications/my - Get current user's job applications (Protected)
router.get('/my', auth, async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

// GET /api/applications/job/:jobId - Get all applications for a specific job (Recruiter)
router.get('/job/:jobId', auth, async (req, res, next) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email skills title')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

// PUT /api/applications/:id/status - Update application status (Protected)
router.put('/:id/status', auth, async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Submitted', 'Under Review', 'Shortlisted', 'Interviewing', 'Accepted', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Status updated successfully",
      application: updated
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
