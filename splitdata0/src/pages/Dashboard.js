import React, { useState, useEffect } from 'react';  // changed this
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';  // (changed this) Use the context to get the user_id
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { userId } = useUser(); // (changed this) Get user_id from context
    const [userInfo, setUserInfo] = useState(null); // State to hold the user's detailed info
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({});

    console.log('Dashboard: userId from context:', userId);

    // user details from the server
    const fetchUserData = (userId) => {
        fetch(`http://localhost:5005/api/user/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('User data fetched:', data);
                setUserInfo({
                    name: data.Name || 'N/A',
                    age: data.Age || 'N/A',
                    height: parseFloat(data.Height) || 'N/A',
                    weight: parseFloat(data.Weight) || 'N/A', 
                    bmi: parseFloat(data.BMI) || 'N/A',
                });
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedInfo({ ...userInfo });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveClick = () => {
        const updatedInfo = {
            ...editedInfo,
            weight: isNaN(parseFloat(editedInfo.weight)) || parseFloat(editedInfo.weight) <= 0 ? null : parseFloat(editedInfo.weight),
            height: isNaN(parseFloat(editedInfo.height)) || parseFloat(editedInfo.height) <= 0 ? null : parseFloat(editedInfo.height),
            age: isNaN(parseInt(editedInfo.age)) || parseInt(editedInfo.age) <= 0 ? null : parseInt(editedInfo.age),
        };

        console.log(`Saving edited info for userId: ${userId}`, updatedInfo);

        fetch(`http://localhost:5005/api/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedInfo),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                setIsEditing(false); // Exit editing mode
                fetchUserData(userId); // Refresh the data after updating
            })
            .catch((error) => {
                console.error('Error updating user data:', error);
            });
    };

    useEffect(() => {
        if (userId) {
            fetchUserData(userId);
        }
    }, [userId]);

    if (!userInfo) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1>Welcome to Your Dashboard</h1>
                <p>Manage your profile and fitness plans here.</p>
            </div>

            <div className={styles.cardRow}>
                {/* User Info Card */}
                <div className={`${styles.card} ${styles.infoCard}`}>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={editedInfo.name || ''}
                                onChange={handleInputChange}
                                placeholder="Name"
                            />
                            <input
                                type="number"
                                name="age"
                                value={editedInfo.age || ''}
                                onChange={handleInputChange}
                                placeholder="Age"
                            />
                            <input
                                type="number"
                                step="0.1"
                                name="height"
                                value={editedInfo.height || ''}
                                onChange={handleInputChange}
                                placeholder="Height (m)"
                            />
                            <input
                                type="number"
                                step="0.1"
                                name="weight"
                                value={editedInfo.weight || ''}
                                onChange={handleInputChange}
                                placeholder="Weight (kg)"
                            />
                            <button onClick={handleSaveClick}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <h2>Welcome, {userInfo.name || 'User'}!</h2>
                            <p>Age: {userInfo.age || 'N/A'}</p>
                            <p>Height: {userInfo.height || 'N/A'} m</p>
                            <p>Weight: {userInfo.weight || 'N/A'} kg</p>
                            <p>BMI: {userInfo.bmi || 'N/A'}</p>
                            <button onClick={handleEditClick}>Edit Info</button>
                        </>
                    )}
                </div>

                {/* Create Plan Card */}
                <div className={`${styles.card} ${styles.planCard}`}>
                    <h2>Create a Plan</h2>
                    <button onClick={() => navigate('/create-plan')}>Create Plan</button>
                </div>

                {/* Find Plan Card */}
                <div className={`${styles.card} ${styles.planCard}`}>
                    <h2>Find Existing Plan</h2>
                    <button onClick={() => navigate('/find-plan')}>Find Plan</button>
                </div>
            </div>
            {/* Bottom Section */}
            {/* <div className={styles.bottomSection}> */}
                {/* <h3>Your subscribed Plans:</h3> */}
                {/* Add your logic here to display subscribed plans */}
            {/* </div> */}
        </div>
    );
};

export default Dashboard;
