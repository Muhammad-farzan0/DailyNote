import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, LayoutDashboard, Kanban, Clock, BarChart3, 
  Users, Settings, Shield, Zap, Smartphone, Globe, 
  Lock, ChevronRight, CheckCircle, Sparkles, TrendingUp,
  Calendar, MessageSquare, CheckSquare, Eye, Edit, Trash2,
  Move, PlusCircle, Search, Bell, Mail, Github, Chrome
} from 'lucide-react';

export default function Documentation() {
  const sectionRefs = {
    overview: useRef(null),
    features: useRef(null),
    timers: useRef(null),
    analytics: useRef(null),
    collaboration: useRef(null),
    ai: useRef(null),
    useCases: useRef(null),
    techStack: useRef(null),
    gettingStarted: useRef(null),
  };

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sections = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'features', icon: Sparkles, label: 'Core Features' },
    { id: 'timers', icon: Clock, label: 'Timer System' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'collaboration', icon: Users, label: 'Collaboration' },
    { id: 'ai', icon: Zap, label: 'AI Assistant' },
    { id: 'useCases', icon: Globe, label: 'Use Cases' },
    { id: 'techStack', icon: Settings, label: 'Tech Stack' },
    { id: 'gettingStarted', icon: BookOpen, label: 'Getting Started' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Header - fixed alignment */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left mb-8 md:mb-10"
        >
          <div className="inline-flex items-center justify-center md:justify-start gap-3 mb-2">
            <BookOpen size={32} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Documentation
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
            Complete guide to DailyNote – features, usage, and technical overview.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar TOC - sticky, clean background */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <ChevronRight size={18} className="text-blue-500" /> On this page
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
                  >
                    <section.icon size={16} className="text-blue-500 flex-shrink-0" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content - clean backgrounds, no glass blur on mobile */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
            {/* Overview */}
            <section ref={sectionRefs.overview} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                <LayoutDashboard size={24} className="text-blue-500" /> Overview
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                <strong>DailyNote</strong> is a modern, Trello‑style task management application designed for teams and individuals. 
                It combines intuitive board organisation with advanced features like <strong>task timers</strong>, <strong>real‑time collaboration</strong>,
                <strong>AI assistance</strong>, and <strong>detailed analytics</strong> – all completely free and open‑source.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Built with a focus on productivity, DailyNote helps you track tasks, meet deadlines, 
                and analyse team performance. The responsive design works seamlessly on desktop, tablet, and mobile.
              </p>
            </section>

            {/* Core Features - using clean cards */}
            <section ref={sectionRefs.features} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-5 text-gray-900 dark:text-white">
                <Sparkles size={24} className="text-yellow-500" /> Core Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Kanban, title: 'Board & Lists', desc: 'Create unlimited boards with custom lists (To Do, In Progress, Completed, Incomplete).' },
                  { icon: PlusCircle, title: 'Drag & Drop Cards', desc: 'Easily move cards between lists with instant optimistic updates.' },
                  { icon: Edit, title: 'Rich Card Details', desc: 'Add descriptions, due dates, checklists, labels, assignees, and comments.' },
                  { icon: Clock, title: 'Smart Timers', desc: 'Set time limits per task; auto‑move to Incomplete when expired.' },
                  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'View task distribution, completion rates, activity trends, and average time per task.' },
                  { icon: Users, title: 'Team Collaboration', desc: 'Add members to boards; everyone can create, edit, delete cards.' },
                  { icon: Search, title: 'Global Search', desc: 'Quickly find cards across all boards.' },
                  { icon: Bell, title: 'Notifications', desc: 'Real‑time in‑app alerts for timer expiry and mentions.' },
                  { icon: Mail, title: 'Email Notifications', desc: 'Optional email alerts (Ethereal test SMTP included).' },
                  { icon: Github, title: 'OAuth Login', desc: 'Sign in with Google, GitHub, or email/password.' },
                  { icon: Smartphone, title: 'Mobile Friendly', desc: 'Fully responsive with collapsible sidebar and touch‑optimised controls.' },
                  { icon: Zap, title: 'AI Assistant', desc: 'Generate task descriptions and suggest deadlines using Hugging Face free models.' },
                ].map((feat, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <feat.icon size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">{feat.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Timer System */}
            <section ref={sectionRefs.timers} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                <Clock size={24} className="text-orange-500" /> Timer System
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>DailyNote includes a unique timer feature to boost productivity:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Set a timer (in minutes) on any card via the edit modal.</li>
                  <li>Timer <strong>starts automatically</strong> when the card is moved to <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded">In Progress</span>.</li>
                  <li><strong>Visual progress ring</strong> on the card shows remaining time.</li>
                  <li>If the timer expires while still in progress, the card <strong>auto‑moves</strong> to <span className="bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">Incomplete</span> and receives an “Overdue” label.</li>
                  <li>Analytics calculates the <strong>average actual time</strong> taken to complete tasks (not just the timer limit).</li>
                </ul>
              </div>
            </section>

            {/* Analytics */}
            <section ref={sectionRefs.analytics} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                <BarChart3 size={24} className="text-purple-500" /> Analytics Dashboard
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-2">
                <li><strong>Bar chart</strong> – shows number of tasks by status (Todo, In Progress, Completed, Incomplete).</li>
                <li><strong>Pie chart</strong> – overall completion rate.</li>
                <li><strong>Line chart</strong> – daily activity for the last 7 days.</li>
                <li><strong>Key metrics</strong> – total tasks, completed tasks, completion rate %, average time per task (minutes).</li>
                <li>Select any board to view its individual analytics.</li>
              </ul>
            </section>

            {/* Collaboration */}
            <section ref={sectionRefs.collaboration} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                <Users size={24} className="text-green-500" /> Collaboration & Permissions
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-2">
                <li><strong>Board owner</strong> can add/remove members, edit board name, delete board.</li>
                <li><strong>All members</strong> can view board, create/edit/move/delete cards, add comments, use AI features.</li>
                <li><strong>Real‑time updates</strong> via WebSockets – changes appear instantly to all members.</li>
                <li><strong>Activity log</strong> records every action (created, moved, deleted cards, added members).</li>
              </ul>
            </section>

            {/* AI Assistant */}
            <section ref={sectionRefs.ai} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                <Zap size={24} className="text-indigo-500" /> AI Assistant (Free)
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-2">
                <li><strong>Generate description</strong> – type a prompt (e.g., “Write a detailed checklist for design review”) and AI writes content.</li>
                <li><strong>Suggest deadline</strong> – based on card title (e.g., “urgent” → tomorrow).</li>
                <li>Floating AI chat bubble available on every page for quick assistance.</li>
              </ul>
            </section>

            {/* Use Cases */}
            <section ref={sectionRefs.useCases} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                <Globe size={24} className="text-teal-500" /> Use Cases
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><h3 className="font-semibold flex items-center gap-1"><CheckCircle size={16} /> Personal Task Management</h3><p className="text-sm text-gray-600 dark:text-gray-400">Organise daily to‑dos, track habits, set timers for focused work.</p></div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><h3 className="font-semibold flex items-center gap-1"><CheckCircle size={16} /> Team Projects</h3><p className="text-sm text-gray-600 dark:text-gray-400">Assign tasks, monitor progress, collaborate in real time.</p></div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><h3 className="font-semibold flex items-center gap-1"><CheckCircle size={16} /> Agile Sprints</h3><p className="text-sm text-gray-600 dark:text-gray-400">Use lists as sprint backlog, in progress, done; track velocity with analytics.</p></div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><h3 className="font-semibold flex items-center gap-1"><CheckCircle size={16} /> Client Work</h3><p className="text-sm text-gray-600 dark:text-gray-400">Share boards with clients, add due dates, use AI to draft tasks.</p></div>
              </div>
            </section>

            {/* Tech Stack */}
            <section ref={sectionRefs.techStack} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                <Settings size={24} className="text-gray-500" /> Technology Stack
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div><strong>Frontend:</strong> React 19, TailwindCSS, Framer Motion, dnd‑kit, Recharts, Socket.io‑client</div>
                <div><strong>Backend:</strong> Node.js, Express, MongoDB, Mongoose, Passport.js, Socket.io</div>
                <div><strong>Auth:</strong> JWT, OAuth2 (Google, GitHub), bcryptjs</div>
                <div><strong>Real‑time:</strong> WebSockets (Socket.io)</div>
                <div><strong>AI:</strong> Hugging Face Inference API (free models)</div>
                <div><strong>Deployment:</strong> Vercel (frontend) / Render (backend) / MongoDB Atlas</div>
              </div>
            </section>

            {/* Getting Started */}
            <section ref={sectionRefs.gettingStarted} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                <BookOpen size={24} className="text-green-500" /> Getting Started
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-2">
                <li>Sign up with email or use Google/GitHub OAuth.</li>
                <li>Create your first board – default lists (To Do, In Progress, Completed, Incomplete) are auto‑generated.</li>
                <li>Add lists by clicking “Add another list”.</li>
                <li>Create cards: click “Add a card”, then edit to add description, due date, timer, checklist, assignees.</li>
                <li>Drag cards between lists – timers start when moved to “In Progress”.</li>
                <li>Invite team members via the “Members” button (owner only).</li>
                <li>Monitor analytics from the sidebar.</li>
                <li>Use AI assistant (sparkles icon) to generate descriptions or suggest deadlines.</li>
              </ol>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <p className="text-sm flex items-center gap-2 text-blue-800 dark:text-blue-200"><Shield size={16} /> <strong>Privacy & Free Forever:</strong> DailyNote uses no paid APIs. All features are completely free, self‑hosted, or hosted on free tiers (MongoDB Atlas, Render, Vercel).</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}