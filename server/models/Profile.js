const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({

name:String,
tag:String,
location:String,
email:String,
phone:String,
bio:String,
profileImage:String,

league:String,
rank:Number,
points:Number,

careerVision:{
title:String,
growingInto:String,
space:String,
inspiredBy:String
},

projects:[
{
title:String,
tech:String,
description:String
}
],

skills:[
{
name:String,
level:String  // beginner, intermediate, advanced, expert
}
],

experience:[
{
company:String,
role:String,
duration:String,
description:String
}
],

education:[
{
institution:String,
degree:String,
title:String,  // Alternative field name for degree
duration:String,
score:String
}
],

extracurricular:[
{
activity:String,
achievement:String
}
],

certifications:[
{
title:String,
issuer:String,
year:String
}
],

links:{
linkedin:String,
github:String,
leetcode:String
},

themePreference:String

})

module.exports = mongoose.model("Profile",profileSchema)