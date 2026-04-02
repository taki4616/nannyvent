import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import GetStarted from "./components/GetStarted";
import PostsApp from "./components/PostsApp.js";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        Nanny<span>Vent</span>
      </Link>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-user">{user.username}</span>
            <button className="btn btn-ghost" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/login" element={<><NavBar /><Login /></>} />
          <Route path="/register" element={<><NavBar /><Register /></>} />
          <Route path="/posts" element={<><NavBar /><PostsApp /></>} />
          <Route path="/profile/:username" element={<><NavBar /><Profile /></>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
