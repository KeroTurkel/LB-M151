import React, { useState } from "react";
import {Link} from "react-router-dom";
import "../Components/Home.css";


const Home = () => {
    return (
        <div className="container">
            <label>Willkommen zum GewinnRad</label>

            <Link to="/loginform">Admin</Link>
            <Link to="/game">Game</Link>
        </div>
        
    );
};

export default Home;