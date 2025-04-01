import type { Task } from "./types"

export const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write and submit the project proposal for the new client",
    status: "In Progress",
    priority: "High",
    favorite: true,
    createdAt: "2023-04-10T10:00:00Z",
    subtasks: [
      {
        id: "1-1",
        title: "Research client background",
        completed: true,
        createdAt: "2023-04-10T10:30:00Z",
      },
      {
        id: "1-2",
        title: "Draft proposal outline",
        completed: true,
        createdAt: "2023-04-10T11:00:00Z",
      },
      {
        id: "1-3",
        title: "Create budget estimates",
        completed: false,
        createdAt: "2023-04-10T11:30:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Review team performance",
    description: "Conduct quarterly performance reviews for team members",
    status: "To Do",
    priority: "Medium",
    favorite: false,
    createdAt: "2023-04-12T14:30:00Z",
    subtasks: [
      {
        id: "2-1",
        title: "Collect peer feedback",
        completed: false,
        createdAt: "2023-04-12T15:00:00Z",
      },
      {
        id: "2-2",
        title: "Schedule review meetings",
        completed: false,
        createdAt: "2023-04-12T15:30:00Z",
      },
    ],
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update the user documentation with the latest features",
    status: "Completed",
    priority: "Low",
    favorite: false,
    createdAt: "2023-04-05T09:15:00Z",
    subtasks: [],
  },
  {
    id: "4",
    title: "Fix login bug",
    description: "Investigate and fix the login issue reported by users",
    status: "In Progress",
    priority: "High",
    favorite: true,
    createdAt: "2023-04-08T11:45:00Z",
    subtasks: [
      {
        id: "4-1",
        title: "Reproduce the issue",
        completed: true,
        createdAt: "2023-04-08T12:00:00Z",
      },
      {
        id: "4-2",
        title: "Debug authentication flow",
        completed: false,
        createdAt: "2023-04-08T12:30:00Z",
      },
      {
        id: "4-3",
        title: "Test fix on staging",
        completed: false,
        createdAt: "2023-04-08T13:00:00Z",
      },
    ],
  },
  {
    id: "5",
    title: "Prepare for client meeting",
    description: "Create presentation slides and gather necessary data",
    status: "To Do",
    priority: "Medium",
    favorite: false,
    createdAt: "2023-04-14T16:20:00Z",
    subtasks: [],
  },
]

