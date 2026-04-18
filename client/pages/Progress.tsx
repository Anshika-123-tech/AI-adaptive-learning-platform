import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

export default function ProgressPage() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("student_id");

  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    loadData();
  }, [studentId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [sRes, cRes, pRes] = await Promise.all([
        fetch(`${API}/progress/${studentId}`),
        fetch(`${API}/progress-chart/${studentId}`),
        fetch(`${API}/performance/${studentId}`),
      ]);

      const sData = await sRes.json();
      const cData = await cRes.json();
      const pData = await pRes.json();

      console.log("📊 Progress:", sData);
      console.log("📈 Chart:", cData);
      console.log("🧠 Performance:", pData);

      setSummary(sData || {});
      setChartData(Array.isArray(cData) ? cData : []);
      setPerformance(Array.isArray(pData) ? pData : []);
    } catch (err) {
      console.error("Error loading progress:", err);
      setSummary({});
      setChartData([]);
      setPerformance([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Progress...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#140f2d] via-[#2b1a5a] to-[#4b2c7a] text-white">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Performance Dashboard
      </h1>

      {/* TOP STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Overall Score",
            value: `${summary?.overall_score || 0}%`,
          },
          {
            title: "Completed",
            value: `${summary?.completed || 0}/${summary?.total || 0}`,
          },
          {
            title: "Weak Areas",
            value: performance?.filter(p => p?.level === "weak").length || 0,
          },
          {
            title: "Streak",
            value: "5 days 🔥",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 p-4 rounded-xl border border-white/10"
          >
            <p className="text-gray-300">{item.title}</p>
            <h2 className="text-2xl font-bold">{item.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white/10 p-6 rounded-xl mb-8 border border-white/10">
        <h2 className="mb-4 font-semibold">Score Over Time</h2>

        {chartData.length === 0 ? (
          <p className="text-gray-400">No chart data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#00ffff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* HEATMAP */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          🧠 Knowledge Heatmap
        </h2>

        <div className="flex flex-wrap gap-4">
          {performance.length > 0 ? (
            performance.map((item, i) => {
              let color = "bg-green-500/30";

              if (item?.level === "weak") color = "bg-red-500/30";
              else if (item?.level === "average") color = "bg-yellow-500/30";

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className={`${color} px-5 py-3 rounded-xl border border-white/10`}
                >
                  <p className="font-semibold">{item?.topic}</p>
                  <p className="text-sm text-gray-300">
                    Score: {item?.score}
                  </p>
                </motion.div>
              );
            })
          ) : (
            <p className="text-gray-400">No performance data yet</p>
          )}
        </div>
      </div>

      {/* WEAK TOPICS */}
      <div className="mb-8">
        <h2 className="mb-4 font-semibold">Topics to Improve</h2>

        {performance
          ?.filter(p => p?.level === "weak")
          .map((topic, i) => (
            <div
              key={i}
              className="bg-white/10 p-4 rounded-xl mb-3 flex justify-between items-center"
            >
              <span>{topic?.topic}</span>
              <button className="bg-red-500/20 px-3 py-1 rounded">
                Improve
              </button>
            </div>
          ))}
      </div>

      {/* AI RECOMMENDATION */}
      <div className="mb-8">
        <h2 className="mb-4 font-semibold">AI Next Steps</h2>

        <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-6 rounded-xl">
          <p className="font-semibold">
            {performance.find(p => p?.level === "weak")?.topic || "Start Learning"}
          </p>
          <p className="text-sm text-gray-300">
            Based on your weak areas
          </p>
          <button className="mt-3 bg-cyan-500 px-4 py-2 rounded">
            Start Learning
          </button>
        </div>
      </div>

      {/* ASSESSMENT */}
      <div>
        <h2 className="mb-4 font-semibold">Assessment</h2>

        <div className="bg-white/10 p-6 rounded-xl">
          <p className="mb-3">
            Test your knowledge with AI-powered quizzes
          </p>

          <button
            onClick={() => navigate("/assessment")} // ✅ FIXED
            className="bg-purple-500 px-4 py-2 rounded"
          >
            Take Assessment
          </button>
        </div>
      </div>

    </div>
  );
}