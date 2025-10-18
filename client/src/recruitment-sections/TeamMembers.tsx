import { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  Avatar,
  Chip,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

interface Candidate {
  name: string;
  role: string;
  status: string;
  readiness: string;
  avatar: string;
  recruitmentStage: number;
  checks: Check[];
  email: string;
  phone: string;
  address: string;
}

interface Check {
  label: string;
  status: 'Pending' | 'Passed' | 'Failed';
  file: string;
}

interface TeamMembersProps {
  standby: Candidate[];
  onUpdateStandby: (candidates: Candidate[]) => void;
  selectedCandidate: Candidate | null;
  onSelectCandidate: (candidate: Candidate | null) => void;
}

const createInitialChecks = (): Check[] => [
  { label: 'DBS/Background Check', status: 'Pending' as const, file: '' },
  { label: 'Employment References', status: 'Pending' as const, file: '' },
  { label: 'Home Address Verification', status: 'Pending' as const, file: '' },
];

export default function TeamMembers({ 
  standby, 
  onUpdateStandby, 
  selectedCandidate, 
  onSelectCandidate 
}: TeamMembersProps) {
  const [addStaffDialog, setAddStaffDialog] = useState(false);
  const [editStaffDialog, setEditStaffDialog] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    status: 'Available',
    readiness: 'Pending',
    email: '',
    phone: '',
    address: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    address: ''
  });

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return '';
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone) ? '' : 'Please enter a valid phone number (minimum 10 digits)';
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) return '';
    if (address.trim().length < 10) return 'Address must be at least 10 characters long';
    return '';
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters long';
        return '';
      case 'role':
        if (!value.trim()) return 'Role is required';
        if (value.trim().length < 2) return 'Role must be at least 2 characters long';
        return '';
      case 'email':
        return ''; // No email validation required
      case 'phone':
        return validatePhone(value);
      case 'address':
        return validateAddress(value);
      default:
        return '';
    }
  };

  const handleNewStaffChange = (field: string, value: string) => {
    setNewStaff(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      name: validateField('name', newStaff.name),
      role: validateField('role', newStaff.role),
      email: validateField('email', newStaff.email),
      phone: validateField('phone', newStaff.phone),
      address: validateField('address', newStaff.address)
    };
    
    setValidationErrors(errors);
    
    // Form is valid if there are no error messages
    return !Object.values(errors).some(error => error !== '');
  };

  const handleAddStaff = () => {
    if (validateForm()) {
      const newCandidate: Candidate = {
        name: newStaff.name.trim(),
        role: newStaff.role.trim(),
        status: newStaff.status,
        readiness: newStaff.readiness,
        avatar: '',
        recruitmentStage: 0,
        checks: createInitialChecks(),
        email: newStaff.email.trim(),
        phone: newStaff.phone.trim(),
        address: newStaff.address.trim(),
      };
      
      onUpdateStandby([...standby, newCandidate]);
      
      // Reset form and close dialog
      setNewStaff({
        name: '',
        role: '',
        status: 'Available',
        readiness: 'Pending',
        email: '',
        phone: '',
        address: ''
      });
      setValidationErrors({
        name: '',
        role: '',
        email: '',
        phone: '',
        address: ''
      });
      setAddStaffDialog(false);
    }
  };

  const handleCloseAddStaffDialog = () => {
    setAddStaffDialog(false);
    // Reset form and validation errors
    setNewStaff({
      name: '',
      role: '',
      status: 'Available',
      readiness: 'Pending',
      email: '',
      phone: '',
      address: ''
    });
    setValidationErrors({
      name: '',
      role: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const handleEditStaff = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    // Populate form with existing data
    setNewStaff({
      name: candidate.name,
      role: candidate.role,
      status: candidate.status,
      readiness: candidate.readiness,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address
    });
    // Clear any existing validation errors
    setValidationErrors({
      name: '',
      role: '',
      email: '',
      phone: '',
      address: ''
    });
    setEditStaffDialog(true);
  };

  const handleUpdateStaff = () => {
    if (editingCandidate && validateForm()) {
      const updatedCandidates = standby.map(candidate => {
        if (candidate.name === editingCandidate.name) {
          return {
            ...candidate,
            name: newStaff.name.trim(),
            role: newStaff.role.trim(),
            status: newStaff.status,
            readiness: newStaff.readiness,
            email: newStaff.email.trim(),
            phone: newStaff.phone.trim(),
            address: newStaff.address.trim(),
          };
        }
        return candidate;
      });
      
      onUpdateStandby(updatedCandidates);
      
      // Update selected candidate if it's the one being edited
      if (selectedCandidate?.name === editingCandidate.name) {
        const updatedCandidate = updatedCandidates.find(c => c.name === newStaff.name.trim());
        onSelectCandidate(updatedCandidate || null);
      }
      
      handleCloseEditStaffDialog();
    }
  };

  const handleCloseEditStaffDialog = () => {
    setEditStaffDialog(false);
    setEditingCandidate(null);
    // Reset form and validation errors
    setNewStaff({
      name: '',
      role: '',
      status: 'Available',
      readiness: 'Pending',
      email: '',
      phone: '',
      address: ''
    });
    setValidationErrors({
      name: '',
      role: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  return (
    <>
      <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #e3ffe8 0%, #eaf6ff 100%)', width: '100%' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <GroupAddIcon color="success" fontSize="large" />
              <Typography variant="h5" fontWeight={600} color="success.main">
                Team Members
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="success"
              startIcon={<GroupAddIcon />}
              onClick={() => setAddStaffDialog(true)}
            >
              Add Team Member
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            Click a name below to view candidate details and actions.
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Readiness</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {standby.map((c) => (
                  <TableRow
                    key={c.name}
                    hover
                    selected={selectedCandidate?.name === c.name}
                    onClick={() => onSelectCandidate(c)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ 
                          width: 40, 
                          height: 40,
                          fontSize: '1rem'
                        }}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography>
                          {c.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {c.role}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {c.email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={c.status}
                        color={c.status === 'Available' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={c.readiness}
                        color={c.readiness === 'Ready' ? 'info' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit Team Member">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStaff(c);
                          }}
                          color="primary"
                        >
                          <AssignmentIndIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={addStaffDialog} onClose={handleCloseAddStaffDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Team Member</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={newStaff.name}
              onChange={(e) => handleNewStaffChange('name', e.target.value)}
              fullWidth
              required
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            <TextField
              label="Role/Position"
              value={newStaff.role}
              onChange={(e) => handleNewStaffChange('role', e.target.value)}
              fullWidth
              required
              error={!!validationErrors.role}
              helperText={validationErrors.role}
            />
            <TextField
              label="Email Address"
              type="email"
              value={newStaff.email}
              onChange={(e) => handleNewStaffChange('email', e.target.value)}
              fullWidth
              placeholder="example@email.com"
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <TextField
              label="Phone Number"
              value={newStaff.phone}
              onChange={(e) => handleNewStaffChange('phone', e.target.value)}
              fullWidth
              placeholder="+44 7700 900000"
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
            />
            <TextField
              label="Address"
              value={newStaff.address}
              onChange={(e) => handleNewStaffChange('address', e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="Street, City, Postcode"
              error={!!validationErrors.address}
              helperText={validationErrors.address}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStaff.status}
                label="Status"
                onChange={(e) => handleNewStaffChange('status', e.target.value)}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Unavailable">Unavailable</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Readiness</InputLabel>
              <Select
                value={newStaff.readiness}
                label="Readiness"
                onChange={(e) => handleNewStaffChange('readiness', e.target.value)}
              >
                <MenuItem value="Ready">Ready</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddStaffDialog}>Cancel</Button>
          <Button 
            onClick={handleAddStaff} 
            variant="contained" 
            color="success"
            disabled={!newStaff.name.trim() || !newStaff.role.trim()}
          >
            Add Staff
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={editStaffDialog} onClose={handleCloseEditStaffDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Team Member</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={newStaff.name}
              onChange={(e) => handleNewStaffChange('name', e.target.value)}
              fullWidth
              required
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            <TextField
              label="Role/Position"
              value={newStaff.role}
              onChange={(e) => handleNewStaffChange('role', e.target.value)}
              fullWidth
              required
              error={!!validationErrors.role}
              helperText={validationErrors.role}
            />
            <TextField
              label="Email Address"
              type="email"
              value={newStaff.email}
              onChange={(e) => handleNewStaffChange('email', e.target.value)}
              fullWidth
              placeholder="example@email.com"
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <TextField
              label="Phone Number"
              value={newStaff.phone}
              onChange={(e) => handleNewStaffChange('phone', e.target.value)}
              fullWidth
              placeholder="+44 7700 900000"
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
            />
            <TextField
              label="Address"
              value={newStaff.address}
              onChange={(e) => handleNewStaffChange('address', e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="Street, City, Postcode"
              error={!!validationErrors.address}
              helperText={validationErrors.address}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStaff.status}
                label="Status"
                onChange={(e) => handleNewStaffChange('status', e.target.value)}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Unavailable">Unavailable</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Readiness</InputLabel>
              <Select
                value={newStaff.readiness}
                label="Readiness"
                onChange={(e) => handleNewStaffChange('readiness', e.target.value)}
              >
                <MenuItem value="Ready">Ready</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditStaffDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateStaff} 
            variant="contained" 
            color="primary"
            disabled={!newStaff.name.trim() || !newStaff.role.trim()}
          >
            Update Team Member
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
