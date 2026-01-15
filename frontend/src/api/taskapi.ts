export async function createTask(task: any) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return res.json();
}
