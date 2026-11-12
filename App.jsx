import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpenText,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarCheck2,
  Camera,
  Check,
  ChevronRight,
  Compass,
  Dumbbell,
  Flame,
  FolderKanban,
  House,
  NotebookPen,
  PencilLine,
  Plus,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trash2,
  Trophy,
  UserRound,
  Zap,
} from 'lucide-react'
import './App.css'

const STORAGE_KEY = 'skillquest-state-v1'

const defaultState = {
  profile: {
    name: 'Maya Brooks',
    bio: 'Product designer • curious explorer',
    level: 4,
    xp: 1250,
    streak: 12,
    interests: ['UX', 'Learning', 'Reading', 'Photography'],
    favoriteSkills: ['Web Development', 'Communication', 'Wellbeing'],
  },
  quests: [
    {
      id: 'quest-1',
      title: 'Complete one JavaScript exercise',
      description: 'Finish a focused DOM challenge and test your understanding of arrays, loops, and events.',
      category: 'Learning',
      duration: '30 min',
      difficulty: 'Medium',
      xp: 80,
      status: 'in-progress',
      dueDate: '2026-11-12',
      skill: 'JavaScript',
      notes: 'Try to complete the exercise without looking at a solution first.',
      evidence: 'Short reflection and a screenshot of the final output.',
      proof: { reflection: '', url: '', image: '' },
      subtasks: [
        { id: 's1', label: 'Open the challenge', done: true },
        { id: 's2', label: 'Write the logic', done: false },
        { id: 's3', label: 'Check the result', done: false },
      ],
    },
    {
      id: 'quest-2',
      title: 'Read 10 pages',
      description: 'Read a chapter from a growth-focused book and note one new idea.',
      category: 'Personal Growth',
      duration: '20 min',
      difficulty: 'Easy',
      xp: 60,
      status: 'upcoming',
      dueDate: '2026-11-13',
      skill: 'Reading',
      notes: 'Capture one lesson you want to use this week.',
      evidence: 'A short reflection about the chapter.',
      proof: { reflection: '', url: '', image: '' },
      subtasks: [],
    },
    {
      id: 'quest-3',
      title: 'Practise photography for 20 minutes',
      description: 'Experiment with light, framing, and contrast using three quick shots.',
      category: 'Creativity',
      duration: '20 min',
      difficulty: 'Medium',
      xp: 90,
      status: 'today',
      dueDate: '2026-11-12',
      skill: 'Photography',
      notes: 'Focus on one mood and take 3 shots in different compositions.',
      evidence: 'Upload 2 favourite shots or a mini moodboard.',
      proof: { reflection: '', url: '', image: '' },
      subtasks: [
        { id: 's4', label: 'Pick a subject', done: true },
        { id: 's5', label: 'Shoot three frames', done: false },
      ],
    },
    {
      id: 'quest-4',
      title: 'Revise a difficult topic',
      description: 'Summarise the complicated concept in your own words and highlight the key idea.',
      category: 'Learning',
      duration: '45 min',
      difficulty: 'Hard',
      xp: 110,
      status: 'in-progress',
      dueDate: '2026-11-12',
      skill: 'Critical Thinking',
      notes: 'Use a blank page and write a short 2-minute explanation to a friend.',
      evidence: 'One written outline or voice note summary.',
      proof: { reflection: '', url: '', image: '' },
      subtasks: [],
    },
    {
      id: 'quest-5',
      title: 'Build a small UI component',
      description: 'Create a polished interface element that could live inside a portfolio project.',
      category: 'Productivity',
      duration: '50 min',
      difficulty: 'Hard',
      xp: 120,
      status: 'completed',
      dueDate: '2026-11-10',
      skill: 'UI Development',
      notes: 'Focus on spacing, hierarchy, and readability.',
      evidence: 'Project URL or mock screenshot of the component.',
      proof: { reflection: 'The spacing and contrast made a big difference.', url: '', image: '' },
      subtasks: [
        { id: 's6', label: 'Sketch component', done: true },
        { id: 's7', label: 'Build it', done: true },
      ],
    },
    {
      id: 'quest-6',
      title: 'Journal reflection',
      description: 'Write about what felt energising, what felt hard, and what to carry into next week.',
      category: 'Personal Growth',
      duration: '15 min',
      difficulty: 'Easy',
      xp: 45,
      status: 'paused',
      dueDate: '2026-11-14',
      skill: 'Communication',
      notes: 'Reflect on your wins and what needs gentler systems.',
      evidence: 'A short journal note.',
      proof: { reflection: '', url: '', image: '' },
      subtasks: [],
    },
    {
      id: 'quest-7',
      title: '30-minute mobility block',
      description: 'Complete a mobility and stretch session with a lighter, low-pressure pace.',
      category: 'Fitness',
      duration: '30 min',
      difficulty: 'Easy',
      xp: 75,
      status: 'today',
      dueDate: '2026-11-12',
      skill: 'Fitness',
      notes: 'Keep the movement steady and stop when you feel tight.',
      evidence: 'Short reflection about how your body feels after.',
      proof: { reflection: '', url: '', image: '' },
      subtasks: [],
    },
  ],
  skills: [
    { id: 'js', name: 'JavaScript', area: 'Technology', level: 3, state: 'in-progress', x: 18, y: 22, connected: ['ui', 'web', 'data'] },
    { id: 'ui', name: 'UI Development', area: 'Technology', level: 4, state: 'mastered', x: 38, y: 18, connected: ['js', 'web', 'design'] },
    { id: 'web', name: 'Web Development', area: 'Technology', level: 3, state: 'in-progress', x: 57, y: 22, connected: ['js', 'ui', 'data'] },
    { id: 'data', name: 'Data Structures', area: 'Technology', level: 2, state: 'available', x: 70, y: 34, connected: ['js', 'web'] },
    { id: 'design', name: 'Graphic Design', area: 'Creativity', level: 2, state: 'available', x: 28, y: 52, connected: ['ui', 'photo', 'story'] },
    { id: 'photo', name: 'Photography', area: 'Creativity', level: 3, state: 'in-progress', x: 40, y: 66, connected: ['design', 'video'] },
    { id: 'story', name: 'Communication', area: 'Personal Development', level: 3, state: 'in-progress', x: 50, y: 76, connected: ['design', 'speak', 'read'] },
    { id: 'speak', name: 'Public Speaking', area: 'Personal Development', level: 1, state: 'available', x: 67, y: 62, connected: ['story', 'read'] },
    { id: 'read', name: 'Reading', area: 'Wellness', level: 2, state: 'available', x: 76, y: 46, connected: ['story', 'readiness'] },
    { id: 'fitness', name: 'Fitness', area: 'Wellness', level: 3, state: 'in-progress', x: 58, y: 48, connected: ['read', 'story'] },
  ],
  challenges: [
    {
      id: 'boss-1',
      title: 'The Web Builder',
      progress: 68,
      completed: 3,
      total: 4,
      xp: 420,
      status: 'in-progress',
      badge: 'Builder Badge',
    },
    {
      id: 'boss-2',
      title: 'The Creative Eye',
      progress: 82,
      completed: 4,
      total: 5,
      xp: 520,
      status: 'almost-done',
      badge: 'Lens Master',
    },
    {
      id: 'boss-3',
      title: 'The Confident Speaker',
      progress: 42,
      completed: 2,
      total: 4,
      xp: 390,
      status: 'in-progress',
      badge: 'Voice Unlock',
    },
  ],
  achievements: [
    { id: 'first-steps', title: 'First Steps', detail: 'Complete your first quest.', unlocked: true },
    { id: 'curious-mind', title: 'Curious Mind', detail: 'Explore three skills.', unlocked: true },
    { id: 'focused', title: 'Focused', detail: 'Complete five focus sessions.', unlocked: false },
    { id: 'boss-slayer', title: 'Boss Slayer', detail: 'Finish a boss challenge.', unlocked: false },
    { id: 'comeback-kid', title: 'Comeback Kid', detail: 'Complete a recovery path quest.', unlocked: false },
  ],
  focusSessions: [
    { id: 'fs-1', questId: 'quest-1', duration: 25, completed: true, note: 'A strong session with clear momentum.' },
    { id: 'fs-2', questId: 'quest-3', duration: 15, completed: true, note: 'Better attention after a short reset.' },
  ],
  reflections: [
    {
      id: 'ref-1',
      week: 'Week 45',
      summary: 'This week I learned to keep my tasks small enough to finish. The momentum felt calmer and more sustainable.',
      answers: {
        learn: 'I learned to break a larger task into the next smallest step.',
        enjoyable: 'Photography and journal reflection felt the most energising.',
        difficult: 'Time management during work-heavy days was the hardest part.',
        proud: 'I finished my UI component and kept a steady streak.',
        improve: 'I want a gentler recovery plan when my energy dips.',
      },
    },
  ],
  theme: 'light',
  toast: '',
}

