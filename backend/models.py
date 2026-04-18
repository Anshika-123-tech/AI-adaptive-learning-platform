from sqlalchemy import Column, Integer, String, TIMESTAMP, text, Text, ForeignKey, Date, Float
from sqlalchemy.orm import relationship
from backend.database import Base

# ---------------- USER ----------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

# ---------------- STUDENT ----------------
class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)

    learning_style = Column(String(50))
    current_level = Column(String(50))

    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"))

    courses = relationship("Enrollment", backref="student")
    progress = relationship("StudentProgress", backref="student")
    performance = relationship("StudentPerformance", backref="student")

# ---------------- COURSE ----------------
class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    course_name = Column(String(150), nullable=False)
    description = Column(Text)
    level = Column(String(50), nullable=False)

    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"))

    modules = relationship("Module", backref="course")

# ---------------- MODULE ----------------
class Module(Base):
    __tablename__ = "modules"

    module_id = Column(Integer, primary_key=True, autoincrement=True)

    course_id = Column(Integer, ForeignKey("courses.course_id"))
    title = Column(String(100), nullable=False)

    progress = relationship("StudentProgress", backref="module")

# ---------------- ENROLLMENT ----------------
class Enrollment(Base):
    __tablename__ = "enrollments"

    enrollment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    student_id = Column(Integer, ForeignKey("students.student_id"))
    course_id = Column(Integer, ForeignKey("courses.course_id"))

    enrollment_date = Column(Date)

# ---------------- PERFORMANCE ----------------
class StudentPerformance(Base):
    __tablename__ = "student_performance"

    performance_id = Column(Integer, primary_key=True, autoincrement=True)

    student_id = Column(Integer, ForeignKey("students.student_id"))
    topic = Column(String(100), nullable=False)

    score = Column(Float, nullable=False)
    attempts = Column(Integer, nullable=False)

# ---------------- PROGRESS ----------------
class StudentProgress(Base):
    __tablename__ = "student_progress"

    progress_id = Column(Integer, primary_key=True, autoincrement=True)

    student_id = Column(Integer, ForeignKey("students.student_id"))
    module_id = Column(Integer, ForeignKey("modules.module_id"))

    completion_status = Column(String(50), nullable=False)
    score = Column(Integer, nullable=False)
    time_spent = Column(Integer, nullable=False)