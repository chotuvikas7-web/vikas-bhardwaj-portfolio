import React, { useEffect, useMemo, useState } from "react";
import { Chart } from "react-google-charts";
import {
  Bell,
  CalendarDays,
  CheckCircle,
  Globe2,
  Eye,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Pencil,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  Table,
  Trash2,
  X,
  Plus
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { api, fallbackProjectImage, getApiErrorMessage, imageUrl } from "../api/client";
import DataTable from "../components/DataTable";
import ProjectForm from "../components/ProjectForm";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext.jsx";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: ShoppingBag },
  { key: "categories", label: "Categories", icon: Table },
  { key: "messages", label: "Messages", icon: MessageCircle },
  { key: "profile", label: "Profile", icon: Mail },
  { key: "email", label: "Email", icon: Sparkles },
  { key: "notifications", label: "Notifications", icon: Bell }
];

const stats = [
  { title: "Visitors", value: "23%", metric: 23, caption: "Weekly growth", change: "-13.24%", negative: true, chart: "donut" },
  { title: "Activity", value: "82%", metric: 82, caption: "Last week", change: "+24.8%", negative: false, chart: "line" },
  { title: "Revenue", value: "$48.9k", metric: 68, caption: "Goal progress", change: "+14.2%", negative: false, chart: "bar" }
];

const initialEmailTemplates = [
  { id: 1, subject: "Welcome to Sneat", recipient: "newuser@example.com", body: "Hello and welcome to the Sneat platform!" },
  { id: 2, subject: "Monthly Report", recipient: "team@example.com", body: "Here is your monthly project report." }
];

const emptyProjectDraft = {
  title: "",
  description: "",
  category: "",
  techStack: "",
  githubLink: "",
  liveLink: "",
  image: ""
};

const projectDraftStorageKey = "admin_project_draft";

const getStoredProjectDraft = () => {
  if (typeof window === "undefined") return emptyProjectDraft;

  try {
    const stored = window.localStorage.getItem(projectDraftStorageKey);
    return stored ? { ...emptyProjectDraft, ...JSON.parse(stored) } : emptyProjectDraft;
  } catch {
    return emptyProjectDraft;
  }
};

const projectToDraft = (project) => ({
  title: project?.title || "",
  description: project?.description || "",
  category: project?.category || "",
  techStack: project?.techStack?.join(", ") || "",
  githubLink: project?.githubLink || "",
  liveLink: project?.liveLink || "",
  image: project?.image || ""
});

const chartBaseOptions = {
  backgroundColor: "transparent",
  animation: {
    startup: true,
    duration: 900,
    easing: "out"
  },
  legend: { position: "none" },
  tooltip: {
    trigger: "focus",
    textStyle: { color: "#0f172a", fontSize: 12 },
    showColorCode: true
  },
  focusTarget: "category",
  chartArea: { left: 20, top: 18, width: "86%", height: "76%" }
};

