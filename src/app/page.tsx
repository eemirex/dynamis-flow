import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const capabilities = [
  {
    icon: LayoutDashboard,
    title: "Flexible project views",
    copy: "Move between focused boards, calendars, lists, and executive-level signals without losing context.",
  },
  {
    icon: UsersRound,
    title: "Built for real teams",
    copy: "Model organizations, teams, owners, guests, and project-specific access from one dependable workspace.",
  },
  {
    icon: ShieldCheck,
    title: "Permission-aware by design",
    copy: "Tenant isolation, role-based controls, audit events, and secure APIs are part of the foundation.",
  },
];

export default function Home() {
  return (
    <main className="marketing-shell">
      <nav className="marketing-nav">
        <Link href="/" className="brand" aria-label="Dynamis Flow home">
          <span className="brand-mark">D</span>
          <span>Dynamis</span>
          <span className="brand-product">Flow</span>
        </Link>
        <div className="marketing-links">
          <a href="#platform">Platform</a>
          <a href="#principles">Why Flow</a>
          <Link href="/login">Sign in</Link>
        </div>
        <Link href="/workspace" className="button button-dark button-small">
          Explore workspace <ArrowRight size={15} />
        </Link>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={14} /> Project operations, beautifully aligned
          </div>
          <h1>
            Work moves better
            <span> when everyone sees the path.</span>
          </h1>
          <p>
            Dynamis Flow brings projects, tasks, conversations, and decisions
            into one calm operating system for ambitious teams.
          </p>
          <div className="hero-actions">
            <Link href="/workspace" className="button button-primary">
              Open interactive demo <ArrowRight size={17} />
            </Link>
            <a href="#platform" className="button button-quiet">
              See how it works
            </a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>AO</span><span>MK</span><span>TS</span><span>+8</span>
            </div>
            <p><strong>One source of truth</strong><br />from planning to launch</p>
          </div>
        </div>

        <div className="hero-product" aria-label="Dynamis Flow product preview">
          <div className="preview-window">
            <div className="preview-topbar">
              <span className="preview-logo">D</span>
              <div className="preview-search">⌘ K &nbsp; Search anything</div>
              <div className="preview-user">EM</div>
            </div>
            <div className="preview-layout">
              <aside className="preview-sidebar">
                <div className="preview-workspace">Northstar Studio <span>⌄</span></div>
                {["Overview", "My work", "Inbox"].map((item, index) => (
                  <div className={`preview-navitem ${index === 0 ? "active" : ""}`} key={item}>
                    <span /> {item}
                  </div>
                ))}
                <p>PROJECTS</p>
                {["Website refresh", "Mobile launch", "Growth engine"].map((item, index) => (
                  <div className="preview-navitem" key={item}>
                    <i className={`project-dot dot-${index}`} /> {item}
                  </div>
                ))}
              </aside>
              <div className="preview-content">
                <div className="preview-heading">
                  <div>
                    <small>PROJECT /</small>
                    <h3>Mobile launch</h3>
                  </div>
                  <button>+ Add task</button>
                </div>
                <div className="metric-grid">
                  <div><span>Completion</span><strong>68%</strong><i><b /></i></div>
                  <div><span>Due this week</span><strong>12</strong><small>3 high priority</small></div>
                  <div><span>Team velocity</span><strong>+18%</strong><small>vs. last sprint</small></div>
                </div>
                <div className="mini-board">
                  {[
                    ["PLANNED", "4", ["Research empty states", "Finalize analytics map"]],
                    ["IN PROGRESS", "3", ["Build onboarding flow", "QA account settings"]],
                    ["COMPLETE", "8", ["Approve navigation", "Ship design tokens"]],
                  ].map(([label, count, cards]) => (
                    <div className="mini-column" key={label as string}>
                      <div className="mini-column-title"><span>{label}</span><b>{count}</b></div>
                      {(cards as string[]).map((card, index) => (
                        <div className="mini-card" key={card}>
                          <small>{index ? "MOB-24" : "MOB-18"}</small>
                          <p>{card}</p>
                          <div><span className={index ? "tag-yellow" : "tag-purple"}>
                            {index ? "Medium" : "Product"}
                          </span><i>{index ? "TS" : "AO"}</i></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="floating-card floating-comment">
            <MessageSquareText size={18} />
            <div><strong>New comment</strong><span>Amara replied on MOB-18</span></div>
          </div>
          <div className="floating-card floating-complete">
            <CheckCircle2 size={19} />
            <div><strong>Milestone complete</strong><span>Design foundation</span></div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <span>FOR TEAMS WHO VALUE</span>
        <div><strong>Clarity</strong><strong>Momentum</strong><strong>Craft</strong><strong>Accountability</strong></div>
      </section>

      <section className="platform-section" id="platform">
        <div className="section-heading">
          <div className="eyebrow">THE DYNAMIS DIFFERENCE</div>
          <h2>Powerful enough for complexity.<br />Calm enough for every day.</h2>
          <p>Less project theatre. More meaningful progress.</p>
        </div>
        <div className="capability-grid">
          {capabilities.map(({ icon: Icon, title, copy }, index) => (
            <article className="capability-card" key={title}>
              <div className={`capability-icon icon-${index}`}><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span>Explore capability <ArrowRight size={15} /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="principles-section" id="principles">
        <div>
          <div className="eyebrow light">ONE CONNECTED WORKSPACE</div>
          <h2>Every signal your team needs. None of the noise.</h2>
          <p>Flow turns daily activity into a useful, visible operating rhythm.</p>
        </div>
        <div className="principles-list">
          <span><CalendarDays size={19} /> Plan work against real capacity</span>
          <span><Bell size={19} /> Keep attention on what changed</span>
          <span><MessageSquareText size={19} /> Make decisions where work happens</span>
          <span><ShieldCheck size={19} /> Govern access without slowing teams down</span>
        </div>
      </section>

      <footer className="marketing-footer">
        <div className="brand"><span className="brand-mark">D</span><span>Dynamis</span><span className="brand-product">Flow</span></div>
        <p>Designed for teams with somewhere meaningful to go.</p>
        <span>© {new Date().getFullYear()} Dynamis</span>
      </footer>
    </main>
  );
}
