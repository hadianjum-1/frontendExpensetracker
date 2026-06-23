import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { authService } from "../Services/api.service";

export default function ProtectedRoute({ children }) {
  const [state, setState] = useState({ loading: true, authenticated: false });

  useEffect(() => {
    let mounted = true;
    authService.checkAuth()
      .then((res) => {
        if (!mounted) return;
        const ok = !!res.data && res.data.authenticated === true;
        setState({ loading: false, authenticated: ok });
      })
      .catch(() => {
        if (!mounted) return;
        setState({ loading: false, authenticated: false });
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) return null;

  if (children) return state.authenticated ? children : <Navigate to="/login" replace />;

  return state.authenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
