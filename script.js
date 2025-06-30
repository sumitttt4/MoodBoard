 // Fetch motivational quote
fetch("https://zenquotes.io/api/today")
  .then(res => res.json())
  .then(data => {
    document.getElementById("quote").textContent = `"${data[0].q}" — ${data[0].a}`;
  });

// Task handling
function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();
  if (task) {
    const list = document.getElementById("taskList");
    const li = document.createElement("li");
    li.className = "flex justify-between bg-gray-800 p-2 rounded";
    li.innerHTML = `<span>${task}</span><button onclick="this.parentElement.remove()" class="text-red-400">Delete</button>`;
    list.appendChild(li);
    input.value = "";
  }
}

// Mood saving
function saveMood() {
  const mood = document.getElementById("moodSelect").value;
  const today = new Date().toLocaleDateString();
  localStorage.setItem(`mood-${today}`, mood);
  alert(`Mood saved for ${today}: ${mood}`);
}

