import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TaskUpdatePage() {
  const { id } = useParams(); // Task document ID
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const backend_url = import.meta.env.VITE_BACKENDURL || "http://localhost:5000";

  const [task, setTask] = useState(null);
  const [subtaskCounts, setSubtaskCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backend_url}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch task");

        const data = await response.json();
        setTask(data);

        // Initialize counts for all subtasks
        const counts = {};
        data.tasks.forEach((subtask, index) => {
          counts[index] = subtask.count;
        });
        setSubtaskCounts(counts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, token]);

  // Handle input change for a subtask
  const handleInputChange = (index, value) => {
    setSubtaskCounts((prev) => ({ ...prev, [index]: value }));
  };

  // Update all subtasks
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatePromises = task.tasks.map((subtask, index) =>
        fetch(`${backend_url}/api/tasks/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            index,
            count: parseInt(subtaskCounts[index], 10),
          }),
        })
      );

      const results = await Promise.all(updatePromises);
      const failed = results.find((res) => !res.ok);
      if (failed) throw new Error("Failed to update some subtasks");

      alert("All subtasks updated successfully!");
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Task: {task?.name}</h2>

      {task && (
        <form onSubmit={handleUpdate}>
          {task.tasks.map((subtask, index) => (
            <div key={subtask._id} style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>{subtask.task}</label>
              <input
                type="number"
                min={0}
                value={subtaskCounts[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={{ marginLeft: "10px", padding: "5px", width: "80px" }}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update All Subtasks
          </button>
        </form>
      )}
    </div>
  );
}

export default TaskUpdatePage;