const navItems = [
  { label: 'Home', path: '/', icon: House },
  { label: 'My Quests', path: '/quests', icon: FolderKanban },
  { label: 'Skill Map', path: '/skills', icon: Compass },
  { label: 'Progress', path: '/progress', icon: BarChart3 },
  { label: 'Profile', path: '/profile', icon: UserRound },
]

const categoryClass = {
  Learning: 'learning',
  Creativity: 'creativity',
  Fitness: 'fitness',
  Productivity: 'productivity',
  'Personal Growth': 'personal-growth',
}

const difficultyOrder = ['Easy', 'Medium', 'Hard', 'Epic']

const questTemplates = {
  quick: ['Practise {title} for 15 minutes.', 'Review the key idea behind {title} in a focused sprint.'],
  easy: ['Learn the 3 essential ideas behind {title}.', 'Complete a short starter task related to {title}.'],
  challenge: ['Build a mini project using {title}.', 'Create a small interactive result based on {title}.'],
  creative: ['Explain {title} through a visual cheatsheet.', 'Turn {title} into a small set of creative prompts.'],
}

function getStoredState() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return defaultState

  try {
    const parsed = JSON.parse(saved)
    return { ...defaultState, ...parsed, profile: { ...defaultState.profile, ...parsed.profile }, quests: parsed.quests || defaultState.quests, skills: parsed.skills || defaultState.skills, challenges: parsed.challenges || defaultState.challenges, achievements: parsed.achievements || defaultState.achievements, reflections: parsed.reflections || defaultState.reflections, focusSessions: parsed.focusSessions || defaultState.focusSessions }
  } catch {
    return defaultState
  }
}

