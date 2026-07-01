"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Subject = { name: string; maxMarks: string };
type StudentEntry = {
  id: string;
  studentName: string;
  rollNumber: string;
  admissionNumber: string;
  marks: string[];
  expanded: boolean;
};

function calcGrade(pct: number) {
  if (pct >= 90) return "A+";
  if (pct >= 75) return "A";
  if (pct >= 60) return "B";
  if (pct >= 33) return "C";
  return "F";
}

export default function NewResultPage() {
  const router = useRouter();
  const [step, setStep] = useState<"setup" | "entry">("setup");

  // Setup state
  const [className, setClassName] = useState("");
  const [examName, setExamName] = useState("");
  const [examYear, setExamYear] = useState(new Date().getFullYear());
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "", maxMarks: "100" },
  ]);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);
  const [existingClasses, setExistingClasses] = useState<string[]>([]);

  // Bulk entry state
  const [students, setStudents] = useState<StudentEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [error, setError] = useState("");
  const firstMarkRef = useRef<HTMLInputElement>(null);

  // Load existing classes for the dropdown
  useEffect(() => {
    async function loadClasses() {
      const supabase = createBrowserSupabase();
      const { data } = await supabase
        .from("available_classes")
        .select("class_name");
      if (data) setExistingClasses(data.map((r) => r.class_name));
    }
    loadClasses();
  }, []);

  // Auto-load template when class + exam are filled
  useEffect(() => {
    if (!className || !examName) return;
    async function loadTemplate() {
      setTemplateLoading(true);
      const supabase = createBrowserSupabase();
      const { data } = await supabase
        .from("subject_templates")
        .select("subjects")
        .eq("class_name", className)
        .eq("exam_name", examName)
        .maybeSingle();
      if (data?.subjects && Array.isArray(data.subjects)) {
        setSubjects(
          data.subjects.map((s: { name: string; maxMarks?: string | number }) => ({
            name: s.name,
            maxMarks: String(s.maxMarks ?? 100),
          }))
        );
        setTemplateSaved(true);
      } else {
        setTemplateSaved(false);
      }
      setTemplateLoading(false);
    }
    loadTemplate();
  }, [className, examName]);

  function updateSubject(i: number, field: keyof Subject, value: string) {
    setSubjects((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s))
    );
    setTemplateSaved(false);
  }

  function addSubject() {
    setSubjects((prev) => [...prev, { name: "", maxMarks: "100" }]);
    setTemplateSaved(false);
  }

  function removeSubject(i: number) {
    if (subjects.length === 1) return;
    setSubjects((prev) => prev.filter((_, idx) => idx !== i));
    setTemplateSaved(false);
  }

  async function saveTemplate() {
    if (!className || !examName) return;
    const supabase = createBrowserSupabase();
    await supabase.from("subject_templates").upsert(
      {
        class_name: className,
        exam_name: examName,
        subjects: subjects.map((s) => ({
          name: s.name,
          maxMarks: Number(s.maxMarks),
        })),
      },
      { onConflict: "class_name,exam_name" }
    );
    setTemplateSaved(true);
  }

  function addStudent() {
    setStudents((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        studentName: "",
        rollNumber: "",
        admissionNumber: "",
        marks: subjects.map(() => ""),
        expanded: true,
      },
    ]);
  }

  function updateStudent(
    id: string,
    field: "studentName" | "rollNumber" | "admissionNumber",
    value: string
  ) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function updateMark(id: string, markIdx: number, value: string) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, marks: s.marks.map((m, i) => (i === markIdx ? value : m)) }
          : s
      )
    );
  }

  function toggleExpand(id: string) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s))
    );
  }

  function removeStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function copyLastStudent() {
    if (students.length === 0) return;
    const last = students[students.length - 1];
    setStudents((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        studentName: "",
        rollNumber: "",
        admissionNumber: "",
        marks: last.marks.slice(),
        expanded: true,
      },
    ]);
  }

  async function proceedToEntry(e: FormEvent) {
    e.preventDefault();
    await saveTemplate();
    addStudent();
    setStep("entry");
    setTimeout(() => firstMarkRef.current?.focus(), 100);
  }

  async function saveAll() {
    setError("");
    setSaving(true);
    const supabase = createBrowserSupabase();
    let count = 0;

    for (const student of students) {
      if (!student.studentName || !student.rollNumber) continue;

      // Find or create student
      const { data: existing } = await supabase
        .from("students")
        .select("id")
        .eq("class_name", className)
        .eq("roll_number", student.rollNumber)
        .maybeSingle();

      let studentId = existing?.id;

      if (!studentId) {
        const { data: created, error: createErr } = await supabase
          .from("students")
          .insert({
            full_name: student.studentName,
            roll_number: student.rollNumber,
            admission_number: student.admissionNumber,
            class_name: className,
          })
          .select("id")
          .single();

        if (createErr || !created) {
          setError(`Failed to create student: ${student.studentName}`);
          continue;
        }
        studentId = created.id;
      }

      const parsedSubjects = subjects.map((s, i) => ({
        name: s.name,
        marks: Number(student.marks[i] || 0),
        maxMarks: Number(s.maxMarks),
      }));

      const totalMarks = parsedSubjects.reduce((sum, s) => sum + s.maxMarks, 0);
      const obtainedMarks = parsedSubjects.reduce((sum, s) => sum + s.marks, 0);
      const percentage =
        totalMarks > 0
          ? Number(((obtainedMarks / totalMarks) * 100).toFixed(2))
          : 0;
      const grade = calcGrade(percentage);
      const resultStatus = percentage >= 33 ? "pass" : "fail";

      await supabase.from("exam_results").insert({
        student_id: studentId,
        exam_name: examName,
        exam_year: examYear,
        subjects: parsedSubjects,
        total_marks: totalMarks,
        obtained_marks: obtainedMarks,
        percentage,
        grade,
        result_status: resultStatus,
        published: false,
      });

      count++;
    }

    setSaving(false);
    setSavedCount(count);
  }

  // ── Setup Step ──────────────────────────────────────────────────────────
  if (step === "setup") {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-primary mb-1">Add Results</h1>
        <p className="text-text-muted text-sm mb-6">
          Set up the class, exam, and subject template first
        </p>

        <form onSubmit={proceedToEntry} className="space-y-5">
          {/* Class + Exam */}
          <div className="rounded-2xl border border-border bg-surface-elevated p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Exam Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Class <span className="text-red-500">*</span>
                </label>
                <input
                  list="existing-classes"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Class 10 or type new"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
                <datalist id="existing-classes">
                  {existingClasses.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Exam Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. Annual Exam"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={examYear}
                  onChange={(e) => setExamYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Subject template */}
          <div className="rounded-2xl border border-border bg-surface-elevated p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">
                  Subject Template
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  {templateLoading
                    ? "Loading saved template..."
                    : templateSaved
                    ? "✓ Template saved — will reuse for all students"
                    : "Define subjects once — reused for every student in this class+exam"}
                </p>
              </div>
              <button
                type="button"
                onClick={addSubject}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                <Plus size={16} />
                Add Subject
              </button>
            </div>

            {subjects.map((subject, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-7">
                  {i === 0 && (
                    <label className="block text-xs font-medium text-text-muted mb-1">
                      Subject Name
                    </label>
                  )}
                  <input
                    type="text"
                    required
                    value={subject.name}
                    onChange={(e) => updateSubject(i, "name", e.target.value)}
                    placeholder={`Subject ${i + 1}`}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
                <div className="col-span-4">
                  {i === 0 && (
                    <label className="block text-xs font-medium text-text-muted mb-1">
                      Max Marks
                    </label>
                  )}
                  <input
                    type="number"
                    required
                    value={subject.maxMarks}
                    onChange={(e) =>
                      updateSubject(i, "maxMarks", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeSubject(i)}
                    disabled={subjects.length === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-light transition-colors"
          >
            Continue to Enter Results →
          </button>
        </form>
      </div>
    );
  }

  // ── Bulk Entry Step ─────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Entering Results
          </h1>
          <p className="text-text-muted text-sm">
            {className} · {examName} {examYear} ·{" "}
            <span className="font-medium">{subjects.length} subjects</span>
          </p>
        </div>
        <button
          onClick={() => setStep("setup")}
          className="text-sm text-text-muted hover:text-primary"
        >
          ← Edit Setup
        </button>
      </div>

      {/* Subject header reference */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 mb-4">
        <p className="text-xs font-semibold text-primary mb-1">
          Subjects (enter marks in this order for each student):
        </p>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s, i) => (
            <span
              key={i}
              className="rounded-full bg-primary/10 text-primary text-xs px-2.5 py-0.5 font-medium"
            >
              {s.name} (/{s.maxMarks})
            </span>
          ))}
        </div>
      </div>

      {/* Student cards */}
      <div className="space-y-3 mb-4">
        {students.map((student, sIdx) => {
          const totalMax = subjects.reduce(
            (sum, s) => sum + Number(s.maxMarks),
            0
          );
          const totalObtained = student.marks.reduce(
            (sum, m) => sum + Number(m || 0),
            0
          );
          const pct =
            totalMax > 0
              ? ((totalObtained / totalMax) * 100).toFixed(1)
              : "0.0";

          return (
            <div
              key={student.id}
              className="rounded-2xl border border-border bg-surface-elevated overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface"
                onClick={() => toggleExpand(student.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {sIdx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {student.studentName || "New Student"}
                    </p>
                    {student.rollNumber && (
                      <p className="text-xs text-text-muted">
                        Roll {student.rollNumber} · {pct}%{" "}
                        {totalMax > 0
                          ? Number(pct) >= 33
                            ? "✓ Pass"
                            : "✗ Fail"
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStudent(student.id);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                  {student.expanded ? (
                    <ChevronUp size={18} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={18} className="text-text-muted" />
                  )}
                </div>
              </div>

              {student.expanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  {/* Student info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={student.studentName}
                        onChange={(e) =>
                          updateStudent(
                            student.id,
                            "studentName",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">
                        Roll Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={student.rollNumber}
                        onChange={(e) =>
                          updateStudent(
                            student.id,
                            "rollNumber",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">
                        Admission No.
                      </label>
                      <input
                        type="text"
                        value={student.admissionNumber}
                        onChange={(e) =>
                          updateStudent(
                            student.id,
                            "admissionNumber",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>

                  {/* Marks grid — tab-friendly */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {subjects.map((subj, mIdx) => (
                      <div key={mIdx}>
                        <label className="block text-xs font-medium text-text-muted mb-1 truncate">
                          {subj.name} (/{subj.maxMarks})
                        </label>
                        <input
                          ref={
                            sIdx === 0 && mIdx === 0 ? firstMarkRef : undefined
                          }
                          type="number"
                          min="0"
                          max={subj.maxMarks}
                          value={student.marks[mIdx]}
                          onChange={(e) =>
                            updateMark(student.id, mIdx, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              mIdx === subjects.length - 1 &&
                              sIdx === students.length - 1
                            ) {
                              e.preventDefault();
                              addStudent();
                            }
                          }}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Running total */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-text-muted">
                      Total:{" "}
                      <b className="text-foreground">
                        {totalObtained}/{totalMax}
                      </b>
                    </span>
                    <span className="text-text-muted">
                      Percentage:{" "}
                      <b className="text-foreground">{pct}%</b>
                    </span>
                    <span
                      className={`font-semibold ${
                        Number(pct) >= 33
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      {totalMax > 0
                        ? Number(pct) >= 33
                          ? "PASS"
                          : "FAIL"
                        : ""}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add student buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          type="button"
          onClick={addStudent}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
        >
          <Plus size={16} />
          Add Student
        </button>
        {students.length > 0 && (
          <button
            type="button"
            onClick={copyLastStudent}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
          >
            <Copy size={16} />
            Copy Last Student's Template
          </button>
        )}
      </div>

      {/* Save */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {savedCount > 0 && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-600 dark:text-green-400 mb-4">
          ✓ {savedCount} result{savedCount > 1 ? "s" : ""} saved successfully.{" "}
          <button
            onClick={() => router.push("/admin/dashboard/results")}
            className="underline font-semibold"
          >
            View all results
          </button>{" "}
          or keep adding below.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={saveAll}
          disabled={saving || students.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white hover:bg-primary-light transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving
            ? "Saving..."
            : `Save All ${students.length} Result${students.length !== 1 ? "s" : ""}`}
        </button>
        <button
          onClick={() => router.push("/admin/dashboard/results")}
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
