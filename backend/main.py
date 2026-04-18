from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

from backend.database import SessionLocal, engine
from backend import models

# ---------------- APP INIT ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

# ---------------- DB ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- SCHEMAS ----------------
class LoginRequest(BaseModel):
    email: str
    password: str

class StudentCreate(BaseModel):
    name: str
    email: str
    learning_style: Optional[str] = None
    current_level: Optional[str] = None

class EnrollmentCreate(BaseModel):
    student_id: int
    course_id: int

class CourseCreate(BaseModel):
    course_name: str
    description: Optional[str] = None
    level: Optional[str] = None

class ProgressCreate(BaseModel):
    student_id: int
    module_id: int
    completion_status: str
    score: int
    time_spent: int

class QuizSubmit(BaseModel):
    student_id: int
    answers: List[str]
    correct_answers: List[str]
    topic: str

# ---------------- LOGIN ----------------
@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.password != data.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "user_id": user.id,
        "email": user.email
    }

# ---------------- HOME ----------------
@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

# ---------------- STUDENTS ----------------
@app.get("/students")
def get_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

@app.post("/students")
def add_student(student: StudentCreate, db: Session = Depends(get_db)):
    try:
        new_student = models.Student(**student.dict())
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        return new_student
    except IntegrityError:
        db.rollback()
        return {"error": "Email already exists ❌"}

# ---------------- SINGLE STUDENT ----------------
@app.get("/student/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(
        models.Student.student_id == student_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student

# ---------------- COURSES ----------------
@app.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@app.post("/courses")
def add_course(course: CourseCreate, db: Session = Depends(get_db)):
    new_course = models.Course(**course.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

# ---------------- ENROLL ----------------
@app.post("/enroll")
def enroll_student(data: EnrollmentCreate, db: Session = Depends(get_db)):
    new_enrollment = models.Enrollment(
        student_id=data.student_id,
        course_id=data.course_id,
        enrollment_date=date.today()
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return {"message": "Student enrolled successfully ✅"}

# ---------------- STUDENT COURSES ----------------
@app.get("/student/{student_id}/courses")
def get_student_courses(student_id: int, db: Session = Depends(get_db)):

    enrollments = db.query(models.Enrollment).filter(
        models.Enrollment.student_id == student_id
    ).all()

    if not enrollments:
        return []

    course_ids = [e.course_id for e in enrollments]

    courses = db.query(models.Course).filter(
        models.Course.course_id.in_(course_ids)
    ).all()

    return courses

# ---------------- PROGRESS ----------------
@app.post("/progress")
def add_progress(data: ProgressCreate, db: Session = Depends(get_db)):
    entry = models.StudentProgress(**data.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

# ---------------- PROGRESS SUMMARY ----------------
@app.get("/progress/{student_id}")
def get_progress(student_id: int, db: Session = Depends(get_db)):
    progress = db.query(models.StudentProgress).filter(
        models.StudentProgress.student_id == student_id
    ).all()

    if not progress:
        return {
            "overall_score": 0,
            "completed": 0,
            "total": 0,
            "weak_modules": []
        }

    total = len(progress)
    completed = len([p for p in progress if p.completion_status == "done"])
    avg_score = sum(p.score for p in progress) // total

    weak = [p.module_id for p in progress if p.score < 50]

    return {
        "overall_score": avg_score,
        "completed": completed,
        "total": total,
        "weak_modules": weak
    }

# ---------------- PROGRESS CHART ----------------
@app.get("/progress-chart/{student_id}")
def progress_chart(student_id: int, db: Session = Depends(get_db)):
    progress = db.query(models.StudentProgress).filter(
        models.StudentProgress.student_id == student_id
    ).all()

    return [
        {"day": f"Day {i+1}", "score": p.score}
        for i, p in enumerate(progress)
    ]

# ---------------- PERFORMANCE ----------------
@app.get("/performance/{student_id}")
def get_performance(student_id: int, db: Session = Depends(get_db)):

    data = db.query(models.StudentPerformance).filter(
        models.StudentPerformance.student_id == student_id
    ).all()

    result = []

    for d in data:
        level = "strong"
        if d.score < 50:
            level = "weak"
        elif d.score < 75:
            level = "average"

        result.append({
            "topic": d.topic,
            "score": d.score,
            "level": level
        })

    return result

# ---------------- AI QUIZ ----------------
@app.get("/generate-quiz/{student_id}")
def generate_quiz(student_id: int, db: Session = Depends(get_db)):

    performance = db.query(models.StudentPerformance).filter(
        models.StudentPerformance.student_id == student_id
    ).all()

    weak_topics = [p.topic for p in performance if p.score < 50]

    topic = weak_topics[0] if weak_topics else "general"

    return {
        "topic": topic,
        "questions": [
            {
                "question": f"What is {topic}?",
                "options": ["Concept", "Loop", "Error", "None"],
                "answer": "Concept"
            },
            {
                "question": f"Why is {topic} important?",
                "options": ["Optimization", "Syntax", "Random", "None"],
                "answer": "Optimization"
            }
        ]
    }

# ---------------- 🔥 FIXED SUBMIT QUIZ ----------------
@app.post("/submit-quiz")
def submit_quiz(data: QuizSubmit, db: Session = Depends(get_db)):

    score = 0
    total = len(data.answers)

    for i in range(total):
        if data.answers[i] == data.correct_answers[i]:
            score += 1

    percentage = (score / total) * 100

    # -------- UPDATE PERFORMANCE --------
    record = db.query(models.StudentPerformance).filter(
        models.StudentPerformance.student_id == data.student_id,
        models.StudentPerformance.topic == data.topic
    ).first()

    if record:
        record.score = (record.score + percentage) / 2
        record.attempts += 1
    else:
        record = models.StudentPerformance(
            student_id=data.student_id,
            topic=data.topic,
            score=percentage,
            attempts=1
        )
        db.add(record)

    # -------- 🔥 ADD PROGRESS ENTRY (MAIN FIX) --------
    progress_entry = models.StudentProgress(
        student_id=data.student_id,
        module_id=1,
        completion_status="done",
        score=int(percentage),
        time_spent=5
    )

    db.add(progress_entry)

    db.commit()

    return {
        "score": percentage,
        "message": "Quiz submitted successfully"
    }

# ---------------- SMART RECOMMEND ----------------
@app.get("/smart-recommend/{student_id}")
def smart_recommend(student_id: int, db: Session = Depends(get_db)):

    student = db.query(models.Student).filter_by(student_id=student_id).first()

    if not student:
        return {"error": "Student not found"}

    courses = db.query(models.Course).filter(
        models.Course.level == student.current_level
    ).all()

    return courses