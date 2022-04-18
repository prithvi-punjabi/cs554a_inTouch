import "./App.css";
import Home from "./components/Home";
import HowTo from "./components/HowTo";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Channel from "./components/Channel";
import { AppContext, socket } from "./context/appContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
	return (
		<AppContext.Provider value={{ socket: socket }}>
			<Router>
				<div className="App">
					<div className="App-body">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/token-how-to" element={<HowTo />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/login" element={<Login />} />
							<Route path="/feed" element={<Feed />} />
							<Route path="/channels" element={<Channel />} />
						</Routes>
					</div>
				</div>
			</Router>
		</AppContext.Provider>
	);
}

export default App;
