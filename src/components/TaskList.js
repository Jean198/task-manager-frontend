import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import { toast } from "react-toastify";
import axios from "axios";
import loadingImg from "../assets/loader.gif";
import { FaFontAwesomeFlag } from "react-icons/fa";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [task, setTask] = useState({
    taskName: "",
    completed: false,
  });

  // Capture the Inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTask((prevTask) => {
      return { ...prevTask, [name]: value };
    });
  };

   // Post a brand new task
   const handleSubmit = async (event) => {
    event.preventDefault();
    if (task.taskName === "") {
      return toast.error("Task name can not be empty");
    }
    try {
      await axios.post("/api/tasks", task);
      toast.success("Task added successfully!");
      setTask((prevTask) => {
        return { ...prevTask, taskName: "" };
      });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get all tasks
  const getTasks = async () => {
    setIsLoading(true);
    try {
      await axios.get("/api/tasks").then((response) => {
        setTasks(response.data);
        setIsLoading(false);
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      toast.success("Task deleted successfuly!");
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Run the getTasks function
  useEffect(() => {
    getTasks();
  }, []);


  //Add completed tasks to completedTasks array
  useEffect(()=>{
      const comTasks=tasks.filter((task)=>{
        return task.completed===true
      })

      setCompletedTasks(comTasks)
  }, [tasks])

  //send the task to edit inside the input form
  const getSingleTask = async (task) => {
    setTaskId(task._id);
    setIsEditing(true);
    setTask(() => {
      return { taskName: task.name, completed: false };
    });
  };

  //update task
  const updateTask = async (event) => {
    event.preventDefault();
    if (task.taskName === "") {
      return toast.error("Task name can not be empty");
    }

    try {
      await axios.put(`/api/tasks/${taskId}`, task);
      setIsEditing(false);
      setTask({ ...task, taskName: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };


 // Set a task as completed
  const setToCompleted = async (task) => {
    const newTask = {
      taskName: task.taskName,
      completed: true,
    };

    try {
      await axios.put(`/api/tasks/${task._id}`, newTask);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        name={task.taskName}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            {" "}
            <b>Total Tasks: </b> {tasks.length}
          </p>
          <p>
            {" "}
            <b>Completed Tasks: </b> {completedTasks.length}
          </p>
        </div>
      )}
      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImg} alt="loading" />
        </div>
      )}

      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task added! Please add a task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                task={task}
                key={task._id}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                updateTask={updateTask}
                setToCompleted={setToCompleted}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
