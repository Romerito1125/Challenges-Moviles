import { Task } from '../pages/List';
import TaskItem from './TaskItem';

interface Props {
  tasks: Task[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  disabled?: boolean;
}


const TaskList: React.FC<Props> = ({ tasks, toggleTask, deleteTask, disabled }) => {
  return (
    <>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          disabled={disabled}
        />

      ))}
    </>
  );
};

export default TaskList;