import "./App.css";
import Home from "./components/Home";
import HowTo from "./components/HowTo";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Channel from "./components/Channel";
import Posts from "./components/Posts";
import Main from "./components/Main";
import { AppContext } from "./context/appContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import Profile from "./components/Profile";
//Temp//
import Channel2 from "./components/Channel2";
//EF Temp//
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const token = localStorage.getItem("token");
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/subscriptions",
    // connectionParams: {
    //   authToken: token ? `${token}` : "",
    // },
  })
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
  request: (operation) => {
    console.log(operation);
  },
});

function App() {
  return (
    <AppContext.Provider value={{}}>
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <div className="App-body">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/token-how-to" element={<HowTo />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user/:userId" element={<Profile />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/channels" element={<Channel />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/main" element={<Main />} />
                <Route path="/channels2" element={<Channel2 />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ApolloProvider>
    </AppContext.Provider>
  );
}

export default App;
