import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePlan.module.css';

function CreatePlan() {
  const navigate = useNavigate();

  return (
    <div className={styles.createPlan}>
      <button
        onClick={() => navigate('/create-plan')}
        className={styles.createButton}
      >
        Create Plan
      </button>
    </div>
  );
}

export default CreatePlan;
