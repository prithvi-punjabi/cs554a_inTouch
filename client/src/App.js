import "./App.css";
import Home from "./components/Home";
import HowTo from "./components/HowTo";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Channel from "./components/Channel";
import { AppContext, socket } from "./context/appContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
  }),
});

function App() {
  return (
    <AppContext.Provider value={{ socket: socket }}>
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    </AppContext.Provider>
  );
}

export default App;
