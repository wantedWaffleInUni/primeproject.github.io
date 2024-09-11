import React, { useState } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable"; // Import React Select Creatable
import "./TaskForm.css"; // CSS for styling

interface Task {
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

const existingTags = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Database", value: "database" },
];

const existingUsers = [
  { label: "Kamalahshunee", value: "Kamala" },
  { label: "Arqraine", value: "Arqraine" },
  { label: "Yanly", value: "Yanly" },
];

const TaskForm: React.FC = () => {
  const [taskData, setTaskData] = useState<Task>({
    id: 0,
    taskNumber: 0,
    taskName: "",
    taskPriority: "",
    taskStage: "",
    taskType: "",
    taskStatus: "",
    tags: { label: "", value: "" },
    description: "",
    taskSize: null,
    taskAssignedto: { label: "", value: "" },
    createdAt: new Date(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name] : value,
    });
  };

  const createOption = (label: string) => ({
    label: label,
    value: label
  });

  const handleCreateTag = (inputValue: string) => {
    // const options = state.options
    const newTag = createOption(inputValue);
    existingTags.push(newTag);
    setTaskData({
      ...taskData,
      tags: newTag,
    });
  };

  const handleCreateAssignees = (inputValue: string) => {
    const newAssign = createOption(inputValue);
    existingUsers.push(newAssign);
    setTaskData({
      ...taskData,
      taskAssignedto: newAssign,
    });
  };

  // Handle tag changes (select and create)
  const handleTagChange = (newTags: any) => {
    setTaskData({
      ...taskData,
      tags: newTags, // Set tags
    });
  };

  const handleTaskAssignedToChange = (newValue: any) => {
    setTaskData({
      ...taskData,
      taskAssignedto: newValue,
    });
  };

  const handleTaskSizeChange = (size: number) => {
    setTaskData({
      ...taskData,
      taskSize: size,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert tags from {label, value} to strings
      const taskWithFormattedTags = {
        ...taskData,
        tags: taskData.tags,
        taskAssignedto: taskData.taskAssignedto,
      };
      await axios.post("http://localhost:5000/createTask", taskWithFormattedTags);

      setTaskData({
        id: 0,
        taskNumber: 0,
        taskName: "",
        taskPriority: "",
        taskStage: "",
        taskType: "",
        taskStatus: "",
        tags: { label: "", value: "" },
        description: "",
        taskSize: null,
        taskAssignedto: { label: "", value: "" },
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Task Name */}
        <div className="form-row">
          <label>
            Task Name:
            <input
              type="text"
              name="taskName"
              value={taskData.taskName}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Task Priority */}
        <div className="form-row">
          <label>
            Task Priority:
            <input
              type="text"
              name="taskPriority"
              value={taskData.taskPriority}
              onChange={handleChange}
              required
            />
          </label>

          {/* Task Status */}
          <label>
            Task Status:
            <input
              type="text"
              name="taskStatus"
              value={taskData.taskStatus}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Task Stage and Tags */}
        <div className="form-row">
          <label>
            Task Stage:
            <input
              type="text"
              name="taskStage"
              value={taskData.taskStage}
              onChange={handleChange}
              required
            />
          </label>

          {/* Tags */}
          <label>
            Tags:
            <CreatableSelect
              isClearable
              onCreateOption={handleCreateTag}
              onChange={handleTagChange}
              options={existingTags}
              value={taskData.tags}
              placeholder="Select or create tags"
            />
          </label>
        </div>

        {/* Task Type and assignees */}
        <div className="form-row">
          <label>
            Task Type:
            <input
              type="text"
              name="taskType"
              value={taskData.taskType}
              onChange={handleChange}
              required
            />
          </label>

          {/* Assignees */}
          <label>
            Assigned To:
            <CreatableSelect
              isClearable
              onCreateOption={handleCreateAssignees}
              onChange={handleTaskAssignedToChange}
              options={existingUsers}
              value={taskData.taskAssignedto}
              placeholder="Select or create assignee"
            />
          </label>
        </div>

        {/* Description */}
        <div className="form-row">
          <label>
            Story Points:
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Task Size */}
        <div className="form-row">
          <label>Task Size:</label>
          <div className="task-size-buttons">
            {[...Array(10)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleTaskSizeChange(index + 1)}
                className={taskData.taskSize === index + 1 ? "selected" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
