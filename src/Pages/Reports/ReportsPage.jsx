import { useState } from "react";
import { expenseService, incomeService } from "../../Services/api.service";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const fmt = (n) => "$" + Number(n || 0).toLocaleString();
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

const QUICK_FILTERS = [
  { label:"Today",      getDates:()=>{ const d=new Date(); return { start:d.toISOString().slice(0,10), end:d.toISOString().slice(0,10) }; } },
  { label:"This Week",  getDates:()=>{ const d=new Date(), day=d.getDay(); const start=new Date(d); start.setDate(d.getDate()-day); const end=new Date(start); end.setDate(start.getDate()+6); return { start:start.toISOString().slice(0,10), end:end.toISOString().slice(0,10) }; } },
  { label:"This Month", getDates:()=>{ const d=new Date(); return { start:new Date(d.getFullYear(),d.getMonth(),1).toISOString().slice(0,10), end:new Date(d.getFullYear(),d.getMonth()+1,0).toISOString().slice(0,10) }; } },
  { label:"This Year",  getDates:()=>{ const y=new Date().getFullYear(); return { start:`${y}-01-01`, end:`${y}-12-31` }; } },
];

const ReportsPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [expenses, setExpenses]   = useState([]);
  const [income, setIncome]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [generated, setGenerated] = useState(false);

  const applyQuick = (f) => {
    const { start, end } = f.getDates();
    setStartDate(start); setEndDate(end); setActiveFilter(f.label);
  };

  const generate = async () => {
    if (!startDate || !endDate) { toast.warning("Select a date range first"); return; }
    setLoading(true);
    try {
      const [eRes, iRes] = await Promise.all([
        expenseService.getAllForExport({ startDate, endDate }),
        incomeService.getAllForExport({ startDate, endDate }),
      ]);
      setExpenses(eRes.data.expenses || []);
      setIncome(iRes.data.income || []);
      setGenerated(true);
    } catch { toast.error("Failed to generate report"); }
    finally { setLoading(false); }
  };

  const totalExpense = expenses.reduce((s,e)=>s+e.amount,0);
  const totalIncome  = income.reduce((s,i)=>s+i.amount,0);
  const balance      = totalIncome - totalExpense;

  const exportCSV = () => {
    const rows = [
      ["Type","Title","Amount","Category/Source","Date","Description"],
      ...expenses.map(e=>["Expense",e.title,e.amount,e.category,fmtDate(e.date),e.description||""]),
      ...income.map(i=>["Income",i.title,i.amount,i.source,fmtDate(i.date),i.description||""]),
    ];
    const csv = rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `report-${startDate}-to-${endDate}.csv`;
    a.click();
    toast.success("CSV exported! 📄");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      ...expenses.map(e=>({ Type:"Expense", Title:e.title, Amount:e.amount, "Category/Source":e.category, Date:fmtDate(e.date), Description:e.description||"" })),
      ...income.map(i=>({ Type:"Income", Title:i.title, Amount:i.amount, "Category/Source":i.source, Date:fmtDate(i.date), Description:i.description||"" })),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `report-${startDate}-to-${endDate}.xlsx`);
    toast.success("Excel exported! 📊");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Financial Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`Period: ${fmtDate(startDate)} – ${fmtDate(endDate)}`, 14, 30);
    doc.text(`Total Income: ${fmt(totalIncome)}`, 14, 40);
    doc.text(`Total Expenses: ${fmt(totalExpense)}`, 14, 48);
    doc.text(`Net Balance: ${fmt(balance)}`, 14, 56);
    if (expenses.length) {
      autoTable(doc, {
        startY:66, head:[["Title","Category","Amount","Date"]],
        body:expenses.map(e=>[e.title,e.category,fmt(e.amount),fmtDate(e.date)]),
        headStyles:{fillColor:[99,102,241]}, styles:{fontSize:9},
      });
    }
    if (income.length) {
      autoTable(doc, {
        startY: doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY+10 : 80,
        head:[["Title","Source","Amount","Date"]],
        body:income.map(i=>[i.title,i.source,fmt(i.amount),fmtDate(i.date)]),
        headStyles:{fillColor:[16,185,129]}, styles:{fontSize:9},
      });
    }
    doc.save(`report-${startDate}-to-${endDate}.pdf`);
    toast.success("PDF exported! 📋");
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Reports</h2>
        <p className="page-subtitle">Generate and export your financial reports</p>
      </div>

      {/* Filter Panel */}
      <div className="card card-p" style={{marginBottom:"1.5rem"}}>
        <p className="fw-600 fs-sm" style={{marginBottom:"1rem"}}>📅 Select Date Range</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",marginBottom:"1.25rem"}}>
          {QUICK_FILTERS.map(f=>(
            <button key={f.label} className={`btn btn-sm ${activeFilter===f.label?"btn-primary":"btn-ghost"}`} onClick={()=>applyQuick(f)}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"1rem",alignItems:"flex-end"}}>
          <div className="form-group" style={{flex:1,minWidth:180}}>
            <label className="form-label">Start Date</label>
            <input className="form-input" type="date" value={startDate} onChange={e=>{setStartDate(e.target.value);setActiveFilter("");}} />
          </div>
          <div className="form-group" style={{flex:1,minWidth:180}}>
            <label className="form-label">End Date</label>
            <input className="form-input" type="date" value={endDate} onChange={e=>{setEndDate(e.target.value);setActiveFilter("");}} />
          </div>
          <button className="btn btn-primary" onClick={generate} disabled={loading} style={{height:42}}>
            {loading?<><span className="spinner"/>Generating...</>:"Generate Report"}
          </button>
        </div>
      </div>

      {generated && (
        <>
          {/* Summary Cards */}
          <div className="stats-grid" style={{marginBottom:"1.5rem"}}>
            {[
              {label:"Total Income",   value:fmt(totalIncome),  color:"#10b981", icon:"📈"},
              {label:"Total Expenses", value:fmt(totalExpense), color:"#ef4444", icon:"📉"},
              {label:"Net Balance",    value:fmt(balance),      color: balance>=0?"#6366f1":"#ef4444", icon:"💰"},
              {label:"Transactions",   value:expenses.length+income.length, color:"#f59e0b", icon:"📋"},
            ].map(s=>(
              <div key={s.label} className="stat-card">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span className="stat-card-label">{s.label}</span>
                  <span style={{fontSize:"1.5rem"}}>{s.icon}</span>
                </div>
                <div className="stat-card-value" style={{color:s.color}}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Export Buttons */}
          <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",marginBottom:"1.5rem"}}>
            <button className="btn btn-ghost" onClick={exportCSV}>📄 Export CSV</button>
            <button className="btn btn-ghost" onClick={exportExcel}>📊 Export Excel</button>
            <button className="btn btn-ghost" onClick={exportPDF}>📋 Export PDF</button>
          </div>

          {/* Expenses Table */}
          {expenses.length > 0 && (
            <div className="table-wrap" style={{marginBottom:"1.5rem"}}>
              <div style={{padding:"1rem 1.25rem",borderBottom:"1px solid var(--color-border)"}}>
                <span className="fw-600">💸 Expenses ({expenses.length})</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table>
                  <thead><tr><th>Title</th><th>Category</th><th>Amount</th><th>Date</th><th>Description</th></tr></thead>
                  <tbody>
                    {expenses.map(e=>(
                      <tr key={e._id}>
                        <td style={{fontWeight:600}}>{e.title}</td>
                        <td><span className="badge badge-purple">{e.category}</span></td>
                        <td style={{color:"var(--color-danger)",fontWeight:600}}>-{fmt(e.amount)}</td>
                        <td style={{color:"var(--color-text-muted)"}}>{fmtDate(e.date)}</td>
                        <td style={{color:"var(--color-text-muted)"}}>{e.description||"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Income Table */}
          {income.length > 0 && (
            <div className="table-wrap">
              <div style={{padding:"1rem 1.25rem",borderBottom:"1px solid var(--color-border)"}}>
                <span className="fw-600">💵 Income ({income.length})</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table>
                  <thead><tr><th>Title</th><th>Source</th><th>Amount</th><th>Date</th><th>Description</th></tr></thead>
                  <tbody>
                    {income.map(i=>(
                      <tr key={i._id}>
                        <td style={{fontWeight:600}}>{i.title}</td>
                        <td><span className="badge badge-green">{i.source}</span></td>
                        <td style={{color:"var(--color-success)",fontWeight:600}}>+{fmt(i.amount)}</td>
                        <td style={{color:"var(--color-text-muted)"}}>{fmtDate(i.date)}</td>
                        <td style={{color:"var(--color-text-muted)"}}>{i.description||"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {expenses.length===0 && income.length===0 && (
            <div className="empty-state card card-p">
              <span style={{fontSize:"3rem"}}>📭</span>
              <div className="empty-state-title">No data for this period</div>
              <div className="empty-state-desc">Try selecting a different date range</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
