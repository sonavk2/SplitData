import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FindPlanPage.module.css';

const FindPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState('');

  // Fetch plans from the API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/plans');
        setPlans(response.data);
        setFilteredPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  // Filter plans based on the search term
  useEffect(() => {
    setFilteredPlans(
      plans.filter((plan) =>
        plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, plans]);

  const handleDeletePlanById = async (e) => {
    e.preventDefault();

    const planId = parseInt(deletePlanId, 10);
    if (isNaN(planId)) {
      console.error('Invalid plan ID:', deletePlanId);
      return;
    }

    try {
      await axios.delete(`http://localhost:5005/api/plans/${planId}`);
      // Update the state to remove the deleted plan
      setPlans((prevPlans) => prevPlans.filter((p) => p.planId !== planId));
      setFilteredPlans((prevFiltered) => prevFiltered.filter((p) => p.planId !== planId));

      // If the currently selected plan is the one just deleted, clear it
      if (selectedPlan && selectedPlan.planId === planId) {
        setSelectedPlan(null);
      }

      // Clear the input field after deletion
      setDeletePlanId('');
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Find Plan</h2>
      <input
        type="text"
        placeholder="Search for a plan"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.planList}>
        {filteredPlans.map((plan) => (
          <div
            key={plan.planId}
            className={styles.planItem}
            onClick={() => setSelectedPlan(plan)}
          >
            <span>{plan.planName}</span>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className={styles.planDetails}>
          <h3>Plan: {selectedPlan.planName}</h3>
          {/* If your selectedPlan has a different structure, adjust accordingly.
              Example structure given in previous code: selectedPlan might have sessions or days. */}
          {selectedPlan.sessions ? (
            <div>
              <h4>Day-by-Day Summary:</h4>
              <ul>
                {selectedPlan.sessions.map((sess, index) => (
                  <li key={index}>
                    <strong>{sess.dayOfWeek}:</strong>{" "}
                    {sess.sets.flatMap(s => s.exercises.map(e => e.exerciseName)).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No detailed session information available.</p>
          )}
        </div>
      )}

      <div className={styles.deleteFormContainer}>
        <h3>Delete a Plan by ID</h3>
        <form onSubmit={handleDeletePlanById}>
          <input
            type="text"
            placeholder="Enter plan ID"
            value={deletePlanId}
            onChange={(e) => setDeletePlanId(e.target.value)}
            className={styles.deleteInput}
          />
          <button type="submit" className={styles.deleteButton}>
            Delete Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPlanPage;
