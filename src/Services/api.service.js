import Api from "../Api/Api.jsx";
const api = Api;

// ── Expenses ─────────────────────────────────────────────
export const expenseService = {
  getAll: (params) => api.get("/expenses", { params }),
  getAllForExport: (params) => api.get("/expenses/all", { params }),
  create: (data) => api.post("/expenses", data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// ── Income ────────────────────────────────────────────────
export const incomeService = {
  getAll: (params) => api.get("/income", { params }),
  getAllForExport: (params) => api.get("/income/all", { params }),
  create: (data) => api.post("/income", data),
  update: (id, data) => api.put(`/income/${id}`, data),
  delete: (id) => api.delete(`/income/${id}`),
};

// ── Categories ────────────────────────────────────────────
export const categoryService = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ── Dashboard ─────────────────────────────────────────────
export const dashboardService = {
  getStats: () => api.get("/dashboard/stats"),
  getCharts: (year) => api.get("/dashboard/charts", { params: { year } }),
};

// ── Auth ──────────────────────────────────────────────────
export const authService = {
  login: (data) => api.post("/user/login", data),
  signup: (data) => api.post("/user/signup", data),
  logout: () => api.post("/user/logout"),
  checkAuth: () => api.get("/user/check-auth"),
  verifyOtp: (data) => api.post("/user/verify-otp", data),
  forgotPassword: (data) => api.post("/user/forgot-password", data),
  verifyResetOtp: (data) => api.post("/user/verify-reset-otp", data),
  resetPassword: (data) => api.post("/user/reset-password", data),
};

// ── Profile ───────────────────────────────────────────────
export const profileService = {
  get: () => api.get("/profile"),
  update: (data) => api.put("/profile", data),
  changePassword: (data) => api.put("/profile/change-password", data),
};

console.log("VITE_API_URL (from api.service):", import.meta.env.VITE_API_URL);
export default api;
