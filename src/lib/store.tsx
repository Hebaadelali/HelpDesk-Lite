import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { SEED_TICKETS } from "./seed";
import type { NewTicketInput, Status, Ticket } from "./types";
import { genId } from "./utils";
import { useToast } from "./toast";
import { useAuth } from "./auth";
import { useStaff } from "./staff";

const STORAGE_KEY = "helpdesk-lite-tickets-v2";

type Action =
  | { type: "hydrate"; tickets: Ticket[] }
  | { type: "create"; ticket: Ticket }
  | { type: "setStatus"; id: string; status: Status; actor: string }
  | { type: "setAssignee"; id: string; assigneeId: string | null; assigneeName: string | null; actor: string }
  | { type: "setPriority"; id: string; priority: Ticket["priority"]; actor: string }
  | { type: "addNote"; id: string; text: string; actor: string }
  | { type: "reset" };

function reducer(state: Ticket[], action: Action): Ticket[] {
  const now = new Date().toISOString();
  switch (action.type) {
    case "hydrate":
      return action.tickets;
    case "reset":
      return SEED_TICKETS;
    case "create":
      return [action.ticket, ...state];
    case "setStatus":
      return state.map((t) => {
        if (t.id !== action.id || t.status === action.status) return t;
        const resolvedAt =
          action.status === "Resolved" || action.status === "Closed" ? now : action.status === "New" ? null : t.resolvedAt;
        return {
          ...t,
          status: action.status,
          updatedAt: now,
          resolvedAt,
          history: [
            ...t.history,
            { id: genId("h"), at: now, actor: action.actor, text: `Status changed to ${action.status}.`, kind: "system" as const },
          ],
        };
      });
    case "setAssignee":
      return state.map((t) => {
        if (t.id !== action.id) return t;
        return {
          ...t,
          assigneeId: action.assigneeId,
          updatedAt: now,
          history: [
            ...t.history,
            {
              id: genId("h"),
              at: now,
              actor: action.actor,
              text: action.assigneeName ? `Assigned to ${action.assigneeName}.` : "Assignment removed.",
              kind: "system" as const,
            },
          ],
        };
      });
    case "setPriority":
      return state.map((t) => {
        if (t.id !== action.id || t.priority === action.priority) return t;
        return {
          ...t,
          priority: action.priority,
          updatedAt: now,
          history: [
            ...t.history,
            { id: genId("h"), at: now, actor: action.actor, text: `Priority changed to ${action.priority}.`, kind: "system" as const },
          ],
        };
      });
    case "addNote":
      return state.map((t) =>
        t.id === action.id
          ? {
              ...t,
              updatedAt: now,
              history: [...t.history, { id: genId("h"), at: now, actor: action.actor, text: action.text, kind: "note" as const }],
            }
          : t,
      );
    default:
      return state;
  }
}

type TicketStore = {
  tickets: Ticket[];
  hydrated: boolean;
  createTicket: (input: NewTicketInput) => Ticket;
  setStatus: (id: string, status: Status) => void;
  setAssignee: (id: string, assigneeId: string | null) => void;
  setPriority: (id: string, priority: Ticket["priority"]) => void;
  addNote: (id: string, text: string) => void;
  resetDemoData: () => void;
};

const TicketContext = createContext<TicketStore | null>(null);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, dispatch] = useReducer(reducer, SEED_TICKETS);
  const hydratedRef = useMemo(() => ({ current: false }), []);
  const toast = useToast();
  const { user } = useAuth();
  const { staffById } = useStaff();
  const actorName = user?.name ?? "Guest";

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", tickets: JSON.parse(raw) as Ticket[] });
    } catch {
      /* ignore malformed storage */
    }
    hydratedRef.current = true;
  }, [hydratedRef]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
      /* storage unavailable */
    }
  }, [tickets, hydratedRef]);

  const createTicket = useCallback(
    (input: NewTicketInput) => {
      const now = new Date().toISOString();
      const suffix = Math.floor(1000 + Math.random() * 8999);
      const ticket: Ticket = {
        id: `t-${suffix}`,
        ref: `TK-${suffix}`,
        subject: input.subject,
        description: input.description,
        category: input.category,
        priority: input.priority,
        status: "New",
        assigneeId: input.assigneeId,
        requestedBy: input.requestedBy,
        createdAt: now,
        updatedAt: now,
        resolvedAt: null,
        history: [
          { id: genId("h"), at: now, actor: input.requestedBy, text: "Submitted the request.", kind: "system" },
          ...(input.assigneeId
            ? [
                {
                  id: genId("h"),
                  at: now,
                  actor: actorName,
                  text: `Assigned to ${staffById(input.assigneeId)?.name}.`,
                  kind: "system" as const,
                },
              ]
            : []),
        ],
      };
      dispatch({ type: "create", ticket });
      toast.push({ tone: "success", title: "Request submitted", message: `${ticket.ref} is now in the queue.` });
      return ticket;
    },
    [toast, actorName, staffById],
  );

  const setStatus = useCallback(
    (id: string, status: Status) => {
      dispatch({ type: "setStatus", id, status, actor: actorName });
      toast.push({ tone: "info", title: "Status updated", message: `Moved to ${status}.` });
    },
    [toast, actorName],
  );

  const setAssignee = useCallback(
    (id: string, assigneeId: string | null) => {
      const assignee = staffById(assigneeId);
      dispatch({ type: "setAssignee", id, assigneeId, assigneeName: assignee?.name ?? null, actor: actorName });
      toast.push({
        tone: "info",
        title: assignee ? "Owner assigned" : "Owner removed",
        message: assignee ? `${assignee.name} now owns this ticket.` : "This ticket is unassigned.",
      });
    },
    [toast, actorName, staffById],
  );

  const setPriority = useCallback(
    (id: string, priority: Ticket["priority"]) => {
      dispatch({ type: "setPriority", id, priority, actor: actorName });
    },
    [actorName],
  );

  const addNote = useCallback(
    (id: string, text: string) => {
      dispatch({ type: "addNote", id, text, actor: actorName });
      toast.push({ tone: "success", title: "Update posted" });
    },
    [toast, actorName],
  );

  const resetDemoData = useCallback(() => {
    dispatch({ type: "reset" });
    toast.push({ tone: "info", title: "Demo data reset" });
  }, [toast]);

  const value = useMemo(
    () => ({ tickets, hydrated: true, createTicket, setStatus, setAssignee, setPriority, addNote, resetDemoData }),
    [tickets, createTicket, setStatus, setAssignee, setPriority, addNote, resetDemoData],
  );

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
}

export function useTickets() {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used inside TicketProvider");
  return ctx;
}
