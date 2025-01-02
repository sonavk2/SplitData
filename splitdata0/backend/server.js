console.log("somethings happening");
const express = require('express');
const mysql = require('mysql2'); // MySQL client
const cors = require('cors'); // Middleware to enable CORS

const app = express();
const PORT = 5005;

app.use(cors());
app.use(express.json()); // Parse JSON requests

// Create a MySQL connection
const db = mysql.createConnection({
    host: '34.46.65.98', // Public IP from the screenshot
    user: 'kazzy', // Replace with your database username
    password: '', // Replace with your database password
    database: 'splitdata', // Replace with the specific database name you're using
  });
  

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to Google Cloud SQL database');
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT User_ID FROM Users WHERE username = ? AND password = ?';
  const params = [username, password];

  db.query(query, params, (err, results) => {
      if (err) {
          console.error('Error during login query:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Return the User_ID if login is successful
      const userId = results[0].User_ID;
      res.json({ message: 'Login successful', userId });
  });
});

app.post("/api/register", (req, res) => {
  const {
      name,
      age,
      gender,
      height,
      weight,
      fitnessLevel,
      goal,
      username,
      password,
  } = req.body;

  // Parse numerical fields with validation
  const parsedAge = age ? parseInt(age, 10) : null;
  const parsedHeight = height ? parseFloat(height).toFixed(1) : null;
  const parsedWeight = weight ? parseFloat(weight).toFixed(1) : null;

  // Validate fields
  if (parsedAge && (parsedAge < 18 || parsedAge > 150)) {
      return res.status(400).json({ error: "Age must be between 18 and 150." });
  }
  if (parsedHeight && (parsedHeight <= 0 || isNaN(parsedHeight))) {
      return res.status(400).json({ error: "Height must be a positive number." });
  }
  if (parsedWeight && (parsedWeight <= 0 || isNaN(parsedWeight))) {
      return res.status(400).json({ error: "Weight must be a positive number." });
  }

  // Prepare the query to insert the user into the database
  const query = `
      INSERT INTO Users (Name, Age, Gender, Height, Weight, Fitness_level, Goal, username, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
      name || null,
      parsedAge,
      gender || null,
      parsedHeight,
      parsedWeight,
      fitnessLevel || null,
      goal || null,
      username,
      password,
  ];

  // Query the database
  db.query(query, values, (err, result) => {
      if (err) {
          console.error("Error inserting user into database:", err);
          return res.status(500).json({ error: "Error creating user" });
      }

      console.log("User created successfully, ID:", result.insertId);
      res.status(201).json({ message: "User created successfully", userId: result.insertId });
  });
});
// added this for editing
app.put('/api/user/:userId', (req, res) => {
  console.log(`Received PUT request for userId: ${req.params.userId}`);
  console.log('Request body:', req.body);
  const userId = req.params.userId;
  const { name, age, height, weight } = req.body;

  console.log('PUT request for userId:', userId, 'with body:', req.body);

  const query = `
      UPDATE Users 
      SET Name = ?, Age = ?, Height = ?, Weight = ?
      WHERE User_ID = ?
  `;

  const values = [name, age, height, weight, userId];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error updating user data:', err);
          return res.status(500).json({ message: 'Error updating user data' });
      }
      console.log('Update query result:', result);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
      } 


      res.json({ message: 'User data updated successfully' });
  });
});

// added this for rendering stats
app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT Name, Age, Height, Weight, BMI FROM Users WHERE User_ID = ?';
  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching user data:', err);
          return res.status(500).json({ message: 'Error fetching user data' });
      }
      console.log('Fetched user data:', results);
      if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(results[0]); // Send the user's data as JSON
  });
});

app.get('/api/exercises', (req, res) => {
    const muscleGroup = req.query.muscleGroup;
  
    let query = 'SELECT * FROM Exercises';
    const params = [];
  
    if (muscleGroup) {
      query += ' WHERE Muscle_Group = ?';
      params.push(muscleGroup);
    }
  
    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Error fetching exercises:', err);
        res.status(500).send('Error fetching exercises');
      } else {
        res.json(results);
      }
    });
  });

  app.post('/api/save-plan', (req, res) => {
    const { userId, planName, sessions } = req.body;
  
    // Validate the top-level fields
    if (!userId || !planName || !Array.isArray(sessions) || sessions.length === 0) {
      console.log('Invalid payload:', { userId, planName, sessions });
      return res.status(400).send('Invalid payload: must provide userId, planName, and at least one session.');
    }
  
    console.log('Received plan data:', JSON.stringify({ userId, planName, sessions }, null, 2));
  
    const insertPlanQuery = `INSERT INTO Plan (Plan_Name, User_ID) VALUES (?, ?)`;
    db.query(insertPlanQuery, [planName, userId], (err, planResult) => {
      if (err) {
        console.error('Error inserting plan:', err);
        return res.status(500).send('Error inserting plan');
      }
  
      const planId = planResult.insertId;
      console.log(`Plan inserted with ID: ${planId}`);
  
      // Since we are no longer dealing with sessions and sets, we just flatten everything into Plan_Contains.
      // We'll need a simple insert query for Plan_Contains.
      const insertPlanContainsQuery = `INSERT INTO Plan_Contains (Plan_ID, Exercise_ID, Day_of_Week, Reps) VALUES (?, ?, ?, ?)`;
  
      // We'll accumulate all insert operations for Plan_Contains in a loop and run them.
      // Or we can do them one by one.
  
      let insertOperations = [];
  
      // Iterate over sessions
      for (const session of sessions) {
        if (!session.day || typeof session.day !== 'string') {
          console.error('Invalid session day:', session);
          return res.status(400).send('Invalid session data: "day" must be a non-empty string.');
        }
        if (!Array.isArray(session.sets)) {
          console.error('Invalid session sets:', session);
          return res.status(400).send('Invalid session data: "sets" must be an array.');
        }
  
        for (const setData of session.sets) {
          if (!Array.isArray(setData.exercises)) {
            console.error('Invalid set exercises:', setData);
            return res.status(400).send('Invalid set data: "exercises" must be an array.');
          }
  
          for (const exercise of setData.exercises) {
            if (typeof exercise.exerciseId !== 'number') {
              console.error('Invalid exerciseId:', exercise);
              return res.status(400).send('Invalid exercise data: "exerciseId" must be a number.');
            }
            if (typeof exercise.reps !== 'number') {
              console.error('Invalid exercise reps:', exercise);
              return res.status(400).send('Invalid exercise data: "reps" must be a number.');
            }
  
            // Prepare this row insertion
            insertOperations.push(new Promise((resolve, reject) => {
              db.query(insertPlanContainsQuery, [planId, exercise.exerciseId, session.day, exercise.reps], (err) => {
                if (err) {
                  console.error('Error inserting Plan_Contains:', err);
                  return reject('Error inserting Plan_Contains');
                }
                resolve();
              });
            }));
          }
        }
      }
  
      // Execute all insert operations
      Promise.all(insertOperations)
        .then(() => {
          console.log('Plan and exercises inserted successfully into Plan_Contains.');
          res.send('Plan saved successfully!');
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send(error || 'Error inserting plan data');
        });
    });
  });
  
  



app.get('/api/plans', (req, res) => {
  const getPlansQuery = `
    SELECT p.Plan_ID as planId, p.Plan_Name as planName
    FROM Plan p
  `;

  db.query(getPlansQuery, (err, plans) => {
    if (err) {
      console.error('Error fetching plans:', err);
      return res.status(500).send('Internal server error');
    }

    if (plans.length === 0) {
      return res.json([]);
    }

    const planIds = plans.map(p => p.planId);

    const getSessionsQuery = `
      SELECT pc.Plan_ID as planId, pc.Day_of_Week as dayOfWeek, s.Session_ID as sessionId, s.Session_Name as sessionName
      FROM Plan_Contains pc
      JOIN Session s ON pc.Session_ID = s.Session_ID
      WHERE pc.Plan_ID IN (?)
    `;

    db.query(getSessionsQuery, [planIds], (err, sessions) => {
      if (err) {
        console.error('Error fetching sessions:', err);
        return res.status(500).send('Internal server error');
      }

      const sessionIds = sessions.map(sess => sess.sessionId);

      if (sessionIds.length === 0) {
        // No sessions found, just return plans without sessions
        const result = plans.map(p => ({ 
          planId: p.planId, 
          planName: p.planName, 
          sessions: [] 
        }));
        return res.json(result);
      }

      const getSetsQuery = `
        SELECT sc.Session_ID as sessionId, sc.Set_ID as setId, sc.Set_Reps as setReps, st.Set_Name as setName
        FROM Session_Contains sc
        JOIN Sets st ON sc.Set_ID = st.Set_ID
        WHERE sc.Session_ID IN (?)
      `;

      db.query(getSetsQuery, [sessionIds], (err, sets) => {
        if (err) {
          console.error('Error fetching sets:', err);
          return res.status(500).send('Internal server error');
        }

        const setIds = sets.map(s => s.setId);

        if (setIds.length === 0) {
          // No sets found
          const structuredResult = plans.map(plan => {
            const planSessions = sessions
              .filter(sess => sess.planId === plan.planId)
              .map(sess => ({
                sessionId: sess.sessionId,
                sessionName: sess.sessionName,
                dayOfWeek: sess.dayOfWeek,
                sets: []
              }));
            return { planId: plan.planId, planName: plan.planName, sessions: planSessions };
          });
          return res.json(structuredResult);
        }

        const getExercisesQuery = `
          SELECT sc.Set_ID as setId, sc.Exercise_ID as exerciseId, sc.E_Reps as eReps,
                 e.Exercise_Name as exerciseName
          FROM Set_Contains sc
          JOIN Exercises e ON sc.Exercise_ID = e.Exercise_ID
          WHERE sc.Set_ID IN (?)
        `;

        db.query(getExercisesQuery, [setIds], (err, exercises) => {
          if (err) {
            console.error('Error fetching exercises:', err);
            return res.status(500).send('Internal server error');
          }

          // Nesting the data
          // 1. Group exercises by setId
          const exercisesBySet = {};
          exercises.forEach(ex => {
            if (!exercisesBySet[ex.setId]) exercisesBySet[ex.setId] = [];
            exercisesBySet[ex.setId].push({
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              reps: ex.eReps
            });
          });

          // 2. Attach exercises to their sets
          const setsBySession = {};
          sets.forEach(st => {
            if (!setsBySession[st.sessionId]) setsBySession[st.sessionId] = [];
            setsBySession[st.sessionId].push({
              setId: st.setId,
              setName: st.setName,
              reps: st.setReps,
              exercises: exercisesBySet[st.setId] || []
            });
          });

          // 3. Attach sets to sessions
          const sessionsByPlan = {};
          sessions.forEach(sess => {
            if (!sessionsByPlan[sess.planId]) sessionsByPlan[sess.planId] = [];
            sessionsByPlan[sess.planId].push({
              sessionId: sess.sessionId,
              sessionName: sess.sessionName,
              dayOfWeek: sess.dayOfWeek,
              sets: setsBySession[sess.sessionId] || []
            });
          });

          // 4. Attach sessions to plans
          const finalResult = plans.map(plan => ({
            planId: plan.planId,
            planName: plan.planName,
            sessions: sessionsByPlan[plan.planId] || []
          }));

          res.json(finalResult);
        });
      });
    });
  });
});

app.delete('/api/plans/:planId', (req, res) => {
  const { planId } = req.params;
  const deleteQuery = 'DELETE FROM Plan WHERE Plan_ID = ?';

  db.query(deleteQuery, [planId], (err, result) => {
    if (err) {
      console.error('Error deleting plan:', err);
      return res.status(500).json({ error: 'Failed to delete plan' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });
  });
});



  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
