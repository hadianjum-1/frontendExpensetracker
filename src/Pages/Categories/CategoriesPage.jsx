import { useState, useEffect } from "react";
import { categoryService } from "../../Services/api.service";
import { toast } from "react-toastify";

const DEFAULT_CATEGORIES = [
  { name:"Food",          icon:"🍔", color:"#10b981" },
  { name:"Shopping",      icon:"🛍️", color:"#6366f1" },
  { name:"Bills",         icon:"📄", color:"#ef4444" },
  { name:"Transport",     icon:"🚗", color:"#f59e0b" },
  { name:"Education",     icon:"📚", color:"#3b82f6" },
  { name:"Entertainment", icon:"🎮", color:"#8b5cf6" },
  { name:"Other",         icon:"🏷️", color:"#64748b" },
];

const Modal = ({ title, onClose, children, footer }) => (
  <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
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

const CategoryForm = ({ initial, onSave, loading }) => {
  const [form, setForm] = useState(initial || { name:"", icon:"🏷️", color:"#6366f1" });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const ICONS = ["🏷️","🍔","🛍️","📄","🚗","📚","🎮","💊","✈️","🏋️","🎵","💻","🏠","👕","🐶","☕","🍕","🎬","💅","🏖️"];
  return (
    <form id="cat-form" onSubmit={e=>{e.preventDefault();onSave(form);}} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
      <div className="form-group">
        <label className="form-label">Category Name</label>
        <input className="form-input" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Healthcare" required />
      </div>
      <div className="form-group">
        <label className="form-label">Icon</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
          {ICONS.map(ic=>(
            <button key={ic} type="button" onClick={()=>set("icon",ic)} style={{
              width:40, height:40, fontSize:"1.25rem", borderRadius:"0.5rem", cursor:"pointer",
              border: form.icon===ic ? "2px solid var(--color-primary)" : "2px solid var(--color-border)",
              background: form.icon===ic ? "var(--color-primary-glow)" : "var(--color-bg)",
            }}>{ic}</button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Color</label>
        <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",alignItems:"center"}}>
          {["#6366f1","#10b981","#ef4444","#f59e0b","#3b82f6","#8b5cf6","#ec4899","#14b8a6","#f97316","#64748b"].map(c=>(
            <button key={c} type="button" onClick={()=>set("color",c)} style={{
              width:32, height:32, borderRadius:"50%", background:c, cursor:"pointer",
              border: form.color===c ? "3px solid var(--color-text)" : "3px solid transparent",
            }} />
          ))}
          <input type="color" value={form.color} onChange={e=>set("color",e.target.value)} style={{width:40,height:36,borderRadius:"0.5rem",border:"1.5px solid var(--color-border)",cursor:"pointer",padding:"2px"}} />
        </div>
      </div>
    </form>
  );
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [showAdd, setShowAdd]       = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [deleteId, setDeleteId]     = useState(null);

  const load = () => {
    setLoading(true);
    categoryService.getAll()
      .then(r => setCategories(r.data.categories || []))
      .catch(()=>toast.error("Failed to load categories"))
      .finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const handleAdd = async (form) => {
    setSaving(true);
    try { await categoryService.create(form); toast.success("Category created! 🏷️"); setShowAdd(false); load(); }
    catch(err){ toast.error(err.response?.data?.message||"Failed to create"); }
    finally{ setSaving(false); }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try { await categoryService.update(editItem._id, form); toast.success("Category updated!"); setEditItem(null); load(); }
    catch(err){ toast.error(err.response?.data?.message||"Failed to update"); }
    finally{ setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await categoryService.delete(deleteId); toast.success("Category deleted"); setDeleteId(null); load(); }
    catch(err){ toast.error("Failed to delete"); }
    finally{ setSaving(false); }
  };

  return (
    <div>
      <div className="flex-between page-header">
        <div>
          <h2 className="page-title">Categories</h2>
          <p className="page-subtitle">Manage your expense categories</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ New Category</button>
      </div>

      {/* Default categories info */}
      <div className="card card-p" style={{marginBottom:"1.5rem"}}>
        <p className="fs-sm fw-600" style={{marginBottom:"0.75rem"}}>📌 Default Categories</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
          {DEFAULT_CATEGORIES.map(c=>(
            <span key={c.name} style={{display:"inline-flex",alignItems:"center",gap:"0.375rem",padding:"0.3rem 0.75rem",borderRadius:"99px",background:c.color+"15",color:c.color,fontWeight:600,fontSize:"0.8rem"}}>
              {c.icon} {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* User categories */}
      <div className="card">
        <div style={{padding:"1.25rem",borderBottom:"1px solid var(--color-border)"}}>
          <p className="fw-600">Your Custom Categories</p>
        </div>
        {loading ? (
          <div style={{padding:"1.5rem",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"1rem"}}>
            {[1,2,3].map(k=><div key={k} className="skeleton" style={{height:80,borderRadius:"0.75rem"}} />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <span style={{fontSize:"3rem"}}>🏷️</span>
            <div className="empty-state-title">No custom categories yet</div>
            <div className="empty-state-desc">Create categories to organize your expenses better</div>
            <button className="btn btn-primary btn-sm" style={{marginTop:"0.5rem"}} onClick={()=>setShowAdd(true)}>Create Category</button>
          </div>
        ) : (
          <div style={{padding:"1.25rem",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1rem"}}>
            {categories.map(cat=>(
              <div key={cat._id} className="card" style={{border:`1.5px solid ${cat.color}30`,transition:"all 0.2s"}}>
                <div style={{padding:"1.25rem"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"}}>
                    <div style={{width:44,height:44,borderRadius:"0.75rem",background:cat.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem"}}>
                      {cat.icon}
                    </div>
                    <div style={{display:"flex",gap:"0.375rem"}}>
                      <button className="btn-icon btn-sm" onClick={()=>setEditItem(cat)}>✏️</button>
                      <button className="btn-icon btn-sm" style={{borderColor:"var(--color-danger)",color:"var(--color-danger)"}} onClick={()=>setDeleteId(cat._id)}>🗑️</button>
                    </div>
                  </div>
                  <div style={{fontWeight:700,color:"var(--color-text)",fontSize:"1rem"}}>{cat.name}</div>
                  <div style={{width:24,height:4,borderRadius:"99px",background:cat.color,marginTop:"0.5rem"}} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <Modal title="Create Category" onClose={()=>setShowAdd(false)} footer={<>
          <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
          <button className="btn btn-primary" type="submit" form="cat-form" disabled={saving}>{saving?<><span className="spinner"/>Creating...</>:"Create"}</button>
        </>}>
          <CategoryForm onSave={handleAdd} loading={saving} />
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Category" onClose={()=>setEditItem(null)} footer={<>
          <button className="btn btn-ghost" onClick={()=>setEditItem(null)}>Cancel</button>
          <button className="btn btn-primary" type="submit" form="cat-form" disabled={saving}>{saving?<><span className="spinner"/>Saving...</>:"Save"}</button>
        </>}>
          <CategoryForm initial={editItem} onSave={handleEdit} loading={saving} />
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Category" onClose={()=>setDeleteId(null)} footer={<>
          <button className="btn btn-ghost" onClick={()=>setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving?<><span className="spinner"/>Deleting...</>:"Yes, Delete"}</button>
        </>}>
          <div style={{textAlign:"center",padding:"1rem 0"}}>
            <div style={{fontSize:"3rem",marginBottom:"1rem"}}>⚠️</div>
            <p style={{fontWeight:600,color:"var(--color-text)"}}>Delete this category?</p>
            <p style={{color:"var(--color-text-muted)",fontSize:"0.875rem",marginTop:"0.5rem"}}>This will not delete expenses using this category.</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CategoriesPage;
