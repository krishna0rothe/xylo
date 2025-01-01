import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoreLandingPage from "./pages/StoreLandingPage";
import { SignupPage } from "./pages/SignupPage";
import { Toaster } from 'react-hot-toast';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import DownloadPage from "./pages/DownloadPage";
import DashboardPage from "./pages/DashboardPage";

function App() {

  return (
    <div className="app-root">
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<StoreLandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/game/:id" element={<GameDetailsPage />} />
          <Route path="/download/:id" element={<DownloadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
        </div>
      </Router>
     
    </div>
  )
}

export default App
