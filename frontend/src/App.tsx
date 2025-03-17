import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MusicoList from "./pages/MusicoList";
import MusicoForm from "./pages/MusicoForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MusicoList />} />
        <Route path="/musico/:id" element={<MusicoForm />} />
      </Routes>
    </Router>
  );
}

export default App;