const fallbackChart = (item, setTooltip) => {
  if (item.chart === "donut") {
    const circumference = 2 * Math.PI * 46;
    return (
      <div className="relative flex h-[280px] w-full items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-52 w-52 -rotate-90">
          <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-800" />
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - item.metric / 100)}
            className="text-rose-500"
            onMouseEnter={() => setTooltip({ label: "Visitors", value: `${item.metric}%` })}
            onMouseLeave={() => setTooltip(null)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-slate-950 dark:text-white">{item.metric}%</span>
        </div>
      </div>
    );
  }

  if (item.chart === "line") {
    const points = [
      { x: 18, y: 140, label: "Week 1", value: "42% activity" },
      { x: 115, y: 74, label: "Week 3", value: "51% activity" },
      { x: 220, y: 88, label: "Week 5", value: `${item.metric}% activity` },
      { x: 340, y: 42, label: "Week 6", value: "72% activity" }
    ];

    return (
      <svg viewBox="0 0 360 180" className="h-[280px] w-full">
        <path d="M18 140 C 55 90, 82 118, 115 74 S 186 58, 220 88 S 288 128, 340 42" fill="none" stroke="#22d3ee" strokeWidth="8" strokeLinecap="round" />
        <path d="M18 140 C 55 90, 82 118, 115 74 S 186 58, 220 88 S 288 128, 340 42 L340 170 L18 170 Z" fill="rgba(34,211,238,0.18)" />
        {points.map((point) => (
          <circle
            key={point.label}
            cx={point.x}
            cy={point.y}
            r="9"
            fill="#cffafe"
            className="cursor-pointer"
            onMouseEnter={() => setTooltip({ label: point.label, value: point.value })}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>
    );
  }

  if (item.chart === "bar") {
    const bars = [
      { label: "January", value: "28k revenue", height: 28 },
      { label: "February", value: "42k revenue", height: 42 },
      { label: "March", value: "36k revenue", height: 36 },
      { label: "April", value: "58k revenue", height: 58 },
      { label: "May", value: `${item.metric}k revenue`, height: item.metric },
      { label: "June", value: "74k revenue", height: 74 }
    ];

    return (
      <div className="flex h-[330px] w-full items-end gap-4">
        {bars.map((bar) => (
          <div
            key={bar.label}
            className="flex-1 cursor-pointer rounded-t-lg bg-gradient-to-t from-cyan-500 to-violet-300 transition hover:brightness-125"
            style={{ height: `${bar.height}%` }}
            onMouseEnter={() => setTooltip({ label: bar.label, value: bar.value })}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </div>
    );
  }

  return null;
};

const InsightGoogleChart = ({ item }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const chartEvents = [
    {
      eventName: "ready",
      callback: () => setIsReady(true)
    },
    {
      eventName: "error",
      callback: () => setHasError(true)
    }
  ];

  if (item.chart === "donut") {
    return (
      <div className="relative h-[280px] w-full">
        {(!isReady || hasError) && <div className="absolute inset-0">{fallbackChart(item, setTooltip)}</div>}
        {!hasError && (
          <div className={isReady ? "relative z-10" : "pointer-events-none absolute inset-0 opacity-0"}>
            <Chart
              chartType="PieChart"
              chartPackages={["corechart"]}
              chartEvents={chartEvents}
              width="100%"
              height="280px"
              loader={<div className="text-sm text-slate-400">Loading chart...</div>}
              data={[
                ["Segment", "Percent"],
                ["Visitors", item.metric],
                ["Remaining", 100 - item.metric]
              ]}
              options={{
                ...chartBaseOptions,
                pieHole: 0.68,
                pieSliceText: "label",
                colors: ["#f43f5e", "#1e293b"],
                slices: { 1: { color: "#1e293b" } },
                tooltip: { ...chartBaseOptions.tooltip, trigger: "selection" }
              }}
            />
          </div>
        )}
        {tooltip && (
          <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-md border border-white/15 bg-slate-950/90 px-3 py-2 text-xs text-white shadow-xl">
            <p className="font-semibold text-cyan-100">{tooltip.label}</p>
            <p className="mt-1 text-white/80">{tooltip.value}</p>
          </div>
        )}
      </div>
    );
  }

  if (item.chart === "line") {
    return (
      <div className="relative h-[280px] w-full">
        {(!isReady || hasError) && <div className="absolute inset-0">{fallbackChart(item, setTooltip)}</div>}
        {!hasError && (
          <div className={isReady ? "relative z-10" : "pointer-events-none absolute inset-0 opacity-0"}>
            <Chart
              chartType="AreaChart"
              chartPackages={["corechart"]}
              chartEvents={chartEvents}
              width="100%"
              height="280px"
              loader={<div className="text-sm text-slate-400">Loading chart...</div>}
              data={[
                ["Week", "Activity", { role: "tooltip" }],
                ["W1", 42, "Week 1: 42% activity"],
                ["W2", 58, "Week 2: 58% activity"],
                ["W3", 51, "Week 3: 51% activity"],
                ["W4", 76, "Week 4: 76% activity"],
                ["W5", item.metric, `Week 5: ${item.metric}% activity`],
                ["W6", 72, "Week 6: 72% activity"]
              ]}
              options={{
                ...chartBaseOptions,
                colors: ["#22d3ee"],
                areaOpacity: 0.22,
                pointSize: 7,
                lineWidth: 4,
                hAxis: { textStyle: { color: "#94a3b8" }, baselineColor: "#334155", gridlines: { color: "transparent" } },
                vAxis: { textStyle: { color: "#94a3b8" }, gridlines: { color: "#1e293b" }, minValue: 0, maxValue: 100 }
              }}
            />
          </div>
        )}
        {tooltip && (
          <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-md border border-white/15 bg-slate-950/90 px-3 py-2 text-xs text-white shadow-xl">
            <p className="font-semibold text-cyan-100">{tooltip.label}</p>
            <p className="mt-1 text-white/80">{tooltip.value}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-[330px] w-full">
      {(!isReady || hasError) && <div className="absolute inset-0">{fallbackChart(item, setTooltip)}</div>}
      {!hasError && (
        <div className={isReady ? "relative z-10" : "pointer-events-none absolute inset-0 opacity-0"}>
          <Chart
            chartType="ColumnChart"
            chartPackages={["corechart"]}
            chartEvents={chartEvents}
            width="100%"
            height="330px"
            loader={<div className="text-sm text-slate-400">Loading chart...</div>}
            data={[
              ["Month", "Revenue", { role: "tooltip" }],
              ["Jan", 28, "January: 28k revenue"],
              ["Feb", 42, "February: 42k revenue"],
              ["Mar", 36, "March: 36k revenue"],
              ["Apr", 58, "April: 58k revenue"],
              ["May", item.metric, `May: ${item.metric}k revenue`],
              ["Jun", 74, "June: 74k revenue"]
            ]}
            options={{
              ...chartBaseOptions,
              colors: ["#a78bfa"],
              bar: { groupWidth: "55%" },
              hAxis: { textStyle: { color: "#94a3b8" }, gridlines: { color: "transparent" } },
              vAxis: { textStyle: { color: "#94a3b8" }, gridlines: { color: "#1e293b" }, minValue: 0, maxValue: 100 }
            }}
          />
        </div>
      )}
      {tooltip && (
        <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-md border border-white/15 bg-slate-950/90 px-3 py-2 text-xs text-white shadow-xl">
          <p className="font-semibold text-cyan-100">{tooltip.label}</p>
          <p className="mt-1 text-white/80">{tooltip.value}</p>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDraft, setProjectDraft] = useState(getStoredProjectDraft);
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [profileDraft, setProfileDraft] = useState({ name: "", role: "", email: "", bio: "", linkedIn: "", phone: "", image: "", resume: "" });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileResumeFile, setProfileResumeFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState("");
  const [previewMessage, setPreviewMessage] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [emailDraft, setEmailDraft] = useState({ id: null, subject: "", recipient: "", body: "" });
  const [emailMessage, setEmailMessage] = useState("");
  const [storageInfo, setStorageInfo] = useState({ dbMode: "unknown", persistent: false });
  const { logout, user } = useAuth();
  const { profile, loading: profileLoading, error: profileContextError, saveProfile, refreshProfile } = useProfile();

  const loadStorageInfo = async () => {
    try {
      const { data } = await api.get("/health");
      setStorageInfo({
        dbMode: data.dbMode || "unknown",
        persistent: Boolean(data.persistent)
      });
    } catch {
      setStorageInfo({ dbMode: "unknown", persistent: false });
    }
  };

  const loadProjects = async () => {
    try {
      setProjectLoading(true);
      setProjectError("");
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      setProjectError(err.response?.data?.message || "Could not load projects");
    } finally {
      setProjectLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      setCategoryError(err.response?.data?.message || "Could not load categories");
    }
  };

  const loadMessages = async () => {
    try {
      setMessagesLoading(true);
      setMessagesError("");
      const { data } = await api.get("/messages");
      setMessages(data);
    } catch (err) {
      setMessagesError(err.response?.data?.message || "Could not load messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    loadStorageInfo();
    loadProjects();
    loadCategories();
    loadMessages();
  }, []);

  useEffect(() => {
    if (selectedProject) return;
    window.localStorage.setItem(projectDraftStorageKey, JSON.stringify({ ...projectDraft, image: "" }));
  }, [projectDraft, selectedProject]);

  useEffect(() => {
    if (profile) {
      setProfileDraft({
        name: profile.name || "",
        role: profile.role || "",
        email: profile.email || "",
        bio: profile.bio || "",
        linkedIn: profile.linkedIn || "",
        phone: profile.phone || "",
        image: profile.image || "",
        resume: profile.resume || ""
      });
      setProfileImageFile(null);
      setProfileResumeFile(null);
    }
  }, [profile]);

  useEffect(() => {
    if (profileImageFile) {
      const previewUrl = URL.createObjectURL(profileImageFile);
      setProfileImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
    setProfileImagePreview(profileDraft.image || "");
  }, [profileImageFile, profileDraft.image]);

  useEffect(() => {
    const stored = window.localStorage.getItem("admin_email_templates");
    if (stored) {
      try {
        setEmailTemplates(JSON.parse(stored));
      } catch {
        setEmailTemplates(initialEmailTemplates);
      }
    } else {
      setEmailTemplates(initialEmailTemplates);
    }
  }, []);

  const persistEmailTemplates = (templates) => {
    setEmailTemplates(templates);
    window.localStorage.setItem("admin_email_templates", JSON.stringify(templates));
  };

  const handleSaveProject = async (formData) => {
    try {
      setProjectSaving(true);
      setProjectError("");
      if (selectedProject) {
        const { data } = await api.put(`/projects/${selectedProject._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setSelectedProject(null);
        setProjectDraft(projectToDraft(data));
        setProjectImageFile(null);
      } else {
        const { data } = await api.post("/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setProjectDraft(projectToDraft(data));
        setProjectImageFile(null);
      }
      await loadProjects();
    } catch (err) {
      setProjectError(err.response?.data?.message || "Could not save project");
    } finally {
      setProjectSaving(false);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      setProjectError("");
      await api.delete(`/projects/${project._id}`);
      setProjects((current) => current.filter((item) => item._id !== project._id));
    } catch (err) {
      setProjectError(err.response?.data?.message || "Could not delete project");
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setProjectDraft(projectToDraft(project));
    setProjectImageFile(null);
    setActiveSection("projects");
  };

  const handleCancelProjectEdit = () => {
    setSelectedProject(null);
    setProjectDraft(getStoredProjectDraft());
    setProjectImageFile(null);
  };

  const handleClearProjectForm = () => {
    setSelectedProject(null);
    setProjectDraft(emptyProjectDraft);
    setProjectImageFile(null);
    setProjectError("");
    window.localStorage.removeItem(projectDraftStorageKey);
  };

  const handleAddCategory = async () => {
    const name = categoryName.trim();
    if (!name) {
      setCategoryError("Category name is required");
      return;
    }
    try {
      setCategoryError("");
      await api.post("/categories", { name });
      setCategoryName("");
      await loadCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.message || "Could not add category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${categoryId}`);
      await loadCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.message || "Could not delete category");
    }
  };

  const handlePreviewMessage = (message) => {
    setPreviewMessage(message);
  };

  const handleDeleteMessage = async (message) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      setMessagesError("");
      await api.delete(`/messages/${message._id || message.id}`);
      setMessages((current) => current.filter((item) => item._id !== (message._id || message.id) && item.id !== (message._id || message.id)));
      if (previewMessage && (previewMessage._id === message._id || previewMessage.id === message.id)) {
        setPreviewMessage(null);
      }
    } catch (err) {
      setMessagesError(err.response?.data?.message || "Could not delete message");
    }
  };

  const handleSaveProfile = async () => {
    try {
      setProfileSaving(true);
      setProfileError("");
      const formData = new FormData();
      formData.append("name", profileDraft.name);
      formData.append("role", profileDraft.role);
      formData.append("email", profileDraft.email);
      formData.append("bio", profileDraft.bio);
      formData.append("linkedIn", profileDraft.linkedIn);
      formData.append("phone", profileDraft.phone);
      formData.append("image", profileImageFile ? profileImageFile : profileDraft.image || "");
      formData.append("resume", profileResumeFile ? profileResumeFile : profileDraft.resume || "");

      await saveProfile(formData);
      setProfileImageFile(null);
      setProfileResumeFile(null);
      setEmailMessage("Profile updated successfully.");
      await refreshProfile();
    } catch (err) {
      setProfileError(getApiErrorMessage(err, "Could not save profile"));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveEmailTemplate = () => {
    if (!emailDraft.subject || !emailDraft.recipient || !emailDraft.body) {
      setEmailMessage("All email fields are required.");
      return;
    }

    const nextTemplates = emailDraft.id
      ? emailTemplates.map((template) => (template.id === emailDraft.id ? emailDraft : template))
      : [...emailTemplates, { ...emailDraft, id: Date.now() }];

    persistEmailTemplates(nextTemplates);
    setEmailDraft({ id: null, subject: "", recipient: "", body: "" });
    setEmailMessage("Email template saved.");
  };

  const handleEditEmailTemplate = (template) => {
    setEmailDraft(template);
    setActiveSection("email");
  };

  const handleDeleteEmailTemplate = (templateId) => {
    if (!window.confirm("Delete this email template?")) return;
    persistEmailTemplates(emailTemplates.filter((template) => template.id !== templateId));
    if (emailDraft.id === templateId) {
      setEmailDraft({ id: null, subject: "", recipient: "", body: "" });
    }
  };

  const categoryNames = useMemo(() => categories.map((category) => category.name), [categories]);
  const profileImageSrc = profileImagePreview || profile?.image || "";
  const profileImageSrcFinal =
    profileImageSrc && (profileImageSrc.startsWith("http") || profileImageSrc.startsWith("blob:"))
      ? profileImageSrc
      : imageUrl(profileImageSrc);
  const adminTableProps = {
    searchable: true,
    sortable: true,
    paginated: true,
    pageSize: 5
  };
  const projectColumns = [
    {
      key: "title",
      label: "Project",
      accessor: (project) => `${project.title} ${project.description}`,
      render: (project) => (
        <div className="flex items-center gap-3">
          <img
            src={imageUrl(project.image)}
            alt={project.title}
            className="h-14 w-20 rounded-xl object-cover"
            onError={(event) => {
              event.currentTarget.src = fallbackProjectImage;
            }}
          />
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">{project.title}</p>
            <p className="line-clamp-1 text-sm text-slate-600 dark:text-slate-400">{project.description}</p>
          </div>
        </div>
      )
    },
    { key: "category", label: "Category", accessor: (project) => project.category || "" },
    { key: "status", label: "Status", accessor: (project) => (project.featured ? "Featured" : "Published"), render: (project) => (project.featured ? "Featured" : "Published") },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (project) => (
        <div className="flex gap-2">
          <button className="btn-secondary px-3 py-2 text-xs" onClick={() => handleEditProject(project)}>
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button className="btn-secondary border-rose-200 px-3 py-2 text-xs text-rose-700 hover:border-rose-300 dark:border-rose-900 dark:text-rose-200" onClick={() => handleDeleteProject(project)}>
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )
    }
  ];
  const messageColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", accessor: (message) => (message.phone ? `${message.countryCode || ""} ${message.phone}`.trim() : "Not provided") },
    { key: "message", label: "Message", render: (message) => <span className="line-clamp-2">{message.message}</span> },
    { key: "createdAt", label: "Received", accessor: (message) => new Date(message.createdAt || message.date || message.timestamp || "").toLocaleString() },
    { key: "autoReplied", label: "Auto-Replied", accessor: (message) => (message.autoReplied ? "Yes" : "No"), render: (message) => (
      message.autoReplied ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-200">
          <CheckCircle className="h-3 w-3" />
          Yes
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-950/20 dark:text-slate-400">No</span>
      )
    ) },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (message) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 dark:border-slate-700 dark:text-slate-200 dark:hover:text-white" onClick={() => handlePreviewMessage(message)} title="Preview message">
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
          <button type="button" className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 dark:border-rose-900 dark:text-rose-200" onClick={() => handleDeleteMessage(message)} title="Delete message">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )
    }
  ];
  const emailTemplateColumns = [
    { key: "subject", label: "Subject" },
    { key: "recipient", label: "Recipient" },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (template) => (
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary text-xs" onClick={() => handleEditEmailTemplate(template)}>Edit</button>
          <button className="btn-secondary border-rose-200 text-xs text-rose-700 hover:border-rose-300 dark:border-rose-900 dark:text-rose-200" onClick={() => handleDeleteEmailTemplate(template.id)}>Delete</button>
        </div>
      )
    }
  ];
  const categoryColumns = [
    { key: "name", label: "Category" },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (category) => (
        <button onClick={() => handleDeleteCategory(category._id)} className="rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 dark:border-rose-900 dark:text-rose-200">
          Delete
        </button>
      )
    }
  ];

  return (
    <section className="min-h-screen bg-[#f7f5ef] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Helmet>
        <title>Admin Dashboard | Developer Portfolio</title>
      </Helmet>

      <div className="grid w-full gap-0 xl:grid-cols-[280px_1fr]">
        <div className={`fixed inset-0 z-20 bg-black/40 transition-opacity md:hidden ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-teal-600 text-white transition-transform duration-300 md:relative md:translate-x-0 md:w-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="border-b border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-teal-100">Admin panel</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Dashboard</h2>
              </div>
              <button type="button" className="md:hidden p-2 text-white" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex items-center gap-4">
              {profileImageSrcFinal ? (
                <img src={profileImageSrcFinal} alt={profile?.name || "Profile"} className="h-16 w-16 rounded-full border border-white/30 object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-semibold text-white">
                  {profileDraft.name ? profileDraft.name[0].toUpperCase() : "A"}
                </div>
              )}
              <div>
                <p className="text-base font-semibold text-white">{profile?.name || "Admin User"}</p>
                <p className="text-sm text-teal-100">{profile?.role || "Administrator"}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2 px-6 py-6">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-none border border-transparent px-4 py-3 text-left text-sm font-medium transition ${
                    activeSection === item.key
                      ? "bg-white/10 text-white"
                      : "text-teal-100 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-white/20 px-6 py-6">
            <button onClick={logout} className="w-full rounded-none border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/15">
              Sign out
            </button>
          </div>
        </aside>

        <div className="space-y-6 px-6">
          <div className="flex items-center justify-between px-4 md:hidden">
            <div className="text-lg font-semibold text-slate-900">Admin Dashboard</div>
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm">
              <Menu className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-4 px-4 md:px-0">
            <div className="border border-slate-200 bg-white px-5 py-5 dark:border-slate-800 dark:bg-slate-950/90">
              <p className="text-sm text-slate-500 dark:text-slate-400">Projects</p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{projects.length}</p>
            </div>
            <div className="border border-slate-200 bg-white px-5 py-5 dark:border-slate-800 dark:bg-slate-950/90">
              <p className="text-sm text-slate-500 dark:text-slate-400">Categories</p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{categories.length}</p>
            </div>
            <div className="border border-slate-200 bg-white px-5 py-5 dark:border-slate-800 dark:bg-slate-950/90">
              <p className="text-sm text-slate-500 dark:text-slate-400">Messages</p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{messages.length}</p>
            </div>
            <div className="border border-slate-200 bg-white px-5 py-5 dark:border-slate-800 dark:bg-slate-950/90">
              <p className="text-sm text-slate-500 dark:text-slate-400">Email templates</p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{emailTemplates.length}</p>
            </div>
          </div>
          {!storageInfo.persistent && (
            <div className="border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
              Storage mode: <span className="font-semibold">{storageInfo.dbMode}</span>. Admin edits now stay saved while this Render instance is running, but permanent saving after restarts/redeploys requires MongoDB Atlas in <span className="font-semibold">MONGO_URI</span>. For permanent media, use image/resume URLs instead of uploads.
            </div>
          )}
          {activeSection === "dashboard" && (
            <div className="border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/90">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Project insights</p>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {stats.map((item) => (
                  <div key={item.title} className={`relative border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-slate-900 ${item.chart === "bar" ? "min-h-[560px] lg:col-span-2" : "min-h-[500px]"}`}>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cyan-500/10 to-transparent" />
                    <div className="relative">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{item.title}</p>
                        <p className="mt-3 text-4xl font-bold text-slate-950 dark:text-white">{item.value}</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.caption}</p>
                        <p className={`mt-3 text-sm font-semibold ${item.negative ? "text-rose-500" : "text-emerald-600"}`}>{item.change}</p>
                      </div>
                    </div>
                    <div className={`relative mt-8 flex items-center justify-center ${item.chart === "bar" ? "min-h-[330px]" : "min-h-[280px]"}`}>
                      <InsightGoogleChart item={item} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={activeSection === "projects" ? "space-y-6" : "hidden"}>
              <div className="border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Projects</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Create, update & delete projects</h2>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Changes are saved immediately and reflected throughout the portfolio.</div>
                </div>
              </div>

              {projectError && <div className="bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{projectError}</div>}

              <ProjectForm
                initialProject={selectedProject}
                values={projectDraft}
                onChange={setProjectDraft}
                imageFile={projectImageFile}
                onImageFileChange={setProjectImageFile}
                onSubmit={handleSaveProject}
                isSaving={projectSaving}
                onCancel={handleCancelProjectEdit}
                onClear={handleClearProjectForm}
                categories={categoryNames}
              />

              {projectLoading ? (
                <div className="border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-400">Loading projects...</div>
              ) : (
                <DataTable columns={projectColumns} rows={projects} emptyMessage="No projects yet." searchPlaceholder="Search projects..." {...adminTableProps} />
              )}
          </div>

          {activeSection === "categories" && (
            <div className="space-y-6">
              <div className="border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Categories</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Add or remove categories</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <input
                      value={categoryName}
                      onChange={(event) => setCategoryName(event.target.value)}
                      placeholder="New category"
                      className="input min-w-[220px]"
                    />
                    <button className="btn-primary" onClick={handleAddCategory}>Add category</button>
                  </div>
                </div>
                {categoryError && <p className="mt-4 text-sm text-rose-600">{categoryError}</p>}
              </div>

              <DataTable columns={categoryColumns} rows={categories} emptyMessage="No categories available." searchPlaceholder="Search categories..." {...adminTableProps} />
            </div>
          )}

          {activeSection === "profile" && (
            <div className="border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Profile</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Edit your public profile</h2>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Saving updates will refresh the portfolio content.</div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Name</span>
                  <input value={profileDraft.name} onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })} className="input" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Role</span>
                  <input value={profileDraft.role} onChange={(event) => setProfileDraft({ ...profileDraft, role: event.target.value })} className="input" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Email</span>
                  <input value={profileDraft.email} onChange={(event) => setProfileDraft({ ...profileDraft, email: event.target.value })} className="input" type="email" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Phone</span>
                  <input value={profileDraft.phone} onChange={(event) => setProfileDraft({ ...profileDraft, phone: event.target.value })} className="input" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Profile image URL</span>
                  <input value={profileDraft.image} onChange={(event) => setProfileDraft({ ...profileDraft, image: event.target.value })} className="input" placeholder="https://" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Upload profile image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setProfileImageFile(file);
                    }}
                    className="input"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Resume URL</span>
                  <input value={profileDraft.resume} onChange={(event) => setProfileDraft({ ...profileDraft, resume: event.target.value })} className="input" placeholder="/uploads/resume.pdf" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Upload resume</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setProfileResumeFile(file);
                    }}
                    className="input"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
                  <span>LinkedIn</span>
                  <input value={profileDraft.linkedIn} onChange={(event) => setProfileDraft({ ...profileDraft, linkedIn: event.target.value })} className="input" />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200 lg:col-span-2">
                  <span>Bio</span>
                  <textarea value={profileDraft.bio} onChange={(event) => setProfileDraft({ ...profileDraft, bio: event.target.value })} className="input min-h-28" />
                </label>
              </div>
              {profileImagePreview && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full border border-slate-200">
                    <img src={profileImagePreview.startsWith("blob:") || profileImagePreview.startsWith("http") ? profileImagePreview : imageUrl(profileImagePreview)} alt="Profile preview" className="h-full w-full object-cover" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Profile preview will display the uploaded or URL image.</p>
                </div>
              )}
              {(profileResumeFile || profileDraft.resume) && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <span className="font-semibold">Resume:</span>
                  <span>{profileResumeFile?.name || profileDraft.resume}</span>
                  {!profileResumeFile && profileDraft.resume && (
                    <a className="btn-secondary px-3 py-2 text-xs" href={imageUrl(profileDraft.resume)} target="_blank" rel="noreferrer">
                      Preview
                    </a>
                  )}
                </div>
              )}

              {(profileError || profileContextError || emailMessage) && (
                <div className={`mt-4 p-4 text-sm ${profileError || profileContextError ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-200"}`}>
                  {profileError || profileContextError || emailMessage}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="btn-primary" onClick={handleSaveProfile} disabled={profileSaving || profileLoading}>
                  {profileSaving ? "Saving..." : "Save profile"}
                </button>
              </div>
            </div>
          )}

          {activeSection === "messages" && (
            <div className="space-y-6">
              <div className="border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Messages</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Incoming contact messages</h2>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">These are saved from the contact form.</div>
                </div>
              </div>

              {messagesError && <div className="bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{messagesError}</div>}

              {messagesLoading ? (
                <div className="border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-400">Loading messages...</div>
              ) : (
                <DataTable columns={messageColumns} rows={messages} emptyMessage="No messages yet." searchPlaceholder="Search messages..." {...adminTableProps} />
              )}
              {previewMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
                  <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Message preview</p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{previewMessage.name}</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{previewMessage.email}</p>
                        {previewMessage.phone && (
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {`${previewMessage.countryCode || ""} ${previewMessage.phone}`.trim()}
                          </p>
                        )}
                        <p className="mt-1 text-sm">
                          Auto-replied: {previewMessage.autoReplied ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-200">
                              <CheckCircle className="h-3 w-3" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-950/20 dark:text-slate-400">
                              No
                            </span>
                          )}
                        </p>
                      </div>
                      <button type="button" className="btn-secondary" onClick={() => setPreviewMessage(null)}>
                        Close
                      </button>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                        {previewMessage.message}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Received: {new Date(previewMessage.createdAt || previewMessage.date || previewMessage.timestamp || "").toLocaleString()}
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 dark:border-rose-900 dark:text-rose-200"
                          onClick={() => handleDeleteMessage(previewMessage)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "email" && (
            <div className="space-y-6">
              <div className="border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Email</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Manage email templates</h2>
                  </div>
                  <button className="btn-secondary" onClick={() => setEmailDraft({ id: null, subject: "", recipient: "", body: "" })}>New template</button>
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span>Subject</span>
                    <input value={emailDraft.subject} onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })} className="input" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span>Recipient</span>
                    <input value={emailDraft.recipient} onChange={(e) => setEmailDraft({ ...emailDraft, recipient: e.target.value })} className="input" />
                  </label>
                </div>
                <label className="mt-4 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Body</span>
                  <textarea value={emailDraft.body} onChange={(e) => setEmailDraft({ ...emailDraft, body: e.target.value })} className="input min-h-44" />
                </label>
                {emailMessage && (
                  <div className="mt-4 bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-200">{emailMessage}</div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="btn-primary" onClick={handleSaveEmailTemplate}>Save template</button>
                  <button className="btn-secondary" onClick={() => setEmailDraft({ id: null, subject: "", recipient: "", body: "" })}>Clear</button>
                </div>
              </div>

              <DataTable columns={emailTemplateColumns} rows={emailTemplates} emptyMessage="No email templates created yet." searchPlaceholder="Search email templates..." {...adminTableProps} />
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Notifications</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Latest alerts</h2>
                </div>
                <div className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">Recent</div>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="bg-slate-50 p-5 dark:bg-slate-900">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">Project sync complete</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">All project data is synced and visible throughout the site.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-5 dark:bg-slate-900">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-1 h-5 w-5 text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">Reminder</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Review categories before publishing new projects.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
