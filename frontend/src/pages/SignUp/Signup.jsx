import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name) {
            setError('Please enter your name');
            return;
        }
        if (!password) {
            setError('Please enter a password');
            return;
        }
        setError('');
        try {
            const response = await axiosInstance.post('/create-account', {
                fullName: name,
                email: email,
                password: password
            });
            if (response.data && response.data.error) {
                setError(response.data.message);
                return;
            }
            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("please try again. " + error.message);
            }
        }
    };

    return (
        <>
            <div className="loginContainer">
                <form onSubmit={handleSignUp}>
                    <h2 className="">SignUp</h2>
                    <div className="loginFormInput">
                        <input
                            type='text'
                            placeholder='Name'
                            className='emailInput'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type='text'
                            placeholder='Email'
                            className='emailInput'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            value={password}
                            type='password'
                            onChange={(e) => setPassword(e.target.value) ? "text" : "password"}
                            placeholder="Enter Password"
                            className='emailInput'
                        />
                        {error && < p className=''>{error}</p>}
                        <button type='submit' className='loginBtn'>Create Account</button>
                        <p className=''>Already have a account?{" "}
                            <Link to="/login" className='loginLink'>Login</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Signup;