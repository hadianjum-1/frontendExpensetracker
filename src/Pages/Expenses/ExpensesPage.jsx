import { useState, useEffect, useCallback } from "react";
import { expenseService, categoryService } from "../../Services/api.service";
import { toast } from "react-toastify";

const fmt = (n) => "$" + Number(n || 0).toLocaleString();
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const CATEGORY_COLORS = {
  Food:"#10b981", Shopping:"#6366f1", Bills:"#ef4444", Transport:"#f59e0b",
  Education:"#3b82f6", Entertainment:"#8b5cf6", Other:"#64748b"
};

const Modal = ({ title, onClose, children, footer }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-header">
        <span className="modal-title">{title}</span>
        <button className="btn-icon" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

const ExpenseForm = ({ initial, categories, onSave, onClose, loading }) => {
  const [form, setForm] = useState(initial || { title:"", amount:"", category:"", description:"", date: new Date().toISOString().slice(0,10) });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const onSubmit = (e) => { e.preventDefault(); onSave(form); };
  return (
    <form id="expense-form" onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="form-input" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Grocery shopping" required />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <div className="form-group">
          <label className="form-label">Amount ($)</label>
          <input className="form-input" type="number" min="0" step="0.01" value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="0.00" required />
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={form.date} onChange={e=>set("date",e.target.value)} required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Category</label>
        <select className="form-input" value={form.category} onChange={e=>set("category",e.target.value)} required>
          <option value="">Select category</option>
          {categories.map(c => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Description <span style={{color:"var(--color-text-muted)"}}>optional</span></label>
        <textarea className="form-input" rows={3} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Add a note..." style={{ resize:"vertical" }} />
      </div>
    </form>
  );
};

const ExpensesPage = () => {
  const [expenses, setExpenses]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [sortBy, setSortBy]       = useState("date");
  const [order, setOrder]         = useState("desc");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showAdd, setShowAdd]     = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const LIMIT = 10;

  const loadCategories = () =>
    categoryService.getAll().then(r => {
      const defaults = ["Food","Shopping","Bills","Transport","Education","Entertainment","Other"].map(n=>({name:n}));
      const user = r.data.categories || [];
      setCategories([...defaults.filter(d=>!user.some(u=>u.name===d.name)), ...user]);
    });

  const load = useCallback(() => {
    setLoading(true);
    expenseService.getAll({ page, limit: LIMIT, search, category: catFilter, sortBy, order })
      .then(r => { setExpenses(r.data.expenses); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => toast.error("Failed to load expenses"))
      .finally(() => setLoading(false));
  }, [page, search, catFilter, sortBy, order]);

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (form) => {
    setSaving(true);
    try {
      await expenseService.create(form);
      toast.success("Expense added! 💸");
      setShowAdd(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to add"); }
    finally { setSaving(false); }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      await expenseService.update(editItem._id, form);
      toast.success("Expense updated!");
      setEditItem(null); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to update"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await expenseService.delete(deleteId);
      toast.success("Expense deleted");
      setDeleteId(null); load();
    } catch (err) { toast.error("Failed to delete"); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex-between page-header">
        <div>
          <h2 className="page-title">Expenses</h2>
          <p className="page-subtitle">{total} record{total !== 1 ? "s" : ""} found</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Expense</button>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <div className="search-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/></svg>
              <input className="search-input" placeholder="Search expenses..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} />
            </div>
            <select className="select-filter" value={catFilter} onChange={e=>{setCatFilter(e.target.value);setPage(1);}}>
              <option value="">All Categories</option>
              {categories.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <select className="select-filter" value={`${sortBy}-${order}`} onChange={e=>{const[s,o]=e.target.value.split("-");setSortBy(s);setOrder(o);}}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Category</th><th>Amount</th><th>Date</th><th>Description</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length:5}).map((_,i) => (
                  <tr key={i}>{Array.from({length:6}).map((_,j)=><td key={j}><div className="skeleton" style={{height:16, width:"80%"}}/></td>)}</tr>
                ))
              ) : expenses.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="empty-state">
                    <span style={{fontSize:"3rem"}}>💸</span>
                    <div className="empty-state-title">No expenses found</div>
                    <div className="empty-state-desc">Add your first expense to get started</div>
                  </div>
                </td></tr>
              ) : expenses.map(exp => (
                <tr key={exp._id}>
                  <td style={{fontWeight:600}}>{exp.title}</td>
                  <td>
                    <span className="badge" style={{background:(CATEGORY_COLORS[exp.category]||"#64748b")+"20", color:CATEGORY_COLORS[exp.category]||"#64748b"}}>
                      {exp.category}
                    </span>
                  </td>
                  <td style={{color:"var(--color-danger)", fontWeight:600}}>-{fmt(exp.amount)}</td>
                  <td style={{color:"var(--color-text-muted)"}}>{fmtDate(exp.date)}</td>
                  <td style={{color:"var(--color-text-muted)", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{exp.description || "—"}</td>
                  <td>
                    <div style={{display:"flex", gap:"0.5rem"}}>
                      <button className="btn-icon" title="Edit" onClick={()=>setEditItem(exp)}>✏️</button>
                      <button className="btn-icon" title="Delete" style={{borderColor:"var(--color-danger)", color:"var(--color-danger)"}} onClick={()=>setDeleteId(exp._id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="pagination">
            <span className="pagination-info">Page {page} of {pages} · {total} records</span>
            <div className="pagination-btns">
              <button className="page-btn" disabled={page===1} onClick={()=>setPage(1)}>«</button>
              <button className="page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {Array.from({length:Math.min(pages,5)},(_,i)=>{
                let p; if(pages<=5){p=i+1;}else if(page<=3){p=i+1;}else if(page>=pages-2){p=pages-4+i;}else{p=page-2+i;}
                return <button key={p} className={`page-btn${page===p?" active":""}`} onClick={()=>setPage(p)}>{p}</button>;
              })}
              <button className="page-btn" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>›</button>
              <button className="page-btn" disabled={page===pages} onClick={()=>setPage(pages)}>»</button>
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <Modal title="Add Expense" onClose={()=>setShowAdd(false)}
          footer={<>
            <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary" type="submit" form="expense-form" disabled={saving}>{saving?<><span className="spinner"/>Saving...</>:"Add Expense"}</button>
          </>}>
          <ExpenseForm categories={categories} onSave={handleAdd} onClose={()=>setShowAdd(false)} loading={saving} />
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Expense" onClose={()=>setEditItem(null)}
          footer={<>
            <button className="btn btn-ghost" onClick={()=>setEditItem(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit" form="expense-form" disabled={saving}>{saving?<><span className="spinner"/>Saving...</>:"Save Changes"}</button>
          </>}>
          <ExpenseForm categories={categories} initial={{...editItem, date: new Date(editItem.date).toISOString().slice(0,10)}} onSave={handleEdit} onClose={()=>setEditItem(null)} loading={saving} />
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Expense" onClose={()=>setDeleteId(null)}
          footer={<>
            <button className="btn btn-ghost" onClick={()=>setDeleteId(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving?<><span className="spinner"/>Deleting...</>:"Yes, Delete"}</button>
          </>}>
          <div style={{textAlign:"center", padding:"1rem 0"}}>
            <div style={{fontSize:"3rem", marginBottom:"1rem"}}>⚠️</div>
            <p style={{color:"var(--color-text)", fontWeight:600}}>Are you sure you want to delete this expense?</p>
            <p style={{color:"var(--color-text-muted)", fontSize:"0.875rem", marginTop:"0.5rem"}}>This action cannot be undone.</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpensesPage;
