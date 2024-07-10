import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import PasswordInput from '../../components/input/PasswordInput';
// import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import '../../index.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!password) {
            setError('Please enter a password');
            return;
        }
        setError('');
        try {
            const response = await axiosInstance.post('login', {
                email: email,
                password: password
            });
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
            <div className='loginContainer'>
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <div className="loginFormInput">
                        <input className='emailInput' type="text" placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            value={password}
                            type='password'
                            onChange={(e) => setPassword(e.target.value) ? "text" : "password"}
                            placeholder="Password"
                            className='passwordInput'
                        />
                        {error && < p>{error}</p>}
                        <button type='submit' className='loginBtn'>Login</button>
                        <p className=''>Not registered yet?{" "}
                            <Link to="/signup" className='loginLink'>Create account</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
