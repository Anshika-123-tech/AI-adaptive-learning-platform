from pydantic import BaseModel


# ---------------- AUTH SCHEMAS ----------------
class LoginRequest(BaseModel):
    email: str
    password: str


# ---------------- STUDENT SCHEMAS ----------------
class StudentBase(BaseModel):
    name: str
    email: str
    learning_style: str | None = None
    current_level: str | None = None


class StudentCreate(StudentBase):
    pass


class StudentResponse(StudentBase):
    student_id: int

    class Config:
        from_attributes = True


# ---------------- COURSE SCHEMAS ----------------
class CourseBase(BaseModel):
    course_name: str
    description: str | None = None
    level: str | None = None


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    course_id: int

    class Config:
        from_attributes = True