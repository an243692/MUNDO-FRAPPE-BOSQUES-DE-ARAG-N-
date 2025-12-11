import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Menu from "./pages/Menu";
import Admin from "./pages/Admin";
import ChatBot from "./components/ChatBot";
import { FilterProvider } from "./context/FilterContext";
import "./App.css";

function App() {
  return (
    <Router>
      <FilterProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <ChatBot />
        </div>
      </FilterProvider>
    </Router>
  );
}

export default App;


