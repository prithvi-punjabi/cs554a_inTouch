import "./App.css";
import Home from "./components/Home";
import HowTo from "./components/HowTo";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Channel from "./components/Channel";
import Posts from "./components/Posts";
import Main from "./components/Main";
import { AppContext, socket } from "./context/appContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Profile from "./components/Profile";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  request: (operation) => {
    console.log(operation);
  },
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
                <Route
                  path="/user/:userId"
                  element={<Main component="user" />}
                />
                <Route path="/feed" element={<Feed />} />
                <Route path="/channels" element={<Channel />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/main" element={<Main />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ApolloProvider>
    </AppContext.Provider>
  );
}

export default App;
