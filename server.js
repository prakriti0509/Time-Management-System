const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html

// Temporary in-memory store
let tasks = [];

// --- ROUTES ---
app.get("/api/tasks", (req, res) => {
  res.json({ tasks });
});

app.post("/api/tasks", (req, res) => {
  const task = { id: Date.now().toString(), ...req.body };
  tasks.push(task);
  res.json({ success: true, task });
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return res.status(404).json({ error: "Not found" });
  tasks[i] = { ...tasks[i], ...req.body };
  res.json({ success: true, task: tasks[i] });
});

app.delete("/api/tasks/:id", (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.json({ success: true });
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
