import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import { Dashboard } from "./pages/Dashboard";
import { Games } from "./pages/Games";
import { Trends } from "./pages/Trends";
import GamePage from "./pages/GamePage";

export function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/games" element={<Games />} />

          <Route path="/game/:appid" element={<GamePage />} />

          <Route path="/trends" element={<Trends />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}