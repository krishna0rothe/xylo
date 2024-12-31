import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoreLandingPage from "./pages/StoreLandingPage";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StoreLandingPage />} />
        </Routes>
      </Router>
     
    </>
  )
}

export default App
