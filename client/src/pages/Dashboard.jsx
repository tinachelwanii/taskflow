import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [creatingTask, setCreatingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [filter, setFilter] = useState("all");

  // Search + sorting
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Edit task state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPriority, setEditingPriority] = useState("medium");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Show message
  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
      setMessage("");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        showMessage("Your session has expired. Please log in again.");
      } else {
        showMessage(
          "Unable to load your tasks. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const handleCreateTask = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showMessage("Task title cannot be empty.");
      return;
    }

    if (trimmedTitle.length > 120) {
      showMessage("Task title cannot be longer than 120 characters.");
      return;
    }

    if (creatingTask) return;

    try {
      setCreatingTask(true);
      setMessage("");

      const response = await api.post(
        "/tasks",
        {
          title: trimmedTitle,
          priority,
          dueDate: dueDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) => [response.data, ...prev]);
      setTitle("");
      setPriority("medium");
      setDueDate("");

      showMessage("Task created successfully.", "success");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        showMessage("Your session has expired. Please log in again.");
      } else if (error.response?.data?.message) {
        showMessage(error.response.data.message);
      } else {
        showMessage("Unable to create task. Please try again.");
      }
    } finally {
      setCreatingTask(false);
    }
  };

  // Toggle task
  const handleToggleTask = async (task) => {
    if (updatingTaskId === task._id || deletingTaskId === task._id) {
      return;
    }

    try {
      setUpdatingTaskId(task._id);
      setMessage("");

      const response = await api.put(
        `/tasks/${task._id}`,
        {
          completed: !task.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((item) =>
          item._id === task._id ? response.data : item
        )
      );
    } catch (error) {
      console.error(error);

      if (error.response?.status === 404) {
        showMessage("This task no longer exists. Refreshing your tasks...");
        fetchTasks();
      } else {
        showMessage("Unable to update task. Please try again.");
      }
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Start editing
  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);
    setEditingTitle(task.title);
    setEditingPriority(task.priority || "medium");

    setEditingDueDate(
      task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : ""
    );

    setMessage("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (savingEdit) return;

    setEditingTaskId(null);
    setEditingTitle("");
    setEditingPriority("medium");
    setEditingDueDate("");
  };

  // Save edited task
  const handleSaveEdit = async (task) => {
    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) {
      showMessage("Task title cannot be empty.");
      return;
    }

    if (trimmedTitle.length > 120) {
      showMessage("Task title cannot be longer than 120 characters.");
      return;
    }

    if (savingEdit) return;

    try {
      setSavingEdit(true);
      setMessage("");

      const response = await api.put(
        `/tasks/${task._id}`,
        {
          title: trimmedTitle,
          priority: editingPriority,
          dueDate: editingDueDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((item) =>
          item._id === task._id ? response.data : item
        )
      );

      setEditingTaskId(null);
      setEditingTitle("");
      setEditingPriority("medium");
      setEditingDueDate("");

      showMessage("Task updated successfully.", "success");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 404) {
        showMessage("This task no longer exists. Refreshing your tasks...");
        fetchTasks();
        handleCancelEdit();
      } else {
        showMessage("Unable to edit task. Please try again.");
      }
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (deletingTaskId === id || updatingTaskId === id) {
      return;
    }

    try {
      setDeletingTaskId(id);
      setMessage("");

      await api.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prev) => prev.filter((task) => task._id !== id));

      if (editingTaskId === id) {
        handleCancelEdit();
      }

      showMessage("Task deleted successfully.", "success");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 404) {
        showMessage("This task has already been deleted.");
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } else {
        showMessage("Unable to delete task. Please try again.");
      }
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.filter(
    (task) => !task.completed
  ).length;

  // Check if a task is overdue
  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDueDate = new Date(task.dueDate);
    taskDueDate.setHours(0, 0, 0, 0);

    return taskDueDate < today;
  };

  // Format due date
  const formatDueDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter + search + sorting
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === "priority") {
        const priorityOrder = {
          high: 1,
          medium: 2,
          low: 3,
        };

        return (
          (priorityOrder[a.priority] || 2) -
          (priorityOrder[b.priority] || 2)
        );
      }

      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

  // Priority badge styling
  const getPriorityStyle = (taskPriority) => {
    switch (taskPriority) {
      case "high":
        return "bg-red-50 text-red-600";

      case "low":
        return "bg-[#dc95ff]/20 text-[#8c56d4]";

      default:
        return "bg-[#fff4bf] text-[#8a6b24]";
    }
  };

  const getPriorityLabel = (taskPriority) => {
    switch (taskPriority) {
      case "high":
        return "High";

      case "low":
        return "Low";

      default:
        return "Medium";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff4bf]/25 via-white to-[#ffbefb]/20">
      {/* Navbar */}
      <header className="border-b border-[#ead8f5] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8c56d4] via-[#dc95ff] to-[#ffbefb] text-lg font-bold text-white shadow-lg shadow-[#dc95ff]/30">
              T
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#59358a]">
                TaskFlow
              </h1>

              <p className="text-xs text-[#9b7ac0]">
                Personal workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#59358a]">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-[#9b7ac0]">
                Stay productive
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#ead8f5] bg-white px-3 py-2 text-sm font-medium text-[#8c56d4] transition hover:border-[#dc95ff] hover:bg-[#ffbefb]/15 sm:px-4"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#8c56d4] via-[#dc95ff] to-[#ffbefb] p-7 text-white shadow-xl shadow-[#dc95ff]/30 sm:mb-10 sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-3 text-sm font-medium text-white/90">
              GOOD TO SEE YOU,{" "}
              {user?.name?.split(" ")[0]?.toUpperCase() || "THERE"} ✨
            </p>

            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Your tasks,
              <br />
              beautifully organized.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/90 sm:text-base">
              Plan your day, stay focused, and turn small actions into
              meaningful progress.
            </p>
          </div>

          <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-[#fff4bf]/25 blur-3xl" />
        </section>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {/* Total tasks */}
          <div className="rounded-2xl border border-[#ead8f5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#dc95ff]/10">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#dc95ff]/25 text-xl">
              📋
            </div>

            <p className="text-sm font-medium text-[#8c56d4]">
              Total tasks
            </p>

            <p className="mt-1 text-4xl font-bold text-[#59358a]">
              {tasks.length}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-[#f2e3a9] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#fff4bf]/40">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4bf] text-xl">
              ⏳
            </div>

            <p className="text-sm font-medium text-[#9b7930]">
              Pending
            </p>

            <p className="mt-1 text-4xl font-bold text-[#8c56d4]">
              {pendingCount}
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              ✓
            </div>

            <p className="text-sm font-medium text-emerald-600">
              Completed
            </p>

            <p className="mt-1 text-4xl font-bold text-emerald-600">
              {completedCount}
            </p>
          </div>
        </div>

        {/* Add Task */}
        <section className="mb-8 rounded-3xl border border-[#ead8f5] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#59358a]">
              Add a new task
            </h3>

            <p className="mt-1 text-sm text-[#9b7ac0]">
              What's one thing you want to accomplish today?
            </p>
          </div>

          <form
            onSubmit={handleCreateTask}
            className="flex flex-col gap-3 lg:flex-row"
          >
            <input
              type="text"
              placeholder="Enter your task..."
              value={title}
              maxLength={120}
              disabled={creatingTask}
              onChange={(e) => setTitle(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm text-[#59358a] outline-none transition placeholder:text-[#bda8d0] focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/* Due date */}
            <input
              type="date"
              value={dueDate}
              disabled={creatingTask}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm font-medium text-[#8c56d4] outline-none transition focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <select
              value={priority}
              disabled={creatingTask}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm font-medium text-[#8c56d4] outline-none transition focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>

            <button
              type="submit"
              disabled={creatingTask}
              className="rounded-xl bg-gradient-to-r from-[#8c56d4] via-[#dc95ff] to-[#ffbefb] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#dc95ff]/30 transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {creatingTask ? "Adding..." : "+ Add Task"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </section>

        {/* Search and Sort */}
        <section className="mb-8 rounded-3xl border border-[#ead8f5] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8c56d4]">
                🔎
              </span>

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#ead8f5] bg-[#fdf7ff] py-3 pl-11 pr-4 text-sm text-[#59358a] outline-none transition placeholder:text-[#bda8d0] focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm font-medium text-[#8c56d4] outline-none transition focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          {(search || sortBy !== "newest") && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-[#9b7ac0]">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSortBy("newest");
                }}
                className="text-xs font-medium text-[#8c56d4] transition hover:text-[#59358a]"
              >
                Clear
              </button>
            </div>
          )}
        </section>

        {/* Tasks */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#59358a]">
                My Tasks
              </h3>

              <p className="mt-1 text-sm text-[#9b7ac0]">
                Keep moving forward, one task at a time.
              </p>
            </div>

            <div className="flex w-full overflow-x-auto rounded-xl border border-[#ead8f5] bg-white p-1 shadow-sm sm:w-auto">
              {[
                ["all", "All"],
                ["pending", "Pending"],
                ["completed", "Completed"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${
                    filter === value
                      ? "bg-[#8c56d4] text-white shadow-sm"
                      : "text-[#8c56d4] hover:bg-[#ffbefb]/20"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-3xl border border-[#ead8f5] bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#dc95ff]/25 border-t-[#8c56d4]" />

              <p className="text-sm text-[#9b7ac0]">
                Loading your tasks...
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            /* Empty state */
            <div className="rounded-3xl border-2 border-dashed border-[#dc95ff]/50 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff4bf] to-[#ffbefb]/50 text-3xl">
                {search ? "🔎" : "✨"}
              </div>

              <h4 className="text-lg font-semibold text-[#59358a]">
                {search
                  ? "No matching tasks"
                  : filter === "all"
                    ? "No tasks yet"
                    : "Nothing here yet"}
              </h4>

              <p className="mt-2 text-sm text-[#9b7ac0]">
                {search
                  ? "Try searching with a different keyword."
                  : "Add a task above and start organizing your day."}
              </p>
            </div>
          ) : (
            /* Task list */
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="rounded-2xl border border-[#ead8f5] bg-white p-4 shadow-sm transition hover:border-[#dc95ff]/60 hover:shadow-lg hover:shadow-[#dc95ff]/10 sm:p-5"
                >
                  {editingTaskId === task._id ? (
                    /* Edit Mode */
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                          type="text"
                          value={editingTitle}
                          maxLength={120}
                          autoFocus
                          disabled={savingEdit}
                          onChange={(e) =>
                            setEditingTitle(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(task);
                            }

                            if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                          className="min-w-0 flex-1 rounded-xl border border-[#dc95ff]/70 bg-[#fdf7ff] px-4 py-3 text-sm text-[#59358a] outline-none transition focus:border-[#8c56d4] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:opacity-60"
                        />

                        {/* Edit due date */}
                        <input
                          type="date"
                          value={editingDueDate}
                          disabled={savingEdit}
                          onChange={(e) =>
                            setEditingDueDate(e.target.value)
                          }
                          className="rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm font-medium text-[#8c56d4] outline-none transition focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:opacity-60"
                        />

                        <select
                          value={editingPriority}
                          disabled={savingEdit}
                          onChange={(e) =>
                            setEditingPriority(e.target.value)
                          }
                          className="rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm font-medium text-[#8c56d4] outline-none transition focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:opacity-60"
                        >
                          <option value="low">Low priority</option>
                          <option value="medium">
                            Medium priority
                          </option>
                          <option value="high">High priority</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(task)}
                          disabled={savingEdit}
                          className="rounded-xl bg-gradient-to-r from-[#8c56d4] to-[#dc95ff] px-4 py-2 text-sm font-semibold text-white transition hover:shadow-md hover:shadow-[#dc95ff]/30 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingEdit ? "Saving..." : "Save"}
                        </button>

                        <button
                          onClick={handleCancelEdit}
                          disabled={savingEdit}
                          className="rounded-xl border border-[#ead8f5] bg-white px-4 py-2 text-sm font-medium text-[#8c56d4] transition hover:bg-[#ffbefb]/15 disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal Mode */
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <button
                          onClick={() => handleToggleTask(task)}
                          disabled={
                            updatingTaskId === task._id ||
                            deletingTaskId === task._id
                          }
                          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0 ${
                            task.completed
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-[#dc95ff]/70 bg-white text-transparent hover:border-[#8c56d4]"
                          }`}
                        >
                          {updatingTaskId === task._id ? "…" : "✓"}
                        </button>

                        <div className="min-w-0">
                          <p
                            className={`break-words font-medium ${
                              task.completed
                                ? "text-[#bca9cb] line-through"
                                : "text-[#59358a]"
                            }`}
                          >
                            {task.title}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {/* Status */}
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.completed
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-[#fff4bf]/70 text-[#9b7930]"
                              }`}
                            >
                              {task.completed
                                ? "Completed"
                                : "Pending"}
                            </span>

                            {/* Priority */}
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                                task.priority
                              )}`}
                            >
                              {getPriorityLabel(task.priority)} priority
                            </span>

                            {/* Due date */}
                            {task.dueDate && (
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  isOverdue(task)
                                    ? "bg-red-50 text-red-600"
                                    : "bg-[#f3e8ff] text-[#8c56d4]"
                                }`}
                              >
                                {isOverdue(task) ? "⚠️" : "📅"}{" "}
                                {isOverdue(task)
                                  ? `Overdue · ${formatDueDate(
                                      task.dueDate
                                    )}`
                                  : `Due · ${formatDueDate(
                                      task.dueDate
                                    )}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                        <button
                          onClick={() => handleStartEdit(task)}
                          disabled={
                            updatingTaskId === task._id ||
                            deletingTaskId === task._id
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-[#8c56d4] transition hover:bg-[#ffbefb]/20 hover:text-[#59358a] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteTask(task._id)
                          }
                          disabled={
                            deletingTaskId === task._id ||
                            updatingTaskId === task._id
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-[#bca9cb] transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingTaskId === task._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;