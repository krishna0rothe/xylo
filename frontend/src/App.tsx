import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoreLandingPage from "./pages/StoreLandingPage";
import { SignupPage } from "./pages/SignupPage";
import { Toaster } from 'react-hot-toast';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import DownloadPage from "./pages/DownloadPage";
import DashboardPage from "./pages/DashboardPage";




import AssetHomePage from "./components/AssetsMarket/HomePage";
import AssetDetailPage from "./components/AssetsMarket/AssetDetailPage";
import AssetDashboardLayout from "./components/AssetsMarket/Dashboard/DashboardLayout";
import MyAssets from "./components/AssetsMarket/Dashboard/MyAssets";
import Revenue from "./components/AssetsMarket/Dashboard/Revenue";
import AddAsset from "./components/AssetsMarket/Dashboard/AddAsset";

function App() {
  return (
    <div className="app-root">
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <Toaster position="top-right" />
          <Routes>
            {/* Game Store Routes */}
            <Route path="/" element={<StoreLandingPage />} />
            
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/game/:id" element={<GameDetailsPage />} />
            <Route path="/download/:id" element={<DownloadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Xylo Asset Marketplace Routes */}
            <Route path="/asset" element={<AssetHomePage />} />
            <Route path="/assets/:assetId" element={<AssetDetailPage />} />
            <Route path="/assets" element={<AssetDashboardLayout />}>
              <Route index element={<MyAssets />} />
              <Route path="/assets/my-assets" element={<MyAssets />} />
              <Route path="/assets/revenue" element={<Revenue />} />
              <Route path="/assets/add-asset" element={<AddAsset />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App
