let subjects = JSON.parse(localStorage.getItem("attendmate_subjects")) || [];

function saveData() {
  localStorage.setItem("attendmate_subjects", JSON.stringify(subjects));
}

function showAddSubject() {
  document.getElementById("subjectModal").style.display = "flex";
  document.getElementById("subjectName").focus();
}

function closeModal() {
  document.getElementById("subjectModal").style.display = "none";
  document.getElementById("subjectName").value = "";
}

function addSubject() {
  const input = document.getElementById("subjectName");
  const name = input.value.trim();

  if (!name) {
    alert("Please enter a subject name.");
    return;
  }

  subjects.push({
    id: Date.now(),
    name: name,
    present: 0,
    absent: 0
  });

  saveData();
  input.value = "";
  closeModal();
  renderSubjects();
}

function markAttendance(id, type) {
  const subject = subjects.find(item => item.id === id);

  if (!subject) return;

  if (type === "present") {
    subject.present++;
  } else {
    subject.absent++;
  }

  saveData();
  renderSubjects();
}

function getPercentage(subject) {
  const total = subject.present + subject.absent;

  if (total === 0) return 0;

  return Math.round((subject.present / total) * 100);
}

function renderSubjects() {
  const container = document.getElementById("subjectList");

  if (subjects.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div>📚</div>
        <h3>No subjects added</h3>
        <p>Add your first subject to start tracking.</p>
        <button onclick="showAddSubject()">Add Subject</button>
      </div>
    `;

    updateOverall();
    return;
  }

  container.innerHTML = subjects.map(subject => {
    const total = subject.present + subject.absent;
    const percentage = getPercentage(subject);

    let warning = "";

    if (total > 0 && percentage < 75) {
      warning = `
        <div class="warning">
          ⚠️ Attendance is below 75%
        </div>
      `;
    }

    return `
      <div class="subject-card">

        <div class="subject-top">
          <div class="subject-name">
            ${escapeHTML(subject.name)}
          </div>

          <div class="percentage">
            ${percentage}%
          </div>
        </div>

        <div class="subject-info">
          Present: ${subject.present} &nbsp; | &nbsp;
          Absent: ${subject.absent} &nbsp; | &nbsp;
          Total: ${total}
        </div>

        <div class="attendance-buttons">

          <button
            class="present-btn"
            onclick="markAttendance(${subject.id}, 'present')">
            ✅ Present

let subjects =
  JSON.parse(localStorage.getItem("attendmate_subjects")) || [];

/* =========================
   SAVE DATA
========================= */

function saveData() {
  localStorage.setItem(
    "attendmate_subjects",
    JSON.stringify(subjects)
  );
}

/* =========================
   ADD SUBJECT
========================= */

function showAddSubject() {
  document.getElementById("subjectModal").style.display = "flex";

  setTimeout(() => {
    document.getElementById("subjectName").focus();
  }, 100);
}

function closeModal() {
  document.getElementById("subjectModal").style.display = "none";
  document.getElementById("subjectName").value = "";
}

function addSubject() {
  const input = document.getElementById("subjectName");
  const name = input.value.trim();

  if (!name) {
    alert("Please enter a subject name.");
    return;
  }

  subjects.push({
    id: Date.now(),
    name: name,
    present: 0,
    absent: 0,
    history: []
  });

  saveData();
  closeModal();
  renderSubjects();
}

/* =========================
   MARK ATTENDANCE
========================= */

function markAttendance(id, type) {
  const subject = subjects.find(item => item.id === id);

  if (!subject) return;

  if (!subject.history) {
    subject.history = [];
  }

  const today = new Date();

  const date = today.toISOString().split("T")[0];

  const alreadyMarked = subject.history.find(
    record => record.date === date
  );

  if (alreadyMarked) {
    alert("Attendance already marked for today.");
    return;
  }

  subject.history.push({
    date: date,
    status: type
  });

  if (type === "present") {
    subject.present++;
  } else {
    subject.absent++;
  }

  saveData();
  renderSubjects();
}

/* =========================
   PERCENTAGE
========================= */

function getPercentage(subject) {
  const total = subject.present + subject.absent;

  if (total === 0) {
    return 0;
  }

  return Math.round(
    (subject.present / total) * 100
  );
}

/* =========================
   RENDER SUBJECTS
========================= */

function renderSubjects() {
  const container =
    document.getElementById("subjectList");

  if (subjects.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div>📚</div>

        <h3>No subjects added</h3>

        <p>
          Add your first subject to start tracking.
        </p>

        <button onclick="showAddSubject()">
          Add Subject
        </button>
      </div>
    `;

    updateOverall();
    return;
  }

  container.innerHTML = subjects.map(subject => {

    const total =
      subject.present + subject.absent;

    const percentage =
      getPercentage(subject);

    let warning = "";

    if (total > 0 && percentage < 75) {
      warning = `
        <div class="warning">
          ⚠️ Attendance is below 75%
        </div>
      `;
    }

    return `
      <div class="subject-card">

        <div class="subject-top">

          <div class="subject-name">
            ${escapeHTML(subject.name)}
          </div>

          <div class="percentage">
            ${percentage}%
          </div>

        </div>

        <div class="subject-info">

          Present: ${subject.present}
          &nbsp; | &nbsp;

          Absent: ${subject.absent}
          &nbsp; | &nbsp;

          Total: ${total}

        </div>

        <div class="attendance-buttons">

          <button
            class="present-btn"
            onclick="markAttendance(
              ${subject.id},
              'present'
            )">

            ✅ Present

          </button>

          <button
            class="absent-btn"
            onclick="markAttendance(
              ${subject.id},
              'absent'
            )">

            ❌ Absent

          </button>

        </div>

        ${warning}

      </div>
    `;

  }).join("");

  updateOverall();
}

/* =========================
   OVERALL ATTENDANCE
========================= */

function updateOverall() {

  let totalPresent = 0;
  let totalClasses = 0;

  subjects.forEach(subject => {

    totalPresent += subject.present;

    totalClasses +=
      subject.present +
      subject.absent;

  });

  const percentage =
    totalClasses === 0
      ? 0
      : Math.round(
          (totalPresent / totalClasses) * 100
        );

  document.getElementById(
    "overallPercentage"
  ).textContent = percentage + "%";

  const status =
    document.getElementById(
      "overallStatus"
    );

  if (totalClasses === 0) {

    status.textContent =
      "No classes recorded";

  } else if (percentage < 75) {

    status.textContent =
      "⚠️ Attendance needs improvement";

  } else {

    status.textContent =
      "✅ Attendance is good";

  }
}

/* =========================
   DATE-WISE HISTORY
========================= */

function showHistory() {

  const modal =
    document.getElementById(
      "historyModal"
    );

  const content =
    document.getElementById(
      "historyContent"
    );

  if (subjects.length === 0) {

    content.innerHTML =
      "<p>No subjects added yet.</p>";

    modal.style.display = "flex";

    return;
  }

  let html = "";

  subjects.forEach(subject => {

    html += `
      <div style="
        padding:15px;
        margin-bottom:15px;
        background:#f4f7fb;
        border-radius:12px;
      ">

        <h3 style="
          margin-bottom:10px;
        ">
          📚 ${escapeHTML(subject.name)}
        </h3>
    `;

    if (
      !subject.history ||
      subject.history.length === 0
    ) {

      html += `
        <p style="
          color:#667085;
          font-size:13px;
        ">
          No attendance recorded yet.
        </p>
      `;

    } else {

      const sortedHistory =
        [...subject.history].reverse();

      sortedHistory.forEach(record => {

        const readableDate =
          formatDate(record.date);

        const status =
          record.status === "present"
            ? "✅ Present"
            : "❌ Absent";

        html += `
          <div style="
            display:flex;
            justify-content:space-between;
            padding:9px 0;
            border-bottom:1px solid #ddd;
            font-size:13px;
          ">

            <span>
              📅 ${readableDate}
            </span>

            <strong>
              ${status}
            </strong>

          </div>
        `;

      });

    }

    html += `
        <div style="
          margin-top:10px;
          font-size:12px;
          color:#667085;
        ">

          Attendance:
          <strong>
            ${getPercentage(subject)}%
          </strong>

        </div>

      </div>
    `;

  });

  content.innerHTML = html;

  modal.style.display = "flex";
}

/* =========================
   FORMAT DATE
========================= */

function formatDate(dateString) {

  const date =
    new Date(dateString + "T00:00:00");

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}

/* =========================
   CLOSE HISTORY
========================= */

function closeHistory() {

  document.getElementById(
    "historyModal"
  ).style.display = "none";
}

/* =========================
   HTML SECURITY
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* =========================
   CLOSE MODALS
========================= */

window.onclick = function(event) {

  const subjectModal =
    document.getElementById(
      "subjectModal"
    );

  const historyModal =
    document.getElementById(
      "historyModal"
    );

  if (event.target === subjectModal) {
    closeModal();
  }

  if (event.target === historyModal) {
    closeHistory();
  }

};

/* =========================
   START APP
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    renderSubjects();

  }
);
