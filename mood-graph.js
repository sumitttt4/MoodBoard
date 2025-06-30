// Fetch motivational quote
fetch("https://zenquotes.io/api/today")
  .then(res => res.json())
  .then(data => {
    document.getElementById("quote").textContent = `"${data[0].q}" — ${data[0].a}`;
  })
  .catch(() => {
    document.getElementById("quote").textContent = "Failed to fetch quote.";
  });

// Mood scores mapping
const moodScores = {
  "😄 Happy": 5,
  "😐 Neutral": 3,
  "😔 Sad": 2,
  "😠 Angry": 1,
  "😴 Tired": 2
};

function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();
  if (!task) return;

  const today = new Date().toLocaleDateString();
  const tasks = JSON.parse(localStorage.getItem(`tasks-${today}`)) || [];

  const taskObj = { text: task, done: false };
  tasks.push(taskObj);
  localStorage.setItem(`tasks-${today}`, JSON.stringify(tasks));

  renderTask(taskObj);
  input.value = "";
}

function renderTask(taskObj) {
  const list = document.getElementById("taskList");
  const li = document.createElement("li");
  li.className = "flex justify-between bg-gray-800 p-2 rounded";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "mr-2";
  checkbox.checked = taskObj.done;
  checkbox.onchange = () => {
    taskObj.done = checkbox.checked;
    const today = new Date().toLocaleDateString();
    const tasks = JSON.parse(localStorage.getItem(`tasks-${today}`)) || [];
    const index = tasks.findIndex(t => t.text === taskObj.text);
    tasks[index] = taskObj;
    localStorage.setItem(`tasks-${today}`, JSON.stringify(tasks));
  };

  const text = document.createElement("span");
  text.textContent = taskObj.text;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "text-red-400";
  delBtn.onclick = () => {
    li.remove();
    const today = new Date().toLocaleDateString();
    let tasks = JSON.parse(localStorage.getItem(`tasks-${today}`)) || [];
    tasks = tasks.filter(t => t.text !== taskObj.text);
    localStorage.setItem(`tasks-${today}`, JSON.stringify(tasks));
  };

  li.appendChild(checkbox);
  li.appendChild(text);
  li.appendChild(delBtn);
  list.appendChild(li);
}

function saveMood() {
  const mood = document.getElementById("moodSelect").value;
  const today = new Date().toLocaleDateString();
  localStorage.setItem(`mood-${today}`, mood);
  alert(`Mood saved for ${today}: ${mood}`);
}

function toggleMoodChart() {
  const chartDiv = document.getElementById("chartContainer");
  chartDiv.classList.toggle("hidden");
}

function downloadCSV() {
  let csvContent = "Date,Mood,Mood Score,Tasks Completed\\n";
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toLocaleDateString();
    const mood = localStorage.getItem(`mood-${key}`) || "Not Set";
    const score = moodScores[mood] || 0;
    const tasks = JSON.parse(localStorage.getItem(`tasks-${key}`)) || [];
    const completed = tasks.filter(t => t.done).length;
    csvContent += `${key},${mood},${score},${completed}\\n`;
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "moodboard_data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadExcel() {
  const data = [["Date", "Mood", "Mood Score", "Tasks Completed"]];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toLocaleDateString();
    const mood = localStorage.getItem(`mood-${key}`) || "Not Set";
    const score = moodScores[mood] || 0;
    const tasks = JSON.parse(localStorage.getItem(`tasks-${key}`)) || [];
    const completed = tasks.filter(t => t.done).length;
    data.push([key, mood, score, completed]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "MoodBoard");
  XLSX.writeFile(workbook, "moodboard_data.xlsx");
}