function createBlankQuest() {
  return {
    id: '',
    title: '',
    description: '',
    category: 'Learning',
    duration: '30 min',
    difficulty: 'Medium',
    xp: 60,
    status: 'today',
    dueDate: new Date().toISOString().slice(0, 10),
    skill: 'JavaScript',
    notes: '',
    evidence: '',
    proof: { reflection: '', url: '', image: '' },
    subtasks: [],
  }
}

function App() {
  const [state, setState] = useState(getStoredState)
  const [selectedQuest, setSelectedQuest] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [draft, setDraft] = useState(createBlankQuest())
  const [focusQuest, setFocusQuest] = useState(null)
  const [focusSession, setFocusSession] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    if (!focusSession || !focusSession.running) return undefined
    const timer = setInterval(() => {
      setFocusSession((current) => {
        if (!current) return null
        if (current.remaining <= 1) {
          return { ...current, remaining: 0, running: false, finished: true }
        }
        return { ...current, remaining: current.remaining - 1 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [focusSession?.running])

  const totalXP = useMemo(() => state.profile.xp, [state.profile.xp])
  const currentLevel = useMemo(() => Math.floor(totalXP / 250) + 1, [totalXP])
  const levelProgress = useMemo(() => ((totalXP % 250) / 250) * 100, [totalXP])
  const completedCount = useMemo(() => state.quests.filter((quest) => quest.status === 'completed').length, [state.quests])
  const focusMinutes = useMemo(() => state.focusSessions.reduce((sum, session) => sum + session.duration, 0), [state.focusSessions])

  const showToast = (message) => setToast(message)

  const saveQuest = () => {
    if (!draft.title.trim()) {
      showToast('Quest title is required.')
      return
    }

    const nextQuest = {
      ...draft,
      id: draft.id || `quest-${Date.now()}`,
      title: draft.title.trim(),
      description: draft.description || 'No description yet.',
      xp: Number(draft.xp) || 60,
      status: draft.status || 'today',
      subtasks: draft.subtasks || [],
      proof: draft.proof || { reflection: '', url: '', image: '' },
    }

    setState((current) => {
      const updatedQuests = formMode === 'create' ? [nextQuest, ...current.quests] : current.quests.map((quest) => (quest.id === nextQuest.id ? nextQuest : quest))
      return { ...current, quests: updatedQuests }
    })

    setModalOpen(false)
    setDraft(createBlankQuest())
    showToast(formMode === 'create' ? 'Quest created.' : 'Quest updated.')
  }

  const toggleQuestCompletion = (questId) => {
    setState((current) => ({
      ...current,
      quests: current.quests.map((quest) => {
        if (quest.id !== questId) return quest
        const nextStatus = quest.status === 'completed' ? 'today' : 'completed'
        return { ...quest, status: nextStatus, progress: nextStatus === 'completed' ? 100 : 50 }
      }),
      profile: {
        ...current.profile,
        xp: current.profile.xp + (current.quests.find((quest) => quest.id === questId)?.status === 'completed' ? -15 : 15),
      },
    }))
    showToast('Quest updated.')
  }

  const deleteQuest = (questId) => {
    setState((current) => ({ ...current, quests: current.quests.filter((quest) => quest.id !== questId) }))
    showToast('Quest deleted.')
  }

  const openCreateModal = () => {
    setFormMode('create')
    setDraft(createBlankQuest())
    setModalOpen(true)
  }

  const openEditModal = (quest) => {
    setFormMode('edit')
    setDraft({ ...quest, proof: quest.proof || { reflection: '', url: '', image: '' }, subtasks: quest.subtasks || [] })
    setModalOpen(true)
  }

  const handleProofUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setDraft((current) => ({
        ...current,
        proof: { ...current.proof, image: String(reader.result || '') },
      }))
    }
    reader.readAsDataURL(file)
  }

  const startFocusMode = (quest) => {
    setFocusQuest(quest)
    setFocusSession({
      questId: quest.id,
      duration: 25,
      remaining: 25 * 60,
      running: false,
      finished: false,
      countdownLabel: 'Ready',
    })
  }

  const toggleFocusRunning = () => {
    setFocusSession((current) => (current ? { ...current, running: !current.running } : current))
  }

  const endFocusSession = () => {
    setState((current) => ({
      ...current,
      focusSessions: [
        {
          id: `fs-${Date.now()}`,
          questId: focusQuest?.id || 'session',
          duration: Math.max(1, Math.round((focusSession?.duration || 25) * 0.5)),
          completed: true,
          note: 'A focused sprint completed with care.',
        },
        ...current.focusSessions,
      ],
    }))
    setFocusSession(null)
    setFocusQuest(null)
    showToast('Focus session saved.')
  }

  const remixQuest = (quest) => {
    const variants = [
      { mode: 'Quick Mode', title: questTemplates.quick[0].replace('{title}', quest.title.toLowerCase()) },
      { mode: 'Easier Mode', title: questTemplates.easy[0].replace('{title}', quest.title.toLowerCase()) },
      { mode: 'Challenge Mode', title: questTemplates.challenge[0].replace('{title}', quest.title.toLowerCase()) },
      { mode: 'Creative Mode', title: questTemplates.creative[0].replace('{title}', quest.title.toLowerCase()) },
    ]

    const chosen = variants[0]
    const remixedQuest = {
      ...quest,
      id: `remix-${Date.now()}`,
      title: chosen.title,
      status: 'upcoming',
      difficulty: quest.difficulty === 'Hard' ? 'Medium' : 'Easy',
      xp: Math.max(30, Math.round(quest.xp * 0.7)),
      notes: `Remixed from “${quest.title}” using ${chosen.mode}.`,
    }

    setState((current) => ({ ...current, quests: [remixedQuest, ...current.quests] }))
    setSelectedQuest(null)
    showToast('Quest remix created.')
  }

  const updateQuestField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  const updateSubtask = (index, checked) => {
    setDraft((current) => ({
      ...current,
      subtasks: current.subtasks.map((task, currentIndex) => (currentIndex === index ? { ...task, done: checked } : task)),
    }))
  }

  const steps = state.quests.filter((quest) => quest.status === 'today' || quest.status === 'in-progress' || quest.status === 'upcoming').slice(0, 5)

  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">
              <Rocket size={18} />
            </div>
            <div className="brand-copy">
              <h1>SkillQuest</h1>
              <p>Small quests. Big transformations.</p>
            </div>
          </div>

          <nav className="nav-list">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="left">
                  <Icon size={18} />
                  <span>{label}</span>
                </span>
                {label === 'My Quests' && <span className="nav-badge">{state.quests.length}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-card">
            <h3>Quest streak</h3>
            <strong>{state.profile.streak} day streak</strong>
            <p>Keep the rhythm going — your consistency is compounding.</p>
          </div>
        </aside>

        <main className="content-panel">
          <header className="topbar">
            <h2>Welcome back, {state.profile.name.split(' ')[0]}</h2>
            <div className="topbar-actions">
              <button type="button" className="icon-button" aria-label="Notifications">
                <Bell size={18} />
              </button>
              <button type="button" className="secondary-button">
                <Sparkles size={16} />
                Level {currentLevel}
              </button>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<HomePage quests={steps} state={state} completeCount={completedCount} totalXP={totalXP} currentLevel={currentLevel} levelProgress={levelProgress} toggleQuestCompletion={toggleQuestCompletion} deleteQuest={deleteQuest} openEditModal={openEditModal} setSelectedQuest={setSelectedQuest} startFocusMode={startFocusMode} />} />
            <Route path="/quests" element={<QuestsPage quests={state.quests} toggleQuestCompletion={toggleQuestCompletion} deleteQuest={deleteQuest} openEditModal={openEditModal} setSelectedQuest={setSelectedQuest} />} />
            <Route path="/skills" element={<SkillMapPage skills={state.skills} />} />
            <Route path="/progress" element={<ProgressPage quests={state.quests} profile={state.profile} focusMinutes={focusMinutes} reflections={state.reflections} />} />
            <Route path="/profile" element={<ProfilePage profile={state.profile} quests={state.quests} achievements={state.achievements} reflections={state.reflections} setState={setState} />} />
          </Routes>
        </main>
      </div>

      <button type="button" className="fab" aria-label="Add new quest" onClick={openCreateModal}>
        <Plus size={28} />
      </button>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{formMode === 'create' ? 'Add quest' : 'Edit quest'}</h3>
              <button type="button" className="icon-button" onClick={() => setModalOpen(false)}>
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="form-grid">
              <div className="field full">
                <label htmlFor="quest-title">Quest title</label>
                <input id="quest-title" value={draft.title} onChange={(event) => updateQuestField('title', event.target.value)} placeholder="Design a lesson recap" />
              </div>

              <div className="field full">
                <label htmlFor="quest-description">Description</label>
                <input id="quest-description" value={draft.description} onChange={(event) => updateQuestField('description', event.target.value)} placeholder="A clear, motivating description" />
              </div>

              <div className="field">
                <label htmlFor="quest-category">Category</label>
                <select id="quest-category" value={draft.category} onChange={(event) => updateQuestField('category', event.target.value)}>
                  <option>Learning</option>
                  <option>Creativity</option>
                  <option>Fitness</option>
                  <option>Productivity</option>
                  <option>Personal Growth</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="quest-skill">Related skill</label>
                <input id="quest-skill" value={draft.skill} onChange={(event) => updateQuestField('skill', event.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="quest-duration">Estimated time</label>
                <input id="quest-duration" value={draft.duration} onChange={(event) => updateQuestField('duration', event.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="quest-difficulty">Difficulty</label>
                <select id="quest-difficulty" value={draft.difficulty} onChange={(event) => updateQuestField('difficulty', event.target.value)}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Epic</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="quest-date">Due date</label>
                <input id="quest-date" type="date" value={draft.dueDate || ''} onChange={(event) => updateQuestField('dueDate', event.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="quest-xp">XP reward</label>
                <input id="quest-xp" type="number" min="10" value={draft.xp} onChange={(event) => updateQuestField('xp', Number(event.target.value) || 0)} />
              </div>

              <div className="field">
                <label htmlFor="quest-status">Status</label>
                <select id="quest-status" value={draft.status} onChange={(event) => updateQuestField('status', event.target.value)}>
                  <option value="today">Today</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div className="field full">
                <label htmlFor="quest-notes">Notes</label>
                <input id="quest-notes" value={draft.notes} onChange={(event) => updateQuestField('notes', event.target.value)} placeholder="What do you want to focus on?" />
              </div>

              <div className="field full">
                <label htmlFor="quest-proof">Proof of progress</label>
                <input id="quest-proof" value={draft.proof?.url || ''} onChange={(event) => updateQuestField('proof', { ...draft.proof, url: event.target.value })} placeholder="External project URL" />
              </div>

              <div className="field full">
                <label htmlFor="quest-image">Image upload</label>
                <input id="quest-image" type="file" accept="image/*" onChange={handleProofUpload} />
              </div>

              <div className="field full">
                <label>Checklist</label>
                <div className="subtask-box">
                  {(draft.subtasks || []).map((task, index) => (
                    <label key={task.id || `task-${index}`} className="check-row">
                      <input type="checkbox" checked={task.done} onChange={(event) => updateSubtask(index, event.target.checked)} />
                      <span>{task.label}</span>
                    </label>
                  ))}
                  <button type="button" className="inline-button" onClick={() => setDraft((current) => ({ ...current, subtasks: [...(current.subtasks || []), { id: `new-${Date.now()}`, label: 'New step', done: false }] }))}>
                    Add subtask
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={saveQuest}>
                {formMode === 'create' ? 'Create quest' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedQuest && (
        <div className="modal-backdrop" onClick={() => setSelectedQuest(null)}>
          <div className="modal-card detail-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedQuest.title}</h3>
              <button type="button" className="icon-button" onClick={() => setSelectedQuest(null)}>
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="detail-body">
              <div className="meta-row detail-meta">
                <span className={`tag ${categoryClass[selectedQuest.category]}`}>{selectedQuest.category}</span>
                <span>{selectedQuest.duration}</span>
                <span>•</span>
                <span>{selectedQuest.difficulty}</span>
                <span>•</span>
                <span className="text-accent">{selectedQuest.xp} XP</span>
              </div>

              <p>{selectedQuest.description || 'No description yet.'}</p>

              <div className="detail-grid">
                <div>
                  <strong>Due date</strong>
                  <span>{selectedQuest.dueDate || 'No due date'}</span>
                </div>
                <div>
                  <strong>Related skill</strong>
                  <span>{selectedQuest.skill || 'General growth'}</span>
                </div>
                <div>
                  <strong>Proof of progress</strong>
                  <span>{selectedQuest.evidence || 'No evidence shared yet.'}</span>
                </div>
                <div>
                  <strong>Notes</strong>
                  <span>{selectedQuest.notes || 'No notes yet.'}</span>
                </div>
              </div>

              <div className="subtask-box">
                {(selectedQuest.subtasks || []).length ? (
                  (selectedQuest.subtasks || []).map((task) => (
                    <label key={task.id} className="check-row">
                      <input type="checkbox" checked={task.done} readOnly />
                      <span>{task.label}</span>
                    </label>
                  ))
                ) : (
                  <span className="muted">No checklist items yet.</span>
                )}
              </div>

              <div className="detail-actions">
                <button type="button" className="secondary-button" onClick={() => remixQuest(selectedQuest)}>
                  Remix Quest
                </button>
                <button type="button" className="primary-button" onClick={() => {
                  toggleQuestCompletion(selectedQuest.id)
                  setSelectedQuest(null)
                }}>
                  Mark complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {focusQuest && focusSession && (
        <div className="focus-modal">
          <div className="focus-card">
            <div className="focus-topbar">
              <span className="tiny-label">Focus Mode</span>
              <button type="button" className="icon-button" onClick={() => { setFocusQuest(null); setFocusSession(null) }}>
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="focus-body">
              <h3>{focusQuest.title}</h3>
              <div className="timer-wrap">
                <div className="timer-value">{formatTime(focusSession.remaining)}</div>
                <div className="timer-controls">
                  <button type="button" className="secondary-button" onClick={toggleFocusRunning}>{focusSession.running ? 'Pause' : 'Resume'}</button>
                  <button type="button" className="primary-button" onClick={endFocusSession}>Finish</button>
                </div>
              </div>
              <div className="focus-options">
                {[15, 25, 45].map((minute) => (
                  <button key={minute} type="button" className={`focus-pill ${focusSession.duration === minute ? 'active' : ''}`} onClick={() => setFocusSession((current) => ({ ...current, duration: minute, remaining: minute * 60, running: false }))}>
                    {minute}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </BrowserRouter>
  )
}

function HomePage({ quests, state, completeCount, totalXP, currentLevel, levelProgress, toggleQuestCompletion, deleteQuest, openEditModal, setSelectedQuest, startFocusMode }) {
  const dailyCompletion = Math.min(100, Math.round((completeCount / Math.max(quests.length || 1, 1)) * 100))

  return (
    <>
      <section className="panel-card hero-card">
        <div className="hero-text">
          <div className="hero-kicker">
            <Sparkles size={14} />
            Level {currentLevel}
          </div>
          <h3>Your next adventure starts here.</h3>
          <p>Every little step takes you somewhere.</p>

          <div className="progress-readout">
            <div>
              <div className="level-pill">Level {currentLevel}</div>
              <div className="level-copy">The Curious Explorer</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="meta-row" style={{ justifyContent: 'space-between' }}>
                <strong>{totalXP}</strong>
                <span>{Math.round(levelProgress)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.max(levelProgress, 12)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-illustration">
            <div className="pill-orb one" />
            <div className="pill-orb two" />
            <div className="flag" />
            <div className="person-shape" />
          </div>
        </div>
      </section>

      <div className="content-grid">
        <section className="panel-card section-card">
          <div className="section-header">
            <h3>Today&apos;s Agenda</h3>
            <span className="muted">{dailyCompletion}% done</span>
          </div>

          <div className="quest-list">
            {quests.map((quest) => (
              <div className="quest-item" key={quest.id}>
                <button type="button" className={`check-button ${quest.status === 'completed' ? 'done' : ''}`} aria-label={`Mark ${quest.title} complete`} onClick={() => toggleQuestCompletion(quest.id)}>
                  <Check size={14} />
                </button>

                <div className="quest-main">
                  <h4>{quest.title}</h4>
                  <div className="meta-row">
                    <span className={`tag ${categoryClass[quest.category]}`}>{quest.category}</span>
                    <span>{quest.duration}</span>
                    <span>•</span>
                    <span>{quest.difficulty}</span>
                    <span>•</span>
                    <span>{quest.xp} XP</span>
                  </div>
                </div>

                <div className="quest-actions">
                  <button type="button" className="icon-ghost" onClick={() => startFocusMode(quest)} aria-label="Start focus mode">
                    <Zap size={14} />
                  </button>
                  <button type="button" className="icon-ghost" onClick={() => setSelectedQuest(quest)} aria-label="View quest details">
                    <NotebookPen size={14} />
                  </button>
                  <button type="button" className="icon-ghost" onClick={() => openEditModal(quest)} aria-label="Edit quest">
                    <PencilLine size={14} />
                  </button>
                  <button type="button" className="icon-ghost" onClick={() => deleteQuest(quest.id)} aria-label="Delete quest">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel-card section-card">
          <div className="section-header">
            <h3>Quick Stats</h3>
            <span className="muted">This week</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="label">Completed</span>
              <strong>{completeCount}</strong>
              <div className="metric-row">
                <span>quests</span>
                <Star size={14} color="#ff8958" />
              </div>
            </div>
            <div className="stat-card">
              <span className="label">XP Earned</span>
              <strong>{totalXP}</strong>
              <div className="metric-row">
                <span>total</span>
                <Zap size={14} color="#7fa8bb" />
              </div>
            </div>
            <div className="stat-card">
              <span className="label">Skills</span>
              <strong>{state.skills.filter((skill) => skill.state !== 'available').length}</strong>
              <div className="metric-row">
                <span>explored</span>
                <BrainCircuit size={14} color="#ff8958" />
              </div>
            </div>
            <div className="stat-card">
              <span className="label">Best streak</span>
              <strong>{state.profile.streak}</strong>
              <div className="metric-row">
                <span>days</span>
                <Flame size={14} color="#ff8958" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="content-grid" style={{ marginTop: 24 }}>
        <section className="panel-card section-card">
          <div className="section-header">
            <h3>Active Challenges</h3>
            <button type="button" className="secondary-button">
              View all <ArrowRight size={15} />
            </button>
          </div>

          <div className="challenge-strip">
            {state.challenges.map((challenge) => (
              <div key={challenge.id} className="challenge-card">
                <div className="challenge-figure" />
                <h4>{challenge.title}</h4>
                <p>{challenge.completed} of {challenge.total} milestones complete</p>
                <div className="progress-track" style={{ width: '100%', marginTop: 12 }}>
                  <div className="progress-fill" style={{ width: `${challenge.progress}%` }} />
                </div>
                <div className="challenge-meta">
                  <span>{challenge.xp} XP</span>
                  <button type="button" className="secondary-button" style={{ padding: '7px 10px', fontSize: '0.72rem' }}>
                    View challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function QuestsPage({ quests, toggleQuestCompletion, deleteQuest, openEditModal, setSelectedQuest }) {
  const [activeFilter, setActiveFilter] = useState('today')

  const filteredQuests = useMemo(() => {
    if (activeFilter === 'all') return quests
    return quests.filter((quest) => quest.status === activeFilter)
  }, [activeFilter, quests])

  const sortingOptions = ['dueDate', 'difficulty', 'xp', 'duration']
  const [sortBy, setSortBy] = useState('dueDate')

  const sortedQuests = useMemo(() => {
    const copy = [...filteredQuests]
    switch (sortBy) {
      case 'difficulty':
        return copy.sort((a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty))
      case 'xp':
        return copy.sort((a, b) => b.xp - a.xp)
      case 'duration':
        return copy.sort((a, b) => parseInt(b.duration, 10) - parseInt(a.duration, 10))
      default:
        return copy.sort((a, b) => new Date(a.dueDate || '2026-11-12') - new Date(b.dueDate || '2026-11-12'))
    }
  }, [filteredQuests, sortBy])

  return (
    <section className="panel-card page-card">
      <div className="page-header">
        <h3>My Quests</h3>
        <button type="button" className="primary-button">
          <CalendarCheck2 size={16} />
          This Week
        </button>
      </div>

      <div className="toolbar-row">
        <div className="filter-row">
          <button type="button" className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
            All
          </button>
          {['today', 'upcoming', 'in-progress', 'completed', 'paused'].map((filter) => (
            <button key={filter} type="button" className={`filter-pill ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>
              {filter.replace('-', ' ')}
            </button>
          ))}
        </div>

        <select className="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          {sortingOptions.map((option) => (
            <option key={option} value={option}>{option === 'dueDate' ? 'Due date' : option === 'difficulty' ? 'Difficulty' : option === 'xp' ? 'XP reward' : 'Duration'}</option>
          ))}
        </select>
      </div>

      <div className="quest-group">
        {sortedQuests.map((quest) => (
          <div className="quest-tile" key={quest.id}>
            <div className="meta-row">
              <span className={`tag ${categoryClass[quest.category]}`}>{quest.category}</span>
              <span>{quest.duration}</span>
            </div>
            <h4>{quest.title}</h4>
            <p>{quest.description || quest.notes}</p>
            <div className="quest-bottom">
              <span className="text-accent">{quest.xp} XP</span>
              <div className="quest-actions">
                <button type="button" className="icon-ghost" onClick={() => setSelectedQuest(quest)}>
                  <Target size={14} />
                </button>
                <button type="button" className="icon-ghost" onClick={() => openEditModal(quest)}>
                  <PencilLine size={14} />
                </button>
                <button type="button" className="icon-ghost" onClick={() => toggleQuestCompletion(quest.id)}>
                  <Check size={14} />
                </button>
                <button type="button" className="icon-ghost" onClick={() => deleteQuest(quest.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SkillMapPage({ skills }) {
  return (
    <section className="panel-card page-card">
      <div className="page-header">
        <h3>Skill Map</h3>
        <button type="button" className="secondary-button">
          <Rocket size={16} />
          Next milestone
        </button>
      </div>

      <div className="skillmap-wrap">
        {skills.map((skill) => (
          <div key={skill.id} className={`skill-node ${skill.state === 'mastered' ? 'active' : ''} ${skill.state}`} style={{ left: `${skill.x}%`, top: `${skill.y}%`, transform: 'translate(-50%, -50%)' }}>
            <strong>{skill.name}</strong>
            <span>{skill.level} • {skill.state}</span>
          </div>
        ))}

        <div className="skill-connector" style={{ left: '18%', top: '22%', width: '26%', transform: 'rotate(10deg)' }} />
        <div className="skill-connector" style={{ left: '31%', top: '29%', width: '30%', transform: 'rotate(16deg)' }} />
        <div className="skill-connector" style={{ left: '46%', top: '22%', width: '28%', transform: 'rotate(-12deg)' }} />
        <div className="skill-connector" style={{ left: '38%', top: '58%', width: '26%', transform: 'rotate(12deg)' }} />
        <div className="skill-connector" style={{ left: '57%', top: '62%', width: '20%', transform: 'rotate(-12deg)' }} />
      </div>
    </section>
  )
}

function ProgressPage({ quests, profile, focusMinutes, reflections }) {
  const completed = quests.filter((quest) => quest.status === 'completed').length
  const percent = Math.round((completed / Math.max(quests.length, 1)) * 100)
  const strongestCategory = 'Learning'

  return (
    <div className="progress-layout">
      <section className="panel-card ring-card">
        <div className="progress-ring" style={{ '--progress': percent }}>
          <div className="ring-inner">
            <strong>{percent}%</strong>
            <span>completion</span>
          </div>
        </div>
      </section>

      <section className="panel-card chart-panel">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h3>Weekly momentum</h3>
          <span className="muted">+18% from last week</span>
        </div>

        <div className="week-bars">
          {[52, 68, 74, 46, 88, 65, 93].map((value, index) => (
            <div key={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]} className="bar-col">
              <div className="bar" style={{ height: `${value}%` }} />
              <span>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProfilePage({ profile, quests, achievements, reflections, setState }) {
  const [journal, setJournal] = useState({
    learn: '',
    enjoyable: '',
    difficult: '',
    proud: '',
    improve: '',
  })

  const latest = reflections[0]

  const saveReflection = () => {
    if (!journal.learn.trim()) return
    setState((current) => ({
      ...current,
      reflections: [
        {
          id: `ref-${Date.now()}`,
          week: `Week ${new Date().getWeek}`,
          summary: journal.learn,
          answers: journal,
        },
        ...current.reflections,
      ],
    }))
  }

  return (
    <div className="profile-shell">
      <section className="panel-card profile-card">
        <div className="avatar" />
        <h3>{profile.name}</h3>
        <p>{profile.bio}</p>

        <div className="profile-info">
          <div className="info-pill">
            <span>Level</span>
            <strong>{Math.floor(profile.xp / 250) + 1}</strong>
          </div>
          <div className="info-pill">
            <span>XP</span>
            <strong>{profile.xp}</strong>
          </div>
          <div className="info-pill">
            <span>Streak</span>
            <strong>{profile.streak}d</strong>
          </div>
        </div>
      </section>

      <section className="panel-card page-card">
        <div className="page-header">
          <h3>Achievements</h3>
          <button type="button" className="secondary-button">
            View all
          </button>
        </div>

        <div className="achievement-list">
          {achievements.map((item) => (
            <div key={item.id} className="achievement-item">
              <div className="achievement-icon"><Trophy size={18} /></div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="journal-card">
          <h4>Weekly reflection</h4>
          <div className="journal-grid">
            <textarea value={journal.learn} onChange={(event) => setJournal((current) => ({ ...current, learn: event.target.value }))} placeholder="What did you learn this week?" />
            <textarea value={journal.enjoyable} onChange={(event) => setJournal((current) => ({ ...current, enjoyable: event.target.value }))} placeholder="Which quest was most enjoyable?" />
            <textarea value={journal.difficult} onChange={(event) => setJournal((current) => ({ ...current, difficult: event.target.value }))} placeholder="What was difficult?" />
            <textarea value={journal.proud} onChange={(event) => setJournal((current) => ({ ...current, proud: event.target.value }))} placeholder="What are you proud of?" />
            <textarea value={journal.improve} onChange={(event) => setJournal((current) => ({ ...current, improve: event.target.value }))} placeholder="What would you like to improve next week?" />
          </div>
          <button type="button" className="primary-button" onClick={saveReflection}>Save reflection</button>
        </div>

        {latest && (
          <div className="reflection-card">
            <h4>Recent journal</h4>
            <p>{latest.summary}</p>
            <ul>
              <li><strong>Learn:</strong> {latest.answers.learn}</li>
              <li><strong>Enjoyed:</strong> {latest.answers.enjoyable}</li>
              <li><strong>Difficult:</strong> {latest.answers.difficult}</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

export default App
