import { createContext, useContext } from "react";
import useRealtimeCollection from "../hooks/useRealTime";
import { AuthContext } from "./AuthContext";

export const TasksContext = createContext<any>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {

  const { user } = useContext(AuthContext);

  const table = user ? `tasks/${user.uid}` : "tasks";

  const {
    results,
    isPending,
    error,
    add,
    update,
    deleteDoc
  } = useRealtimeCollection(table);



  const addTask = async (task: { title: string; completed: boolean }) => {
    await add(task);
  };


  const toggleTask = async (task: any) => {
    await update(task.id, {
      ...task,
      completed: !task.completed
    });
  };

  const removeTask = async (id: string) => {
    await deleteDoc(id);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks: results,
        loading: isPending,
        error,
        addTask,
        toggleTask,
        deleteTask: removeTask
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
