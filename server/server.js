const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))

const Profile = require("./models/Profile")

app.get("/api/profile", async (req,res)=>{
const profile = await Profile.findOne()
res.json(profile)
})

app.put("/api/profile/:id", async (req,res)=>{
const updated = await Profile.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
)
res.json(updated)
})

// Migration endpoint to fix education and skills data
app.post("/api/profile/migrate/:id", async (req,res)=>{
try {
  const profile = await Profile.findById(req.params.id)
  
  // Fix education data
  profile.education = [
    {
      institution: "Shri Vishnu Engineering College for Women, Bhimavaram",
      degree: "B.Tech in Information Technology",
      title: "B.Tech in Information Technology",
      duration: "Oct 2022 – Present",
      score: "CGPA: 8.98"
    },
    {
      institution: "Adithya Junior College, Narsapur",
      degree: "Intermediate (PCM)",
      title: "Intermediate (PCM)",
      duration: "2020 – 2022",
      score: "Percentage: 96.1"
    },
    {
      institution: "Sri Chaitanya Techno School, Narsapur",
      degree: "Secondary School (10th)",
      title: "Secondary School (10th)",
      duration: "2019 – 2020",
      score: "Percentage: 100"
    }
  ]
  
  // Fix skills data - add level field
  profile.skills = profile.skills.map(skill => ({
    name: skill.name,
    level: skill.level || 'intermediate'
  }))
  
  await profile.save()
  res.json(profile)
} catch(err) {
  res.status(500).json({error: err.message})
}
})

app.listen(5000,()=>console.log("Server running on 5000"))