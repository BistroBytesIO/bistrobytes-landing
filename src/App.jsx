import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ZohoAuth from "./pages/ZohoAuth";
import TestZohoCalendar from "./pages/TestZohoCalendar";
import ZoomAuth from "./pages/ZoomAuth";
import TestZoomIntegration from "./pages/TestZoomIntegration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/zoom-auth" element={<ZoomAuth />} />
        {/* Temporary Zoho auth route - remove after use */}
        <Route path="/zoho-auth" element={<ZohoAuth />} />
        {/* Other routes */}
        <Route path="/test-calendar" element={<TestZohoCalendar />} /> {/* Add this route */}
        <Route path="/test-zoom" element={<TestZoomIntegration />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;