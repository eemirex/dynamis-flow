"use client";

import Link from "next/link";
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Command,
  FileText,
  Filter,
  FolderKanban,
  Gauge,
  Inbox,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Settings,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  activity,
  initialTasks,
  statuses,
  type Status,
  type Task,
} from "@/data/demo";

type View = "Overview" | "Board" | "Calendar" | "Activity";

const navItems = [
  { label: "Overview", icon: Gauge },
  { label: "My work", icon: CheckCircle2 },
  { label: "Inbox", icon: Inbox, badge: "4" },
];

const projects = [
  { name: "Mobile launch", color: "#7c5cff", progress: 68 },
  { name: "Website refresh", color: "#ff7657", progress: 44 },
  { name: "Growth engine", color: "#28b889", progress: 57 },
];

function Avatar({ initials, title }: { initials: string; title?: string }) {
  const palette: Record<string, string> = {
    AO: "#745adf",
    EM: "#2874d0",
    MK: "#1aa678",
    TS: "#e9674d",
    NJ: "#d69a28",
  };
  return (
    <span
      className="avatar"
      style={{ background: palette[initials] ?? "#5b6475" }}
      title={title}
    >
      {initials}
    </span>
  );
}

function TaskCard({
  task,
  onOpen,
  onDragStart,
}: {
  task: Task;
  onOpen: () => void;
  onDragStart: () => void;
}) {
  return (
    <button
      className="task-card"
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      type="button"
    >
      <div className="task-card-top">
        <span className="task-id">{task.id}</span>
        <MoreHorizontal size={16} />
      </div>
      <h4>{task.title}</h4>
      <span className={`priority priority-${task.priority.toLowerCase()}`}>
        {task.priority}
      </span>
      <div className="task-project">
        <i style={{ background: task.projectColor }} /> {task.project}
      </div>
      <div className="task-card-meta">
        <Avatar initials={task.assignee} title={task.assigneeName} />
        <span className={task.due === "Jul 28" ? "due-soon" : ""}>
          <Clock3 size={13} /> {task.due}
        </span>
        {task.comments > 0 && (
          <span><MessageSquareText size={13} /> {task.comments}</span>
        )}
        {task.attachments > 0 && (
          <span><Paperclip size={13} /> {task.attachments}</span>
        )}
      </div>
    </button>
  );
}

