import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import EditTaskForm from "./EditTaskForm";
import "./TaskTable.css";

interface Task {
  _id: string;
  id: number;
  taskNumber: number;
  taskName: string;
  taskPriority: string;
  taskStage: string;
  taskType: string;
  taskStatus: string;
  tags: { label: string; value: string }; // Array of tag objects
  description: string;
  taskSize: number | null;
  taskAssignedto: { label: string; value: string };
  createdAt: Date;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "taskPriority",
    direction: "asc",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/readTask"); // Adjust the URL based on your backend route
        const tasks = response.data.map((task: any) => ({
          ...task,
          tags: task.tags,
          taskAssignedto: task.taskAssignedto,
        }));
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
    // const intervalId = setInterval(fetchTasks, 5000);
    // return () => clearInterval(intervalId);
  }, []);

  // Function to sort tasks by priority or date
  // Priorities are only 'Urgent', 'Less Urgent', 'Not Urgent'
  // Dates are in ascending order
  const sortTasks = (key: "taskPriority" | "taskNumber") => {
    let sortedTasks = [...tasks].sort((a, b) => {
      if (key === "taskPriority") {
        // Assign numerical values to priorities
        const priorityValues: { [key: string]: number } = {
          "Urgent": 1,
          "Less Urgent": 2,
          "Not Urgent": 3,
        };
        return sortConfig.direction === "asc"
          ? priorityValues[a.taskPriority] - priorityValues[b.taskPriority]
          : priorityValues[b.taskPriority] - priorityValues[a.taskPriority];
      } else if (key === "taskNumber") {
        return sortConfig.direction === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    setTasks(sortedTasks);
    setSortConfig({
      key,
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    closeModal();
  };

  const renderRows = () => {
    const numEmptyRows = Math.max(0, 3 - tasks.length); // Calculate how many empty rows are needed
    const emptyRows = Array.from({ length: numEmptyRows }, (_, index) => (
      <tr key={`empty-row-${index}`}>
        <td colSpan={6} style={{ textAlign: "left", fontStyle: "italic" }}>
          Create tasks to fill in row {index + 1}
        </td>
      </tr>
    ));

    return (
      <>
        {emptyRows} {/* Render the empty rows if necessary */}
      </>
    );
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th
              onClick={() => sortTasks("taskNumber")}
              style={{ cursor: "pointer" }}
            >
              Date{" "}
              {sortConfig.key === "taskNumber" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th>Task Name</th>
            <th>Tags</th>
            <th>Story Points</th>
            <th
              onClick={() => sortTasks("taskPriority")}
              style={{ cursor: "pointer" }}
            >
              Priority{" "}
              {sortConfig.key === "taskPriority" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} onClick={() => handleTaskClick(task)}>
              <td>{task.taskNumber}</td>
              <td>{task.taskName}</td>
              <td>{task.tags.value}</td>
              <td>{task.description}</td>
              <td>{task.taskPriority}</td>
              <td>{task.taskAssignedto.value}</td>
            </tr>
          ))}
          {renderRows()}
        </tbody>
      </table>

      {/* Modal for editing a task */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        {selectedTask && (
          <EditTaskForm
            task={selectedTask}
            onUpdate={handleTaskUpdate}
            onClose={closeModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default TaskTable;
