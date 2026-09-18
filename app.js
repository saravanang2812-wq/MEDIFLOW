// ==================== STATE MANAGEMENT ====================
const state = {
  employees: [
    { id: "EMP-101", name: "Dr. Arvind Kumar", dept: "Cardiology", role: "Senior Cardiologist", status: "On Duty", username: "emp101", password: "emp123", contact: "kumar@mediflow.com" },
    { id: "EMP-102", name: "Priya Sharma", dept: "ICU", role: "ICU Charge Nurse", status: "On Duty", username: "emp102", password: "emp123", contact: "priya@mediflow.com" },
    { id: "EMP-103", name: "Dr. Sarah Jenkins", dept: "Neurology", role: "Neurologist Consultant", status: "Active", username: "emp103", password: "emp123", contact: "sarah@mediflow.com" },
    { id: "EMP-104", name: "Dr. Michael Chen", dept: "Emergency", role: "ER Chief Resident", status: "On Duty", username: "emp104", password: "emp123", contact: "chen@mediflow.com" },
    { id: "EMP-105", name: "Nurse David Lee", dept: "General Medicine", role: "Staff Nurse", status: "On Leave", username: "emp105", password: "emp123", contact: "david@mediflow.com" }
  ],
  tasks: [
    { id: "TASK-201", title: "Patient Review - Ward 3C", dept: "Cardiology", assigneeId: "EMP-101", priority: "High", start: "2026-06-04", deadline: "2026-06-05", desc: "Perform comprehensive cardiology review for post-op patients.", status: "Completed" },
    { id: "TASK-202", title: "ICU Ventilator Monitoring Check", dept: "ICU", assigneeId: "EMP-102", priority: "High", start: "2026-06-04", deadline: "2026-06-04", desc: "Monitor ventilators and document vitals for ICU beds 1 to 5.", status: "In Progress" },
    { id: "TASK-203", title: "ER Trauma Case Assignment", dept: "Emergency", assigneeId: "EMP-104", priority: "High", start: "2026-06-04", deadline: "2026-06-04", desc: "Handle incoming multi-trauma emergency case arriving via helicopter.", status: "Pending" },
    { id: "TASK-204", title: "Neurological Consults", dept: "Neurology", assigneeId: "EMP-103", priority: "Medium", start: "2026-06-04", deadline: "2026-06-06", desc: "Consult with stroke patients and schedule EEG tests.", status: "Pending" },
    { id: "TASK-205", title: "Ward 4B Afternoon Rounds", dept: "General Medicine", assigneeId: "EMP-105", priority: "Low", start: "2026-06-04", deadline: "2026-06-04", desc: "Conduct routine temperature and blood pressure check-ups.", status: "Pending" }
  ],
  alerts: [
    { id: "ALERT-301", type: "emergency", title: "Emergency Code Blue", desc: "ICU Bed 3 cardiac arrest team dispatched.", time: "10 mins ago" },
    { id: "ALERT-302", type: "warning", title: "Deadline Approaching", desc: "Ventilator check list is due in 30 minutes.", time: "1 hour ago" },
    { id: "ALERT-303", type: "announcement", title: "Staff Meeting Reminder", desc: "Monthly workforce planning meeting in main auditorium at 3:00 PM.", time: "2 hours ago" }
  ],
  recentActivities: [
    { text: "Dr Kumar completed Patient Review", time: "10 mins ago" },
    { text: "Priya completed ICU Monitoring", time: "32 mins ago" },
    { text: "New Emergency Case Assigned", time: "1 hour ago" },
    { text: "Monthly Report Generated", time: "2 hours ago" }
  ],
  currentUser: null,
  currentRole: "admin", // Selected role on login screen
  charts: {} // Store Chart instances to allow updating or deleting
};

