"use client";

import { useState, useEffect, FormEvent } from "react";
import { Search, Printer, AlertCircle } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Subject = { name: string; marks: number; maxMarks: number };

type Result = {
  full_name: string;
  roll_number: string;
  admission_number: string;
  class_name: string;
  exam_name: string;
  exam_year: number;
  subjects: Subject[];
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  result_status: string;
};

export default function ResultsPage() {
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    async function loadClasses() {
      const supabase = createBrowserSupabase();
      const { data } = await supabase
        .from("available_classes")
        .select("class_name");
      if (data) {
        setClasses(data.map((row) => row.class_name));
      }
    }
    loadClasses();
  }, []);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!selectedClass) {
      setError("Please select a class first.");
      return;
    }
    if (!rollNumber.trim()) {
      setError("Please enter a roll number.");
      return;
    }

    setLoading(true);

    const supabase = createBrowserSupabase();
    const { data, error: queryError } = await supabase
      .from("published_results")
      .select("*")
      .eq("class_name", selectedClass)
      .eq("roll_number", rollNumber.trim())
      .maybeSingle();

    setLoading(false);

    if (queryError || !data) {
      setError(
        "No result found for this Class and Roll Number combination. Please check and try again."
      );
      return;
    }

    setResult(data as Result);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6 text-center print:hidden">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Examination Results
        </h1>
        <p className="text-white/80 max-w-xl mx-auto">
          Select your class and enter your roll number to view your result
        </p>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-xl">
          <form
            onSubmit={handleSearch}
            className="rounded-2xl border border-border bg-surface-elevated p-6 md:p-8 space-y-4 print:hidden"
          >
            <div>
              <label
                htmlFor="class"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Class <span className="text-red-500">*</span>
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                <option value="">Select your class...</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="roll"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                id="roll"
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                placeholder="e.g. 12"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-light transition-colors disabled:opacity-60"
            >
              {loading ? "Searching..." : "View Result"}
              {!loading && <Search size={16} />}
            </button>
          </form>

          {result && (
            <div className="mt-8 rounded-2xl border border-border bg-surface-elevated p-6 md:p-8 print:border-2 print:border-black">
              <div className="text-center mb-6 pb-6 border-b border-border">
                <h2 className="text-xl font-bold text-primary">
                  {result.exam_name} — {result.exam_year}
                </h2>
                <p className="text-text-muted text-sm mt-1">
                  Darul Uloom Faizan-E-Ashraf
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-text-muted">Student Name</p>
                  <p className="font-semibold text-foreground">
                    {result.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Class</p>
                  <p className="font-semibold text-foreground">
                    {result.class_name}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Roll Number</p>
                  <p className="font-semibold text-foreground">
                    {result.roll_number}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Admission Number</p>
                  <p className="font-semibold text-foreground">
                    {result.admission_number}
                  </p>
                </div>
              </div>

              <table className="w-full text-sm mb-6">
                <thead>
                  <tr className="border-b border-border text-left text-text-muted">
                    <th className="py-2">Subject</th>
                    <th className="py-2 text-right">Marks Obtained</th>
                    <th className="py-2 text-right">Max Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((subj) => (
                    <tr key={subj.name} className="border-b border-border">
                      <td className="py-2 text-foreground">{subj.name}</td>
                      <td className="py-2 text-right text-foreground">
                        {subj.marks}
                      </td>
                      <td className="py-2 text-right text-text-muted">
                        {subj.maxMarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="rounded-lg bg-surface p-3">
                  <p className="text-text-muted text-xs">Total</p>
                  <p className="font-bold text-foreground">
                    {result.obtained_marks}/{result.total_marks}
                  </p>
                </div>
                <div className="rounded-lg bg-surface p-3">
                  <p className="text-text-muted text-xs">Percentage</p>
                  <p className="font-bold text-foreground">
                    {result.percentage}%
                  </p>
                </div>
                <div className="rounded-lg bg-surface p-3">
                  <p className="text-text-muted text-xs">Grade</p>
                  <p className="font-bold text-foreground">{result.grade}</p>
                </div>
              </div>

              <div
                className={`text-center py-2 rounded-lg font-semibold mb-6 ${
                  result.result_status === "pass"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {result.result_status === "pass" ? "PASS" : "FAIL"}
              </div>

              <button
                onClick={handlePrint}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 font-semibold text-foreground hover:bg-surface transition-colors print:hidden"
              >
                <Printer size={16} />
                Print Result
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
