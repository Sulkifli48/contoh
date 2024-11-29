import './Login.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const userData = await response.json();
            console.log('Login successful:', userData);

            sessionStorage.setItem("user_id", userData.id_users);
            sessionStorage.setItem("email", userData.email);
            sessionStorage.setItem("user_role", userData.user_role);
            sessionStorage.setItem("name", userData.name);

            navigate("/admin/dashboard");
            window.location.reload();
            console.log(`Welcome, ${userData.name}`);
        } catch (error) {
            setError('Login failed. Please check your email and password and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='wrapper'>
            <div className='card'>
                <h1>Sign in</h1>
                <form onSubmit={handleLogin}>
                    <div className='input-box'>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-box'>
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='lupapass'>
                        <Link to="/forget">Forgot password</Link>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
