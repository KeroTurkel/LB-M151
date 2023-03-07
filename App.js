
import React from "react";
import LoginForm from "./Components/SignIn";
import Home from "./Components/Home";
import Game from "./Components/Game";
import SignUp from "./Components/SignUpFrom";
import AdminPanel from "./Components/Administration";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (
    <BrowserRouter> 
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/loginform" element={<LoginForm />} />
      <Route path="/game" element={<Game />} />
      <Route path="/signup" element={<SignUp />} />

    </Routes>
    </BrowserRouter>
  );
}

export default App;
