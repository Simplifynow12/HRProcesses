import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid as MuiGrid,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Alert,
  LinearProgress,
  Stack,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import SelectAllIcon from '@mui/icons-material/SelectAll';

interface Training {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  progress: number;
  enrolled: boolean;
  assignedEmployees?: string[];
  completionRate?: number;
  totalEnrollments?: number;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
}

interface TrainingManagementProps {
  trainings: Training[];
  onTrainingsUpdate: (trainings: Training[]) => void;
  userRole?: string;
}

const categories = ["Technical", "Soft Skills", "Management", "Professional Development", "Industry Specific"];

// Mock employee data for superadmin features
const mockEmployees: Employee[] = [
  { id: '1', name: 'John Smith', role: 'Developer', department: 'Engineering' },
  { id: '2', name: 'Sarah Johnson', role: 'HR Manager', department: 'Human Resources' },
  { id: '3', name: 'Mike Chen', role: 'Project Manager', department: 'Operations' },
  { id: '4', name: 'Emily Davis', role: 'Designer', department: 'Design' },
  { id: '5', name: 'David Wilson', role: 'Analyst', department: 'Finance' },
  { id: '6', name: 'Lisa Brown', role: 'Developer', department: 'Engineering' },
  { id: '7', name: 'Tom Anderson', role: 'Marketing Specialist', department: 'Marketing' },
  { id: '8', name: 'Amy Taylor', role: 'Operations Lead', department: 'Operations' }
];

