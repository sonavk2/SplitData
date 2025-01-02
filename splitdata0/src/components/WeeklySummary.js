import React from 'react';
import styles from './WeeklySummary.module.css';

function WeeklySummary({ workoutsByDay }) {
  return (
    <div className={styles.summaryContainer}>
      <h2>Weekly Summary</h2>
      <div className={styles.dayBoxes}>
        {Object.keys(workoutsByDay).map((day) => (
          <div key={day} className={styles.dayBox}>
            <h4>{day}</h4>
            <ul>
              {workoutsByDay[day].map((workout, index) => (
                <li key={index}>
                  {workout.name} - {workout.sets} Sets x {workout.reps} Reps
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklySummary;
