"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Subject = { name: string; marks: string; maxMarks: string };

export default function NewResultPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [className, setClassName] = useState("");
  const [examName, setExamName] = useState("");
  const [examYear, setExamYear] = useState(new Date().getFullYear());
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "", marks: "", maxMarks: "100" },
  ]);
  const [published, setPublished] = useState(false);

  function updateSubject(index: number, field: keyof Subject, value: string) {
    setSubjects((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addSubject() {
    setSubjects((prev) => [...prev, { name: "", marks: "", maxMarks: "100" }]);
  }

  function removeSubject(index: number) {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const supabase = createBrowserSupabase();

    // Step 1: find or create the student (Class + Roll Number must be unique together)
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .eq("class_name", className)
      .eq("roll_number", rollNumber)
      .maybeSingle();

    let studentId = existingStudent?.id;

    if (!studentId) {
      const { data: newStudent, error: studentError } = await supabase
        .from("students")
        .insert({
          full_name: studentName,
          roll_number: rollNumber,
          admission_number: admissionNumber,
          class_name: className,
        })
        .select("id")
        .single();

      if (studentError || !newStudent) {
        setSaving(false);
        setError(
          studentError?.message ?? "Could not create student record."
        );
        return;
      }
      studentId = newStudent.id;
    }

    // Step 2: calculate totals from subjects
    const parsedSubjects = subjects.map((s) => ({
      name: s.name,
      marks: Number(s.marks),
      maxMarks: Number(s.maxMarks),
    }));
    const totalMarks = parsedSubjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const obtainedMarks = parsedSubjects.reduce((sum, s) => sum + s.marks, 0);
    const percentage =
      totalMarks > 0 ? Number(((obtainedMarks / totalMarks) * 100).toFixed(2)) : 0;
    const resultStatus = percentage >= 33 ? "pass" : "fail";
    const grade =
      percentage >= 90
        ? "A+"
        : percentage >= 75
        ? "A"
        : percentage >= 60
        ? "B"
        : percentage >= 33
        ? "C"
        : "F";

    // Step 3: insert the exam result
    const { error: resultError } = await supabase.from("exam_results").insert({
      student_id: studentId,
      exam_name: examName,
      exam_year: examYear,
      subjects: parsedSubjects,
      total_marks: totalMarks,
      obtained_marks: obtainedMarks,
      percentage,
      grade,
      result_status: resultStatus,
      published,
    });

    setSaving(false);

    if (resultError) {
      setError(resultError.message);
      return;
    }

    router.push("/admin/dashboard/results");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-primary mb-1">Add Result</h1>
      <p className="text-text-muted text-sm mb-6">
        Enter student details and exam scores
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface-elevated p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Student Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Class <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. Class 10"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Admission Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
          </div>

          <p className="text-xs text-text-muted">
            If a student with this Class + Roll Number already exists, their
            existing record will be reused.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-elevated p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Exam Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                Exam Year <span className="text-red-500">*</span>
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

        <div className="rounded-2xl border border-border bg-surface-elevated p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Subjects</h2>
            <button
              type="button"
              onClick={addSubject}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              <Plus size={16} />
              Add Subject
            </button>
          </div>

          {subjects.map((subject, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject.name}
                  onChange={(e) => updateSubject(index, "name", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Marks
                </label>
                <input
                  type="number"
                  required
                  value={subject.marks}
                  onChange={(e) => updateSubject(index, "marks", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Max
                </label>
                <input
                  type="number"
                  required
                  value={subject.maxMarks}
                  onChange={(e) => updateSubject(index, "maxMarks", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  disabled={subjects.length === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 disabled:opacity-30 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2.5 text-sm text-foreground">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Publish immediately (visible on the public Results page)
        </label>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-light transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Result"}
        </button>
      </form>
    </div>
  );
}
