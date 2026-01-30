/* eslint-disable no-unused-vars */
import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import TestConnection from "./TestConnection";
import Home from "./components/Home";
import About from "./components/About";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import GetStarted from "./components/GetStarted";
import NannyBoard from "./components/NannyBoard";
import ParentBoard from "./components/ParentBoard";
import PostsApp from "./components/PostsApp.js";
import ChooseRole from "./pages/ChooseRole";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          NannyVent
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/posts">
              Posts
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link disabled style={{ color: "#9ca3af" }}>
                  {user.username}
                </Nav.Link>
                <Nav.Link onClick={logout} style={{ cursor: "pointer" }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/posts" element={<PostsApp />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/nanny-board" element={<NannyBoard />} />
            <Route path="/parent-board" element={<ParentBoard />} />
            <Route path="/choose-role" element={<ChooseRole />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
