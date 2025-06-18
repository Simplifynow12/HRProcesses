import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import users from './users.json';
import SOPManagement from './SOPManagement';
import Layout from './Layout';
import Onboarding from './Onboarding';
import Recruitment from './Recruitment';

interface User {
  username: string;
  password: string;
  name: string;
  role: string;
}

const userStories = [
  { label: 'SOP Management', component: <SOPManagement /> },
  { label: 'Onboarding', component: <Onboarding /> },
  { label: 'Recruitment', component: <Recruitment /> },
];

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [tab, setTab] = useState(0);

  const navItems = [
    { label: 'SOP Management', roles: ['operations_lead', 'superadmin'] },
    { label: 'Onboarding', roles: ['employee'] },
    { label: 'Recruitment', roles: ['hr_manager', 'superadmin'] },
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
    const handleLogout = () => setLoggedInUser(null);
    return (
      <Layout user={loggedInUser} selected={tab} onSelect={setTab} onLogout={handleLogout}>
        {allowedTabs.some(t => t.idx === tab) ? userStories[tab].component : null}
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
