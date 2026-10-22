const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedDatabase = async () => {
  console.log('[Seed] Seeding database with initial tech jobs and demo accounts...');
  
  // Clear existing records
  await User.deleteMany({});
  await Job.deleteMany({});
  await Application.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Demo Users
  const jobseeker = await User.create({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: hashedPassword,
    role: 'jobseeker',
    title: 'Senior Full Stack Developer',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker', 'GraphQL'],
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.'
  });

  const recruiter = await User.create({
    name: 'Sarah Connor',
    email: 'recruiter@techjobs.io',
    password: hashedPassword,
    role: 'recruiter',
    title: 'Head of Talent Acquisition',
    skills: ['Technical Recruiting', 'Talent Operations', 'HR Tech'],
    bio: 'Connecting exceptional engineers with hyper-growth engineering teams worldwide.'
  });

  // Seed Realistic Tech Jobs
  const jobsData = [
    {
      title: 'Senior Full-Stack Engineer (React + Node.js)',
      company: 'Stripe',
      location: 'San Francisco, CA (Hybrid)',
      type: 'Full-Time',
      salary: '$165,000 - $210,000',
      description: 'Join the Stripe developer platforms team to architect high-throughput financial infrastructure and modern developer tooling. You will lead full-stack feature delivery across React frontends and Node.js microservices.',
      requirements: [
        '5+ years building production-grade web applications with React and Node.js',
        'Strong understanding of REST, GraphQL, and microservice architecture',
        'Deep experience with SQL and NoSQL database optimization',
        'Track record of mentoring junior engineers and leading system design'
      ],
      experienceLevel: 'Senior Level',
      category: 'Engineering',
      tags: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      featured: true,
      postedBy: recruiter._id
    },
    {
      title: 'Frontend Interactive Engineer (Design Systems & WebGL)',
      company: 'Figma',
      location: 'Remote',
      type: 'Remote',
      salary: '$150,000 - $190,000',
      description: 'Help Figma craft the next generation of collaborative web canvases and real-time interactive UI. We are looking for engineers obsessed with UI fidelity, 60fps animations, and magnetic user interactions.',
      requirements: [
        'Proficiency in React, HTML5 Canvas, WebGL, and advanced CSS transforms',
        'Passion for micro-interactions, responsive design, and design systems',
        'Knowledge of state synchronization and browser performance profiling'
      ],
      experienceLevel: 'Mid Level',
      category: 'Design & UI',
      tags: ['React', 'WebGL', 'Canvas', 'CSS3', 'Figma'],
      companyLogo: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=100&auto=format&fit=crop&q=80',
      featured: true,
      postedBy: recruiter._id
    },
    {
      title: 'AI Platform Full Stack Engineer',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      type: 'Full-Time',
      salary: '$180,000 - $240,000',
      description: 'Build developer interfaces and agentic workflow orchestration dashboards powered by state-of-the-art foundation models. Work at the bleeding edge of AI agent interfaces and human-AI collaboration.',
      requirements: [
        'Hands-on experience with modern JavaScript / TypeScript, Node.js, and Python',
        'Familiarity with LLM APIs, prompt orchestration, and streaming WebSocket responses',
        'Solid database foundations (MongoDB, PostgreSQL, Vector DBs)'
      ],
      experienceLevel: 'Senior Level',
      category: 'AI & Data',
      tags: ['Python', 'Node.js', 'React', 'LLMs', 'VectorDB'],
      companyLogo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&auto=format&fit=crop&q=80',
      featured: true,
      postedBy: recruiter._id
    },
    {
      title: 'DevOps & Cloud Infrastructure Specialist',
      company: 'Datadog',
      location: 'New York, NY (Hybrid)',
      type: 'Full-Time',
      salary: '$140,000 - $185,000',
      description: 'Help manage our global cloud infrastructure across thousands of Kubernetes clusters and multi-region deployments. Ensure maximum reliability, automated CI/CD pipelines, and zero-downtime rollouts.',
      requirements: [
        'Deep understanding of Docker, Kubernetes, Terraform, and AWS/GCP',
        'Experience building robust CI/CD pipelines (GitHub Actions, ArgoCD)',
        'Familiarity with observability, Prometheus, and distributed tracing'
      ],
      experienceLevel: 'Mid Level',
      category: 'DevOps',
      tags: ['Kubernetes', 'AWS', 'Docker', 'Terraform', 'CI/CD'],
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      featured: false,
      postedBy: recruiter._id
    },
    {
      title: 'Junior Full Stack Web Developer',
      company: 'Vercel',
      location: 'Remote',
      type: 'Remote',
      salary: '$85,000 - $110,000',
      description: 'Great opportunity for an ambitious junior or early-career developer to contribute to web applications, documentation portals, and community templates used by millions of developers.',
      requirements: [
        'Solid grounding in JavaScript (ES6+), React, and Node.js Express',
        'Familiarity with Git, GitHub pull requests, and modern web deployment',
        'Strong problem-solving curiosity and passion for learning'
      ],
      experienceLevel: 'Entry Level',
      category: 'Engineering',
      tags: ['React', 'JavaScript', 'Node.js', 'Bootstrap', 'Git'],
      companyLogo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=80',
      featured: false,
      postedBy: recruiter._id
    },
    {
      title: 'Staff Product Security Engineer',
      company: 'GitHub',
      location: 'Remote',
      type: 'Remote',
      salary: '$190,000 - $250,000',
      description: 'Lead application security reviews, threat modeling, and authentication architecture across identity systems. Ensure defense-in-depth across millions of repositories and user credentials.',
      requirements: [
        'Extensive background in web security, OAuth2, JWT hardening, and cryptographic primitives',
        'Experience conducting automated vulnerability scans and static code analysis',
        'Excellent cross-functional communication with core product teams'
      ],
      experienceLevel: 'Lead / Staff',
      category: 'Security',
      tags: ['Security', 'OAuth2', 'JWT', 'Node.js', 'Pen-Testing'],
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      featured: false,
      postedBy: recruiter._id
    }
  ];

  const createdJobs = await Job.insertMany(jobsData);

  // Pre-seed an application for Alex so the dashboard is immediately populated
  if (createdJobs.length > 0) {
    await Application.create({
      jobId: createdJobs[0]._id,
      userId: jobseeker._id,
      status: 'Under Review',
      coverNote: 'Very excited about Stripe engineering! My experience scaling React apps aligns directly with your platform roadmap.',
      resumeUrl: 'https://alexjohnson.dev/resume.pdf',
      portfolioUrl: 'https://alexjohnson.dev'
    });

    await Application.create({
      jobId: createdJobs[1]._id,
      userId: jobseeker._id,
      status: 'Shortlisted',
      coverNote: 'Figma is my dream company. I build interactive canvas experiences and design system primitives daily.',
      resumeUrl: 'https://alexjohnson.dev/resume.pdf',
      portfolioUrl: 'https://alexjohnson.dev'
    });
  }

  console.log(`[Seed] Database successfully populated:`);
  console.log(` - 2 Demo Users (Jobseeker: alex@example.com / Recruiter: recruiter@techjobs.io, pass: password123)`);
  console.log(` - ${createdJobs.length} Verified Tech Job Listings`);
  console.log(` - 2 Initial Applications for Demo Dashboard`);
};

if (require.main === module) {
  require('dotenv').config();
  connectDB().then(() => {
    seedDatabase().then(() => {
      console.log('[Seed] Seeding complete.');
      process.exit(0);
    }).catch(err => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
  });
}

module.exports = seedDatabase;