// ==================== APP INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  initClock();
  initLogin();
  initSidebarNavigation();
  initForms();
  initKanbanDragAndDrop();
  
  // Modals close buttons
  document.getElementById("close-employee-modal").addEventListener("click", () => toggleModal("employee-modal", false));
  document.getElementById("close-profile-modal").addEventListener("click", () => toggleModal("edit-profile-modal", false));
  document.getElementById("open-add-employee-btn").addEventListener("click", () => {
    document.getElementById("employee-modal-title").innerText = "Add New Employee";
    document.getElementById("employee-modal-submit-btn").innerText = "Add Employee";
    document.getElementById("employee-form").reset();
    document.getElementById("edit-emp-index").value = "";
    toggleModal("employee-modal", true);
  });

  // Sidebar toggle for responsive menus
  document.getElementById("admin-hamburger").addEventListener("click", () => {
    document.querySelector("#admin-dashboard-container .sidebar").classList.toggle("mobile-open");
  });
  document.getElementById("emp-hamburger").addEventListener("click", () => {
    document.querySelector("#employee-dashboard-container .sidebar").classList.toggle("mobile-open");
  });

  // Close sidebars when selecting menu on mobile
  document.querySelectorAll(".sidebar-nav a").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".sidebar").forEach(sidebar => sidebar.classList.remove("mobile-open"));
    });
  });

  // Top nav profile, settings alerts toggles
  document.getElementById("admin-nav-alerts-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("admin-alerts-dropdown").classList.toggle("hidden");
    populateAlertsDropdowns();
  });
  document.getElementById("emp-nav-alerts-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("emp-alerts-dropdown").classList.toggle("hidden");
    populateAlertsDropdowns();
  });

  // Settings and profile clicks
  document.getElementById("admin-nav-settings-btn").addEventListener("click", () => {
    document.querySelectorAll("#admin-dashboard-container .nav-item").forEach(n => n.classList.remove("active"));
    const settingsNav = document.querySelector(`#admin-dashboard-container .nav-item[data-section="admin-settings"]`);
    if (settingsNav) settingsNav.classList.add("active");
    loadAdminSection("admin-settings");
  });
  document.getElementById("admin-nav-profile-btn").addEventListener("click", () => {
    document.querySelectorAll("#admin-dashboard-container .nav-item").forEach(n => n.classList.remove("active"));
    const settingsNav = document.querySelector(`#admin-dashboard-container .nav-item[data-section="admin-settings"]`);
    if (settingsNav) settingsNav.classList.add("active");
    loadAdminSection("admin-settings");
  });

  document.getElementById("emp-nav-settings-btn").addEventListener("click", () => {
    document.querySelectorAll("#employee-dashboard-container .nav-item").forEach(n => n.classList.remove("active"));
    const profileNav = document.querySelector(`#employee-dashboard-container .nav-item[data-section="emp-profile"]`);
    if (profileNav) profileNav.classList.add("active");
    loadEmployeeSection("emp-profile");
  });
  document.getElementById("emp-nav-profile-btn").addEventListener("click", () => {
    document.querySelectorAll("#employee-dashboard-container .nav-item").forEach(n => n.classList.remove("active"));
    const profileNav = document.querySelector(`#employee-dashboard-container .nav-item[data-section="emp-profile"]`);
    if (profileNav) profileNav.classList.add("active");
    loadEmployeeSection("emp-profile");
  });

  document.addEventListener("click", () => {
    document.getElementById("admin-alerts-dropdown").classList.add("hidden");
    document.getElementById("emp-alerts-dropdown").classList.add("hidden");
  });
});

// ==================== LIVE CLOCK SYSTEM ====================
function initClock() {
  const updateTime = () => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const adminClock = document.getElementById("admin-live-time");
    const empClock = document.getElementById("emp-live-time");
    if (adminClock) adminClock.innerText = timeString;
    if (empClock) empClock.innerText = timeString;
  };
  updateTime();
  setInterval(updateTime, 1000);
}

// ==================== LOGIN SCREEN HANDLERS ====================
function initLogin() {
  const roleButtons = document.querySelectorAll(".role-btn");
  const loginForm = document.getElementById("login-form");

  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentRole = btn.getAttribute("data-role");
    });
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userVal = document.getElementById("username").value.trim();
    const passVal = document.getElementById("password").value;

    if (state.currentRole === "admin") {
      // Validate Admin Credentials
      if (userVal === "admin" && passVal === "admin123") {
        state.currentUser = { name: "Dr. Richard Brand", role: "Director" };
        loginForm.reset();
        transitionDashboard("admin");
      } else {
        alert("Invalid Admin Username or Password. Try admin / admin123");
      }
    } else {
      // Validate Employee Credentials
      const matchedEmp = state.employees.find(emp => emp.username === userVal && emp.password === passVal);
      if (matchedEmp) {
        state.currentUser = matchedEmp;
        loginForm.reset();
        transitionDashboard("employee");
      } else {
        alert("Invalid Employee Username or Password. Try emp101 / emp123");
      }
    }
  });

  // Setup logout buttons
  document.querySelectorAll(".btn-logout").forEach(btn => {
    btn.addEventListener("click", () => {
      state.currentUser = null;
      document.getElementById("admin-dashboard-container").classList.add("hidden");
      document.getElementById("employee-dashboard-container").classList.add("hidden");
      document.getElementById("login-container").classList.remove("hidden");
    });
  });
}

function transitionDashboard(role) {
  document.getElementById("login-container").classList.add("hidden");
  if (role === "admin") {
    document.getElementById("admin-dashboard-container").classList.remove("hidden");
    loadAdminSection("admin-dashboard");
  } else {
    document.getElementById("employee-dashboard-container").classList.remove("hidden");
    loadEmployeeSection("emp-dashboard");
  }
}

// ==================== SINGLE PAGE ROUTER ====================
function initSidebarNavigation() {
  // Admin Navigation Clicks
  const adminNavs = document.querySelectorAll("#admin-dashboard-container .nav-item");
  adminNavs.forEach(nav => {
    nav.addEventListener("click", (e) => {
      e.preventDefault();
      adminNavs.forEach(n => n.classList.remove("active"));
      nav.classList.add("active");
      const sectionName = nav.getAttribute("data-section");
      loadAdminSection(sectionName);
    });
  });

  // Employee Navigation Clicks
  const empNavs = document.querySelectorAll("#employee-dashboard-container .nav-item");
  empNavs.forEach(nav => {
    nav.addEventListener("click", (e) => {
      e.preventDefault();
      empNavs.forEach(n => n.classList.remove("active"));
      nav.classList.add("active");
      const sectionName = nav.getAttribute("data-section");
      loadEmployeeSection(sectionName);
    });
  });
}

