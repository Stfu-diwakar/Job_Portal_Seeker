const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// GET /api/jobs - List all jobs with optional filters
router.get('/', async (req, res, next) => {
  try {
    const { search, category, type, experience, location, featured } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (experience && experience !== 'All') {
      query.experienceLevel = experience;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Basic search in title or company or tags
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { company: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs/:id - Single job details
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
});

// POST /api/jobs - Create new job (Protected)
router.post('/', auth, async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      experienceLevel,
      category,
      tags,
      companyLogo,
      featured
    } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        message: "Title, company and description are required"
      });
    }

    const newJob = await Job.create({
      title,
      company,
      location: location || 'Remote',
      type: type || 'Full-Time',
      salary: salary || '$120,000 - $150,000',
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').map(r => r.trim()).filter(Boolean) : []),
      experienceLevel: experienceLevel || 'Mid Level',
      category: category || 'Engineering',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['React', 'Node.js']),
      companyLogo: companyLogo || '',
      featured: Boolean(featured),
      postedBy: req.user.id
    });

    res.status(201).json(newJob);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/jobs/:id - Delete job (Protected)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await Job.deleteMany({ _id: req.params.id });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
