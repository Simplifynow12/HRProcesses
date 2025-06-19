import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ChecklistIcon from '@mui/icons-material/Checklist';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import AdbIcon from '@mui/icons-material/Adb';
import ListItemButton from '@mui/material/ListItemButton';

const drawerWidth = 280;

const navItems = [
  { label: 'SOP Management', icon: <DescriptionIcon />, roles: ['operations_lead', 'superadmin'] },
  { label: 'Onboarding', icon: <ChecklistIcon />, roles: ['employee'] },
  { label: 'Recruitment', icon: <GroupIcon />, roles: ['hr_manager', 'superadmin'] },
  { label: 'Training & Development', icon: <SchoolIcon />, roles: ['employee'] },
  { label: 'Training Management', icon: <SchoolIcon />, roles: ['operations_lead'] },
];

interface LayoutProps {
  user: { username: string; name: string; role: string };
  selected: number;
  onSelect: (idx: number) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Layout({ user, selected, onSelect, onLogout, children }: LayoutProps) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <AdbIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" fontWeight={800} color="primary">
          HR Processes
        </Typography>
      </Toolbar>
      <List sx={{ pt: 2 }}>
        {navItems.filter(item => item.roles.includes(user.role)).map((item) => {
          const originalIdx = navItems.findIndex(n => n.label === item.label);
          return (
            <ListItemButton
              key={item.label}
              selected={selected === originalIdx}
              onClick={() => onSelect(originalIdx)}
              sx={{
                mb: 1,
                borderRadius: 2,
                px: 2,
                ml: 1.5,
                ...(selected === originalIdx && {
                  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                  color: '#fff',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                  borderRadius: 999,
                  mr: 2,
                  ml: 1.5,
                  width: '90%',
                }),
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            HR Processes Demo
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar>{user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}</Avatar>
            <Typography variant="subtitle1">{user.name || user.username}</Typography>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={onLogout} size="large">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: 'linear-gradient(180deg, #f6f8fa 0%, #e3f0ff 100%)' },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, #f6f8fa 0%, #e3f0ff 100%)',
              border: 'none',
              boxShadow: 'none',
              borderRadius: 0,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
          background: '#f6f8fa',
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 