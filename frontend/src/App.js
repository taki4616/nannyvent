/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import TestConnection from "./TestConnection";
import Home from "./components/Home";
import About from "./components/About";
import Posts from "./components/Posts";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "./index.css"; // Use index.css instead of App.css
import GetStarted from "./components/GetStarted";
import NannyBoard from "./components/NannyBoard";
import ParentBoard from "./components/ParentBoard";
import PostsApp from "./components/PostsApp.js";
import ChooseRole from "./pages/ChooseRole";

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            NannyVent
          </Navbar.Brand>
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
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/nanny-board" element={<NannyBoard />} />
          <Route path="/parent-board" element={<ParentBoard />} />
          <Route path="/choose-role" element={<ChooseRole />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
