import React from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

export const LoginForm = ({ switchToSignUpForm, switchToTaskList }) => {
    return (
        <div className='wrapper'>
            <form>
                <h1>Login</h1>
                <div className='input-box'>
                    <input type="text" placeholder='Name' required />
                    <FaUser className='icon'/>
                </div>
                <div className='input-box'>
                    <input type='password' placeholder='Password' required />
                    <FaLock className='icon'/>
                </div>
                <button type='submit' onClick={switchToTaskList}>Login</button>

                <div className='register-link'>
                    <p>Don't have an account?</p> <button onClick={switchToSignUpForm}>Register</button>
                </div>
            </form>
        </div>
    )
}