export default function TrainingManagement({ trainings, onTrainingsUpdate, userRole }: TrainingManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [formData, setFormData] = useState<Omit<Training, 'id' | 'progress' | 'enrolled'>>({
    title: '',
    description: '',
    duration: '',
    category: ''
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTrainings, setSelectedTrainings] = useState<number[]>([]);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalTrainings: trainings.length,
    totalEnrollments: trainings.reduce((sum, t) => sum + (t.totalEnrollments || 0), 0),
    averageCompletion: trainings.reduce((sum, t) => sum + (t.completionRate || 0), 0) / trainings.length || 0,
    popularCategory: 'Technical'
  });

  const handleOpenDialog = (training?: Training) => {
    if (training) {
      setEditingTraining(training);
      setFormData({
        title: training.title,
        description: training.description,
        duration: training.duration,
        category: training.category
      });
    } else {
      setEditingTraining(null);
      setFormData({
        title: '',
        description: '',
        duration: '',
        category: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTraining(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      category: ''
    });
  };

  const handleSave = () => {
    let updatedTrainings: Training[];
    if (editingTraining) {
      // Update existing training
      updatedTrainings = trainings.map(t => 
        t.id === editingTraining.id 
          ? { ...editingTraining, ...formData }
          : t
      );
    } else {
      // Add new training
      const newId = Math.max(...trainings.map(t => t.id), 0) + 1;
      updatedTrainings = [...trainings, { 
        ...formData, 
        id: newId,
        progress: 0,
        enrolled: false
      }];
    }
    onTrainingsUpdate(updatedTrainings);
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this training program?')) {
      const updatedTrainings = trainings.filter(t => t.id !== id);
      onTrainingsUpdate(updatedTrainings);
    }
  };

  // Superadmin-specific functions
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedTrainings.length} training programs?`)) {
      const updatedTrainings = trainings.filter(t => !selectedTrainings.includes(t.id));
      onTrainingsUpdate(updatedTrainings);
      setSelectedTrainings([]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTrainings.length === trainings.length) {
      setSelectedTrainings([]);
    } else {
      setSelectedTrainings(trainings.map(t => t.id));
    }
  };

  const handleTrainingSelect = (id: number) => {
    setSelectedTrainings(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const handleOpenAssignmentDialog = () => {
    setAssignmentDialogOpen(true);
    setSelectedEmployees([]);
  };

  const handleCloseAssignmentDialog = () => {
    setAssignmentDialogOpen(false);
    setSelectedEmployees([]);
  };

  const handleAssignTraining = () => {
    const updatedTrainings = trainings.map(training => {
      if (selectedTrainings.includes(training.id)) {
        return {
          ...training,
          assignedEmployees: [...(training.assignedEmployees || []), ...selectedEmployees],
          totalEnrollments: (training.totalEnrollments || 0) + selectedEmployees.length
        };
      }
      return training;
    });
    onTrainingsUpdate(updatedTrainings);
    handleCloseAssignmentDialog();
    setSelectedTrainings([]);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleExportAnalytics = () => {
    const data = {
      analytics: analyticsData,
      trainings: trainings.map(t => ({
        title: t.title,
        category: t.category,
        duration: t.duration,
        enrollments: t.totalEnrollments || 0,
        completionRate: t.completionRate || 0
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training-analytics.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isSuperAdmin = userRole === 'superadmin';

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Training Management {isSuperAdmin && <Chip label="Super Admin" color="secondary" size="small" sx={{ ml: 2 }} />}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Training
          </Button>
          {isSuperAdmin && (
            <>
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                onClick={handleOpenAssignmentDialog}
                disabled={selectedTrainings.length === 0}
              >
                Assign to Employees
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                disabled={selectedTrainings.length === 0}
              >
                Bulk Delete
              </Button>
            </>
          )}
        </Stack>
      </Box>

      {/* Super Admin Tabs */}
      {isSuperAdmin && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Training Programs" icon={<AssignmentIcon />} />
            <Tab label="Analytics & Reports" icon={<AnalyticsIcon />} />
            <Tab label="Employee Assignments" icon={<PeopleIcon />} />
          </Tabs>
        </Box>
      )}

      {/* Training Programs Tab */}
      {(currentTab === 0 || !isSuperAdmin) && (
        <Box sx={{ flexGrow: 1 }}>
          {isSuperAdmin && trainings.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<SelectAllIcon />}
                onClick={handleSelectAll}
                variant="outlined"
                size="small"
              >
                {selectedTrainings.length === trainings.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Typography variant="body2" color="text.secondary">
                {selectedTrainings.length} of {trainings.length} selected
              </Typography>
            </Box>
          )}
          
          <MuiGrid container spacing={2}>
            {trainings.map((training) => (
              <MuiGrid item xs={12} md={6} lg={4} key={training.id}>
                <Card sx={{ 
                  border: isSuperAdmin && selectedTrainings.includes(training.id) ? '2px solid #1976d2' : 'none',
                  backgroundColor: isSuperAdmin && selectedTrainings.includes(training.id) ? '#f3f8ff' : 'inherit'
                }}>
                  {isSuperAdmin && (
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Checkbox
                        checked={selectedTrainings.includes(training.id)}
                        onChange={() => handleTrainingSelect(training.id)}
                        size="small"
                      />
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {training.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {training.category} • {training.duration}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {training.description}
                    </Typography>
                    {isSuperAdmin && (
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption">Enrollments:</Typography>
                          <Typography variant="caption" fontWeight="bold">
                            {training.totalEnrollments || 0}
                          </Typography>
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption">Completion Rate:</Typography>
                            <Typography variant="caption" fontWeight="bold">
                              {training.completionRate || 0}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={training.completionRate || 0} 
                            size="small"
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </Stack>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton 
                      onClick={() => handleOpenDialog(training)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(training.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </MuiGrid>
            ))}
          </MuiGrid>
        </Box>
      )}

      {/* Analytics Tab - Super Admin Only */}
      {isSuperAdmin && currentTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Training Analytics & Reports</Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportAnalytics}
            >
              Export Analytics
            </Button>
          </Box>

          <MuiGrid container spacing={3}>
            <MuiGrid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary">
                    {analyticsData.totalTrainings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Training Programs
                  </Typography>
                </CardContent>
              </Card>
            </MuiGrid>
            <MuiGrid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main">
                    {analyticsData.totalEnrollments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Enrollments
                  </Typography>
                </CardContent>
              </Card>
            </MuiGrid>
            <MuiGrid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="warning.main">
                    {analyticsData.averageCompletion.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Completion Rate
                  </Typography>
                </CardContent>
              </Card>
            </MuiGrid>
            <MuiGrid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="secondary.main">
                    {analyticsData.popularCategory}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Most Popular Category
                  </Typography>
                </CardContent>
              </Card>
            </MuiGrid>
          </MuiGrid>

          <Divider sx={{ my: 3 }} />

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Training Performance Overview</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Training Program</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Enrollments</TableCell>
                      <TableCell>Completion Rate</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trainings.map((training) => (
                      <TableRow key={training.id}>
                        <TableCell>{training.title}</TableCell>
                        <TableCell>
                          <Chip label={training.category} size="small" />
                        </TableCell>
                        <TableCell>{training.totalEnrollments || 0}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {training.completionRate || 0}%
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={training.completionRate || 0} 
                              sx={{ width: 60, height: 6 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={training.completionRate && training.completionRate > 70 ? 'Excellent' : 
                                   training.completionRate && training.completionRate > 50 ? 'Good' : 'Needs Attention'}
                            color={training.completionRate && training.completionRate > 70 ? 'success' : 
                                   training.completionRate && training.completionRate > 50 ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Employee Assignments Tab - Super Admin Only */}
      {isSuperAdmin && currentTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>Employee Training Assignments</Typography>
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Assigned Trainings</TableCell>
                      <TableCell>Completion Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockEmployees.map((employee) => {
                      const assignedTrainings = trainings.filter(t => 
                        t.assignedEmployees?.includes(employee.id)
                      );
                      return (
                        <TableRow key={employee.id}>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.role}</TableCell>
                          <TableCell>
                            {assignedTrainings.length > 0 ? (
                              <Stack spacing={0.5}>
                                {assignedTrainings.map(training => (
                                  <Chip 
                                    key={training.id}
                                    label={training.title} 
                                    size="small" 
                                    variant="outlined"
                                  />
                                ))}
                              </Stack>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No assignments
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={assignedTrainings.length > 0 ? 'In Progress' : 'Not Assigned'}
                              color={assignedTrainings.length > 0 ? 'warning' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingTraining ? 'Edit Training Program' : 'Add New Training Program'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="Duration (e.g., '4 weeks')"
              fullWidth
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={!formData.title || !formData.description || !formData.duration || !formData.category}
          >
            {editingTraining ? 'Save Changes' : 'Add Training'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Assignment Dialog - Super Admin Only */}
      {isSuperAdmin && (
        <Dialog 
          open={assignmentDialogOpen} 
          onClose={handleCloseAssignmentDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Assign Training to Employees
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select employees to assign the selected training programs to:
            </Typography>
            
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < mockEmployees.length}
                          checked={selectedEmployees.length === mockEmployees.length}
                          onChange={() => {
                            if (selectedEmployees.length === mockEmployees.length) {
                              setSelectedEmployees([]);
                            } else {
                              setSelectedEmployees(mockEmployees.map(e => e.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => handleEmployeeSelect(employee.id)}
                          />
                        </TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              {selectedEmployees.length} employee(s) selected for training assignment
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAssignmentDialog} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleAssignTraining}
              variant="contained"
              disabled={selectedEmployees.length === 0}
            >
              Assign Training
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
} 