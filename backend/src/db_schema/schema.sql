CREATE TABLE "Students" (
  "_id" varchar PRIMARY KEY,
  "email" varchar UNIQUE,
  "password_hash" varchar,
  "profile_data" json,
  "created_at" datetime
);

CREATE TABLE "Alumni" (
  "_id" varchar PRIMARY KEY,
  "email" varchar UNIQUE,
  "password_hash" varchar,
  "profile_data" json,
  "created_at" datetime
);

CREATE TABLE "Admins" (
  "_id" varchar PRIMARY KEY,
  "email" varchar UNIQUE,
  "password_hash" varchar,
  "created_at" datetime
);

CREATE TABLE "Resumes" (
  "_id" varchar PRIMARY KEY,
  "student_id" varchar,
  "resume_link" varchar,
  "uploaded_at" datetime
);

CREATE TABLE "Courses" (
  "course_code" varchar PRIMARY KEY,
  "course_name" varchar
);

CREATE TABLE "AcademicResources" (
  "_id" varchar PRIMARY KEY,
  "uploader_id" varchar,
  "course_code" varchar,
  "topic" varchar,
  "file_url" varchar,
  "uploaded_at" datetime
);

CREATE TABLE "Upvotes" (
  "_id" varchar PRIMARY KEY,
  "student_id" varchar,
  "resource_id" varchar,
  "upvoted_at" datetime
);

CREATE TABLE "Messages" (
  "_id" varchar PRIMARY KEY,
  "sender_id" varchar,
  "receiver_id" varchar,
  "content" text,
  "reference_id" varchar,
  "reference_type" varchar,
  "is_read" boolean,
  "read_at" datetime,
  "created_at" datetime
);

CREATE TABLE "Companies" (
  "_id" varchar PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "JobPostings" (
  "_id" varchar PRIMARY KEY,
  "poster_id" varchar,
  "company_id" varchar,
  "title" varchar,
  "description" text,
  "deadline" datetime,
  "created_at" datetime
);

CREATE TABLE "Reports" (
  "_id" varchar PRIMARY KEY,
  "reporter_id" varchar,
  "content_id" varchar,
  "content_type" varchar,
  "reason" text,
  "status" varchar DEFAULT 'pending',
  "resolved_by" varchar,
  "reported_at" datetime
);

ALTER TABLE "Resumes" ADD FOREIGN KEY ("student_id") REFERENCES "Students" ("_id");

ALTER TABLE "AcademicResources" ADD FOREIGN KEY ("uploader_id") REFERENCES "Students" ("_id");

ALTER TABLE "AcademicResources" ADD FOREIGN KEY ("uploader_id") REFERENCES "Alumni" ("_id");

ALTER TABLE "AcademicResources" ADD FOREIGN KEY ("course_code") REFERENCES "Courses" ("course_code");

ALTER TABLE "Upvotes" ADD FOREIGN KEY ("student_id") REFERENCES "Students" ("_id");

ALTER TABLE "Upvotes" ADD FOREIGN KEY ("resource_id") REFERENCES "AcademicResources" ("_id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("sender_id") REFERENCES "Students" ("_id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("sender_id") REFERENCES "Alumni" ("_id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("receiver_id") REFERENCES "Students" ("_id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("receiver_id") REFERENCES "Alumni" ("_id");

ALTER TABLE "JobPostings" ADD FOREIGN KEY ("poster_id") REFERENCES "Alumni" ("_id");

ALTER TABLE "JobPostings" ADD FOREIGN KEY ("company_id") REFERENCES "Companies" ("_id");

ALTER TABLE "Reports" ADD FOREIGN KEY ("reporter_id") REFERENCES "Students" ("_id");

ALTER TABLE "Reports" ADD FOREIGN KEY ("reporter_id") REFERENCES "Alumni" ("_id");

ALTER TABLE "Reports" ADD FOREIGN KEY ("resolved_by") REFERENCES "Admins" ("_id");