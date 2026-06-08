import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  LayoutDashboard,
  Kanban,
  Clock,
  BarChart3,
  Users,
  Settings,
  Shield,
  Zap,
  Smartphone,
  Globe,
  Lock,
  ChevronRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Calendar,
  MessageSquare,
  CheckSquare,
  Eye,
  Edit,
  Trash2,
  Move,
  PlusCircle,
  Search,
  Bell,
  Mail,
  Github,
  Chrome,
  AlertTriangle,
  Infinity,
  PieChart,
  LineChart,
  Activity,
  Timer,
  UserPlus,
  Share2,
  MessageCircle,
  FileText,
  Download,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";

export default function Documentation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sectionRefs = {
    overview: useRef(null),
    vsTrello: useRef(null),
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
    setMobileMenuOpen(false);
    sectionRefs[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sections = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    
    { id: "features", icon: Sparkles, label: "Core Features" },
    { id: "timers", icon: Clock, label: "Timer System" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "collaboration", icon: Users, label: "Collaboration" },
    { id: "ai", icon: Zap, label: "AI Assistant" },
    { id: "useCases", icon: Globe, label: "Use Cases" },
    { id: "techStack", icon: Settings, label: "Tech Stack" },
    { id: "vsTrello", icon: AlertTriangle, label: "Vs Trello Free" },
    { id: "gettingStarted", icon: BookOpen, label: "Getting Started" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left mb-6 md:mb-8"
        >
          <div className="inline-flex items-center justify-center md:justify-start gap-3 mb-2">
            <BookOpen size={32} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Documentation
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
            Complete guide to DailyNote – unlimited free features, advanced
            timer & analytics.
          </p>
        </motion.div>

        {/* Mobile TOC: horizontal scroll + hamburger for better UX */}
        <div className="lg:hidden mb-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              <span>Jump to section</span>
            </button>
            <div className="overflow-x-auto pb-1 -mx-2 px-2 flex-1 ml-2">
              <div className="flex gap-2 min-w-max">
                {sections.slice(0, 10).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-sm font-medium shadow-sm border whitespace-nowrap"
                  >
                    <section.icon size={14} className="text-blue-500" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3 grid grid-cols-2 gap-2 border"
              >
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <section.icon size={16} className="text-blue-500" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main layout: desktop uses grid with sidebar */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop TOC sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 ">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ChevronRight size={18} className="text-blue-500" /> On this
                page
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
                  >
                    <section.icon
                      size={16}
                      className="text-blue-500 flex-shrink-0"
                    />
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* ========== OVERVIEW ========== */}
            <section
              ref={sectionRefs.overview}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 "
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <LayoutDashboard size={24} className="text-blue-500" /> Overview
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                <strong>DailyNote</strong> is a modern, Trello‑style task
                management application designed for teams and individuals. It
                combines intuitive board organisation with advanced features
                like <strong>task timers</strong>,{" "}
                <strong>real‑time collaboration</strong>,
                <strong>AI assistance</strong>, and{" "}
                <strong>detailed analytics</strong> –{" "}
                <span className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded font-semibold">
                  100% free and open‑source
                </span>
                .
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Built with a focus on productivity, DailyNote helps you track
                tasks, meet deadlines, and analyse team performance. The
                responsive design works seamlessly on desktop, tablet, and
                mobile. No hidden costs, no member limits, no feature paywalls.
              </p>
            </section>

            {/* ========== CORE FEATURES (detailed) ========== */}
            <section
              ref={sectionRefs.features}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 "
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-5">
                <Sparkles size={24} className="text-yellow-500" /> Core Features
                – Deep Dive
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FeatureCard
                    icon={Kanban}
                    title="Board & Lists"
                    description="Create unlimited boards. Each board comes with default lists: To Do, In Progress, Completed, Incomplete. Add/remove/reorder lists freely. Every list can hold infinite cards."
                  />
                  <FeatureCard
                    icon={Move}
                    title="Drag & Drop Cards"
                    description="Intuitive drag‑and‑drop powered by dnd‑kit. Cards move instantly between lists. Optimistic UI updates – feels snappy even on slow connections."
                  />
                  <FeatureCard
                    icon={Edit}
                    title="Rich Card Editor"
                    description="Modal with description (markdown supported), due date picker, checklist with sub‑tasks, colour labels (e.g., bug, feature), assignees, and timer. Also supports comments from team members."
                  />
                  <FeatureCard
                    icon={CheckSquare}
                    title="Checklists"
                    description="Break down tasks into sub‑items. Track progress with a completion percentage shown directly on the card. Useful for complex tasks like 'Launch checklist'."
                  />
                  <FeatureCard
                    icon={Calendar}
                    title="Due Dates & Reminders"
                    description="Set deadline per card. Overdue cards get visual warning. Optional email reminder 1 hour before due time (configured via SMTP)."
                  />
                  <FeatureCard
                    icon={Search}
                    title="Global Search"
                    description="Search across all boards and cards. Filters by title, description, assignee, label. Works instantly with debounced input."
                  />
                  <FeatureCard
                    icon={Bell}
                    title="Real‑time Notifications"
                    description="In‑app toast notifications when: timer expires, you're mentioned in a comment, a card you follow is moved, or someone adds you to a board."
                  />
                  <FeatureCard
                    icon={Smartphone}
                    title="Full Mobile Support"
                    description="Responsive design with collapsible sidebar, touch‑friendly drag handles, and bottom sheet modals on small screens. Works on iOS and Android browsers."
                  />
                </div>
              </div>
            </section>

            {/* ========== TIMER SYSTEM (detailed) ========== */}
            <section
              ref={sectionRefs.timers}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 "
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Clock size={24} className="text-orange-500" /> Timer System –
                How It Works
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Why timers?</strong> Boost focus and avoid tasks
                  lingering in "In Progress" forever. DailyNote's timer is
                  inspired by Pomodoro but fully flexible.
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <strong>Setting a timer:</strong> When creating/editing a
                    card, enter a duration in minutes (1 to 1440).
                  </li>
                  <li>
                    <strong>Auto‑start trigger:</strong> Timer{" "}
                    <strong>starts automatically</strong> the moment the card is
                    moved to{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded font-mono">
                      In Progress
                    </span>
                    .
                  </li>
                  <li>
                    <strong>Visual feedback:</strong> Each card in progress
                    shows a circular progress ring (SVG) that ticks down.
                    Remaining time displayed in mm:ss.
                  </li>
                  <li>
                    <strong>Expiry action:</strong> Once timer reaches zero, the
                    system automatically moves the card to{" "}
                    <span className="bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">
                      Incomplete
                    </span>
                    , adds an "Overdue" label, and sends a notification to all
                    board members.
                  </li>
                  <li>
                    <strong>Manual stop:</strong> If you finish early, simply
                    move the card to "Completed" – timer stops and logs the
                    actual time taken.
                  </li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl">
                  <p className="text-sm flex gap-2">
                    <Timer size={18} className="text-blue-500" />{" "}
                    <strong>Pro tip:</strong> Use timers on repetitive tasks to
                    see if you're improving over time – the Analytics page
                    calculates average completion time per board.
                  </p>
                </div>
              </div>
            </section>

            {/* ========== ANALYTICS (full detail) ========== */}
            <section
              ref={sectionRefs.analytics}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 "
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <BarChart3 size={24} className="text-purple-500" /> Analytics
                Dashboard – Everything You Can Track
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  DailyNote provides a <strong>full analytics suite</strong>{" "}
                  that helps you understand productivity patterns. Access it via
                  the sidebar menu "Analytics".
                </p>

                <h3 className="text-xl font-semibold mt-4 flex items-center gap-2">
                  <PieChart size={20} /> 1. Task Distribution (Bar Chart)
                </h3>
                <p>
                  Shows number of cards in each list (To Do, In Progress,
                  Completed, Incomplete). Useful to see at a glance if your
                  backlog is growing or if too many tasks are stuck in progress.
                </p>

                <h3 className="text-xl font-semibold mt-4 flex items-center gap-2">
                  <PieChart size={20} /> 2. Completion Rate (Pie Chart)
                </h3>
                <p>
                  Percentage of completed tasks vs incomplete + todo. Filter by
                  board to see which projects are on track.
                </p>

                <h3 className="text-xl font-semibold mt-4 flex items-center gap-2">
                  <LineChart size={20} /> 3. Daily Activity (Line Chart)
                </h3>
                <p>
                  Tracks how many tasks were <strong>completed</strong> each day
                  over the last 7 days. Helps identify your most productive days
                  of the week.
                </p>

                <h3 className="text-xl font-semibold mt-4 flex items-center gap-2">
                  <Activity size={20} /> 4. Key Metrics Cards
                </h3>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>
                    <strong>Total tasks</strong> – all cards in the selected
                    board (or all boards if "All Boards" selected).
                  </li>
                  <li>
                    <strong>Completed tasks</strong> – cards in "Completed"
                    list.
                  </li>
                  <li>
                    <strong>Completion rate %</strong> – completed / total *
                    100.
                  </li>
                  <li>
                    <strong>Average time per task (minutes)</strong> – only for
                    tasks that had a timer and were completed. Real data, not
                    just the timer limit.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mt-4 flex items-center gap-2">
                  <LayoutDashboard size={20} /> Board Selector
                </h3>
                <p>
                  At the top of the Analytics page, a dropdown lets you choose
                  between "All Boards" or any specific board. Charts and metrics
                  update instantly without page reload.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-3">
                  <p>
                    <strong>✨ What's different from Trello?</strong> Trello's
                    free version offers only one dashboard with very limited
                    metrics. DailyNote gives you multiple chart types, real
                    board filtering, and timer performance analysis – all free.
                  </p>
                </div>
              </div>
            </section>

            {/* ========== COLLABORATION (detailed) ========== */}
            <section
              ref={sectionRefs.collaboration}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 "
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Users size={24} className="text-green-500" /> Collaboration &
                Permissions (Unlimited Members)
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Add as many members as you want</strong> to any board
                  – no 10‑member limit like Trello Free. DailyNote is built for
                  real teams.
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <strong>Roles:</strong> Board owner (creator) can add/remove
                    members, edit board name, delete board. All members have
                    full read/write access to cards (create, edit, move, delete,
                    comment).
                  </li>
                  <li>
                    <strong>Real‑time presence:</strong> When a member moves a
                    card or adds a comment, every other online member sees the
                    change instantly (WebSockets). No need to refresh.
                  </li>
                  <li>
                    <strong>Activity log:</strong> Every board has an activity
                    feed showing who did what and when (e.g., "Ali moved 'Fix
                    login bug' from In Progress to Completed").
                  </li>
                  <li>
                    <strong>Mentions:</strong> Type @username in a comment –
                    that user gets an in‑app notification and (optional) email
                    alert.
                  </li>
                  <li>
                    <strong>Invite link:</strong> Board owner can generate a
                    shareable link to invite new members without manually adding
                    emails.
                  </li>
                </ul>
                <div className="flex flex-wrap gap-3 mt-2 text-sm bg-gray-100 dark:bg-gray-700/40 p-3 rounded-lg">
                  <span className="flex items-center gap-1">
                    <UserPlus size={16} /> Unlimited invites
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 size={16} /> Shareable links
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} /> Threaded comments
                  </span>
                </div>
              </div>
            </section>

            {/* ========== AI ASSISTANT ========== */}
            <section
              ref={sectionRefs.ai}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 "
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Zap size={24} className="text-indigo-500" /> AI Assistant
                (Powered by Hugging Face – Free)
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-2">
                <li>
                  <strong>Generate task description:</strong> Click the sparkle
                  icon in the card editor, type a prompt like "Write steps to
                  set up MongoDB", and AI fills the description field.
                </li>
                <li>
                  <strong>Suggest deadline:</strong> Based on card title (e.g.,
                  "Urgent client report" → suggests tomorrow). You can accept or
                  adjust.
                </li>
                <li>
                  <strong>Floating chat bubble:</strong> Visible on every page –
                  ask general productivity questions or get quick help with
                  DailyNote features.
                </li>
                <li>
                  <strong>No API keys required:</strong> DailyNote uses a free
                  Hugging Face inference endpoint. No usage limits for basic
                  operations.
                </li>
              </ul>
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-sm">
                <p>
                  <strong>Example AI prompts:</strong> "Draft a checklist for
                  code review", "Suggest a deadline for 'Prepare Q3
                  presentation'", "Summarise this task: …"
                </p>
              </div>
            </section>

            {/* ========== USE CASES (expanded) ========== */}
            <section
              ref={sectionRefs.useCases}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 "
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Globe size={24} className="text-teal-500" /> Use Cases – Who
                Benefits?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UseCaseCard
                  title="Freelancers"
                  desc="Manage client projects, set timers for billable hours, share read‑only boards with clients."
                />
                <UseCaseCard
                  title="Startups"
                  desc="Unlimited team members, sprint planning with drag & drop, real‑time standup updates."
                />
                <UseCaseCard
                  title="Students"
                  desc="Track assignments, group projects, use timers for study sessions, AI to generate study guides."
                />
                <UseCaseCard
                  title="Open Source Maintainers"
                  desc="Organise issues, community contributions, activity log for transparency."
                />
                <UseCaseCard
                  title="Personal Productivity"
                  desc="Habit tracking, grocery lists (with checklists), daily planner with due dates."
                />
                <UseCaseCard
                  title="Remote Teams"
                  desc="Async collaboration, timezone‑aware due dates, notifications via email when offline."
                />
              </div>
            </section>

            {/* ========== TECH STACK (detailed) ========== */}
            <section
              ref={sectionRefs.techStack}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 "
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Settings size={24} className="text-gray-500" /> Technology
                Stack – Under the Hood
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="block">Frontend</strong> React 19,
                  TailwindCSS, Framer Motion, dnd‑kit, Recharts,
                  Socket.io‑client, Axios
                </div>
                <div>
                  <strong className="block">Backend</strong> Node.js + Express,
                  MongoDB (Mongoose), Socket.io, JWT, Passport.js
                  (Google/GitHub)
                </div>
                <div>
                  <strong className="block">Real‑time</strong> WebSockets with
                  automatic reconnection, presence tracking, typing indicators
                </div>
                <div>
                  <strong className="block">AI Integration</strong> Hugging Face
                  Inference API (free models: gpt2, bloom‑560m for text
                  generation)
                </div>
                <div>
                  <strong className="block">Hosting (optional)</strong>{" "}
                  Frontend: Vercel/Netlify, Backend: Render/Railway, DB: MongoDB
                  Atlas free tier
                </div>
                <div>
                  <strong className="block">DevOps</strong> Environment
                  variables, CORS setup, rate limiting, Helmet for security
                </div>
              </div>
            </section>
            {/* ========== VS TRELLO FREE ========== */}
            <section
              ref={sectionRefs.vsTrello}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 border border-yellow-200 dark:border-yellow-800"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-yellow-700 dark:text-yellow-400">
                <AlertTriangle size={24} /> DailyNote vs Trello Free
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm md:text-base text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-2 px-3 font-semibold">Feature</th>
                      <th className="py-2 px-3 font-semibold text-red-600">
                        Trello Free
                      </th>
                      <th className="py-2 px-3 font-semibold text-green-600">
                        DailyNote
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr>
                      <td className="py-2 px-3">Members per board</td>
                      <td className="py-2 px-3 text-red-600">Max 10</td>
                      <td className="py-2 px-3 text-green-600">
                        <Infinity size={16} className="inline" /> Unlimited
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Boards per workspace</td>
                      <td className="py-2 px-3 text-red-600">Unlimited</td>
                      <td className="py-2 px-3 text-green-600">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Attachments</td>
                      <td className="py-2 px-3 text-red-600">10 MB max</td>
                      <td className="py-2 px-3 text-green-600">
                        No limit (cloud storage independent)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Automation (Butler)</td>
                      <td className="py-2 px-3 text-red-600">
                        1 command per board
                      </td>
                      <td className="py-2 px-3 text-green-600">
                        Smart timers + auto‑move (unlimited)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">AI assistance</td>
                      <td className="py-2 px-3 text-red-600">Not available</td>
                      <td className="py-2 px-3 text-green-600">
                        Free Hugging Face AI (generate description, deadlines)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Analytics dashboard</td>
                      <td className="py-2 px-3 text-red-600">
                        Basic (only 1 dashboard)
                      </td>
                      <td className="py-2 px-3 text-green-600">
                        Full charts: bar, pie, line + metrics by board
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Timer per task</td>
                      <td className="py-2 px-3 text-red-600">
                        No native timer
                      </td>
                      <td className="py-2 px-3 text-green-600">
                        Built‑in timer with visual ring, auto‑move on expiry
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Real‑time updates</td>
                      <td className="py-2 px-3 text-red-600">
                        Yes, but limited
                      </td>
                      <td className="py-2 px-3 text-green-600">
                        WebSocket powered, instant sync
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">OAuth login</td>
                      <td className="py-2 px-3 text-red-600">Google only</td>
                      <td className="py-2 px-3 text-green-600">
                        Google + GitHub + email/password
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Cost</td>
                      <td className="py-2 px-3 text-red-600">
                        Freemium (many limits)
                      </td>
                      <td className="py-2 px-3 text-green-600 font-bold">
                        100% Free forever
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <strong>DailyNote</strong> removes Trello's
                frustrating free‑tier limits. Invite your whole team, use
                advanced timers, get full analytics – no credit card, ever.
              </p>
            </section>
            {/* ========== GETTING STARTED (step-by-step) ========== */}
            <section
              ref={sectionRefs.gettingStarted}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 md:p-7 scroll-mt-24 "
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <BookOpen size={24} className="text-green-500" /> Getting
                Started – 10 Simple Steps
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 pl-2">
                <li>
                  <strong>Sign up</strong> – use email/password or one‑click
                  with Google/GitHub.
                </li>
                <li>
                  <strong>Create your first board</strong> – give it a name
                  (e.g., "Marketing Campaign"). The board will auto‑generate
                  four lists: To Do, In Progress, Completed, Incomplete.
                </li>
                <li>
                  <strong>Add lists</strong> – click "Add another list" to
                  create custom columns like "Backlog" or "Review".
                </li>
                <li>
                  <strong>Create a card</strong> – click "Add a card" under any
                  list. Fill in title, description (you can use AI to generate),
                  due date, timer, checklist.
                </li>
                <li>
                  <strong>Move cards</strong> – drag and drop between lists. If
                  you move a card to "In Progress" and it has a timer, the timer
                  starts automatically.
                </li>
                <li>
                  <strong>Invite team members</strong> – as board owner, click
                  "Members" button, enter email addresses or generate an invite
                  link. No member limits.
                </li>
                <li>
                  <strong>Use the timer system</strong> – set a timer on
                  important tasks, watch the progress ring, and see auto‑move to
                  "Incomplete" if overdue.
                </li>
                <li>
                  <strong>Check analytics</strong> – go to Analytics from
                  sidebar. Select a board from dropdown to see charts. Monitor
                  completion rate and average time per task.
                </li>
                <li>
                  <strong>Collaborate in real time</strong> – add comments,
                  mention teammates with @, see live updates when others make
                  changes.
                </li>
                <li>
                  <strong>Explore AI assistant</strong> – click the sparkle icon
                  in the bottom‑right corner. Ask for help writing task
                  descriptions or setting deadlines.
                </li>
              </ol>
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <p className="text-sm flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Shield size={16} /> <strong>Free forever promise:</strong>{" "}
                  DailyNote is an open‑source project. No premium tiers, no ads,
                  no data selling. You can even host your own instance.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components for cleaner code
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
      <Icon size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function UseCaseCard({ title, desc }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      <h3 className="font-semibold flex items-center gap-1">
        <CheckCircle size={16} className="text-green-500" /> {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{desc}</p>
    </div>
  );
}
