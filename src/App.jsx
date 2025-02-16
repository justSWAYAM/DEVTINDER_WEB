import { Route, Routes, BrowserRouter } from "react-router-dom"
import LandingPage from "./pages/landingpage"
import Register from './components/Register';
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Profile from "./pages/Profile"
import Feed from "./pages/Feed";
function App() {
  return (
    <div className="font-Montserrat">
      <Provider store = {appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element = {<Profile/>}/>
          <Route path="/feed" element = {<Feed/>}/>
        </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
