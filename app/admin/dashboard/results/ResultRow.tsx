"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Student = {
  full_name: string;
  roll_number: string;
  class_name: string;
};

type Result = {
  id: string;
  exam_name: string;
  exam_year: number;
  grade: string | null;
  result_status: string;
  published: boolean;
  students: Student | Student[] | null;
};

export default function ResultRow({ result }: { result: Result }) {
  const [published, setPublished] = useState(result.published);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const student = Array.isArray(result.students)
    ? result.students[0]
    : result.students;

  async function togglePublished() {
    setUpdating(true);
    const supabase = createBrowserSupabase();
    const { error } = await supabase
      .from("exam_results")
      .update({ published: !published })
      .eq("id", result.id);

    setUpdating(false);
    if (!error) {
      setPublished(!published);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete the result for ${student?.full_name ?? "this student"}? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createBrowserSupabase();
    const { error } = await supabase
      .from("exam_results")
      .delete()
      .eq("id", result.id);

    setDeleting(false);
    if (!error) {
      setDeleted(true);
    }
  }

  if (deleted) {
    return null;
  }

  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 font-medium text-foreground">
        {student?.full_name ?? "—"}
      </td>
      <td className="px-4 py-3 text-text-muted">
        {student ? `${student.class_name} • Roll ${student.roll_number}` : "—"}
      </td>
      <td className="px-4 py-3 text-text-muted">
        {result.exam_name} {result.exam_year}
      </td>
      <td className="px-4 py-3 text-foreground">{result.grade ?? "—"}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            result.result_status === "pass"
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {result.result_status.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={togglePublished}
          disabled={updating}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
            published
              ? "bg-primary text-white"
              : "bg-surface border border-border text-text-muted"
          }`}
        >
          {published ? "Published" : "Draft"}
        </button>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Delete result"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}
