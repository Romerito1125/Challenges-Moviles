import { Task } from '../pages/Home';
import TaskItem from './TaskItem';

interface Props {
  tasks: Task[];
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskList: React.FC<Props> = ({ tasks, toggleTask, deleteTask }) => {
  return (
    <>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      ))}
    </>
  );
};

export default TaskList;
