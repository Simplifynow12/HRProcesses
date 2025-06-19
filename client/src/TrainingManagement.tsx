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
  Grid as MuiGrid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface Training {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  progress: number;
  enrolled: boolean;
}

interface TrainingManagementProps {
  trainings: Training[];
  onTrainingsUpdate: (trainings: Training[]) => void;
}

const categories = ["Technical", "Soft Skills", "Management", "Professional Development", "Industry Specific"];

export default function TrainingManagement({ trainings, onTrainingsUpdate }: TrainingManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [formData, setFormData] = useState<Omit<Training, 'id' | 'progress' | 'enrolled'>>({
    title: '',
    description: '',
    duration: '',
    category: ''
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Manage Training Programs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Training
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <MuiGrid container spacing={2}>
          {trainings.map((training) => (
            <MuiGrid item xs={12} md={6} lg={4} key={training.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {training.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {training.category} • {training.duration}
                  </Typography>
                  <Typography variant="body2">
                    {training.description}
                  </Typography>
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
    </Box>
  );
} 