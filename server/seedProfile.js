const mongoose = require("mongoose");
require("dotenv").config();

const Profile = require("./models/Profile");

const profileData = {
  name: "JYOTHI SIVA NAGA DEVI GELLI",
  tag: "Final-Year B.Tech IT Student",
  location: "Narsapur, Andhra Pradesh",
  email: "gellijyothi17@gmail.com",
  phone: "+91 9494165651",
  bio: "I'm an IT graduate who enjoys coding and building practical applications. I like learning new technologies and improving my problem-solving skills by working on projects. I've worked on a few academic and personal projects that helped me understand how real-world applications are built. Right now, I'm looking for an opportunity where I can learn from experienced developers and grow as a software engineer while contributing to the team.",
  profileImage: "/profile.png",
  themePreference: "light",
  careerVision: {
    title: "Software Developer",
    growingInto: "Independent Professional",
    space: "Full Stack Development & AI Systems",
    inspiredBy: "Building scalable and impactful software solutions"
  },
  skills: [
    { name: "Java" },
    { name: "Python" },
    { name: "React.js" },
    { name: "Node.js" },
    { name: "MongoDB" },
    { name: "SQL" }
  ],
  experience: [
    {
      company: "Green Cycle Project",
      role: "Full Stack Developer",
      duration: "2025",
      description: "Built a MERN-based waste management platform with Stripe payments and Twilio SMS integration."
    }
  ],
  projects: [
    {
      title: "Green Cycle – Organic Waste Management",
      tech: "React, Node.js, Express, MongoDB, Stripe, Twilio",
      description: "A MERN-based platform connecting organic waste sellers and buyers with payment and SMS notifications."
    },
    {
      title: "AQI Prediction System",
      tech: "Python, Pandas, Scikit-learn",
      description: "Machine learning system predicting Air Quality Index using regression and classification models."
    },
    {
      title: "Class Monitor Voting System",
      tech: "Python, Tkinter, MongoDB",
      description: "Secure voting system ensuring one vote per user with MongoDB storage."
    }
  ],
  education: [
    {
      title: "B.Tech in Information Technology",
      duration: "Oct 2022 – Present",
      institution: "Shri Vishnu Engineering College for Women, Bhimavaram",
      score: "CGPA: 8.98"
    },
    {
      title: "Intermediate (PCM)",
      duration: "2020 – 2022",
      institution: "Adithya Junior College, Narsapur",
      score: "Percentage: 96.1"
    },
    {
      title: "Secondary School (10th)",
      duration: "2019 – 2020",
      institution: "Sri Chaitanya Techno School, Narsapur",
      score: "Percentage: 100"
    }
  ],
  certifications: [
    {
      title: "Oracle Database Foundations",
      issuer: "Oracle Academy",
      year: "2025"
    },
    {
      title: "Java Programming",
      issuer: "Infosys Springboard",
      year: "2024"
    }
  ],
  extracurricular: [
    {
      activity: "Throwball Competition",
      achievement: "Secured 1st place in college-level competition"
    },
    {
      activity: "GDSC Solution Challenge 2024",
      achievement: "Participated with sustainability-focused solution"
    },
    {
      activity: "Sankalp 2K24 Hackathon",
      achievement: "Participated in hackathon at SRKR College"
    },
    {
      activity: "LeetCode Practice",
      achievement: "Solved 100+ coding problems"
    }
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/jyothi-gelli-791017257/",
    github: "https://github.com/Gelli-Jyothi1243",
    leetcode: "https://leetcode.com/Jyothi_gelli"
  }
};

async function seedProfile() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete existing profile
    await Profile.deleteMany({});
    console.log("Cleared existing profiles");

    // Create new profile
    const profile = await Profile.create(profileData);
    console.log("Profile created successfully!");
    console.log("Profile ID:", profile._id);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding profile:", error);
    process.exit(1);
  }
}

seedProfile();
