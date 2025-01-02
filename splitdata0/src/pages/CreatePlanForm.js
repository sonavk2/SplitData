import React, { useState } from 'react';
import axios from 'axios';
import DaySelector from '../components/DaySelector';
import WeeklySummary from '../components/WeeklySummary';
import styles from './CreatePlanForm.module.css';

const CreatePlanForm = () => {
    const [planName, setPlanName] = useState('');
    const [workoutsByDay, setWorkoutsByDay] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    });

    const handleAddWorkout = (day, workout) => {
        // Ensure that workout includes { exerciseId, name, reps }
        // The DaySelector or the source adding workouts should provide these.
        setWorkoutsByDay((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), workout],
        }));
    };

    const handleSubmitPlan = async () => {
        if (!planName) {
            alert('Please enter a plan name.');
            return;
        }

        // Construct the sessions data
        const sessions = Object.keys(workoutsByDay).map((day) => ({
            day,
            name: `${day} Session`,
            sets: workoutsByDay[day].map((workout) => ({
                name: `${workout.name} Set`,
                reps: workout.reps,
                // Include the exerciseId from the workout
                exercises: [
                    { exerciseId: workout.exerciseId, reps: workout.reps },
                ],
            })),
        }));

        const planData = {
            userId: 1, // Replace with the actual user ID of the logged-in user
            planName,
            sessions,
        };

        try {
            const response = await axios.post('http://localhost:5005/api/save-plan', planData);
            alert('Plan saved successfully!');
        } catch (error) {
            console.error('Error saving the plan:', error);
            alert('Failed to save the plan.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Create Your Plan</h2>
                <input
                    placeholder="Enter Plan Name"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className={styles.input}
                />
            </div>
            <DaySelector onAddWorkout={handleAddWorkout} />
            <WeeklySummary workoutsByDay={workoutsByDay} />
            <button onClick={handleSubmitPlan} className={styles.submitButton}>
                Submit Plan
            </button>
        </div>
    );
};

export default CreatePlanForm;
