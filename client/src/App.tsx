import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import users from './users.json';
import SOPManagement from './SOPManagement';
import Layout from './Layout';
import Onboarding from './Onboarding';
import Recruitment from './Recruitment';
import Training from './Training';
import TrainingManagement from './TrainingManagement';

interface User {
  username: string;
  password: string;
  name: string;
  role: string;
}

interface TrainingProgram {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  progress: number;
  enrolled: boolean;
}

// Initial training data
const initialTrainings: TrainingProgram[] = [
  {
    id: 1,
    title: "React Advanced Concepts",
    description: "Deep dive into React hooks, context, and performance optimization",
    duration: "8 weeks",
    category: "Technical",
    progress: 0,
    enrolled: false
  },
  {
    id: 2,
    title: "Leadership Fundamentals",
    description: "Essential leadership skills for career growth",
    duration: "4 weeks",
    category: "Soft Skills",
    progress: 0,
    enrolled: false
  },
  {
    id: 3,
    title: "Project Management Basics",
    description: "Introduction to project management methodologies",
    duration: "6 weeks",
    category: "Management",
    progress: 0,
    enrolled: false
  }
];

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [tab, setTab] = useState(0);
  const [trainings, setTrainings] = useState<TrainingProgram[]>(initialTrainings);

  const handleUpdateTrainings = (updatedTrainings: TrainingProgram[]) => {
    // Preserve enrollment and progress data when updating trainings
    const updatedWithProgress = updatedTrainings.map(newTraining => {
      const existingTraining = trainings.find(t => t.id === newTraining.id);
      if (existingTraining) {
        return {
          ...newTraining,
          progress: existingTraining.progress || 0,
          enrolled: existingTraining.enrolled || false
        };
      }
      return {
        ...newTraining,
        progress: 0,
        enrolled: false
      };
    });
    setTrainings(updatedWithProgress);
  };

  const handleEnrollment = (trainingId: number, enrolled: boolean) => {
    setTrainings(trainings.map(training =>
      training.id === trainingId
        ? { ...training, enrolled }
        : training
    ));
  };

  const handleProgressUpdate = (trainingId: number, progress: number) => {
    setTrainings(trainings.map(training =>
      training.id === trainingId
        ? { ...training, progress }
        : training
    ));
  };

  const navItems = [
    { label: 'SOP Management', roles: ['operations_lead', 'superadmin'] },
    { label: 'Onboarding', roles: ['employee'] },
    { label: 'Recruitment', roles: ['hr_manager', 'superadmin'] },
    { label: 'Training & Development', roles: ['employee'] },
    { label: 'Training Management', roles: ['operations_lead'] },
  ];

  const userStories = [
    { label: 'SOP Management', component: SOPManagement },
    { label: 'Onboarding', component: Onboarding },
    { label: 'Recruitment', component: Recruitment },
    { 
      label: 'Training & Development', 
      component: () => (
        <Training 
          trainings={trainings}
          onEnrollment={handleEnrollment}
          onProgressUpdate={handleProgressUpdate}
        />
      )
    },
    { 
      label: 'Training Management', 
      component: () => (
        <TrainingManagement 
          trainings={trainings}
          onTrainingsUpdate={handleUpdateTrainings}
        />
      )
    },
  ];

  const allowedTabs = navItems
    .map((item, idx) => ({ ...item, idx }))
    .filter(item => item.roles.includes(loggedInUser?.role || ''));
  
  React.useEffect(() => {
    if (loggedInUser && !allowedTabs.some(t => t.idx === tab)) {
      setTab(allowedTabs[0]?.idx ?? 0);
    }
  }, [loggedInUser, allowedTabs, tab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = (users as User[]).find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setLoggedInUser(user);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  if (loggedInUser) {
    const handleLogout = () => {
      setLoggedInUser(null);
      // Reset trainings to initial state on logout
      setTrainings(initialTrainings);
    };

    const CurrentComponent = userStories[tab].component;

    return (
      <Layout user={loggedInUser} selected={tab} onSelect={setTab} onLogout={handleLogout}>
        {allowedTabs.some(t => t.idx === tab) && <CurrentComponent />}
      </Layout>
    );
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f6f8fa"
      zIndex={1300}
    >
      <Box component={Paper} p={4} width={400} maxWidth="90vw">
        <Typography variant="h5" gutterBottom>
          HR Processes Demo Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default App;
