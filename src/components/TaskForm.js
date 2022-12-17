import React from "react";

const TaskForm = ({
  handleSubmit,
  name,
  handleInputChange,
  isEditing,
  updateTask,
}) => {
  return (
    <form
      className="task-form"
      onSubmit={isEditing ? updateTask : handleSubmit}
    >
      <input
        type="text"
        placeholder="Add a task"
        name="taskName"
        value={name}
        onChange={handleInputChange}
      />
      <button type="submit">{isEditing ? "Edit" : "Add"}</button>
    </form>
  );
};

export default TaskForm;
