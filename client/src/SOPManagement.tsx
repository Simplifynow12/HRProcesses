import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

interface SOP {
  id: number;
  title: string;
  department: string;
  description: string;
  steps: string;
  version: number;
  updatedAt: string;
}

const initialSOPs: SOP[] = [
  {
    id: 1,
    title: 'Onboarding New Employee',
    department: 'HR',
    description: 'How to onboard a new employee from offer to first day.',
    steps: '1. Send offer letter.\n2. Collect documents.\n3. Schedule orientation.',
    version: 2,
    updatedAt: '2024-06-01',
  },
  {
    id: 2,
    title: 'Payroll Processing',
    department: 'Finance',
    description: 'Monthly payroll process for all employees.',
    steps: '1. Collect timesheets.\n2. Verify hours.\n3. Process payments.',
    version: 1,
    updatedAt: '2024-05-15',
  },
];

export default function SOPManagement() {
  const [sops, setSOPs] = useState<SOP[]>(initialSOPs);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
    steps: '',
  });
  const [viewSOP, setViewSOP] = useState<SOP | null>(null);
  const [editSOP, setEditSOP] = useState<SOP | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    department: '',
    description: '',
    steps: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ title: '', department: '', description: '', steps: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    setSOPs([
      ...sops,
      {
        id: sops.length + 1,
        title: form.title,
        department: form.department,
        description: form.description,
        steps: form.steps,
        version: 1,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    handleClose();
  };

  const generateMarkdown = (sop: SOP) => `# ${sop.title}\n\n**Department:** ${sop.department}\n\n**Version:** v${sop.version}  \n**Last Updated:** ${sop.updatedAt}\n\n## Description\n${sop.description}\n\n## Steps\n${sop.steps}\n`;

  const downloadMarkdown = (sop: SOP) => {
    const md = generateMarkdown(sop);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sop.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditOpen = (sop: SOP) => {
    setEditSOP(sop);
    setEditForm({
      title: sop.title,
      department: sop.department,
      description: sop.description,
      steps: sop.steps,
    });
  };
  const handleEditClose = () => {
    setEditSOP(null);
    setEditForm({ title: '', department: '', description: '', steps: '' });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = () => {
    if (!editSOP) return;
    setSOPs(sops.map((sop) =>
      sop.id === editSOP.id
        ? {
            ...sop,
            ...editForm,
            version: sop.version + 1,
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : sop
    ));
    handleEditClose();
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 10, lg: 8 }} sx={{ width: '100%' }}>
          <Paper elevation={4} sx={{ p: 3, width: '100%', maxWidth: 900, mx: 'auto', background: 'linear-gradient(120deg, #fffbe7 0%, #e3f0ff 100%)', mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="secondary.main" gutterBottom>
              Why SOPs Matter
            </Typography>
            <Typography variant="body1" color="text.secondary">
              SOPs ensure consistency, quality, and compliance in your organization. Documenting and updating them helps teams perform tasks reliably—even during absences.
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                Features:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Create, view, and manage SOPs</li>
                <li>Version control and update history</li>
                <li>Department/task association</li>
                <li>Download and share SOPs</li>
              </ul>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 10, lg: 8 }} sx={{ width: '100%' }}>
          <Paper elevation={4} sx={{ p: 3, mb: 3, width: '100%', maxWidth: 900, mx: 'auto', background: 'linear-gradient(90deg, #e3ffe8 0%, #eaf6ff 100%)' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                Standard Operating Procedures
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                sx={{ borderRadius: 3, fontWeight: 600, boxShadow: 2 }}
              >
                Create SOP
              </Button>
            </Box>
            <List>
              {sops.map((sop) => (
                <Paper
                  key={sop.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 4,
                    background: '#fafdff',
                    boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.06)',
                  }}
                  elevation={0}
                >
                  <ListItem
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View SOP">
                          <span>
                            <IconButton onClick={() => setViewSOP(sop)} color="primary">
                              <VisibilityIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Edit SOP">
                          <span>
                            <IconButton onClick={() => handleEditOpen(sop)} color="primary">
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Download Markdown">
                          <span>
                            <IconButton onClick={() => downloadMarkdown(sop)} color="primary">
                              <DownloadIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    }
                  >
                    <ListItemText
                      primary={<Typography fontWeight={600}>{sop.title}</Typography>}
                      secondary={
                        <>
                          <Chip label={sop.department} size="small" color="info" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary" display="inline">
                            v{sop.version} • Updated {sop.updatedAt}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Create SOP Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New SOP</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Task Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Step-by-step Instructions"
            name="steps"
            value={form.steps}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* View SOP Dialog */}
      <Dialog open={!!viewSOP} onClose={() => setViewSOP(null)} fullWidth maxWidth="sm">
        <DialogTitle>View SOP</DialogTitle>
        <DialogContent>
          {viewSOP && (
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {viewSOP.title}
              </Typography>
              <Chip label={viewSOP.department} color="info" sx={{ mb: 1 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                v{viewSOP.version} • Updated {viewSOP.updatedAt}
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Description</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{viewSOP.description}</Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Steps</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{viewSOP.steps}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewSOP(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit SOP Dialog */}
      <Dialog open={!!editSOP} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit SOP</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={editForm.title}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Department"
            name="department"
            value={editForm.department}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Task Description"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Step-by-step Instructions"
            name="steps"
            value={editForm.steps}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 