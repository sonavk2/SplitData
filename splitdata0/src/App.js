// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import CreatePlanForm from './pages/CreatePlanForm';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ProtectedRoute from './components/ProtectedRoute';
// import styles from './App.module.css';

// function App() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication starts as false

//     // Handles login and sets authentication to true
//     const handleLogin = () => {
//         setIsAuthenticated(true);
//     };

//     const handleRegister = () => {
//         alert('Account registered successfully!');
//     };

//     const handleCreatePlan = (planDetails) => {
//         console.log('Plan created:', planDetails);
//         alert('Plan created successfully!');
//     };

//     return (
//         <Router>
//             <div className={styles.container}>
//                 <Routes>
//                     {/* Login Page as the default route */}
//                     <Route
//                         path="/"
//                         element={
//                             isAuthenticated ? (
//                                 <Navigate to="/dashboard" />
//                             ) : (
//                                 <LoginPage onLogin={handleLogin} />
//                             )
//                         }
//                     />
                    
//                     {/* Registration Page */}
//                     <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />

//                     {/* Dashboard (Protected Route) */}
//                     <Route
//                         path="/dashboard"
//                         element={
//                             <ProtectedRoute isAuthenticated={isAuthenticated}>
//                                 <Dashboard />
//                             </ProtectedRoute>
//                         }
//                     />

//                     {/* Create Plan Page (Protected Route) */}
//                     <Route
//                         path="/create-plan"
//                         element={
//                             <ProtectedRoute isAuthenticated={isAuthenticated}>
//                                 <CreatePlanForm onCreate={handleCreatePlan} />
//                             </ProtectedRoute>
//                         }
//                     />

//                     {/* Catch-all route to redirect unauthenticated users */}
//                     <Route path="*" element={<Navigate to="/" />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// }

// export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import Dashboard from './pages/Dashboard';
import CreatePlanForm from './pages/CreatePlanForm';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import styles from './App.module.css';
import FindPlanPage from './pages/FindPlanPage.js';
import FindPlanPage2 from './pages/FindPlanPage2.js';
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication starts as false

    // Handles login and sets authentication to true
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleRegister = () => {
        alert('Account registered successfully!');
    };

    const handleCreatePlan = (planDetails) => {
        console.log('Plan created:', planDetails);
        alert('Plan created successfully!');
    };

    return (
        // Wrap everything in UserProvider to provide the context to the app
        <UserProvider>
            <Router>
                <div className={styles.container}>
                    <Routes>
                        {/* Login Page as the default route */}
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/dashboard" />
                                ) : (
                                    <LoginPage onLogin={handleLogin} />
                                )
                            }
                        />
                        
                        {/* Registration Page */}
                        <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />

                        {/* Dashboard (Protected Route) */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Create Plan Page (Protected Route) */}
                        <Route
                            path="/create-plan"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <CreatePlanForm onCreate={handleCreatePlan} />
                                </ProtectedRoute>
                            }
                        />

                        <Route 
                          path = "/find-plan"
                          element = {
                            <FindPlanPage/>
                          }
                        />

                        {/* Catch-all route to redirect unauthenticated users */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
