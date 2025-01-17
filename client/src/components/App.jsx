import React, { useState, useEffect, createContext } from "react";
import NavBar from "./modules/NavBar";
import { Outlet } from "react-router-dom";

import jwt_decode from "jwt-decode";

import "../utilities.css";
import "../theme.css";

import { socket } from "../client-socket";

import { get, post } from "../utilities";

export const UserContext = createContext(null);

/**
 * Define the "App" component
 */
const App = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUser(user);
      }
    });
  }, []);

  const handleCustomLogin = ({code}) => {
    console.log(code);
    post("/api/exchange-token", { code }).then((tokens) => {
      handleLogin({credential: tokens.id_token});
    });
  }

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    console.log(userToken);
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUser(user);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUser(undefined);
    post("/api/logout");
  };

  const authContextValue = {
    user,
    handleCustomLogin,
    handleLogin,
    handleLogout,
  };

  return (
    <UserContext.Provider value={authContextValue}>
      <NavBar />
      <Outlet />
    </UserContext.Provider>
  );
};

export default App;
