import create from 'zustand';
import { adminService } from '../../services/admin/adminService';

interface AdminStore {
  // Cards
  cards: any[];
  loadingCards: boolean;
  fetchCards: () => Promise<void>;
  createCard: (cardData: any) => Promise<void>;
  updateCard: (id: string, cardData: any) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;

  // Tasks
  tasks: any[];
  loadingTasks: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: any) => Promise<void>;
  updateTask: (id: string, taskData: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Skills
  skills: any[];
  loadingSkills: boolean;
  fetchSkills: () => Promise<void>;
  createSkill: (skillData: any) => Promise<void>;
  updateSkill: (id: string, skillData: any) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;

  // Settings
  settings: any;
  loadingSettings: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (settingsData: any) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  // Cards
  cards: [],
  loadingCards: false,
  fetchCards: async () => {
    set({ loadingCards: true });
    try {
      const cards = await adminService.getCards();
      set({ cards });
    } finally {
      set({ loadingCards: false });
    }
  },
  createCard: async (cardData) => {
    const newCard = await adminService.createCard(cardData);
    set({ cards: [...get().cards, newCard] });
  },
  updateCard: async (id, cardData) => {
    const updatedCard = await adminService.updateCard(id, cardData);
    set({ cards: get().cards.map(card => card.id === id ? updatedCard : card) });
  },
  deleteCard: async (id) => {
    await adminService.deleteCard(id);
    set({ cards: get().cards.filter(card => card.id !== id) });
  },

  // Tasks
  tasks: [],
  loadingTasks: false,
  fetchTasks: async () => {
    set({ loadingTasks: true });
    try {
      const tasks = await adminService.getTasks();
      set({ tasks });
    } finally {
      set({ loadingTasks: false });
    }
  },
  createTask: async (taskData) => {
    const newTask = await adminService.createTask(taskData);
    set({ tasks: [...get().tasks, newTask] });
  },
  updateTask: async (id, taskData) => {
    const updatedTask = await adminService.updateTask(id, taskData);
    set({ tasks: get().tasks.map(task => task.id === id ? updatedTask : task) });
  },
  deleteTask: async (id) => {
    await adminService.deleteTask(id);
    set({ tasks: get().tasks.filter(task => task.id !== id) });
  },

  // Skills
  skills: [],
  loadingSkills: false,
  fetchSkills: async () => {
    set({ loadingSkills: true });
    try {
      const skills = await adminService.getSkills();
      set({ skills });
    } finally {
      set({ loadingSkills: false });
    }
  },
  createSkill: async (skillData) => {
    const newSkill = await adminService.createSkill(skillData);
    set({ skills: [...get().skills, newSkill] });
  },
  updateSkill: async (id, skillData) => {
    const updatedSkill = await adminService.updateSkill(id, skillData);
    set({ skills: get().skills.map(skill => skill.id === id ? updatedSkill : skill) });
  },
  deleteSkill: async (id) => {
    await adminService.deleteSkill(id);
    set({ skills: get().skills.filter(skill => skill.id !== id) });
  },

  // Settings
  settings: null,
  loadingSettings: false,
  fetchSettings: async () => {
    set({ loadingSettings: true });
    try {
      const settings = await adminService.getSettings();
      set({ settings });
    } finally {
      set({ loadingSettings: false });
    }
  },
  updateSettings: async (settingsData) => {
    const updatedSettings = await adminService.updateSettings(settingsData);
    set({ settings: updatedSettings });
  },
}));