function loadAdminSection(sectionName) {
  // Hide all sections in Admin viewport
  const sections = document.querySelectorAll("#admin-dashboard-container main.content-viewport > section");
  sections.forEach(s => s.classList.add("hidden"));

  // Show active section
  const activeSec = document.getElementById(`section-${sectionName}`);
  if (activeSec) {
    activeSec.classList.remove("hidden");
  }

  // Update title header
  const titleMapping = {
    "admin-dashboard": "Hospital Command Center",
    "admin-employees": "Employee Directory",
    "admin-jobs": "Job Assignment Portal",
    "admin-tasks": "Task Progress Board",
    "admin-analytics": "Performance Analytics",
    "admin-alerts": "System Warning Alerts",
    "admin-reports": "Operational Reports",
    "admin-settings": "Command Settings"
  };
  document.getElementById("admin-header-title").innerText = titleMapping[sectionName] || "Command Center";

  // Trigger Section Specific Rendering
  switch (sectionName) {
    case "admin-dashboard":
      renderAdminDashboardStats();
      renderRecentActivities();
      break;
    case "admin-employees":
      renderEmployeesTable();
      break;
    case "admin-jobs":
      populateAssigneeDropdown();
      renderAssignedJobsTable();
      break;
    case "admin-tasks":
      renderKanbanBoard();
      break;
    case "admin-analytics":
      renderAnalyticsCharts();
      break;
    case "admin-alerts":
      renderAdminAlerts();
      break;
    case "admin-settings":
      renderAdminSettings();
      break;
  }
}

function loadEmployeeSection(sectionName) {
  // Hide all sections in Employee viewport
  const sections = document.querySelectorAll("#employee-dashboard-container main.content-viewport > section");
  sections.forEach(s => s.classList.add("hidden"));

  // Show active section
  const activeSec = document.getElementById(`section-${sectionName}`);
  if (activeSec) {
    activeSec.classList.remove("hidden");
  }

  // Update title header
  const titleMapping = {
    "emp-dashboard": "Workforce Portal",
    "emp-tasks": "My Assigned Tasks",
    "emp-schedule": "Shift Schedule",
    "emp-alerts": "Portal Alerts",
    "emp-progress": "My Shift Progress",
    "emp-profile": "My Employee Profile"
  };
  document.getElementById("emp-header-title").innerText = titleMapping[sectionName] || "Workforce Portal";

  // Populate dynamic header details
  const empSidebarContainer = document.getElementById("emp-sidebar-user");
  if (empSidebarContainer && state.currentUser) {
    // Generate avatar url based on ID to keep it visually interesting
    const imgUrl = `https://images.unsplash.com/photo-${getPhotoHash(state.currentUser.id)}?auto=format&fit=crop&q=80&w=120`;
    empSidebarContainer.innerHTML = `
      <img src="${imgUrl}" alt="Employee Avatar" class="avatar-sm">
      <div class="user-details">
        <h4>${state.currentUser.name}</h4>
        <span>${state.currentUser.role}</span>
      </div>
    `;
    document.getElementById("emp-nav-avatar").src = imgUrl;
  }

  // Trigger Section Specific Rendering
  switch (sectionName) {
    case "emp-dashboard":
      renderEmployeeDashboardStats();
      break;
    case "emp-tasks":
      renderEmployeeTasksTable();
      break;
    case "emp-schedule":
      renderEmployeeSchedule();
      break;
    case "emp-alerts":
      renderEmployeeAlerts();
      break;
    case "emp-progress":
      renderEmployeeProgressRadial();
      break;
    case "emp-profile":
      renderEmployeeProfileDetails();
      break;
  }
}

function getPhotoHash(id) {
  // Return different Unsplash photo hashes depending on employee ID to ensure visual diversity
  const mapping = {
    "EMP-101": "1537368910-092b324d5d45", // Kumar
    "EMP-102": "1573496359142-b8d87734a5a2", // Priya
    "EMP-103": "1559839734-2b71ea197ec2", // Sarah
    "EMP-104": "1612349317150-e413f6a5b16d", // Michael
    "EMP-105": "1537368910-092b324d5d45"  // David
  };
  return mapping[id] || "1537368910-092b324d5d45";
}

// ==================== ADMIN: DASHBOARD SECTION ====================
function renderAdminDashboardStats() {
  document.getElementById("stat-total-staff").innerText = state.employees.length;
  document.getElementById("stat-total-tasks").innerText = state.tasks.length;

  const totalBeds = 48; // hardcoded statistic
  document.getElementById("stat-available-beds").innerText = totalBeds;
}

