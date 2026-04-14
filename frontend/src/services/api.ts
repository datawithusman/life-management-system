import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
  getWeeklySummary: () => api.get('/dashboard/weekly-summary'),
};

// Study APIs
export const studyAPI = {
  addSession: (data: any) => api.post('/study/sessions', data),
  getSessions: (params?: any) => api.get('/study/sessions', { params }),
  getTodayHours: () => api.get('/study/today'),
  createGoal: (data: any) => api.post('/study/goals', data),
  getGoals: () => api.get('/study/goals'),
  updateGoal: (goalId: string, data: any) => api.put(`/study/goals/${goalId}`, data),
};

// Expense APIs
export const expenseAPI = {
  addExpense: (data: any) => api.post('/expense/add', data),
  getTodayExpenses: () => api.get('/expense/today'),
  getMonthlyReport: () => api.get('/expense/monthly-report'),
  getAllExpenses: (params?: any) => api.get('/expense/all', { params }),
  setBudget: (data: any) => api.post('/expense/budget/set', data),
  getBudget: () => api.get('/expense/budget'),
};

// Professional APIs
export const professionalAPI = {
  createPost: (data: any) => api.post('/professional/posts', data),
  getPendingPosts: () => api.get('/professional/posts/pending'),
  markPostPosted: (postId: string) => api.put(`/professional/posts/${postId}/posted`),
  createEvent: (data: any) => api.post('/professional/events', data),
  getUpcomingEvents: () => api.get('/professional/events/upcoming'),
  markEventAttended: (eventId: string, data: any) => api.put(`/professional/events/${eventId}/attended`, data),
  createGoal: (data: any) => api.post('/professional/goals', data),
  getGoals: () => api.get('/professional/goals'),
  updateGoal: (goalId: string, data: any) => api.put(`/professional/goals/${goalId}`, data),
};

// Health APIs
export const healthAPI = {
  addWorkout: (data: any) => api.post('/health/workouts', data),
  getTodayWorkouts: () => api.get('/health/workouts/today'),
  getMonthlyStats: () => api.get('/health/workouts/monthly-stats'),
  addMetric: (data: any) => api.post('/health/metrics', data),
  getLatestMetric: () => api.get('/health/metrics/latest'),
  getMetricHistory: (params?: any) => api.get('/health/metrics/history', { params }),
};

// Islamic APIs
export const islamicAPI = {
  recordPractice: (data: any) => api.post('/islamic/practices', data),
  getTodayPractices: () => api.get('/islamic/practices/today'),
  getWeeklyStats: () => api.get('/islamic/practices/weekly-stats'),
  addQuranProgress: (data: any) => api.post('/islamic/quran', data),
  getQuranProgress: () => api.get('/islamic/quran/progress'),
  getCurrentSurah: () => api.get('/islamic/quran/current'),
};

// Business APIs
export const businessAPI = {
  addCourse: (data: any) => api.post('/business/courses', data),
  getActiveCourses: () => api.get('/business/courses/active'),
  updateCourseProgress: (courseId: string, data: any) => api.put(`/business/courses/${courseId}/progress`, data),
  addFollowup: (data: any) => api.post('/business/followups', data),
  getPendingFollowups: () => api.get('/business/followups/pending'),
  addIncomeSource: (data: any) => api.post('/business/income', data),
  getIncomeSources: () => api.get('/business/income'),
};

// Task APIs
export const taskAPI = {
  createTask: (data: any) => api.post('/tasks', data),
  getTodayTasks: () => api.get('/tasks/today'),
  getUpcomingTasks: (params?: any) => api.get('/tasks/upcoming', { params }),
  completeTask: (taskId: string) => api.put(`/tasks/${taskId}/complete`),
  updateTask: (taskId: string, data: any) => api.put(`/tasks/${taskId}`, data),
};

// Goal APIs
export const goalAPI = {
  createGoal: (data: any) => api.post('/goals', data),
  getAllGoals: () => api.get('/goals'),
  getInProgressGoals: () => api.get('/goals/in-progress'),
  updateGoalProgress: (goalId: string, data: any) => api.put(`/goals/${goalId}/progress`, data),
  completeMilestone: (goalId: string, milestoneIndex: number) => 
    api.put(`/goals/${goalId}/milestones/${milestoneIndex}/complete`),
};

// Network APIs
export const networkAPI = {
  addConnection: (data: any) => api.post('/network', data),
  getAllConnections: (params?: any) => api.get('/network', { params }),
  getPendingFollowups: () => api.get('/network/followup/pending'),
  updateConnection: (connectionId: string, data: any) => api.put(`/network/${connectionId}`, data),
};

export default api;
