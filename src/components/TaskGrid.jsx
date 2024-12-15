import React from 'react'

const TaskGrid = () => {
  const tasks = [
    { id: 1, title: 'Task 1', status: 'pending', assignedTo: 'Player 1' },
    { id: 2, title: 'Task 2', status: 'in-progress', assignedTo: 'Player 2' },
    { id: 3, title: 'Task 3', status: 'completed', assignedTo: 'Player 3' },
  ]

  return (
    <div className="task-grid">
      <h2 className="grid-title">Tasks</h2>
      <div className="tasks-container">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Assigned to: {task.assignedTo}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskGrid
