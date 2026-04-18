import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Assessment() {
  const studentId = localStorage.getItem("student_id");

  const [quiz, setQuiz] = useState<any[]>([]);
  const [topic, setTopic] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<any>({});
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🚀 LOAD QUIZ
  useEffect(() => {
    if (!studentId) return;

    const loadQuiz = async () => {
      try {
        const res = await fetch(`${API}/generate-quiz/${studentId}`);
        const data = await res.json();

        console.log("🔥 QUIZ DATA:", data); // DEBUG

        if (Array.isArray(data)) {
          setQuiz(data);
          setTopic("General");
        } else {
          setQuiz(Array.isArray(data.questions) ? data.questions : []);
          setTopic(data.topic || "General");
        }
      } catch (err) {
        console.error("Quiz load error:", err);
        setQuiz([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [studentId]);

  // ⏱️ TIMER
  useEffect(() => {
    if (time > 0 && !finished) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time === 0 && !finished) {
      finishQuiz();
    }
  }, [time, finished]);

  const selectOption = (option: string) => {
    setSelected((prev: any) => ({
      ...prev,
      [current]: option,
    }));
  };

  const nextQuestion = () => {
    if (current < quiz.length - 1) {
      setCurrent(current + 1);
    } else {
      finishQuiz();
    }
  };

  // 🚀 FINISH QUIZ
  const finishQuiz = async () => {
    let sc = 0;

    const answers: string[] = [];
    const correctAnswers: string[] = [];

    quiz.forEach((q, i) => {
      const userAns = selected[i] || "";
      const correct = q?.answer || "";

      answers.push(userAns);
      correctAnswers.push(correct);

      if (userAns === correct) sc++;
    });

    setScore(sc);
    setFinished(true);

    try {
      await fetch(`${API}/submit-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: Number(studentId),
          answers,
          correct_answers: correctAnswers,
          topic,
        }),
      });
    } catch (err) {
      console.error("Error saving quiz:", err);
    }
  };

  // ---------------- RESULT ----------------
  if (finished) {
    const percentage =
      quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#140f2d] via-[#2b1a5a] to-[#4b2c7a]">

        <h1 className="text-3xl font-bold mb-4">
          🎯 Your Score: {percentage}%
        </h1>

        <p className="mb-4">
          Correct Answers: {score} / {quiz.length}
        </p>

        <div className="bg-white/10 p-6 rounded-xl text-center">
          {percentage < 50 && (
            <p className="text-red-400">
              Focus more on <b>{topic}</b>
            </p>
          )}

          {percentage >= 50 && percentage < 80 && (
            <p className="text-yellow-400">
              Improving in <b>{topic}</b>, keep going
            </p>
          )}

          {percentage >= 80 && (
            <p className="text-green-400">
              Strong understanding of <b>{topic}</b> 🚀
            </p>
          )}
        </div>

        <button
          onClick={() => (window.location.href = "/progress")}
          className="mt-6 bg-cyan-500 px-5 py-2 rounded-lg hover:bg-cyan-600 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading Assessment...
      </div>
    );
  }

  // ❌ EXTRA SAFETY
  if (!quiz || quiz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No quiz available. Try again later.
      </div>
    );
  }

  // ---------------- QUIZ ----------------
  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-[#140f2d] via-[#2b1a5a] to-[#4b2c7a]">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          AI Assessment ({topic})
        </h1>
        <div className="text-red-400 font-semibold">
          ⏱️ {time}s
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-xl border border-white/10">

        <h2 className="mb-4 font-semibold text-lg">
          Q{current + 1}. {quiz[current]?.question || "Question"}
        </h2>

        {(quiz[current]?.options || []).map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => selectOption(opt)}
            className={`block w-full text-left p-3 mb-2 rounded-lg transition ${
              selected[current] === opt
                ? "bg-cyan-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {opt}
          </button>
        ))}

        <button
          onClick={nextQuestion}
          className="mt-4 bg-purple-500 px-5 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          {current === quiz.length - 1 ? "Finish" : "Next"}
        </button>

      </div>
    </div>
  );
}