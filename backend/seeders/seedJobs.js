const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const User = require('../models/User');
const connectDB = require('../config/database');

dotenv.config();

connectDB();

const jobsData = [
  {
    title: "Frontend Developer",
    company: "TechCorp",
    location: "New York, NY",
    type: "Full-time",
    category: "Technology",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces using React and modern web technologies.",
    requirements: "Experience with React, JavaScript, HTML, CSS. Knowledge of state management libraries is a plus.",
    responsibilities: "Develop and maintain web applications, collaborate with designers and backend developers, ensure responsive design.",
    postedDate: "2023-10-01"
  },
  {
    title: "Backend Engineer",
    company: "DataSys",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Technology",
    description: "Join our backend team to build scalable APIs and services. Work with Node.js, databases, and cloud technologies.",
    requirements: "Proficiency in Node.js, Express, MongoDB or SQL. Experience with AWS or similar cloud platforms.",
    responsibilities: "Design and implement APIs, optimize database queries, ensure security and performance.",
    postedDate: "2023-10-02"
  },
  {
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "Los Angeles, CA",
    type: "Part-time",
    category: "Design",
    description: "Create beautiful and intuitive user interfaces for web and mobile applications. Collaborate with developers to bring designs to life.",
    requirements: "Proficiency in Figma, Adobe XD, or Sketch. Understanding of user-centered design principles.",
    responsibilities: "Create wireframes and mockups, conduct user research, iterate on designs based on feedback.",
    postedDate: "2023-10-03"
  },
  {
    title: "Data Analyst",
    company: "Analytics Inc",
    location: "Chicago, IL",
    type: "Remote",
    category: "Data",
    description: "Analyze large datasets to provide insights for business decisions. Work with SQL, Python, and visualization tools.",
    requirements: "Strong SQL skills, Python or R for data analysis, experience with Tableau or Power BI.",
    responsibilities: "Extract and analyze data, create reports and dashboards, present findings to stakeholders.",
    postedDate: "2023-10-04"
  },
  {
    title: "Marketing Manager",
    company: "BrandBoost",
    location: "Austin, TX",
    type: "Full-time",
    category: "Marketing",
    description: "Lead marketing campaigns and strategies to grow our brand. Manage social media, content creation, and analytics.",
    requirements: "Experience in digital marketing, social media management, content creation. Analytical skills.",
    responsibilities: "Develop marketing plans, manage campaigns, analyze performance metrics, collaborate with sales team.",
    postedDate: "2023-10-05"
  },
  {
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    type: "Full-time",
    category: "Technology",
    description: "Build and maintain CI/CD pipelines, manage infrastructure, ensure reliable deployments.",
    requirements: "Experience with Docker, Kubernetes, AWS/GCP, scripting languages like Bash or Python.",
    responsibilities: "Set up and maintain CI/CD pipelines, monitor system performance, automate infrastructure tasks.",
    postedDate: "2023-10-06"
  },
  {
    title: "Product Manager",
    company: "InnovateCo",
    location: "Boston, MA",
    type: "Full-time",
    category: "Product",
    description: "Drive product development from ideation to launch. Work closely with engineering, design, and marketing teams.",
    requirements: "Experience in product management, understanding of agile methodologies, strong communication skills.",
    responsibilities: "Define product vision and roadmap, gather requirements, prioritize features, analyze market trends.",
    postedDate: "2023-10-07"
  },
  {
    title: "Graphic Designer",
    company: "CreativeAgency",
    location: "Miami, FL",
    type: "Part-time",
    category: "Design",
    description: "Create visual content for various media including websites, social media, and print materials.",
    requirements: "Proficiency in Adobe Creative Suite, strong portfolio, understanding of design principles.",
    responsibilities: "Design graphics for campaigns, create branding materials, collaborate with marketing team.",
    postedDate: "2023-10-08"
  }
];

const importData = async () => {
  try {
    // Create a dummy employer user
    const employer = await User.create({
      name: 'Admin Employer',
      email: 'employer@example.com',
      password: 'password123',
      role: 'employer',
    });

    // Add jobs with employer reference
    const jobsWithEmployer = jobsData.map(job => ({
      ...job,
      employer: employer._id,
    }));

    await Job.insertMany(jobsWithEmployer);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Job.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}