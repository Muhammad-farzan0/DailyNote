import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  CheckCircle,
  TrendingUp,
  Clock,
  Calendar,
  Timer,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { Analytics3DCharts } from "../components/Analytics3DCharts";

export default function Analytics() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);
      if (res.data.length) setSelectedBoard(res.data[0]._id);
    } catch (err) {
      toast.error("Failed to load boards");
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedBoard) return;
    setLoading(true);
    try {
      const res = await api.get(`/analytics/board/${selectedBoard}`);
      setAnalytics(res.data);
    } catch (err) {
      toast.error("Could not load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard) fetchAnalytics();
  }, [selectedBoard]);

  const barData = analytics?.statusCounts
    ? [
        { name: "Todo", count: analytics.statusCounts.todo, color: "#3b82f6" },
        {
          name: "In Progress",
          count: analytics.statusCounts.inProgress,
          color: "#f59e0b",
        },
        {
          name: "Completed",
          count: analytics.statusCounts.completed,
          color: "#10b981",
        },
        {
          name: "Incomplete",
          count: analytics.statusCounts.incomplete,
          color: "#ef4444",
        },
      ]
    : [];

  const pieData = [
    { name: "Completed", value: analytics?.completedCards || 0 },
    {
      name: "Remaining",
      value: (analytics?.totalCards || 0) - (analytics?.completedCards || 0),
    },
  ];
  const COLORS = ["#10b981", "#3b82f6"];

  const dailyData = analytics?.dailyActivity
    ? Object.entries(analytics.dailyActivity).map(([date, count]) => ({
        date,
        count,
      }))
    : [];

  const assigneeData = analytics?.tasksPerAssignee || [];

  const dueDateItems = [
    {
      label: "Due This Week",
      value: analytics?.dueDateStats?.dueThisWeek || 0,
      color: "#3b82f6",
    },
    {
      label: "Overdue",
      value: analytics?.dueDateStats?.overdue || 0,
      color: "#ef4444",
    },
    {
      label: "No Due Date",
      value: analytics?.dueDateStats?.noDueDate || 0,
      color: "#9ca3af",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 pb-8"
    >
      {/* Header */}
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gradient">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track productivity, timers, deadlines, and task insights
        </p>
      </div>

      {/* Board Selector */}
      <div className="glass-card p-4 mb-6 md:mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Board
        </label>
        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          className="w-full sm:w-72 p-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 dark:text-white"
        >
          {boards.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {analytics && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 md:space-y-8"
        >
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <div className="glass-card p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                    Total Tasks
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalCards}
                  </p>
                </div>
                <LayoutGrid className="text-blue-500" size={28} />
              </div>
            </div>
            <div className="glass-card p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                    Completed
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-green-600">
                    {analytics.completedCards}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={28} />
              </div>
            </div>
            <div className="glass-card p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                    Completion Rate
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-purple-600">
                    {analytics.completionRate}%
                  </p>
                </div>
                <TrendingUp className="text-purple-500" size={28} />
              </div>
            </div>
            <div className="glass-card p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                    Avg Time / Task
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-orange-500">
                    {analytics.averageTimePerTask} min
                  </p>
                </div>
                <Clock className="text-orange-500" size={28} />
              </div>
            </div>
          </div>

          {/* Row 1: Status Bar Chart + Timer Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                Task Distribution by Status
              </h2>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={300}>
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      className="dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "currentColor", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        color: "#1f2937",
                      }}
                      labelStyle={{ color: "#1f2937" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="count" name="Tasks">
                      {barData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          radius={[8, 8, 0, 0]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Timer Stats Card */}
            <div className="glass-card p-4 md:p-5 flex flex-col justify-between">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Timer size={18} /> Timer Insights
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tasks with timer:
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {analytics.timerStats?.tasksWithTimer || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Expired timers:
                  </span>
                  <span className="font-bold text-red-500">
                    {analytics.timerStats?.tasksWithExpiredTimer || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Average timer duration:
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {analytics.timerStats?.averageTimerDuration || 0} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Due Date Stats + Tasks per Assignee */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Due Date Distribution */}
            <div className="glass-card p-4 md:p-5">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Calendar size={18} /> Due Date Overview
              </h2>
              <div className="space-y-3">
                {dueDateItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(item.value / analytics.totalCards) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        ></div>
                      </div>
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks per Assignee */}
            <div className="glass-card p-4 md:p-5">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Users size={18} /> Tasks per Assignee
              </h2>
              {assigneeData.length === 0 ? (
                <p className="text-gray-500 text-sm">No assignees yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={assigneeData}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-700" />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={80}
                      tick={{ fontSize: 12, fill: "currentColor" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: "8px",
                        border: "none",
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Row 3: Completion Pie + Daily Activity Line */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4 md:p-5">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Completion Overview
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {dailyData.length > 0 && (
              <div className="glass-card p-4 md:p-5">
                <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Daily Activity (Last 7 Days)
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={dailyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      className="dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "currentColor", fontSize: 10 }}
                      angle={-15}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: "12px",
                        border: "none",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 3D Data Visualization Section */}
          <div className="glass-card p-4 md:p-6 mt-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
              3D Task Distribution
            </h2>
            <Analytics3DCharts statusCounts={analytics.statusCounts} />
          </div>
        </motion.div>
      )}

      {!analytics && !loading && boards.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Select a board to see analytics.
          </p>
        </div>
      )}
    </motion.div>
  );
}