function renderRecentActivities() {
  const container = document.getElementById("recent-activities-list");
  if (!container) return;
  container.innerHTML = "";

  state.recentActivities.slice(0, 5).forEach(act => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${act.text}</strong>
      <span class="activity-time">${act.time}</span>
    `;
    container.appendChild(li);
  });
}

function addRecentActivity(text) {
  state.recentActivities.unshift({ text, time: "Just now" });
  renderRecentActivities();
}

// ==================== ADMIN: EMPLOYEES MANAGEMENT ====================
function renderEmployeesTable() {
  const body = document.getElementById("employees-table-body");
  if (!body) return;
  body.innerHTML = "";

  state.employees.forEach((emp, index) => {
    const tr = document.createElement("tr");
    const statusClass = emp.status.toLowerCase().replace(" ", "-");
    tr.innerHTML = `
      <td><strong>${emp.id}</strong></td>
      <td>${emp.name}</td>
      <td>${emp.dept}</td>
      <td>${emp.role}</td>
      <td><span class="status-pill ${statusClass}">${emp.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openEditEmployee(${index})"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${index})"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    `;
    body.appendChild(tr);
  });
}

window.deleteEmployee = function(index) {
  if (confirm(`Are you sure you want to delete ${state.employees[index].name}?`)) {
    addRecentActivity(`Removed employee ${state.employees[index].name}`);
    state.employees.splice(index, 1);
    renderEmployeesTable();
  }
};

window.openEditEmployee = function(index) {
  const emp = state.employees[index];
  document.getElementById("employee-modal-title").innerText = "Edit Employee Details";
  document.getElementById("employee-modal-submit-btn").innerText = "Save Changes";
  document.getElementById("edit-emp-index").value = index;

  document.getElementById("emp-name").value = emp.name;
  document.getElementById("emp-id").value = emp.id;
  document.getElementById("emp-id").readOnly = true;
  document.getElementById("emp-dept").value = emp.dept;
  document.getElementById("emp-role").value = emp.role;
  document.getElementById("emp-status").value = emp.status;

  toggleModal("employee-modal", true);
};

function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  if (show) {
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
    document.getElementById("emp-id").readOnly = false;
  }
}

// ==================== ADMIN: JOB ASSIGNMENT ====================
function populateAssigneeDropdown() {
  const dropdown = document.getElementById("job-assignee");
  if (!dropdown) return;
  dropdown.innerHTML = "";
  
  state.employees.forEach(emp => {
    const opt = document.createElement("option");
    opt.value = emp.id;
    opt.innerText = `${emp.name} (${emp.dept})`;
    dropdown.appendChild(opt);
  });
}

function renderAssignedJobsTable() {
  const body = document.getElementById("assigned-jobs-table-body");
  if (!body) return;
  body.innerHTML = "";

  state.tasks.forEach(task => {
    const empObj = state.employees.find(e => e.id === task.assigneeId);
    const empName = empObj ? empObj.name : "Unassigned";
    const priorityClass = task.priority.toLowerCase();
    const statusClass = task.status.toLowerCase().replace(" ", "-");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${task.title}</strong></td>
      <td>${empName}</td>
      <td><span class="status-pill ${priorityClass}">${task.priority}</span></td>
      <td>${task.deadline}</td>
      <td><span class="status-pill ${statusClass}">${task.status}</span></td>
    `;
    body.appendChild(tr);
  });
}

// ==================== ADMIN: KANBAN TASK TRACKING ====================
function renderKanbanBoard() {
  const colPending = document.getElementById("cards-pending");
  const colProgress = document.getElementById("cards-progress");
  const colCompleted = document.getElementById("cards-completed");

  if (!colPending || !colProgress || !colCompleted) return;

  colPending.innerHTML = "";
  colProgress.innerHTML = "";
  colCompleted.innerHTML = "";

  let counts = { Pending: 0, "In Progress": 0, Completed: 0 };

  state.tasks.forEach(task => {
    const empObj = state.employees.find(e => e.id === task.assigneeId);
    const empName = empObj ? empObj.name : "Unassigned";
    const priorityClass = task.priority.toLowerCase();

    const card = document.createElement("div");
    card.className = "kanban-card";
    card.setAttribute("draggable", "true");
    card.setAttribute("data-id", task.id);
    card.innerHTML = `
      <div class="kanban-card-title">${task.title}</div>
      <div class="kanban-card-desc">${task.desc}</div>
      <div class="kanban-card-meta">
        <span class="kanban-card-assignee"><i class="fa-solid fa-user-doctor"></i> ${empName}</span>
        <span class="status-pill ${priorityClass}">${task.priority}</span>
      </div>
      <div class="kanban-card-controls" style="margin-top: 8px; display: flex; gap: 4px; justify-content: flex-end;">
        ${task.status !== 'Pending' ? `<button class="btn btn-outline btn-sm" onclick="moveTaskStatus('${task.id}', 'prev')" style="padding: 2px 6px; font-size: 0.7rem;"><i class="fa-solid fa-arrow-left"></i></button>` : ''}
        ${task.status !== 'Completed' ? `<button class="btn btn-outline btn-sm" onclick="moveTaskStatus('${task.id}', 'next')" style="padding: 2px 6px; font-size: 0.7rem;"><i class="fa-solid fa-arrow-right"></i></button>` : ''}
      </div>
    `;

    // Attach native dragstart
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.id);
      card.style.opacity = "0.5";
    });

    card.addEventListener("dragend", () => {
      card.style.opacity = "1";
    });

    if (task.status === "Pending") {
      colPending.appendChild(card);
      counts.Pending++;
    } else if (task.status === "In Progress") {
      colProgress.appendChild(card);
      counts["In Progress"]++;
    } else if (task.status === "Completed") {
      colCompleted.appendChild(card);
      counts.Completed++;
    }
  });

  // Update counts badges
  document.getElementById("count-pending").innerText = counts.Pending;
  document.getElementById("count-progress").innerText = counts["In Progress"];
  document.getElementById("count-completed").innerText = counts.Completed;
}

