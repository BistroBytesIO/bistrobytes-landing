import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import ZohoAuth from "./pages/ZohoAuth";
import TestZohoCalendar from "./pages/TestZohoCalendar";
import ZoomAuth from "./pages/ZoomAuth";
import TestZoomIntegration from "./pages/TestZoomIntegration";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/zoom-auth" element={<ZoomAuth />} />
          {/* Temporary auth routes - remove after getting tokens */}
          {/* <Route path="/zoho-auth" element={<ZohoAuth />} /> */}
          {/* Testing routes - can remove in production */}
          <Route path="/test-calendar" element={<TestZohoCalendar />} />
          <Route path="/test-zoom" element={<TestZoomIntegration />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App;