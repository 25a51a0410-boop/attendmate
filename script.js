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
          </button>

          <button
            class="absent-btn"
            onclick="markAttendance(${subject.id}, 'absent')">
            ❌ Absent
          </button>

        </div>

        ${warning}

      </div>
    `;
  }).join("");

  updateOverall();
}

function updateOverall() {
  let totalPresent = 0;
  let totalClasses = 0;

  subjects.forEach(subject => {
    totalPresent += subject.present;
    totalClasses += subject.present + subject.absent;
  });

  const percentage =
    totalClasses === 0
      ? 0
      : Math.round((totalPresent / totalClasses) * 100);

  document.getElementById("overallPercentage").textContent =
    percentage + "%";

  const status = document.getElementById("overallStatus");

  if (totalClasses === 0) {
    status.textContent = "No classes recorded";
  } else if (percentage < 75) {
    status.textContent = "⚠️ Attendance needs improvement";
  } else {
    status.textContent = "✅ Attendance is good";
  }
}

function showHistory() {
  const modal = document.getElementById("historyModal");
  const content = document.getElementById("historyContent");

  if (subjects.length === 0) {
    content.innerHTML = "<p>No attendance records yet.</p>";
  } else {
    content.innerHTML = subjects.map(subject => {
      const total = subject.present + subject.absent;
      const percentage = getPercentage(subject);

      return `
        <div style="
          padding:12px;
          margin-bottom:10px;
          background:#f4f7fb;
          border-radius:10px;
        ">
          <strong>${escapeHTML(subject.name)}</strong>
          <br>
          Present: ${subject.present} |
          Absent: ${subject.absent}
          <br>
          Attendance: ${percentage}%
          <br>
          Total Classes: ${total}
        </div>
      `;
    }).join("");
  }

  modal.style.display = "flex";
}

function closeHistory() {
  document.getElementById("historyModal").style.display = "none";
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

window.onclick = function(event) {
  const subjectModal = document.getElementById("subjectModal");
  const historyModal = document.getElementById("historyModal");

  if (event.target === subjectModal) {
    closeModal();
  }

  if (event.target === historyModal) {
    closeHistory();
  }
};

document.addEventListener("DOMContentLoaded", function() {
  renderSubjects();
});
