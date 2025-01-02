import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FilteredWorkoutList.module.css';

function FilteredWorkoutList({ onAddWorkout }) {
  const [exercises, setExercises] = useState([]);
  const [muscleGroup, setMuscleGroup] = useState('All');
  const [search, setSearch] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [exerciseSetsReps, setExerciseSetsReps] = useState({});

  const muscleGroups = [
    'All', 'Abdominals', 'Abductors', 'Adductors', 'Biceps', 'Calves',
    'Chest', 'Forearms', 'Glutes', 'Hamstrings', 'Lats', 'Lower Back',
    'Middle Back', 'Neck', 'Quadriceps', 'Shoulders', 'Traps', 'Triceps'
  ];

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/exercises', {
          params: { muscleGroup: muscleGroup === 'All' ? '' : muscleGroup }
        });
        setExercises(response.data);
        setFilteredExercises(response.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, [muscleGroup]);

  useEffect(() => {
    const filtered = exercises.filter((exercise) => {
      return (
        exercise.Exercise_Name &&
        exercise.Exercise_Name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredExercises(filtered);
  }, [search, exercises]);

  const handleInputChange = (exerciseId, type, value) => {
    setExerciseSetsReps((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [type]: value,
      },
    }));
  };

  const handleAdd = (exercise) => {
    const { reps, sets } = exerciseSetsReps[exercise.Exercise_ID] || {};
    if (reps && sets) {
      onAddWorkout({
        name: exercise.Exercise_Name,
        reps: parseInt(reps),
        sets: parseInt(sets),
      });
      setExerciseSetsReps((prev) => ({
        ...prev,
        [exercise.Exercise_ID]: { reps: '', sets: '' },
      }));
    } else {
      alert('Please specify reps and sets.');
    }
  };

  return (
    <div className={styles.filteredWorkoutList}>
      <h3>Select Workout</h3>

      <div className={styles.exerciseContainer}>
        <div className={styles.filterButtons}>
          {muscleGroups.map((group) => (
            <button
              key={group}
              className={`${styles.filterButton} ${muscleGroup === group ? styles.active : ''}`}
              onClick={() => setMuscleGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search exercises"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        {/* Column Headers */}
        <div className={styles.headerRow}>
          <span className={styles.header}>Exercise Name</span>
          <span className={styles.header}>Muscle Group</span>
          <span className={styles.header}>Difficulty</span>
          <span className={styles.header}>Reps</span>
          <span className={styles.header}>Sets</span>
        </div>

        {/* Exercise List */}
        {filteredExercises.map((exercise) => (
          <div key={exercise.Exercise_ID} className={styles.exerciseItem}>
            <span className={styles.column}>{exercise.Exercise_Name}</span>
            <span className={styles.column}>{exercise.Muscle_Group}</span>
            <span className={styles.column}>({exercise.Difficulty})</span>
            <input
            type="number"
            placeholder="Reps"
            value={exerciseSetsReps[exercise.Exercise_ID]?.reps || ''}
            onChange={(e) => handleInputChange(exercise.Exercise_ID, 'reps', e.target.value)}
            className={`${styles.column} ${styles.smallInput}`} /* Apply smallInput class */
            min="1"
            />
            <input
            type="number"
            placeholder="Sets"
            value={exerciseSetsReps[exercise.Exercise_ID]?.sets || ''}
            onChange={(e) => handleInputChange(exercise.Exercise_ID, 'sets', e.target.value)}
            className={`${styles.column} ${styles.smallInput}`} /* Apply smallInput class */
            min="1"
            />

            <button onClick={() => handleAdd(exercise)} className={styles.addButton}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilteredWorkoutList;
