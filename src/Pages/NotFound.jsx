import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"var(--color-bg)", padding:"2rem", textAlign:"center" }}>
      <div style={{ fontSize:"6rem", lineHeight:1, marginBottom:"1rem" }}>404</div>
      <div style={{ fontSize:"2rem", fontWeight:800, color:"var(--color-text)", marginBottom:"0.5rem" }}>Page Not Found</div>
      <p style={{ color:"var(--color-text-muted)", maxWidth:400, lineHeight:1.7, marginBottom:"2rem" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", justifyContent:"center" }}>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>← Go Back</button>
        <button className="btn btn-ghost" onClick={() => navigate("/app/user/dashboard")}>Dashboard</button>
      </div>
    </div>
  );
};

export default NotFound;
