import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';  // (changed this) Import useUser from Context
import './LoginPage.css'; // Using a regular CSS file

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useUser();  // (changed this) Access the login function from context

    const handleLogin = async () => {
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        try {
            const response = await fetch('http://localhost:5005/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save the user ID and mark the user as authenticated
                onLogin(data.userId);
                login(data.userId); // (changed this)This will store the user_id in the context
                navigate('/dashboard');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Failed to login. Please try again later.');
        }
    };
    
    return (
        <div className="login-root">
            <div className="hero-background">
                <div className="overlay">
                    <div className="login-panel">
                        <h1 className="login-title">Sign in to Your Account</h1>
                        <div className="social-login-options">
                        </div>
                        <p className="or-divider">or</p>
                        <input
                            type="text"
                            placeholder="Email or Username"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="cta-btn" onClick={handleLogin}>Login</button>
                        <div className="register-text">
                            Don’t have an account? <Link to="/register" className="link highlighted-link">Register Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
