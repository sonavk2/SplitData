import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlansList = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/plans');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handleDelete = async (planId) => {
    try {
      await axios.delete(`http://localhost:5005/api/plans/${planId}`);
      setPlans((prevPlans) => prevPlans.filter(plan => plan.planId !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <div>
      <h2>All Plans</h2>
      {plans.length === 0 && <p>No plans found.</p>}
      {plans.map((plan, index) => (
        <div key={plan.planId} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {/* Display the incremented plan number on the card */}
            <h3 style={{margin: 0}}>Plan {index + 1}: {plan.planName}</h3>
            <button onClick={() => handleDelete(plan.planId)}>Delete</button>
          </div>

          {plan.sessions.length === 0 ? (
            <p>No sessions for this plan.</p>
          ) : (
            plan.sessions.map(session => (
              <div key={session.sessionId} style={{marginLeft: '20px'}}>
                <h4>{session.dayOfWeek} - {session.sessionName}</h4>
                {session.sets.length === 0 ? (
                  <p>No sets in this session.</p>
                ) : (
                  session.sets.map(s => (
                    <div key={s.setId} style={{marginLeft: '20px'}}>
                      <strong>{s.setName}:</strong> {s.reps} reps
                      {s.exercises.length === 0 ? (
                        <p>No exercises in this set.</p>
                      ) : (
                        s.exercises.map(e => (
                          <div key={e.exerciseId} style={{marginLeft: '20px'}}>
                            {e.exerciseName} - {e.reps} reps
                          </div>
                        ))
                      )}
                    </div>
                  ))
                )}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default PlansList;
