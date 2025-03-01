import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import CreateProdudct from "./pages/create-product";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-product" element={<CreateProdudct />} />
        <Route path="/edit-product/:id" element={<CreateProdudct />} />
      </Routes>
    </Router>
  );
};

export default App;
