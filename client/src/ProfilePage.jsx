import { useEffect, useState } from "react"
import API from "./services/api"
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Trophy,
  GraduationCap,
  Code,
  Star,
  Edit2,
  Save,
  X,
  Award,
  Briefcase,
  Plus
} from "lucide-react"
import "./ProfilePage.css"
import "./InputFix.css" // EMERGENCY FIX FOR INPUT VISIBILITY

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(null)
  const [theme, setTheme] = useState('light')
  const [editingSkillId, setEditingSkillId] = useState(null) // Track which skill is being edited
  const [newItemIds, setNewItemIds] = useState(new Set()) // Track newly added items
  const [editingItemId, setEditingItemId] = useState(null) // Track which item is being edited (format: "arrayName-index")

  useEffect(() => {
    API.get("/api/profile")
      .then(res => {
        setProfile(res.data)
        setEditedProfile(res.data)
        // Load theme preference
        if (res.data.themePreference) {
          setTheme(res.data.themePreference)
          document.documentElement.setAttribute('data-theme', res.data.themePreference)
        }
      })
      .catch(err => {
        console.error("Failed to load profile:", err)
      })
  }, [])

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    
    // Save theme preference
    try {
      const updatedProfile = { ...profile, themePreference: newTheme }
      await API.put(`/api/profile/${profile._id}`, updatedProfile)
      setProfile(updatedProfile)
    } catch (error) {
      console.error('Failed to save theme preference')
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile({ ...profile })
  }

  const handleSave = async () => {
    try {
      const res = await API.put(`/api/profile/${profile._id}`, editedProfile)
      setProfile(res.data)
      setIsEditing(false)
      alert("Profile updated successfully!")
    } catch (error) {
      alert("Failed to update profile")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile({ ...profile })
  }

  const updateSkillLevel = (index, level) => {
    const newSkills = [...editedProfile.skills]
    newSkills[index] = { ...newSkills[index], level: level }
    setEditedProfile({ ...editedProfile, skills: newSkills })
  }

  const updateField = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value })
  }

  const updateNestedField = (parent, field, value) => {
    setEditedProfile({
      ...editedProfile,
      [parent]: { ...editedProfile[parent], [field]: value }
    })
  }

  const addNewItem = (arrayName, template) => {
    const currentProfile = editedProfile || profile
    const newItem = { ...template, _tempId: Date.now() } // Add temporary ID
    const newArray = [...(currentProfile[arrayName] || []), newItem]
    const updatedProfile = { ...currentProfile, [arrayName]: newArray }
    setEditedProfile(updatedProfile)
    setProfile(updatedProfile) // Update profile state too
    setNewItemIds(new Set([...newItemIds, newItem._tempId])) // Mark as new
  }

  const updateArrayItem = (arrayName, index, field, value) => {
    const newArray = [...editedProfile[arrayName]]
    newArray[index] = { ...newArray[index], [field]: value }
    setEditedProfile({ ...editedProfile, [arrayName]: newArray })
  }

  const removeArrayItem = async (arrayName, index) => {
    const item = editedProfile[arrayName][index]
    const newArray = editedProfile[arrayName].filter((_, i) => i !== index)
    const updatedProfile = { ...editedProfile, [arrayName]: newArray }
    setEditedProfile(updatedProfile)
    
    // Remove from new items tracking
    if (item._tempId) {
      const newIds = new Set(newItemIds)
      newIds.delete(item._tempId)
      setNewItemIds(newIds)
    }
    
    // Auto-save to database
    await saveToDatabase(updatedProfile)
  }

  const confirmNewItem = async (arrayName, index) => {
    const item = editedProfile[arrayName][index]
    const tempId = item._tempId
    
    // Remove _tempId before saving to database
    const cleanItem = { ...item }
    delete cleanItem._tempId
    
    const newArray = [...editedProfile[arrayName]]
    newArray[index] = cleanItem
    const updatedProfile = { ...editedProfile, [arrayName]: newArray }
    
    // Remove from new items tracking
    if (tempId) {
      const newIds = new Set(newItemIds)
      newIds.delete(tempId)
      setNewItemIds(newIds)
    }
    
    // Save to database
    await saveToDatabase(updatedProfile)
  }

  const isNewItem = (item) => {
    return item._tempId && newItemIds.has(item._tempId)
  }

  const isEditingItem = (arrayName, index) => {
    return editingItemId === `${arrayName}-${index}`
  }

  const startEditingItem = (arrayName, index) => {
    // Auto-save and close any currently editing item before opening a new one
    if (editingItemId && editingItemId !== `${arrayName}-${index}`) {
      const [currentArray, currentIndex] = editingItemId.split('-');
      saveEditedItem(currentArray, parseInt(currentIndex));
    }
    setEditingItemId(`${arrayName}-${index}`)
  }

  const stopEditingItem = () => {
    setEditingItemId(null)
  }

  const saveEditedItem = async (arrayName, index) => {
    await saveToDatabase(editedProfile)
    stopEditingItem()
  }

  const saveToDatabase = async (updatedProfile) => {
    try {
      // Clean up _tempId fields before saving
      const cleanProfile = JSON.parse(JSON.stringify(updatedProfile))
      
      // Remove _tempId from all array items
      const arrayFields = ['skills', 'experience', 'projects', 'certifications', 'extracurricular', 'education']
      arrayFields.forEach(field => {
        if (cleanProfile[field]) {
          cleanProfile[field] = cleanProfile[field].map(item => {
            const cleanItem = { ...item }
            delete cleanItem._tempId
            return cleanItem
          })
        }
      })
      
      const res = await API.put(`/api/profile/${profile._id}`, cleanProfile)
      setProfile(res.data)
      setEditedProfile(res.data)
    } catch (error) {
      console.error('Failed to save to database:', error)
    }
  }

  if (!profile) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading profile...</p>
      <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
        First load may take 30-60 seconds (free tier backend waking up)
      </p>
    </div>
  )

  const currentData = isEditing ? editedProfile : profile

  return (
    <div className="profile-page">
      {/* Gidy Logo Header */}
      <div className="gidy-header">
        <img src="/gidy-logo.png" alt="Gidy" className="gidy-logo" />
        <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Header with Edit Button */}
      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <img src={currentData.profileImage} alt="Profile" className="profile-avatar" />
          </div>

          <div className="profile-info">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={currentData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="edit-input edit-input-large"
                />
                <input
                  type="text"
                  value={currentData.tag}
                  onChange={(e) => updateField('tag', e.target.value)}
                  className="edit-input"
                />
              </>
            ) : (
              <>
                <h1 className="profile-name">{currentData.name}</h1>
                <p className="profile-tag">{currentData.tag}</p>
              </>
            )}

            <div className="profile-contact">
              <div className="contact-item">
                <Mail size={16} />
                {isEditing ? (
                  <input
                    type="email"
                    value={currentData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="edit-input-inline"
                  />
                ) : (
                  <a href={`mailto:${currentData.email}`}>{currentData.email}</a>
                )}
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                {isEditing ? (
                  <input
                    type="text"
                    value={currentData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="edit-input-inline"
                  />
                ) : (
                  <span>{currentData.location}</span>
                )}
              </div>
            </div>

            <div className="profile-social-links">
              <a href={currentData.links.linkedin} target="_blank" rel="noopener noreferrer" className="social-link-inline">
                <Linkedin size={18} />
              </a>
              <a href={currentData.links.github} target="_blank" rel="noopener noreferrer" className="social-link-inline">
                <Github size={18} />
              </a>
              <a href={currentData.links.leetcode} target="_blank" rel="noopener noreferrer" className="social-link-inline">
                <Code size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="edit-controls">
          {!isEditing ? (
            <button onClick={handleEdit} className="btn-edit">
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="btn-save">
                <Save size={18} />
                Save
              </button>
              <button onClick={handleCancel} className="btn-cancel">
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div className="section-card">
        <h2 className="section-title">About Me</h2>
        {isEditing ? (
          <textarea
            value={currentData.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            className="edit-textarea"
            rows="6"
          />
        ) : (
          <p className="bio-text">{currentData.bio}</p>
        )}
      </div>

      {/* Career Vision - Only editable in edit mode */}
      {isEditing ? (
        <div className="career-vision-card edit-mode">
          <div className="career-header">
            <Star className="career-icon" />
            <h2>You're Career Vision</h2>
          </div>
          <input
            type="text"
            value={currentData.careerVision.title}
            onChange={(e) => updateNestedField('careerVision', 'title', e.target.value)}
            className="edit-input career-title-input"
            placeholder="Career Title"
          />
          <div className="career-grid">
            <div className="career-item">
              <span className="career-label">What you're growing into right now</span>
              <input
                type="text"
                value={currentData.careerVision.growingInto}
                onChange={(e) => updateNestedField('careerVision', 'growingInto', e.target.value)}
                className="edit-input"
              />
            </div>
            <div className="career-item">
              <span className="career-label">The space you want to grow in</span>
              <input
                type="text"
                value={currentData.careerVision.space}
                onChange={(e) => updateNestedField('careerVision', 'space', e.target.value)}
                className="edit-input"
              />
            </div>
            <div className="career-item">
              <span className="career-label">Inspired by</span>
              <input
                type="text"
                value={currentData.careerVision.inspiredBy}
                onChange={(e) => updateNestedField('careerVision', 'inspiredBy', e.target.value)}
                className="edit-input"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="career-vision-card">
          <div className="career-header">
            <Star className="career-icon" />
            <h2>You're Career Vision</h2>
          </div>
          <h3 className="career-title">{currentData.careerVision.title}</h3>
          <div className="career-grid">
            <div className="career-item">
              <span className="career-label">What you're growing into right now</span>
              <span className="career-value">{currentData.careerVision.growingInto}</span>
            </div>
            <div className="career-item">
              <span className="career-label">The space you want to grow in</span>
              <span className="career-value">{currentData.careerVision.space}</span>
            </div>
            <div className="career-item">
              <span className="career-label">Inspired by</span>
              <span className="career-value">{currentData.careerVision.inspiredBy}</span>
            </div>
          </div>
        </div>
      )}

      {/* Education Timeline - Always Visible */}
      <div className="timeline-container">
        <h2 className="section-title">
          <GraduationCap size={20} />
          Education
        </h2>
        <div className="timeline">
          {currentData.education.map((edu, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-marker education-marker">
                <GraduationCap size={20} />
              </div>
              <div className="timeline-content">
                <h4>{edu.degree || edu.title || 'Degree not specified'}</h4>
                <p className="timeline-institution">{edu.institution}</p>
                <p className="timeline-date">{edu.duration || edu.year || 'Duration not specified'}</p>
                {edu.score && <p className="timeline-score">{edu.score}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Skills - Full Width */}
        <div className="section-card skills-section">
          <div className="section-header">
            <h2 className="section-title">
              <Code size={20} />
              Skills
            </h2>
            <button 
              onClick={() => addNewItem('skills', { name: '', level: 'intermediate' })}
              className="btn-add-item"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="skills-display-grid">
            {currentData.skills.filter(skill => skill.name || skill._tempId).map((skill, idx) => {
              // Find the actual index in the unfiltered array
              const actualIndex = currentData.skills.findIndex(s => 
                s._tempId ? s._tempId === skill._tempId : s.name === skill.name
              )
              return (
              <div key={skill._tempId || idx} className="skill-item-wrapper">
                {isNewItem(skill) || editingSkillId === actualIndex ? (
                  <div className="skill-edit-card">
                    <input
                      key={`skill-name-${actualIndex}-${skill.name}`}
                      type="text"
                      defaultValue={skill.name || ''}
                      onInput={(e) => updateArrayItem('skills', actualIndex, 'name', e.target.value)}
                      onBlur={(e) => updateArrayItem('skills', actualIndex, 'name', e.target.value)}
                      className="skill-edit-input"
                      placeholder="Skill name"
                      autoFocus
                      style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                    />
                    <select
                      value={skill.level || 'intermediate'}
                      onChange={(e) => updateSkillLevel(actualIndex, e.target.value)}
                      className="skill-edit-select"
                      style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                    <div className="skill-edit-actions">
                      <button
                        onClick={() => {
                          if (isNewItem(skill)) {
                            confirmNewItem('skills', actualIndex)
                          } else {
                            saveEditedItem('skills', actualIndex)
                          }
                          setEditingSkillId(null)
                        }}
                        className="btn-confirm"
                        title="Save"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={() => {
                          removeArrayItem('skills', actualIndex)
                          setEditingSkillId(null)
                        }}
                        className="btn-delete"
                        title="Delete"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="skill-badge-container">
                    <div className="skill-badge-display">
                      <span className="skill-name">{skill.name}</span>
                      <span className={`skill-level-badge ${skill.level || 'intermediate'}`}>
                        {(skill.level || 'intermediate').charAt(0).toUpperCase() + (skill.level || 'intermediate').slice(1)}
                      </span>
                    </div>
                    <div className="skill-badge-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingSkillId(actualIndex)
                        }}
                        className="btn-edit-tiny"
                        title="Edit"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeArrayItem('skills', actualIndex)
                        }}
                        className="btn-delete-tiny"
                        title="Delete"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="two-column-wrapper">
          {/* Left Column */}
          <div className="column-left">
            {/* Experience */}
            <div className="section-card experience-section">
          <div className="section-header">
            <h2 className="section-title">
              <Briefcase size={20} />
              Experience
            </h2>
            <button 
              onClick={() => addNewItem('experience', { 
                company: '', 
                role: '', 
                duration: '', 
                description: '' 
              })}
              className="btn-add-item"
            >
              <Plus size={16} />
            </button>
          </div>
          {currentData.experience.filter(exp => exp.role || exp.company || exp._tempId).length === 0 && (
            <div className="empty-hint">
              <Briefcase size={16} />
              <span>Add Your Experience!</span>
            </div>
          )}
          {currentData.experience.filter(exp => exp.role || exp.company || exp._tempId).map((exp, idx) => (
            <div key={idx} className="content-item">
              {isNewItem(exp) || isEditingItem('experience', idx) ? (
                <div className="edit-card">
                  <div className="edit-card-header">
                    <input
                      key={`exp-role-${idx}-${exp.role}`}
                      type="text"
                      defaultValue={exp.role || ''}
                      onInput={(e) => updateArrayItem('experience', idx, 'role', e.target.value)}
                      onBlur={(e) => updateArrayItem('experience', idx, 'role', e.target.value)}
                      className="edit-input-title"
                      placeholder="Role/Position"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => {
                          if (isNewItem(exp)) {
                            confirmNewItem('experience', idx)
                          } else {
                            saveEditedItem('experience', idx)
                          }
                        }}
                        className="btn-confirm"
                        title="Save"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => removeArrayItem('experience', idx)}
                        className="btn-delete"
                        title="Delete"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <input
                    key={`exp-company-${idx}-${exp.company}`}
                    type="text"
                    defaultValue={exp.company || ''}
                    onInput={(e) => updateArrayItem('experience', idx, 'company', e.target.value)}
                    onBlur={(e) => updateArrayItem('experience', idx, 'company', e.target.value)}
                    className="edit-input"
                    placeholder="Company Name"
                    style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                  />
                  <input
                    key={`exp-duration-${idx}-${exp.duration}`}
                    type="text"
                    defaultValue={exp.duration || ''}
                    onInput={(e) => updateArrayItem('experience', idx, 'duration', e.target.value)}
                    onBlur={(e) => updateArrayItem('experience', idx, 'duration', e.target.value)}
                    className="edit-input"
                    placeholder="Duration (e.g., 2024 - Present)"
                    style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                  />
                  <textarea
                    key={`exp-desc-${idx}-${exp.description}`}
                    defaultValue={exp.description || ''}
                    onInput={(e) => updateArrayItem('experience', idx, 'description', e.target.value)}
                    onBlur={(e) => updateArrayItem('experience', idx, 'description', e.target.value)}
                    className="edit-textarea"
                    placeholder="Description"
                    rows="3"
                    style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                  />
                </div>
              ) : (
                <div className="display-card" onClick={() => startEditingItem('experience', idx)} style={{ cursor: 'pointer' }} title="Click to edit">
                  <div className="card-header-with-actions">
                    <div className="card-content">
                      <h4>{exp.role}</h4>
                      <p className="company">{exp.company}</p>
                      <p className="duration">{exp.duration}</p>
                      <p className="description">{exp.description}</p>
                    </div>
                    <div className="card-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditingItem('experience', idx)
                        }}
                        className="btn-edit-small"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeArrayItem('experience', idx)
                        }}
                        className="btn-delete-small"
                        title="Delete"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="section-card projects-section">
          <div className="section-header">
            <h2 className="section-title">
              <Code size={20} />
              Projects
            </h2>
            <button 
              onClick={() => addNewItem('projects', { 
                title: '', 
                tech: '', 
                description: '' 
              })}
              className="btn-add-item"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="projects-list">
            {currentData.projects?.filter(p => p.title || p._tempId).length === 0 && (
              <div className="empty-hint">
                <Code size={16} />
                <span>Add Your Projects!</span>
              </div>
            )}
            {currentData.projects?.filter(p => p.title || p._tempId).map((project, idx) => (
              <div key={idx} className="content-item">
                {isNewItem(project) || isEditingItem('projects', idx) ? (
                  <div className="edit-card">
                    <div className="edit-card-header">
                      <input
                        key={`project-title-${idx}-${project.title}`}
                        type="text"
                        defaultValue={project.title || ''}
                        onInput={(e) => updateArrayItem('projects', idx, 'title', e.target.value)}
                        onBlur={(e) => updateArrayItem('projects', idx, 'title', e.target.value)}
                        className="edit-input-title"
                        placeholder="Project Title"
                        autoFocus
                        style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                      />
                      <div className="edit-actions">
                        <button
                          onClick={() => {
                            if (isNewItem(project)) {
                              confirmNewItem('projects', idx)
                            } else {
                              saveEditedItem('projects', idx)
                            }
                          }}
                          className="btn-confirm"
                          title="Save"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => removeArrayItem('projects', idx)}
                          className="btn-delete"
                          title="Delete"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <input
                      key={`project-tech-${idx}-${project.tech}`}
                      type="text"
                      defaultValue={project.tech || ''}
                      onInput={(e) => updateArrayItem('projects', idx, 'tech', e.target.value)}
                      onBlur={(e) => updateArrayItem('projects', idx, 'tech', e.target.value)}
                      className="edit-input"
                      placeholder="Technologies Used"
                      style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                    />
                    <textarea
                      key={`project-desc-${idx}-${project.description}`}
                      defaultValue={project.description || ''}
                      onInput={(e) => updateArrayItem('projects', idx, 'description', e.target.value)}
                      onBlur={(e) => updateArrayItem('projects', idx, 'description', e.target.value)}
                      className="edit-textarea"
                      placeholder="Project Description"
                      rows="3"
                      style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                    />
                  </div>
                ) : (
                  <div className="display-card" onClick={() => startEditingItem('projects', idx)} style={{ cursor: 'pointer' }} title="Click to edit">
                    <div className="card-header-with-actions">
                      <div className="card-content">
                        <h4>{project.title}</h4>
                        <p className="tech-stack">{project.tech}</p>
                        <p className="description">{project.description}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditingItem('projects', idx)
                          }}
                          className="btn-edit-small"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeArrayItem('projects', idx)
                          }}
                          className="btn-delete-small"
                          title="Delete"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
            </div>

            {/* Right Column */}
            <div className="column-right">
              {/* Certifications */}
              <div className="section-card certifications-section">
                <div className="section-header">
                  <h2 className="section-title">
                    <Award size={20} />
                    Certifications
                  </h2>
                  <button 
                    onClick={() => addNewItem('certifications', { 
                title: '', 
                issuer: '', 
                year: '' 
              })}
              className="btn-add-item"
            >
              <Plus size={16} />
            </button>
          </div>
          {currentData.certifications.filter(c => c.title || c._tempId).length === 0 && (
            <div className="empty-hint">
              <Award size={16} />
              <span>Add Your Certifications!</span>
            </div>
          )}
          {currentData.certifications.filter(c => c.title || c._tempId).map((cert, idx) => (
            <div key={idx} className="content-item">
              {isNewItem(cert) || isEditingItem('certifications', idx) ? (
                <div className="edit-card">
                  <div className="edit-card-header">
                    <input
                      key={`cert-title-${idx}-${cert.title}`}
                      type="text"
                      defaultValue={cert.title || ''}
                      onInput={(e) => updateArrayItem('certifications', idx, 'title', e.target.value)}
                      onBlur={(e) => updateArrayItem('certifications', idx, 'title', e.target.value)}
                      className="edit-input-title"
                      placeholder="Certification Title"
                      autoFocus
                      style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => {
                          if (isNewItem(cert)) {
                            confirmNewItem('certifications', idx)
                          } else {
                            saveEditedItem('certifications', idx)
                          }
                        }}
                        className="btn-confirm"
                        title="Save"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => removeArrayItem('certifications', idx)}
                        className="btn-delete"
                        title="Delete"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <input
                    key={`cert-issuer-${idx}-${cert.issuer}`}
                    type="text"
                    defaultValue={cert.issuer || ''}
                    onInput={(e) => updateArrayItem('certifications', idx, 'issuer', e.target.value)}
                    onBlur={(e) => updateArrayItem('certifications', idx, 'issuer', e.target.value)}
                    className="edit-input"
                    placeholder="Issuing Organization"
                    style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                  />
                  <input
                    key={`cert-year-${idx}-${cert.year}`}
                    type="text"
                    defaultValue={cert.year || ''}
                    onInput={(e) => updateArrayItem('certifications', idx, 'year', e.target.value)}
                    onBlur={(e) => updateArrayItem('certifications', idx, 'year', e.target.value)}
                    className="edit-input"
                    placeholder="Year"
                    style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                  />
                </div>
              ) : (
                <div className="display-card" onClick={() => startEditingItem('certifications', idx)} style={{ cursor: 'pointer' }} title="Click to edit">
                  <div className="card-header-with-actions">
                    <div className="card-content">
                      <h4>{cert.title}</h4>
                      <p className="issuer">{cert.issuer}</p>
                      <p className="year">{cert.year}</p>
                    </div>
                    <div className="card-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditingItem('certifications', idx)
                        }}
                        className="btn-edit-small"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeArrayItem('certifications', idx)
                        }}
                        className="btn-delete-small"
                        title="Delete"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Extracurricular */}
        <div className="section-card extracurricular-section">
          <div className="section-header">
            <h2 className="section-title">
              <Trophy size={20} />
              Extracurricular Activities
            </h2>
            <button 
              onClick={() => addNewItem('extracurricular', { 
                activity: '', 
                achievement: '' 
              })}
              className="btn-add-item"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="activities-list">
            {currentData.extracurricular.filter(a => a.activity || a._tempId).length === 0 && (
              <div className="empty-hint">
                <Trophy size={16} />
                <span>Add Your Extracurricular Activities!</span>
              </div>
            )}
            {currentData.extracurricular.filter(a => a.activity || a._tempId).map((activity, idx) => (
              <div key={idx} className="content-item">
                {isNewItem(activity) || isEditingItem('extracurricular', idx) ? (
                  <div className="edit-card">
                    <div className="edit-card-header">
                      <input
                        key={`activity-name-${idx}-${activity.activity}`}
                        type="text"
                        defaultValue={activity.activity || ''}
                        onInput={(e) => updateArrayItem('extracurricular', idx, 'activity', e.target.value)}
                        onBlur={(e) => updateArrayItem('extracurricular', idx, 'activity', e.target.value)}
                        className="edit-input-title"
                        placeholder="Activity Name"
                        autoFocus
                        style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                      />
                      <div className="edit-actions">
                        <button
                          onClick={() => {
                            if (isNewItem(activity)) {
                              confirmNewItem('extracurricular', idx)
                            } else {
                              saveEditedItem('extracurricular', idx)
                            }
                          }}
                          className="btn-confirm"
                          title="Save"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => removeArrayItem('extracurricular', idx)}
                          className="btn-delete"
                          title="Delete"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <input
                      key={`activity-achievement-${idx}-${activity.achievement}`}
                      type="text"
                      defaultValue={activity.achievement || ''}
                      onInput={(e) => updateArrayItem('extracurricular', idx, 'achievement', e.target.value)}
                      onBlur={(e) => updateArrayItem('extracurricular', idx, 'achievement', e.target.value)}
                      className="edit-input"
                      placeholder="Achievement/Description"
                      style={{ color: theme === 'dark' ? '#ffffff' : '#000000', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                    />
                  </div>
                ) : (
                  <div className="display-card" onClick={() => startEditingItem('extracurricular', idx)} style={{ cursor: 'pointer' }} title="Click to edit">
                    <div className="card-header-with-actions">
                      <div className="card-content">
                        <div>
                          <h4>{activity.activity}</h4>
                          <p>{activity.achievement}</p>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditingItem('extracurricular', idx)
                          }}
                          className="btn-edit-small"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeArrayItem('extracurricular', idx)
                          }}
                          className="btn-delete-small"
                          title="Delete"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
            </div>
          </div>
      </div>
    </div>
  )
}
