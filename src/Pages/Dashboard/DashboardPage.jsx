import { useState, useEffect } from "react";
import { dashboardService } from "../../Services/api.service";
import { toast } from "react-toastify";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444","#3b82f6","#8b5cf6","#ec4899"];

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="stat-card">
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span className="stat-card-label">{label}</span>
      <div className="stat-card-icon" style={{ background: color + "20", color }}>
        <span style={{ fontSize: "1.25rem" }}>{icon}</span>
      </div>
    </div>
    <div className="stat-card-value">{value}</div>
    {sub && <div className="stat-card-sub">{sub}</div>}
  </div>
);

const SkeletonCard = () => (
  <div className="stat-card">
    <div className="skeleton" style={{ height: 16, width: "60%", marginBottom: 12 }} />
    <div className="skeleton" style={{ height: 32, width: "80%" }} />
  </div>
);

const DashboardPage = () => {
  const [stats, setStats]   = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    Promise.all([dashboardService.getStats(), dashboardService.getCharts(year)])
      .then(([s, c]) => { 
        console.log("dashboard stats response:", s);
        console.log("dashboard charts response:", c);
        setStats(s.data); setCharts(c.data); 
      })
      .catch((err) => {
        console.error("Dashboard load error:", err.response || err);
        console.error("Dashboard error headers:", err.response?.headers);
        toast.error("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">Dashboard Overview</h2>
        <p className="page-subtitle">Your financial summary for {year}</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {loading ? (
          [1,2,3,4].map((k) => <SkeletonCard key={k} />)
        ) : (
          <>
            <StatCard label="Total Balance"  value={fmt(stats?.totalBalance)}  icon="💰" color="#6366f1" sub="Net balance" />
            <StatCard label="Total Income"   value={fmt(stats?.totalIncome)}   icon="📈" color="#10b981" sub="All time income" />
            <StatCard label="Total Expenses" value={fmt(stats?.totalExpense)}  icon="📉" color="#ef4444" sub="All time expenses" />
            <StatCard label="Savings"        value={fmt(stats?.savings)}       icon="🏦" color="#f59e0b" sub="Amount saved" />
          </>
        )}
      </div>

      {/* Charts Row 1: Line + Pie */}
      <div className="charts-grid-3">
        <div className="card card-p">
          <div className="chart-title">📊 Monthly Expenses — {year}</div>
          {loading ? <div className="skeleton" style={{ height: 260 }} /> : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={charts?.monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card card-p">
          <div className="chart-title">🥧 Expense by Category</div>
          {loading ? <div className="skeleton" style={{ height: 260 }} /> : (
            charts?.categoryBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={charts.categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {charts.categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: 260 }}>
                <span style={{ fontSize: "3rem" }}>📭</span>
                <div className="empty-state-title">No expense data yet</div>
                <div className="empty-state-desc">Add expenses to see the breakdown</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Charts Row 2: Bar + Area */}
      <div className="charts-grid">
        <div className="card card-p">
          <div className="chart-title">📊 Income vs Expenses</div>
          {loading ? <div className="skeleton" style={{ height: 240 }} /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={charts?.incomeVsExpense}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card card-p">
          <div className="chart-title">📈 Weekly Spending Trend</div>
          {loading ? <div className="skeleton" style={{ height: 240 }} /> : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={charts?.weeklyTrend}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorArea)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
