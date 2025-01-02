// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './RegisterPage.css'; // Ensure this import is correct and points to your CSS file

// function RegisterPage({ onRegister }) {
//     const [email, setEmail] = useState('');
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     const validatePassword = (pass) => {
//         const lengthCheck = /^.{8,12}$/;
//         const uppercaseCheck = /[A-Z]/;
//         const numberCheck = /\d/;
//         const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/;

//         if (!lengthCheck.test(pass)) return "Password must be 8-12 characters long.";
//         if (!uppercaseCheck.test(pass)) return "Password must contain at least one uppercase letter.";
//         if (!numberCheck.test(pass)) return "Password must contain at least one number.";
//         if (!specialCharCheck.test(pass)) return "Password must contain at least one special character.";
//         return null;
//     };

//     const handleRegisterClick = () => {
//         const validationError = validatePassword(password);
//         if (validationError) {
//             setError(validationError);
//             return;
//         }

//         if (password !== confirmPassword) {
//             setError('Passwords do not match!');
//             return;
//         }

//         onRegister(email, username, password);
//         navigate('/');
//     };

//     return (
//         <div className="register-root">
//             <div className="hero-background">
//                 <div className="overlay">
//                     <div className="register-panel">
//                         <h1 className="register-title">Create Account</h1>
//                         <input
//                             type="email"
//                             placeholder="Email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="input-field"
//                             required
//                         />
//                         <input
//                             type="text"
//                             placeholder="Username"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             className="input-field"
//                             required
//                         />
//                         <input
//                             type="password"
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="input-field"
//                             required
//                         />
//                         <input
//                             type="password"
//                             placeholder="Confirm Password"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             className="input-field"
//                             required
//                         />

//                         <div className="requirements-box">
//                             <h3>Password Requirements:</h3>
//                             <ul>
//                                 <li>8-12 characters in length</li>
//                                 <li>At least one uppercase letter</li>
//                                 <li>At least one number</li>
//                                 <li>At least one special character</li>
//                             </ul>
//                         </div>

//                         {error && <p className="error">{error}</p>}

//                         <button
//                             onClick={handleRegisterClick}
//                             className="cta-btn"
//                         >
//                             Register
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default RegisterPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [fitnessLevel, setFitnessLevel] = useState("");
    const [goal, setGoal] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegisterClick = async () => {
        if (!username || !password) {
            alert("Please enter both username and password");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Parse numerical fields with validation
        const parsedAge = age ? parseInt(age, 10) : null;
        const parsedHeight = height ? parseFloat(height).toFixed(1) : null;
        const parsedWeight = weight ? parseFloat(weight).toFixed(1) : null;

        if (parsedAge && (parsedAge < 18 || parsedAge > 150)) {
            setError("Age must be between 18 and 150.");
            return;
        }
        if (parsedHeight && (parsedHeight <= 0 || isNaN(parsedHeight))) {
            setError("Height must be a positive number.");
            return;
        }
        if (parsedWeight && (parsedWeight <= 0 || isNaN(parsedWeight))) {
            setError("Weight must be a positive number.");
            return;
        }

        const requestData = {
            name: name || null,
            age: parsedAge,
            gender: gender || null,
            height: parsedHeight,
            weight: parsedWeight,
            fitnessLevel: fitnessLevel || null,
            goal: goal || null,
            username,
            password,
        };

        try {
            const response = await fetch("http://localhost:5005/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); // Show success message
                navigate("/login"); // Redirect to login page
            } else {
                alert(data.error || "Registration failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Failed to register. Please try again later.");
        }
    };

    return (
        <div className="register-root">
            <div className="hero-background">
                <div className="overlay">
                    <div className="register-panel">
                        <h1 className="register-title">Create Account</h1>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Height (in meters)"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Weight (in kg)"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Fitness Level"
                            value={fitnessLevel}
                            onChange={(e) => setFitnessLevel(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Goal"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field"
                        />

                        <div className="requirements-box">
                            <h3>Password Requirements:</h3>
                            <ul>
                                <li>8-12 characters in length</li>
                                <li>At least one uppercase letter</li>
                                <li>At least one number</li>
                                <li>At least one special character</li>
                            </ul>
                        </div>

                        {error && <p className="error">{error}</p>}

                        <button onClick={handleRegisterClick} className="cta-btn">
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
