export type Status = "Planned" | "In progress" | "In review" | "Complete";
export type Priority = "Urgent" | "High" | "Medium" | "Low";

export type Task = {
  id: string;
  title: string;
  project: string;
  projectColor: string;
  status: Status;
  priority: Priority;
  assignee: string;
  assigneeName: string;
  due: string;
  comments: number;
  attachments: number;
  description: string;
};

export const initialTasks: Task[] = [
  {
    id: "MOB-18",
    title: "Build guided onboarding flow",
    project: "Mobile launch",
    projectColor: "#7c5cff",
    status: "In progress",
    priority: "Urgent",
    assignee: "AO",
    assigneeName: "Amara Okafor",
    due: "Jul 29",
    comments: 6,
    attachments: 2,
    description: "Create the first-session experience from account setup through the first completed action.",
  },
  {
    id: "WEB-42",
    title: "Validate new pricing architecture",
    project: "Website refresh",
    projectColor: "#ff7657",
    status: "Planned",
    priority: "High",
    assignee: "EM",
    assigneeName: "Emmanuel Emirex",
    due: "Jul 31",
    comments: 3,
    attachments: 1,
    description: "Review the pricing narrative, plan structure, and conversion assumptions with product and growth.",
  },
  {
    id: "GRO-09",
    title: "Instrument activation events",
    project: "Growth engine",
    projectColor: "#28b889",
    status: "In progress",
    priority: "High",
    assignee: "MK",
    assigneeName: "Maya Khan",
    due: "Aug 1",
    comments: 4,
    attachments: 0,
    description: "Implement the agreed analytics taxonomy for the new activation journey.",
  },
  {
    id: "MOB-21",
    title: "QA account and notification settings",
    project: "Mobile launch",
    projectColor: "#7c5cff",
    status: "In review",
    priority: "Medium",
    assignee: "TS",
    assigneeName: "Tobi Salami",
    due: "Jul 28",
    comments: 8,
    attachments: 3,
    description: "Run the regression suite across account preferences and push notification controls.",
  },
  {
    id: "WEB-38",
    title: "Ship design token migration",
    project: "Website refresh",
    projectColor: "#ff7657",
    status: "Complete",
    priority: "Medium",
    assignee: "AO",
    assigneeName: "Amara Okafor",
    due: "Jul 25",
    comments: 2,
    attachments: 1,
    description: "Replace legacy color and spacing values with the approved semantic token system.",
  },
  {
    id: "GRO-12",
    title: "Draft lifecycle email sequence",
    project: "Growth engine",
    projectColor: "#28b889",
    status: "Planned",
    priority: "Low",
    assignee: "NJ",
    assigneeName: "Nina James",
    due: "Aug 4",
    comments: 1,
    attachments: 0,
    description: "Write the onboarding, activation, and re-engagement email sequence for review.",
  },
  {
    id: "MOB-16",
    title: "Approve navigation prototype",
    project: "Mobile launch",
    projectColor: "#7c5cff",
    status: "Complete",
    priority: "High",
    assignee: "EM",
    assigneeName: "Emmanuel Emirex",
    due: "Jul 24",
    comments: 11,
    attachments: 4,
    description: "Review and sign off the updated mobile navigation model after usability testing.",
  },
  {
    id: "WEB-45",
    title: "Create editorial landing templates",
    project: "Website refresh",
    projectColor: "#ff7657",
    status: "In review",
    priority: "Medium",
    assignee: "MK",
    assigneeName: "Maya Khan",
    due: "Aug 2",
    comments: 5,
    attachments: 2,
    description: "Build reusable landing page templates for the content and campaigns teams.",
  },
];

export const activity = [
  { person: "Amara Okafor", initials: "AO", action: "moved MOB-18 to In progress", time: "8 min ago", color: "#7158e8" },
  { person: "Tobi Salami", initials: "TS", action: "commented on QA account settings", time: "26 min ago", color: "#ef6b4f" },
  { person: "Maya Khan", initials: "MK", action: "uploaded analytics-event-map.pdf", time: "1 hr ago", color: "#1ca979" },
  { person: "Emmanuel Emirex", initials: "EM", action: "completed Approve navigation prototype", time: "3 hrs ago", color: "#2874d0" },
];

export const statuses: Status[] = ["Planned", "In progress", "In review", "Complete"];
