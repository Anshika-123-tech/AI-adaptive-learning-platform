import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  LogOut,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";

const API = "http://127.0.0.1:8000";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [courses, setCourses] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    if (!studentId) {
      navigate("/login");
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [studentRes, coursesRes, myCoursesRes] = await Promise.all([
        fetch(`${API}/student/${studentId}`),
        fetch(`${API}/courses`),
        fetch(`${API}/student/${studentId}/courses`),
      ]);

      const studentData = await studentRes.json();
      const coursesData = await coursesRes.json();
      const myCoursesData = await myCoursesRes.json();

      // ✅ SAFE SETTING
      setStudent(studentData || null);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setMyCourses(Array.isArray(myCoursesData) ? myCoursesData : []);

      // ✅ AI (SAFE)
      fetch(`${API}/smart-recommend/${studentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setRecommendation(data);
          else setRecommendation([]);
        })
        .catch(() => setRecommendation([]));

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const progress = Math.round(
    (myCourses.length / (courses.length || 1)) * 100
  );

  // 🔥 ACTIVE NAV STYLE
  const navStyle = (path: string) =>
    location.pathname === path
      ? "text-cyan-400"
      : "text-gray-400 hover:text-white";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#140f2d] via-[#2b1a5a] to-[#4b2c7a] text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-black/30 backdrop-blur-xl p-6 flex flex-col justify-between border-r border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 mb-6">
            AdaptLearn
          </h1>

          <p className="text-gray-300 mb-6">
            Welcome,<br />
            <span className="font-semibold">
              {student?.name || "Loading..."}
            </span>
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center gap-2 ${navStyle("/dashboard")}`}
            >
              <BookOpen /> Courses
            </button>

            <button
              onClick={() => navigate("/progress")}
              className={`flex items-center gap-2 ${navStyle("/progress")}`}
            >
              <TrendingUp /> Progress
            </button>

            <button
              onClick={() => navigate("/assessment")}
              className={`flex items-center gap-2 ${navStyle("/assessment")}`}
            >
              <Sparkles /> AI
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/40 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Learning Dashboard</h1>
          <p className="text-gray-300">
            Track progress, AI insights & courses
          </p>
        </motion.div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-2 text-cyan-400">
              <TrendingUp /> Progress
            </div>

            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : `${progress}%`}
            </h2>

            <div className="w-full bg-gray-700 h-2 rounded mt-3">
              <div
                className="bg-cyan-400 h-2 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 🔥 QUICK ACTION */}
            <button
              onClick={() => navigate("/progress")}
              className="mt-3 text-sm text-cyan-400 underline"
            >
              View Details →
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-2 text-purple-400">
              <BookOpen /> Total Courses
            </div>
            <h2 className="text-3xl font-bold mt-2">
              {courses.length}
            </h2>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-2 text-green-400">
              <Layers /> Enrolled
            </div>
            <h2 className="text-3xl font-bold mt-2">
              {myCourses.length}
            </h2>

            {/* 🔥 QUICK QUIZ */}
            <button
              onClick={() => navigate("/assessment")}
              className="mt-3 text-sm text-green-400 underline"
            >
              Take Quiz →
            </button>
          </motion.div>
        </div>

        {/* AI CARD */}
        <motion.div className="mb-10">
          <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-6 rounded-xl border border-cyan-400/30">

            <div className="flex justify-between items-center mb-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles /> AI Recommendation
              </h2>

              <span className="bg-cyan-400/20 px-3 py-1 text-sm rounded-full">
                Smart AI
              </span>
            </div>

            {recommendation === null ? (
              <p className="text-gray-400 animate-pulse">
                🤖 AI is analyzing...
              </p>
            ) : recommendation.length > 0 ? (
              recommendation.map((c: any, i: number) => (
                <div key={i}>
                  <p className="font-semibold">{c.course_name}</p>
                  <p className="text-sm text-gray-300">
                    Level: {c.level}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                No recommendations yet. Take a quiz!
              </p>
            )}
          </div>
        </motion.div>

        {/* MY COURSES */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            My Courses
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {myCourses.length > 0 ? (
              myCourses.map((course: any) => (
                <motion.div
                  key={course.course_id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 p-5 rounded-xl border border-white/10 hover:border-cyan-400"
                >
                  <h3 className="font-bold">{course.course_name}</h3>
                  <p className="text-sm text-gray-300">
                    {course.description}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">No enrolled courses yet</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}