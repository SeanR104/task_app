import React, { useRef } from "react";
import './SignUpForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import base from '../../api/base';

export const SignUpForm = ({ switchToLoginForm, switchToTaskList }) => {
    const nameRef = useRef();
    
    const addUser = (e) => {
        e.preventDefault();
        const Name = nameRef.current.value;
        base('Users').create({Name}, 
            function (err, record) {
                if (err) {
                    console.error(err);
                    return;
                }
            })
    }

    return (
        <div className="wrapper">
            <form>
                <h1>Register</h1>
                <div className="input-box">
                    <input type="text" placeholder="Name" ref={nameRef} required />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required />
                    <FaLock className="icon" />
                </div>

                <button type="submit" onClick={(e) => { switchToTaskList(); addUser(e); }}>Register</button>

                <div className="register-link">
                    <p>Already have an account?</p> <button onClick={switchToLoginForm}>Login</button>
                </div>
            </form>
        </div>
    )
}