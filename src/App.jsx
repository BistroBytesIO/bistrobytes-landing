import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ZohoAuth from "./pages/ZohoAuth";
import TestZohoCalendar from "./pages/TestZohoCalendar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Temporary Zoho auth route - remove after use */}
        <Route path="/zoho-auth" element={<ZohoAuth />} />
        {/* Other routes */}
        <Route path="/test-calendar" element={<TestZohoCalendar />} /> {/* Add this route */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;