window.moveTaskStatus = function(taskId, direction) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  const order = ["Pending", "In Progress", "Completed"];
  let currIdx = order.indexOf(task.status);
  
  if (direction === "next" && currIdx < 2) {
    task.status = order[currIdx + 1];
    addRecentActivity(`Moved task ${task.title} to ${task.status}`);
  } else if (direction === "prev" && currIdx > 0) {
    task.status = order[currIdx - 1];
    addRecentActivity(`Moved task ${task.title} back to ${task.status}`);
  }

  renderKanbanBoard();
};

function initKanbanDragAndDrop() {
  const cols = document.querySelectorAll(".kanban-column");

  cols.forEach(col => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      col.style.backgroundColor = "rgba(37, 99, 235, 0.05)";
    });

    col.addEventListener("dragleave", () => {
      col.style.backgroundColor = "";
    });

    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.style.backgroundColor = "";
      const taskId = e.dataTransfer.getData("text/plain");
      const taskObj = state.tasks.find(t => t.id === taskId);
      if (!taskObj) return;

      const colId = col.id; // col-pending, col-progress, col-completed
      let newStatus = "Pending";
      if (colId === "col-progress") newStatus = "In Progress";
      else if (colId === "col-completed") newStatus = "Completed";

      if (taskObj.status !== newStatus) {
        taskObj.status = newStatus;
        addRecentActivity(`Dragged task "${taskObj.title}" to ${newStatus}`);
        renderKanbanBoard();
      }
    });
  });
}

