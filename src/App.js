import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";     // ← your Page 1
import Page2 from "./pages/Page2";   // ← calendar + history
import useGeolocation from "./hooks/useGeolocation";

function App() {
  const { latitude, longitude } = useGeolocation();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<Page2 lat={latitude} lon={longitude} />} /> 
      </Routes>
    </Router>
  );
}

export default App;
