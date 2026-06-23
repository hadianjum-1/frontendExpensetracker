import { useState, useEffect, useRef } from "react";
import { profileService } from "../../Services/api.service";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [tab, setTab]         = useState("info"); // info | password
  const [form, setForm]       = useState({ Name:"", Email:"", avatar:"" });
  const [passForm, setPassForm] = useState({ currentPassword:"", newPassword:"", confirm:"" });
  const fileRef = useRef();

  useEffect(() => {
    profileService.get()
      .then(r => {
        const u = r.data.user;
        setProfile(u);
        setForm({ Name: u.Name||"", Email: u.Email||"", avatar: u.avatar||"" });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setForm(p => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.update(form);
      const updated = res.data.user;
      setProfile(updated);
      login({ ...user, name: updated.Name, email: updated.Email, avatar: updated.avatar });
      toast.success("Profile updated! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirm) { toast.error("Passwords do not match"); return; }
    if (passForm.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      await profileService.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success("Password changed! 🔐");
      setPassForm({ currentPassword:"", newPassword:"", confirm:"" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally { setSaving(false); }
  };

  const initials = (profile?.Name || "U").slice(0, 2).toUpperCase();

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      {[1,2,3].map(k => <div key={k} className="skeleton" style={{ height: 80, borderRadius:"0.75rem" }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin:"0 auto" }}>
      <div className="page-header">
        <h2 className="page-title">My Profile</h2>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      {/* Avatar + name banner */}
      <div className="card card-p" style={{ display:"flex", alignItems:"center", gap:"1.5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        <div style={{ position:"relative" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.75rem", fontWeight:700, color:"#fff", overflow:"hidden", border:"3px solid var(--color-primary-glow)" }}>
            {form.avatar ? <img src={form.avatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : initials}
          </div>
          <button onClick={() => fileRef.current?.click()} style={{ position:"absolute", bottom:-2, right:-2, width:28, height:28, borderRadius:"50%", background:"var(--color-primary)", border:"2px solid var(--color-bg-card)", color:"#fff", cursor:"pointer", fontSize:"0.75rem", display:"flex", alignItems:"center", justifyContent:"center" }}>✏️</button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:"none" }} />
        </div>
        <div>
          <div style={{ fontSize:"1.25rem", fontWeight:700, color:"var(--color-text)" }}>{profile?.Name || "User"}</div>
          <div style={{ color:"var(--color-text-muted)", fontSize:"0.875rem" }}>{profile?.Email}</div>
          <div style={{ marginTop:"0.375rem" }}><span className="badge badge-purple">{profile?.Role || "user"}</span></div>
        </div>
        <div style={{ marginLeft:"auto" }}>
          <div style={{ fontSize:"0.75rem", color:"var(--color-text-muted)" }}>Member since</div>
          <div style={{ fontWeight:600, fontSize:"0.875rem" }}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US",{month:"long",year:"numeric"}) : "—"}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.5rem", borderBottom:"1px solid var(--color-border)", paddingBottom:"0" }}>
        {[{k:"info",l:"Account Info"},{k:"password",l:"Change Password"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{
            padding:"0.625rem 1.25rem",
            border:"none", background:"none", cursor:"pointer",
            fontWeight: tab===t.k ? 700 : 500,
            fontSize:"0.9rem",
            color: tab===t.k ? "var(--color-primary)" : "var(--color-text-muted)",
            borderBottom: tab===t.k ? "2px solid var(--color-primary)" : "2px solid transparent",
            marginBottom:"-1px", transition:"all 0.2s",
          }}>{t.l}</button>
        ))}
      </div>

      {/* Account Info Tab */}
      {tab === "info" && (
        <div className="card card-p">
          <form onSubmit={saveProfile} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.Name} onChange={e=>setForm(p=>({...p,Name:e.target.value}))} placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={form.Email} onChange={e=>setForm(p=>({...p,Email:e.target.value}))} placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" value={profile?.Phone||""} disabled style={{ opacity:0.6, cursor:"not-allowed" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? <><span className="spinner" />Saving...</> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Tab */}
      {tab === "password" && (
        <div className="card card-p">
          <form onSubmit={changePassword} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" value={passForm.currentPassword} onChange={e=>setPassForm(p=>({...p,currentPassword:e.target.value}))} placeholder="Enter current password" required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" value={passForm.newPassword} onChange={e=>setPassForm(p=>({...p,newPassword:e.target.value}))} placeholder="At least 6 characters" required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" value={passForm.confirm} onChange={e=>setPassForm(p=>({...p,confirm:e.target.value}))} placeholder="Repeat new password" required />
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? <><span className="spinner" />Updating...</> : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
