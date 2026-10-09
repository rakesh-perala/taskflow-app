import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory tasks (will become Postgres in Stage 7)
let tasks = [
  { id: 1, title: 'Learn Terraform', done: true },
  { id: 2, title: 'Deploy to EKS', done: false },
  { id: 3, title: 'Set up ArgoCD', done: false },
];

// Health check for K8s probes
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Readiness probe
app.get('/ready', (_req: Request, res: Response) => {
  res.json({ ready: true });
});

// List tasks
app.get('/api/tasks', (_req: Request, res: Response) => {
  res.json(tasks);
});

// Create task
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const newTask = { id: tasks.length + 1, title, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Metrics endpoint (for Prometheus in Stage 7)
app.get('/metrics', (_req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain');
  res.send('# HELP taskflow_up Service up\n# TYPE taskflow_up gauge\ntaskflow_up 1\n');
});

app.listen(PORT, () => {
  console.log(`🚀 TaskFlow backend running on port ${PORT}`);
});
