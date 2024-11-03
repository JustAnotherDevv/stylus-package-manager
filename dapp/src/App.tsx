import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Packages from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import Dashboard from "./pages/Dashboard";
import PublishPackage from "./pages/PublishPackage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Packages />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/publish" element={<PublishPackage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
