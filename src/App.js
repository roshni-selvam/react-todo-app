import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;
    if (editId !== null) {
      setTasks(tasks.map((t) => t.id === editId ? { ...t, text: task } : t));
      setEditId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: task, done: false }]);
    }
    setTask("");
  };

  const toggleDone = (id) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const editTask = (task) => {
    setTask(task.text);
    setEditId(task.id);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.done;
    if (filter === "pending") return !t.done;
    return true;
  });

  return (
    <div className="app">
      <h1>React Todo App</h1>

      <div className="input-box">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Enter Todo"
        />
        <button onClick={addTask}>{editId ? "Update" : "Add"}</button>
      </div>

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>

      <div className="list">
        {filteredTasks.length === 0 && (
          <p style={{ textAlign: "center", color: "#f472b6" }}>
            No tasks yet! Add one 🎉
          </p>
        )}
        {filteredTasks.map((t) => (
          <div className="todo" key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleDone(t.id)}
            />
            <span className={t.done ? "done" : ""}>{t.text}</span>
            <div className="actions">
              <button onClick={() => editTask(t)}>✏️</button>
              <button onClick={() => deleteTask(t.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;