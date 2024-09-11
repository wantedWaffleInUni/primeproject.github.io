import React, { useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import './TaskForm.css';

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

interface EditTaskFormProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onClose: () => void;
}

const existingTags = [
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Database', value: 'database' },
];

const existingUsers = [
  { label: "Kamalahshunee", value: "Kamala" },
  { label: "Arqraine", value: "Arqraine" },
  { label: "Yanly", value: "Yanly" },
];

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onUpdate, onClose }) => {
  const [taskData, setTaskData] = useState<Task>({
    _id: task._id,
    id: task.id,
    taskNumber: task.taskNumber,
    taskStage: task.taskStage,
    taskType: task.taskType,
    taskStatus: task.taskStatus,
    taskSize: task.taskSize,
    taskName: task.taskName,
    tags: task.tags,
    description: task.description,
    taskPriority: task.taskPriority,
    taskAssignedto: task.taskAssignedto,
    createdAt: task.createdAt,  
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
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
  const handleTagChange = (newTag: any) => {
    setTaskData({
      ...taskData,
      tags: newTag, // Set tags or empty array
    });
  };

  const handleTaskAssignedToChange = (newValue: any) => {
    setTaskData({
      ...taskData,
      taskAssignedto: newValue,
    });
  }

  const handleTaskSizeChange = (size: number) => {
    setTaskData({
      ...taskData,
      taskSize: size,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/update/${taskData._id}`, // Use PUT and pass the task ID
        taskData
      );
      if (response.status === 200) {
        alert('Task updated successfully');
        onUpdate(taskData);  // Trigger onUpdate callback to update the task in the parent component
        onClose();  // Close the modal
      }
    } catch (err) {
      console.error("Error updating task:", err);
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

export default EditTaskForm;


