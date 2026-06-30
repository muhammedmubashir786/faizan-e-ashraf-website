import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import ResultRow from "./ResultRow";

export default async function ResultsListPage() {
  const supabase = await createServerSupabase();

  const { data: results } = await supabase
    .from("exam_results")
    .select(
      "id, exam_name, exam_year, percentage, grade, result_status, published, students(full_name, roll_number, class_name)"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Exam Results</h1>
          <p className="text-text-muted text-sm">
            Manage and publish student examination results
          </p>
        </div>
        <Link
          href="/admin/dashboard/results/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
        >
          <Plus size={16} />
          Add Result
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-surface-elevated overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-text-muted">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Student</th>
              <th className="px-4 py-3 whitespace-nowrap">Class</th>
              <th className="px-4 py-3 whitespace-nowrap">Exam</th>
              <th className="px-4 py-3 whitespace-nowrap">Grade</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {results?.map((result) => (
              <ResultRow key={result.id} result={result} />
            ))}
            {(!results || results.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                  No results added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
