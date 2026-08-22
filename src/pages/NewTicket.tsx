import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Shell } from "../components/Shell";
import { PriorityTag } from "../components/Badges";
import { useStaff } from "../lib/staff";
import { useTickets } from "../lib/store";
import { CATEGORIES, PRIORITIES, type Category, type Priority } from "../lib/types";
import { cn } from "../lib/utils";

const fieldClass =
  "w-full rounded-md border border-border bg-panel px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent";
const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted";

export default function NewTicket() {
  const { createTicket } = useTickets();
  const { staff } = useStaff();
  const navigate = useNavigate();
  const [requestedBy, setRequestedBy] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [priority, setPriority] = useState<Priority>("Normal");
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!requestedBy.trim() || !subject.trim() || !description.trim()) {
      setError("Your name, a subject, and a description are required.");
      return;
    }
    const ticket = createTicket({
      requestedBy: requestedBy.trim(),
      subject: subject.trim(),
      description: description.trim(),
      category,
      priority,
      assigneeId: assigneeId || null,
    });
    navigate(`/tickets/${ticket.id}`);
  }

  return (
    <Shell title="Submit a Request" action={false}>
      <div className="mx-auto max-w-3xl p-5 sm:p-8">
        <div className="mb-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent">New request</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">Tell us what you need</h1>
          <p className="mt-1 text-sm text-muted">
            Structured intake keeps ownership and follow-up clear — no back-and-forth over chat.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 rounded-xl2 border border-border bg-panel p-6 shadow-glow sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="requestedBy">
                Your name
              </label>
              <input
                id="requestedBy"
                className={fieldClass}
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                placeholder="e.g. Alex Rivera"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="category">
                Category
              </label>
              <select id="category" className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              className={fieldClass}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary of the issue"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="description">
              What's happening?
            </label>
            <textarea
              id="description"
              rows={5}
              className={fieldClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include what you tried, when it started, and anything that helps reproduce it."
            />
          </div>

          <div>
            <label className={labelClass}>Priority</label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                    priority === p ? "border-accent bg-accent/10" : "border-border bg-panel hover:border-faint",
                  )}
                >
                  <PriorityTag priority={p} className="border-0 bg-transparent p-0" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="assignee">
              Assign to (optional)
            </label>
            <select id="assignee" className={fieldClass} value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
              <option value="">Leave unassigned</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.role}
                </option>
              ))}
            </select>
          </div>

          {error ? <p className="text-xs font-medium text-red">{error}</p> : null}

          <div className="flex justify-end border-t border-border pt-6">
            <button
              type="submit"
              className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-accent-ink shadow-sm transition-opacity hover:opacity-90"
            >
              Submit request
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
