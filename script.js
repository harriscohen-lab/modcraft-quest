const STORAGE_KEY = "modcraft-progress";
const NOTES_KEY = "modcraft-notes";

const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const weeks = Array.from(document.querySelectorAll(".week"));
const resumeButton = document.getElementById("resume-btn");
const resetButton = document.getElementById("reset-btn");
const notesField = document.getElementById("notes");
const saveNotesButton = document.getElementById("save-notes");

const loadProgress = () => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  weeks.forEach((week, index) => {
    const checkbox = week.querySelector("input[type='checkbox']");
    checkbox.checked = saved.includes(index + 1);
  });
};

const saveProgress = () => {
  const completed = weeks
    .map((week, index) => {
      const checkbox = week.querySelector("input[type='checkbox']");
      return checkbox.checked ? index + 1 : null;
    })
    .filter(Boolean);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  updateProgress();
};

const updateProgress = () => {
  const completed = weeks.filter(
    (week) => week.querySelector("input[type='checkbox']").checked
  ).length;
  const percent = Math.round((completed / weeks.length) * 100);
  progressBar.style.setProperty("--progress", `${percent}%`);
  progressText.textContent = `${percent}% complete`;
};

const resumeJourney = () => {
  const nextWeek = weeks.find(
    (week) => !week.querySelector("input[type='checkbox']").checked
  );
  const target = nextWeek || weeks[weeks.length - 1];
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  target.classList.add("highlight");
  setTimeout(() => target.classList.remove("highlight"), 1200);
};

const resetProgress = () => {
  if (!window.confirm("Reset all progress and notes?")) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(NOTES_KEY);
  weeks.forEach((week) => {
    week.querySelector("input[type='checkbox']").checked = false;
  });
  notesField.value = "";
  updateProgress();
};

const loadNotes = () => {
  notesField.value = localStorage.getItem(NOTES_KEY) || "";
};

const saveNotes = () => {
  localStorage.setItem(NOTES_KEY, notesField.value.trim());
  saveNotesButton.textContent = "Saved!";
  setTimeout(() => {
    saveNotesButton.textContent = "Save Notes";
  }, 1000);
};

weeks.forEach((week) => {
  week.querySelector("input[type='checkbox']").addEventListener("change", saveProgress);
});

resumeButton.addEventListener("click", resumeJourney);
resetButton.addEventListener("click", resetProgress);
saveNotesButton.addEventListener("click", saveNotes);

loadProgress();
loadNotes();
updateProgress();
