import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetch('/api/tasks')
      .then((r) => r.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

  const addTask = async () => {
    if (!newTitle.trim()) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    const task = await res.json();
    setTasks([...tasks, task]);
    setNewTitle('');
  };

  return (
    <div style={{ padding: 40, fontFamily: 'system-ui' }}>
      <h1>📋 TaskFlow</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task..."
          style={{ padding: 8, marginRight: 8 }}
        />
        <button onClick={addTask} style={{ padding: 8 }}>Add</button>
      </div>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.done ? '✅' : '⬜'} {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