export function WorkspaceShell() {
  const [view, setView] = useState<View>("Overview");
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        `${task.title} ${task.id} ${task.project}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, tasks],
  );

  function moveTask(taskId: string, status: Status) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );
    setSelectedTask((current) =>
      current?.id === taskId ? { ...current, status } : current,
    );
    setToast(`Task moved to ${status}`);
    window.setTimeout(() => setToast(null), 2200);
  }

  function addTask(formData: FormData) {
    const title = String(formData.get("title") || "Untitled task");
    const task: Task = {
      id: `MOB-${28 + tasks.length}`,
      title,
      project: "Mobile launch",
      projectColor: "#7c5cff",
      status: "Planned",
      priority: "Medium",
      assignee: "EM",
      assigneeName: "Emmanuel Emirex",
      due: "Aug 8",
      comments: 0,
      attachments: 0,
      description: "New task created in the interactive demo workspace.",
    };
    setTasks((current) => [task, ...current]);
    setNewTaskOpen(false);
    setView("Board");
    setToast("Task created");
    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="workspace-shell">
      <aside className={`workspace-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="workspace-brand">
          <Link href="/" className="brand">
            <span className="brand-mark">D</span>
            <span>Dynamis</span>
            <span className="brand-product">Flow</span>
          </Link>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <button className="organization-switcher" type="button">
          <span className="org-logo">N</span>
          <span><strong>Northstar Studio</strong><small>Business workspace</small></span>
          <ChevronDown size={15} />
        </button>
        <nav className="primary-nav">
          {navItems.map(({ label, icon: Icon, badge }) => (
            <button
              type="button"
              className={view === label ? "active" : ""}
              key={label}
              onClick={() => {
                if (label === "Overview") setView("Overview");
                if (label === "Inbox") setNotificationsOpen(true);
              }}
            >
              <Icon size={17} /><span>{label}</span>{badge && <b>{badge}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-label"><span>PROJECTS</span><Plus size={14} /></div>
        <nav className="project-nav">
          {projects.map((project) => (
            <button key={project.name} onClick={() => setView("Board")} type="button">
              <i style={{ background: project.color }} />
              <span>{project.name}</span>
              <small>{project.progress}%</small>
            </button>
          ))}
        </nav>
        <div className="sidebar-label"><span>WORKSPACE</span></div>
        <nav className="primary-nav quiet">
          <button type="button"><UsersRound size={17} /><span>People & teams</span></button>
          <button type="button"><FolderKanban size={17} /><span>All projects</span></button>
          <button type="button"><Settings size={17} /><span>Settings</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <Sparkles size={17} />
            <strong>14 days left in trial</strong>
            <span>Unlock workload and advanced permissions.</span>
            <button type="button">View plans</button>
          </div>
          <button className="profile-button" type="button">
            <Avatar initials="EM" />
            <span><strong>Emmanuel Emirex</strong><small>Workspace owner</small></span>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)} type="button">
            <Menu size={20} />
          </button>
          <button className="global-search" onClick={() => setSearchOpen(true)} type="button">
            <Search size={16} /><span>Search projects, tasks, and people</span>
            <kbd><Command size={12} /> K</kbd>
          </button>
          <div className="topbar-actions">
            <span className="demo-pill">Interactive demo</span>
            <button type="button" aria-label="Help"><CircleHelp size={18} /></button>
            <button
              className="notification-button"
              type="button"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell size={18} /><i />
            </button>
            <Avatar initials="EM" />
          </div>
        </header>

        <div className="workspace-content">
          <div className="workspace-heading">
            <div>
              <div className="breadcrumb">
                <span>Northstar Studio</span><ChevronRight size={13} /><span>Mobile launch</span>
              </div>
              <h1>Mobile launch</h1>
              <p>Plan and ship the next chapter of the Northstar mobile experience.</p>
            </div>
            <div className="heading-actions">
              <div className="member-stack">
                {["AO", "MK", "TS"].map((person) => <Avatar initials={person} key={person} />)}
                <span className="member-more">+5</span>
              </div>
              <button className="button button-outline" type="button">
                <UsersRound size={16} /> Share
              </button>
              <button className="button button-primary" type="button" onClick={() => setNewTaskOpen(true)}>
                <Plus size={16} /> Add task
              </button>
            </div>
          </div>

          <div className="view-tabs">
            {(["Overview", "Board", "Calendar", "Activity"] as View[]).map((item) => {
              const Icon = item === "Overview" ? LayoutDashboard : item === "Board" ? FolderKanban : item === "Calendar" ? CalendarDays : Activity;
              return (
                <button
                  type="button"
                  className={view === item ? "active" : ""}
                  key={item}
                  onClick={() => setView(item)}
                >
                  <Icon size={15} /> {item}
                </button>
              );
            })}
            <div className="tab-actions">
              <button type="button"><Filter size={15} /> Filter</button>
              <button type="button"><MoreHorizontal size={17} /></button>
            </div>
          </div>

          {view === "Overview" && (
            <OverviewView tasks={tasks} onOpenTask={setSelectedTask} />
          )}
          {view === "Board" && (
            <BoardView
              tasks={filteredTasks}
              onOpenTask={setSelectedTask}
              onDragStart={setDraggedId}
              onDrop={(status) => {
                if (draggedId) moveTask(draggedId, status);
                setDraggedId(null);
              }}
            />
          )}
          {view === "Calendar" && (
            <CalendarView tasks={tasks} onOpenTask={setSelectedTask} />
          )}
          {view === "Activity" && <ActivityView />}
        </div>
      </main>

      {selectedTask && (
        <TaskPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onMove={(status) => moveTask(selectedTask.id, status)}
        />
      )}
      {newTaskOpen && (
        <Modal title="Create a new task" onClose={() => setNewTaskOpen(false)}>
          <form action={addTask} className="new-task-form">
            <label>
              Task name
              <input name="title" required autoFocus placeholder="What needs to be done?" />
            </label>
            <div className="form-grid">
              <label>Project<select defaultValue="mobile"><option value="mobile">Mobile launch</option></select></label>
              <label>Assignee<select defaultValue="em"><option value="em">Emmanuel Emirex</option></select></label>
              <label>Status<select defaultValue="planned"><option value="planned">Planned</option></select></label>
              <label>Priority<select defaultValue="medium"><option value="medium">Medium</option></select></label>
            </div>
            <label>Description<textarea placeholder="Add context, outcomes, or acceptance criteria…" /></label>
            <div className="modal-actions">
              <button className="button button-quiet" type="button" onClick={() => setNewTaskOpen(false)}>Cancel</button>
              <button className="button button-primary" type="submit">Create task</button>
            </div>
          </form>
        </Modal>
      )}
      {notificationsOpen && (
        <NotificationsPanel onClose={() => setNotificationsOpen(false)} />
      )}
      {searchOpen && (
        <Modal title="Search Flow" onClose={() => setSearchOpen(false)} compact>
          <div className="search-dialog">
            <Search size={18} />
            <input
              autoFocus
              placeholder="Search by title, ID, or project…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="search-results">
            {(query ? filteredTasks : tasks.slice(0, 4)).map((task) => (
              <button key={task.id} type="button" onClick={() => { setSelectedTask(task); setSearchOpen(false); }}>
                <span className="search-result-icon"><CheckCircle2 size={16} /></span>
                <span><strong>{task.title}</strong><small>{task.id} · {task.project}</small></span>
                <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function OverviewView({
  tasks,
  onOpenTask,
}: {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}) {
  const complete = tasks.filter((task) => task.status === "Complete").length;
  const progress = Math.round((complete / tasks.length) * 100);
  return (
    <div className="overview-layout">
      <section className="metric-cards">
        <article>
          <div><span>Project progress</span><small>Healthy</small></div>
          <strong>{progress}%</strong>
          <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
          <p><b>+12%</b> since last week</p>
        </article>
        <article>
          <div><span>Open tasks</span><small>This sprint</small></div>
          <strong>{tasks.length - complete}</strong>
          <div className="micro-bars">{[38, 58, 45, 78, 66, 88, 72].map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div>
          <p><b>3</b> due this week</p>
        </article>
        <article>
          <div><span>Team velocity</span><small>Last 30 days</small></div>
          <strong>41 <em>pts</em></strong>
          <div className="velocity-line"><svg viewBox="0 0 180 35"><path d="M2 29 C28 30 30 14 52 18 S79 30 98 16 S125 5 142 12 S163 5 178 3" /></svg></div>
          <p><b>+18%</b> from previous period</p>
        </article>
        <article>
          <div><span>Time remaining</span><small>Launch target</small></div>
          <strong>24 <em>days</em></strong>
          <div className="date-range"><span>Jul 08</span><i /><span>Aug 20</span></div>
          <p>On track for release</p>
        </article>
      </section>
      <section className="overview-grid">
        <article className="panel recent-work">
          <div className="panel-heading"><div><h3>Priority work</h3><p>Tasks requiring attention this week</p></div><button type="button">View all <ChevronRight size={14} /></button></div>
          <div className="task-table">
            <div className="task-table-head"><span>Task</span><span>Status</span><span>Owner</span><span>Due</span></div>
            {tasks.filter((task) => task.status !== "Complete").slice(0, 5).map((task) => (
              <button type="button" className="task-row" key={task.id} onClick={() => onOpenTask(task)}>
                <span><i style={{ borderColor: task.projectColor }} /><b>{task.title}</b><small>{task.id}</small></span>
                <span className={`status status-${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span>
                <span><Avatar initials={task.assignee} /></span>
                <span className={task.due === "Jul 28" ? "due-soon" : ""}>{task.due}</span>
              </button>
            ))}
          </div>
        </article>
        <article className="panel team-activity">
          <div className="panel-heading"><div><h3>Team pulse</h3><p>Recent workspace activity</p></div><MoreHorizontal size={17} /></div>
          <div className="activity-feed">
            {activity.map((item) => (
              <div key={item.action}>
                <Avatar initials={item.initials} />
                <p><strong>{item.person}</strong><span>{item.action}</span><small>{item.time}</small></p>
              </div>
            ))}
          </div>
          <button className="view-activity" type="button">View activity log</button>
        </article>
      </section>
      <section className="milestone-panel panel">
        <div className="panel-heading"><div><h3>Milestones</h3><p>Major outcomes on the path to launch</p></div><button type="button"><Plus size={14} /> Add milestone</button></div>
        <div className="milestone-track">
          {[
            ["Foundation", "Complete", "Jul 18"],
            ["Feature complete", "In progress", "Aug 02"],
            ["Release candidate", "Upcoming", "Aug 12"],
            ["Public launch", "Upcoming", "Aug 20"],
          ].map(([name, state, date], index) => (
            <div className={state === "Complete" ? "done" : index === 1 ? "current" : ""} key={name}>
              <i>{state === "Complete" ? <Check size={13} /> : index + 1}</i>
              <span><strong>{name}</strong><small>{state} · {date}</small></span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BoardView({
  tasks,
  onOpenTask,
  onDragStart,
  onDrop,
}: {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onDragStart: (id: string) => void;
  onDrop: (status: Status) => void;
}) {
  return (
    <div className="board">
      {statuses.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <section
            className="board-column"
            key={status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(status)}
          >
            <div className="board-column-heading">
              <span className={`status-dot dot-${status.toLowerCase().replace(" ", "-")}`} />
              <strong>{status}</strong><b>{columnTasks.length}</b>
              <button type="button"><Plus size={15} /></button>
              <button type="button"><MoreHorizontal size={15} /></button>
            </div>
            <div className="board-card-list">
              {columnTasks.map((task) => (
                <TaskCard
                  task={task}
                  key={task.id}
                  onOpen={() => onOpenTask(task)}
                  onDragStart={() => onDragStart(task.id)}
                />
              ))}
              <button className="add-inline-task" type="button"><Plus size={15} /> Add task</button>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function CalendarView({ tasks, onOpenTask }: { tasks: Task[]; onOpenTask: (task: Task) => void }) {
  const startOffset = 3;
  const days = Array.from({ length: 35 }, (_, index) => index - startOffset + 1);
  return (
    <section className="calendar-panel panel">
      <div className="calendar-toolbar">
        <div><button type="button"><ChevronLeft size={16} /></button><button type="button"><ChevronRight size={16} /></button><button type="button">Today</button></div>
        <h3>July 2026</h3>
        <div><button type="button" className="active">Month</button><button type="button">Week</button></div>
      </div>
      <div className="calendar-grid calendar-days">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="calendar-grid calendar-cells">
        {days.map((day, index) => {
          const visible = day > 0 && day <= 31;
          const dayTasks = visible ? tasks.filter((task) => Number(task.due.split(" ")[1]) === day) : [];
          return (
            <div className={`${!visible ? "muted" : ""} ${day === 27 ? "today" : ""}`} key={index}>
              <span>{visible ? day : day <= 0 ? 30 + day : day - 31}</span>
              {dayTasks.map((task) => (
                <button type="button" style={{ borderLeftColor: task.projectColor }} key={task.id} onClick={() => onOpenTask(task)}>
                  <b>{task.title}</b><small>{task.assignee}</small>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ActivityView() {
  return (
    <section className="activity-page panel">
      <div className="activity-title"><div><h3>Activity log</h3><p>A traceable record of meaningful workspace changes.</p></div><button type="button"><Filter size={15} /> All activity <ChevronDown size={14} /></button></div>
      <div className="activity-timeline">
        {[...activity, ...activity.slice(0, 2)].map((item, index) => (
          <div key={`${item.action}-${index}`}>
            <span className="timeline-line" />
            <Avatar initials={item.initials} />
            <div><p><strong>{item.person}</strong> {item.action}</p><small>{index < 4 ? item.time : `${index} hrs ago`} · Mobile launch</small></div>
            <button type="button"><MoreHorizontal size={16} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}

function TaskPanel({ task, onClose, onMove }: { task: Task; onClose: () => void; onMove: (status: Status) => void }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { name: "Amara Okafor", initials: "AO", copy: "The empty-state prototype is ready. I linked the latest pass in the design file.", time: "24 min ago" },
    { name: "Maya Khan", initials: "MK", copy: "Looks strong. Let’s preserve the progressive disclosure on the final step.", time: "8 min ago" },
  ]);
  return (
    <div className="panel-overlay" onMouseDown={onClose}>
      <aside className="task-panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="task-panel-top">
          <span><i style={{ background: task.projectColor }} />{task.project}<ChevronRight size={13} />{task.id}</span>
          <div><button type="button"><MoreHorizontal size={18} /></button><button type="button" onClick={onClose}><X size={19} /></button></div>
        </div>
        <div className="task-panel-body">
          <div className="task-title-row"><button type="button"><CheckCircle2 size={21} /></button><h2>{task.title}</h2></div>
          <div className="task-properties">
            <span>Status</span><select value={task.status} onChange={(event) => onMove(event.target.value as Status)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            <span>Assignee</span><button type="button"><Avatar initials={task.assignee} /> {task.assigneeName}</button>
            <span>Priority</span><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
            <span>Due date</span><button type="button"><CalendarDays size={15} /> {task.due}, 2026</button>
          </div>
          <section className="task-description">
            <h3>Description</h3><p>{task.description}</p>
            <ul><li>Keep the experience useful on smaller screens</li><li>Track completion and drop-off events</li><li>Include loading, empty, and error states</li></ul>
          </section>
          <section className="attachments">
            <h3>Attachments <span>{task.attachments}</span></h3>
            <div className="attachment-row"><span><FileText size={19} /></span><div><strong>product-brief-v2.pdf</strong><small>2.4 MB · Added by Amara</small></div><MoreHorizontal size={16} /></div>
            <button type="button"><Paperclip size={15} /> Attach a file</button>
          </section>
          <section className="comments">
            <h3>Comments <span>{comments.length}</span></h3>
            {comments.map((item) => (
              <div className="comment" key={item.copy}><Avatar initials={item.initials} /><div><p><strong>{item.name}</strong><small>{item.time}</small></p><span>{item.copy}</span></div></div>
            ))}
            <div className="comment-composer">
              <Avatar initials="EM" />
              <div><textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment… Use @ to mention someone" /><footer><button type="button"><Paperclip size={15} /></button><button type="button" disabled={!comment.trim()} onClick={() => { setComments((current) => [...current, { name: "Emmanuel Emirex", initials: "EM", copy: comment, time: "Just now" }]); setComment(""); }}>Comment</button></footer></div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="panel-overlay" onMouseDown={onClose}>
      <aside className="notifications-panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="notifications-heading"><div><h2>Inbox</h2><span>4 unread</span></div><button type="button" onClick={onClose}><X size={19} /></button></div>
        <div className="notification-tabs"><button type="button" className="active">All</button><button type="button">Mentions</button><button type="button">Assigned</button><button type="button"><Check size={15} /> Mark all read</button></div>
        <div className="notification-list">
          {[
            ["AO", "Amara mentioned you", "Can you review the final onboarding copy?", "MOB-18 · 8 min ago"],
            ["TS", "Task moved to In review", "QA account and notification settings", "MOB-21 · 26 min ago"],
            ["MK", "New file uploaded", "analytics-event-map.pdf", "GRO-09 · 1 hr ago"],
            ["AO", "Due date changed", "Build guided onboarding flow", "MOB-18 · 3 hrs ago"],
          ].map(([initials, title, copy, meta], index) => (
            <button className={index < 2 ? "unread" : ""} type="button" key={title}>
              <Avatar initials={initials} /><span><strong>{title}</strong><p>{copy}</p><small>{meta}</small></span>{index < 2 && <i />}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
  compact,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className={`modal ${compact ? "modal-compact" : ""}`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading"><h2>{title}</h2><button type="button" onClick={onClose}><X size={19} /></button></div>
        {children}
      </div>
    </div>
  );
}
