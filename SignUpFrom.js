import React, { useState } from "react";
import "../Components/SignUp.css";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from "./Firebase";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault()
     
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
           
            const user = userCredential.user;
            console.log(user);
            navigate("/loginform");
           
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        
        });
    };

    

    return (
        <div>
            <h1>Signup</h1>
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
                    <button type="submit">Signup</button>
                    </div>
                    
                    
                </form>
            </div>
        </div>
    );
};

export default SignUp;