import { Route, Routes, BrowserRouter } from "react-router-dom"
import LandingPage from "./pages/landingpage"

function App() {
  return (
    <div className="font-Montserrat">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
