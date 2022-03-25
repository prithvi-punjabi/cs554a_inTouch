import logo from "./img/inTouch.png";
import "./App.css";
import Home from "./components/Home";
import HowTo from "./components/HowTo";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="inTouch Logo" />
          <h1 className="App-title">Welcome to Stevens inTouch!</h1>
        </header>
        <br />
        <br />
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/token-how-to" element={<HowTo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
