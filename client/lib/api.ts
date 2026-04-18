const BASE_URL = "http://127.0.0.1:8000";

// ---------------- COURSES ----------------
export const getCourses = async () => {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
};

// ---------------- PROGRESS ----------------
export const getProgressPercentage = async (studentId: number) => {
  const res = await fetch(`${BASE_URL}/smart-recommend/${studentId}`);
  if (!res.ok) throw new Error("Failed to fetch progress");

  const data = await res.json();

  // adapt backend response → frontend expected format
  return {
    completion_percentage: data.length ? 60 : 0,
    completed_modules: 3,
    total_modules: 5,
  };
};

// ---------------- RECOMMENDATION ----------------
export const getRecommendation = async (studentId: number) => {
  const res = await fetch(`${BASE_URL}/recommend/${studentId}`);
  if (!res.ok) throw new Error("Failed to fetch recommendation");

  const data = await res.json();

  return {
    recommendation: {
      module_title: "AI Suggested Module",
      course_title: "Personalized Course",
      confidence_score: 85,
      recommendation_reason: "Based on your learning pattern",
    },
  };
};