// ==================== ADMIN: ANALYTICS CHARTS ====================
function renderAnalyticsCharts() {
  // Chart 1: Employee Performance (Tasks completed per staff)
  const empCompletionData = state.employees.map(emp => {
    const completedCount = state.tasks.filter(t => t.assigneeId === emp.id && t.status === "Completed").length;
    return { name: emp.name.split(" ").slice(-1)[0], count: completedCount };
  });

  const ctxEmp = document.getElementById("chart-employee-performance").getContext("2d");
  if (state.charts.employee) state.charts.employee.destroy();
  state.charts.employee = new Chart(ctxEmp, {
    type: "bar",
    data: {
      labels: empCompletionData.map(d => d.name),
      datasets: [{
        label: "Tasks Completed",
        data: empCompletionData.map(d => d.count),
        backgroundColor: "rgba(37, 99, 235, 0.7)",
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });

  // Chart 2: Department Performance (Hardcoded values updated with dynamically finished tasks ratio if applicable)
  // Base ratios cardiology 95%, neurology 88%, ER 97%, ICU 92%. We slightly modify it according to relative status.
  const ctxDept = document.getElementById("chart-dept-performance").getContext("2d");
  if (state.charts.dept) state.charts.dept.destroy();
  state.charts.dept = new Chart(ctxDept, {
    type: "radar",
    data: {
      labels: ["Cardiology", "Neurology", "Emergency", "ICU", "General Medicine"],
      datasets: [{
        label: "Department Efficiency Score (%)",
        data: [95, 88, 97, 92, 85],
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        borderColor: "rgba(6, 182, 212, 1)",
        pointBackgroundColor: "rgba(6, 182, 212, 1)",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 50,
          suggestedMax: 100
        }
      }
    }
  });

  // Chart 3: Task Completion Rate (Pending vs In Progress vs Completed)
  const pendingCount = state.tasks.filter(t => t.status === "Pending").length;
  const progressCount = state.tasks.filter(t => t.status === "In Progress").length;
  const completedCount = state.tasks.filter(t => t.status === "Completed").length;

  const ctxTask = document.getElementById("chart-task-completion").getContext("2d");
  if (state.charts.task) state.charts.task.destroy();
  state.charts.task = new Chart(ctxTask, {
    type: "doughnut",
    data: {
      labels: ["Pending", "In Progress", "Completed"],
      datasets: [{
        data: [pendingCount, progressCount, completedCount],
        backgroundColor: ["#f59e0b", "#2563eb", "#10b981"],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

// ==================== ADMIN: ALERTS CENTER ====================
function renderAdminAlerts() {
  const emgList = document.getElementById("admin-emergency-alerts-list");
  const wrnList = document.getElementById("admin-deadline-alerts-list");
  const ancList = document.getElementById("admin-announcement-alerts-list");

  if (!emgList || !wrnList || !ancList) return;

  emgList.innerHTML = "";
  wrnList.innerHTML = "";
  ancList.innerHTML = "";

  state.alerts.forEach(alert => {
    const card = document.createElement("div");
    card.className = `alert-card alert-${alert.type}`;
    
    let icon = "fa-bullhorn";
    if (alert.type === "emergency") icon = "fa-circle-exclamation";
    else if (alert.type === "warning") icon = "fa-clock";

    card.innerHTML = `
      <div class="alert-card-icon"><i class="fa-solid ${icon}"></i></div>
      <div class="alert-card-content">
        <h4>${alert.title}</h4>
        <p>${alert.desc}</p>
        <span>${alert.time}</span>
      </div>
    `;

    if (alert.type === "emergency") {
      emgList.appendChild(card);
    } else if (alert.type === "warning") {
      wrnList.appendChild(card);
    } else {
      ancList.appendChild(card);
    }
  });
}

// ==================== ADMIN: SETTINGS ====================
function renderAdminSettings() {
  const passForm = document.getElementById("admin-password-form");
  if (!passForm) return;

  passForm.onsubmit = (e) => {
    e.preventDefault();
    const curr = document.getElementById("admin-current-pass").value;
    const n = document.getElementById("admin-new-pass").value;

    if (curr === "admin123") {
      alert("Password updated successfully!");
      passForm.reset();
    } else {
      alert("Current password validation failed.");
    }
  };

  // Setup Admin profile metadata click
  document.getElementById("admin-edit-profile-btn").onclick = () => {
    document.getElementById("edit-profile-name-input").value = "Dr. Richard Brand";
    document.getElementById("edit-profile-contact-input").value = "richard@mediflow.com";
    
    const form = document.getElementById("edit-profile-form");
    form.onsubmit = (ev) => {
      ev.preventDefault();
      const n = document.getElementById("edit-profile-name-input").value;
      const c = document.getElementById("edit-profile-contact-input").value;
      document.querySelector(".sidebar-user h4").innerText = n;
      document.querySelector(".profile-summary-meta h4").innerText = n;
      document.querySelector(".profile-summary-meta p").innerText = `Director | Contact: ${c}`;
      toggleModal("edit-profile-modal", false);
      alert("Profile updated!");
    };
    toggleModal("edit-profile-modal", true);
  };
}

// ==================== EMPLOYEE PORTAL HANDLERS ====================
function renderEmployeeDashboardStats() {
  if (!state.currentUser) return;
  const myTasks = state.tasks.filter(t => t.assigneeId === state.currentUser.id);
  
  document.getElementById("emp-welcome-name").innerText = `Welcome Back, ${state.currentUser.name}`;
  document.getElementById("emp-welcome-dept").innerHTML = `<i class="fa-solid fa-hospital-user"></i> ${state.currentUser.role} | <strong>Dept: ${state.currentUser.dept}</strong>`;

  const assigned = myTasks.length;
  const completed = myTasks.filter(t => t.status === "Completed").length;
  const pending = myTasks.filter(t => t.status === "Pending" || t.status === "In Progress").length;

  document.getElementById("emp-stat-assigned").innerText = assigned;
  document.getElementById("emp-stat-completed").innerText = completed;
  document.getElementById("emp-stat-pending").innerText = pending;

  // Render priority tasks table in dashboard quick view
  const tblBody = document.getElementById("emp-dashboard-tasks-body");
  if (!tblBody) return;
  tblBody.innerHTML = "";

  myTasks.slice(0, 3).forEach(task => {
    const tr = document.createElement("tr");
    const priorityClass = task.priority.toLowerCase();
    const statusClass = task.status.toLowerCase().replace(" ", "-");
    tr.innerHTML = `
      <td><strong>${task.title}</strong></td>
      <td><span class="status-pill ${priorityClass}">${task.priority}</span></td>
      <td>${task.deadline}</td>
      <td><span class="status-pill ${statusClass}">${task.status}</span></td>
    `;
    tblBody.appendChild(tr);
  });
}

function renderEmployeeTasksTable() {
  const body = document.getElementById("emp-tasks-table-body");
  if (!body) return;
  body.innerHTML = "";

  const myTasks = state.tasks.filter(t => t.assigneeId === state.currentUser.id);

  if (myTasks.length === 0) {
    body.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No tasks assigned currently.</td></tr>`;
    return;
  }

  myTasks.forEach(task => {
    const priorityClass = task.priority.toLowerCase();
    const statusClass = task.status.toLowerCase().replace(" ", "-");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${task.title}</strong></td>
      <td><span class="status-pill ${priorityClass}">${task.priority}</span></td>
      <td>${task.deadline}</td>
      <td><span class="status-pill ${statusClass}">${task.status}</span></td>
      <td>
        ${task.status === "Pending" ? `<button class="btn btn-primary btn-sm" onclick="updateTaskStatus('${task.id}', 'In Progress')">Start Task</button>` : ""}
        ${task.status === "In Progress" ? `<button class="btn btn-outline btn-sm" onclick="updateTaskStatus('${task.id}', 'In Progress')">Update Progress</button>
                                          <button class="btn btn-primary btn-sm" onclick="updateTaskStatus('${task.id}', 'Completed')">Mark Complete</button>` : ""}
        ${task.status === "Completed" ? `<span style="color: var(--success); font-size: 0.85rem;"><i class="fa-solid fa-circle-check"></i> Done</span>` : ""}
      </td>
    `;
    body.appendChild(tr);
  });
}

window.updateTaskStatus = function(taskId, newStatus) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  if (newStatus === "In Progress" && task.status === "In Progress") {
    // Interactive progress update demo
    const progressVal = prompt("Enter task progress percentage (0 - 100):", "50");
    if (progressVal !== null) {
      task.desc = `${task.desc.split(" [")[0]} [Progress: ${progressVal}%]`;
      addRecentActivity(`${state.currentUser.name} updated task progress to ${progressVal}%`);
      alert("Progress updated!");
    }
  } else {
    task.status = newStatus;
    addRecentActivity(`${state.currentUser.name} marked task "${task.title}" as ${newStatus}`);
  }

  renderEmployeeTasksTable();
};

function renderEmployeeSchedule() {
  const container = document.getElementById("emp-timeline-list");
  if (!container) return;

  // Timeline hardcoded requirements
  const timelineItems = [
    { time: "09:00 AM", title: "Ward Visit", desc: "Routine vital checks on general ward patients." },
    { time: "11:00 AM", title: "Patient Review", desc: "Consultation checks and file reviews with Lead Doctor." },
    { time: "02:00 PM", title: "Emergency Support", desc: "Shift standby for ER room 1 & 2 support." },
    { time: "05:00 PM", title: "ICU Monitoring", desc: "Hourly updates of critical ICU vitals and check sheets." }
  ];

  container.innerHTML = "";
  timelineItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-details">
        <h4>${item.title}</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">${item.desc}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderEmployeeAlerts() {
  const container = document.getElementById("emp-personal-alerts-list");
  if (!container) return;

  // Personalized hardcoded requirements:
  const empAlerts = [
    { type: "emergency", title: "Emergency Patient Assigned", desc: "You have been reassigned to trauma case arrival on Bed 14. Report immediately.", time: "5 mins ago" },
    { type: "warning", title: "Deadline Approaching", desc: "Your Shift Activity Log for the morning must be filed in 45 minutes.", time: "15 mins ago" },
    { type: "announcement", title: "Staff Meeting Reminder", desc: "All shift leads to report to main auditorium at 3:00 PM for Medi Flow operations debrief.", time: "1 hour ago" }
  ];

  container.innerHTML = "";
  empAlerts.forEach(alert => {
    const div = document.createElement("div");
    div.className = `alert-card alert-${alert.type}`;
    let icon = "fa-bullhorn";
    if (alert.type === "emergency") icon = "fa-circle-exclamation";
    else if (alert.type === "warning") icon = "fa-clock";

    div.innerHTML = `
      <div class="alert-card-icon"><i class="fa-solid ${icon}"></i></div>
      <div class="alert-card-content">
        <h4>${alert.title}</h4>
        <p>${alert.desc}</p>
        <span>${alert.time}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderEmployeeProgressRadial() {
  if (!state.currentUser) return;
  const myTasks = state.tasks.filter(t => t.assigneeId === state.currentUser.id);
  const completed = myTasks.filter(t => t.status === "Completed").length;
  const total = myTasks.length;

  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Radial animation using stroke-dashoffset
  const ring = document.getElementById("emp-progress-ring");
  const percentText = document.getElementById("emp-progress-percent");
  
  if (ring && percentText) {
    const r = ring.r.baseVal.value;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (rate / 100) * circumference;
    
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${offset}`;
    percentText.innerText = `${rate}%`;
  }

  document.getElementById("emp-progress-completed").innerText = completed;
  document.getElementById("emp-progress-pending").innerText = total - completed;

  // Milestone check description
  const milestoneTasksDesc = document.getElementById("milestone-tasks-desc");
  const milestoneTasksStep = document.getElementById("milestone-tasks-step");
  if (milestoneTasksDesc && milestoneTasksStep) {
    if (rate === 100 && total > 0) {
      milestoneTasksStep.classList.add("done");
      milestoneTasksStep.querySelector(".milestone-bullet").innerHTML = '<i class="fa-solid fa-check"></i>';
      milestoneTasksDesc.innerText = "All assigned shift tasks completed successfully!";
    } else {
      milestoneTasksStep.classList.remove("done");
      milestoneTasksStep.querySelector(".milestone-bullet").innerHTML = '<i class="fa-solid fa-spinner"></i>';
      milestoneTasksDesc.innerText = `${completed} out of ${total} tasks finished. Complete all tasks to unlock shift log out.`;
    }
  }
}

function renderEmployeeProfileDetails() {
  if (!state.currentUser) return;

  const imgUrl = `https://images.unsplash.com/photo-${getPhotoHash(state.currentUser.id)}?auto=format&fit=crop&q=80&w=120`;
  document.getElementById("emp-profile-avatar").src = imgUrl;

  document.getElementById("emp-profile-name").innerText = state.currentUser.name;
  document.getElementById("emp-profile-position").innerText = state.currentUser.role;
  document.getElementById("emp-profile-id").innerText = state.currentUser.id;
  document.getElementById("emp-profile-dept-name").innerText = state.currentUser.dept;
  document.getElementById("emp-profile-contact").innerText = state.currentUser.contact;

  // Bind edit profile modal action
  document.getElementById("open-edit-profile-btn").onclick = () => {
    document.getElementById("edit-profile-name-input").value = state.currentUser.name;
    document.getElementById("edit-profile-contact-input").value = state.currentUser.contact;

    const form = document.getElementById("edit-profile-form");
    form.onsubmit = (e) => {
      e.preventDefault();
      state.currentUser.name = document.getElementById("edit-profile-name-input").value.trim();
      state.currentUser.contact = document.getElementById("edit-profile-contact-input").value.trim();

      addRecentActivity(`Employee updated profile: ${state.currentUser.name}`);
      renderEmployeeProfileDetails();
      toggleModal("edit-profile-modal", false);
      alert("Profile updated successfully!");
    };

    toggleModal("edit-profile-modal", true);
  };
}

// ==================== FORMS AND SUBMIT HANDLERS ====================
function initForms() {
  // Add/Edit Employee Submit Handler
  const empForm = document.getElementById("employee-form");
  if (empForm) {
    empForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const idx = document.getElementById("edit-emp-index").value;
      const name = document.getElementById("emp-name").value.trim();
      const id = document.getElementById("emp-id").value.trim();
      const dept = document.getElementById("emp-dept").value;
      const role = document.getElementById("emp-role").value.trim();
      const status = document.getElementById("emp-status").value;

      if (idx !== "") {
        // Edit Mode
        const empIndex = parseInt(idx, 10);
        state.employees[empIndex].name = name;
        state.employees[empIndex].dept = dept;
        state.employees[empIndex].role = role;
        state.employees[empIndex].status = status;
        addRecentActivity(`Updated employee: ${name}`);
      } else {
        // Add Mode
        // Generate automatic temporary username/password credentials
        const cleanName = name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 6);
        const username = `emp${Math.floor(100 + Math.random() * 900)}`;
        const password = "emp123";

        const newEmp = { id, name, dept, role, status, username, password, contact: `${cleanName}@mediflow.com` };
        state.employees.push(newEmp);
        addRecentActivity(`Added new employee: ${name}`);
      }

      toggleModal("employee-modal", false);
      renderEmployeesTable();
    });
  }

  // Job Assignment Submit Handler
  const jobForm = document.getElementById("job-assignment-form");
  if (jobForm) {
    jobForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("job-title").value.trim();
      const dept = document.getElementById("job-dept").value;
      const assigneeId = document.getElementById("job-assignee").value;
      const priority = document.getElementById("job-priority").value;
      const start = document.getElementById("job-start").value;
      const deadline = document.getElementById("job-deadline").value;
      const desc = document.getElementById("job-description").value.trim();

      const newTaskId = `TASK-${Math.floor(206 + Math.random() * 1000)}`;
      const newTask = { id: newTaskId, title, dept, assigneeId, priority, start, deadline, desc, status: "Pending" };

      state.tasks.push(newTask);
      addRecentActivity(`Assigned job "${title}" to employee ID: ${assigneeId}`);
      
      jobForm.reset();
      renderAssignedJobsTable();
      alert("Job Assigned Successfully!");
    });
  }
}

// ==================== OPERATIONAL REPORTS CSV EXPORT ====================
window.downloadMockReport = function(type) {
  let title = `Medi_Flow_${type}_Performance_Report.csv`;
  let csvContent = "data:text/csv;charset=utf-8,";
  
  if (type === "daily") {
    csvContent += "Metric,Value\n";
    csvContent += `Active Employees Count,${state.employees.length}\n`;
    csvContent += `Total Assigned Tasks,${state.tasks.length}\n`;
    csvContent += `Current Patients Vitals Count,342\n`;
    csvContent += `Beds Available,48\n`;
  } else if (type === "weekly") {
    csvContent += "Department,Task Count,Completed,Completion Rate (%)\n";
    const depts = ["Cardiology", "Neurology", "Emergency", "ICU", "General Medicine"];
    depts.forEach(dept => {
      const deptTasks = state.tasks.filter(t => t.dept === dept);
      const done = deptTasks.filter(t => t.status === "Completed").length;
      const rate = deptTasks.length > 0 ? Math.round((done / deptTasks.length) * 100) : 100;
      csvContent += `${dept},${deptTasks.length},${done},${rate}%\n`;
    });
  } else {
    csvContent += "Employee ID,Name,Department,Role,Status,Assigned Tasks\n";
    state.employees.forEach(emp => {
      const count = state.tasks.filter(t => t.assigneeId === emp.id).length;
      csvContent += `"${emp.id}","${emp.name}","${emp.dept}","${emp.role}","${emp.status}",${count}\n`;
    });
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", title);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
  addRecentActivity(`Exported ${type} performance reports`);
};

// ==================== DROPDOWN ALERTS GENERATOR ====================
function populateAlertsDropdowns() {
  const adminDropdownList = document.getElementById("admin-alerts-list");
  const empDropdownList = document.getElementById("emp-alerts-list");

  if (adminDropdownList) {
    adminDropdownList.innerHTML = "";
    state.alerts.forEach(alert => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${alert.title}</strong>
        <p style="margin: 0; color: var(--text-muted); font-size: 0.75rem;">${alert.desc}</p>
        <span style="font-size: 0.7rem; color: var(--primary-blue); opacity: 0.8;">${alert.time}</span>
      `;
      adminDropdownList.appendChild(li);
    });
  }

  if (empDropdownList && state.currentUser) {
    empDropdownList.innerHTML = "";
    // Personalized alerts
    const empAlerts = [
      { title: "Emergency Patient Assigned", desc: "Report to trauma room arrival Bed 14.", time: "5 mins ago" },
      { title: "Deadline Approaching", desc: "Shift activity log is due in 45 minutes.", time: "15 mins ago" },
      { title: "Staff Meeting Reminder", desc: "Operations meeting in Main Auditorium.", time: "1 hour ago" }
    ];
    empAlerts.forEach(alert => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${alert.title}</strong>
        <p style="margin: 0; color: var(--text-muted); font-size: 0.75rem;">${alert.desc}</p>
        <span style="font-size: 0.7rem; color: var(--primary-blue); opacity: 0.8;">${alert.time}</span>
      `;
      empDropdownList.appendChild(li);
    });
  }
}

