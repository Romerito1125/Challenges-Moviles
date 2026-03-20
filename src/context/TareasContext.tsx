import { createContext, useState, useEffect } from "react";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export const TasksContext = createContext<any>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (tasks.length === 0) return;

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);

  }, [tasks]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false
    };

    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      loading,
      addTask,
      toggleTask,
      deleteTask
    }}>
      {children}
    </TasksContext.Provider>
  );
}
