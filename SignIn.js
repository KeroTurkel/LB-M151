import React, { useState } from "react";
import "../Components/SignIn.css";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "./Firebase";

import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/admin")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

    };


    return (
        <div>
            <h1>Login</h1>
            <div className="container">

                <form onSubmit={handleSubmit} >
                <div className="containerForm">
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </label>
                    <button type="submit">Login</button>
                    <Link to="/signup">SignUp</Link>
                    </div>
                    
                </form>
            </div>
        </div>


    );
};

export default LoginForm;