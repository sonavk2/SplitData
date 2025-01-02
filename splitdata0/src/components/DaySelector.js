import React, { useState } from 'react';
import FilteredWorkoutList from './FilteredWorkoutList';
import styles from './DaySelector.module.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function DaySelector({ onAddWorkout }) {
  const [selectedDay, setSelectedDay] = useState(null);

  const handleAddWorkout = (workout) => {
    // `workout` should be an object like:
    // { exerciseId: 123, name: 'Bench Press', reps: 10 }
    // Assuming FilteredWorkoutList passes this structure:
    onAddWorkout(selectedDay, workout);
  };

  return (
    <div className={styles.container}>
      <h2>Select Day</h2>
      <div className={styles.dayButtons}>
        {days.map((day) => (
          <button
            key={day}
            className={`${styles.dayButton} ${selectedDay === day ? styles.selected : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      {selectedDay && <FilteredWorkoutList onAddWorkout={handleAddWorkout} />}
    </div>
  );
}

export default DaySelector;
