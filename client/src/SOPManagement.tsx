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
  Menu,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';

interface SOP {
  id: number;
  title: string;
  department: string;
  description: string;
  steps: string;
  version: number;
  updatedAt: string;
  links: string[]; // Added links field
}

interface SOPManagementProps {
  userRole?: string;
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
    links: [],
  },
  {
    id: 2,
    title: 'Payroll Processing',
    department: 'Finance',
    description: 'Monthly payroll process for all employees.',
    steps: '1. Collect timesheets.\n2. Verify hours.\n3. Process payments.',
    version: 1,
    updatedAt: '2024-05-15',
    links: [],
  },
];

export default function SOPManagement({ userRole }: SOPManagementProps) {
  // Load SOPs from localStorage on component mount
  const loadSOPsFromStorage = (): SOP[] => {
    try {
      const stored = localStorage.getItem('hr-sops');
      return stored ? JSON.parse(stored) : initialSOPs;
    } catch (error) {
      console.error('Error loading SOPs from storage:', error);
      return initialSOPs;
    }
  };

  const [sops, setSOPs] = useState<SOP[]>(loadSOPsFromStorage);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
    steps: '',
    links: [''], // Add links to form state
  });
  const [viewSOP, setViewSOP] = useState<SOP | null>(null);
  const [editSOP, setEditSOP] = useState<SOP | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    department: '',
    description: '',
    steps: '',
    links: [''], // Add links to editForm state
  });
  const [deleteSOP, setDeleteSOP] = useState<SOP | null>(null);
  const [downloadMenu, setDownloadMenu] = useState<{ anchorEl: HTMLElement | null; sop: SOP | null }>({
    anchorEl: null,
    sop: null
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ title: '', department: '', description: '', steps: '', links: [''] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLinkChange = (idx: number, value: string) => {
    const newLinks = [...form.links];
    newLinks[idx] = value;
    setForm({ ...form, links: newLinks });
  };
  const handleAddLink = () => {
    setForm({ ...form, links: [...form.links, ''] });
  };
  const handleRemoveLink = (idx: number) => {
    const newLinks = form.links.filter((_, i) => i !== idx);
    setForm({ ...form, links: newLinks });
  };

  // Save SOPs to localStorage whenever they change
  const saveSOPsToStorage = (newSOPs: SOP[]) => {
    try {
      localStorage.setItem('hr-sops', JSON.stringify(newSOPs));
    } catch (error) {
      console.error('Error saving SOPs to storage:', error);
    }
  };

  const handleCreate = () => {
    // Validate links
    const validLinks = form.links.filter(link => link.trim() !== '' && /^https?:\/\//.test(link));
    const newSOPs = [
      ...sops,
      {
        id: sops.length + 1,
        title: form.title,
        department: form.department,
        description: form.description,
        steps: form.steps,
        version: 1,
        updatedAt: new Date().toISOString().slice(0, 10),
        links: validLinks,
      },
    ];
    setSOPs(newSOPs);
    saveSOPsToStorage(newSOPs);
    handleClose();
  };

  const generateMarkdown = (sop: SOP) => `# ${sop.title}\n\n**Department:** ${sop.department}\n\n**Version:** v${sop.version}  \n**Last Updated:** ${sop.updatedAt}\n\n## Description\n${sop.description}\n\n## Steps\n${sop.steps}\n`;

  const generatePlainText = (sop: SOP) => `${sop.title.toUpperCase()}\n\nDepartment: ${sop.department}\nVersion: v${sop.version}\nLast Updated: ${sop.updatedAt}\n\nDESCRIPTION\n${sop.description}\n\nSTEPS\n${sop.steps}\n`;

  const generateHTML = (sop: SOP) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sop.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px; }
        h2 { color: #424242; margin-top: 30px; }
        .meta { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .meta span { font-weight: bold; }
        .steps { background: #fff; padding: 20px; border-left: 4px solid #1976d2; }
    </style>
</head>
<body>
    <h1>${sop.title}</h1>
    <div class="meta">
        <span>Department:</span> ${sop.department}<br>
        <span>Version:</span> v${sop.version}<br>
        <span>Last Updated:</span> ${sop.updatedAt}
    </div>
    <h2>Description</h2>
    <p>${sop.description}</p>
    <h2>Steps</h2>
    <div class="steps">
        ${sop.steps.split('\n').map(step => `<p>${step}</p>`).join('')}
    </div>
</body>
</html>`;

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

  const downloadPlainText = (sop: SOP) => {
    const text = generatePlainText(sop);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sop.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadHTML = (sop: SOP) => {
    const html = generateHTML(sop);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sop.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = (sop: SOP) => {
    // Create a formatted document for PDF-like download
    const content = generatePlainText(sop);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sop.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_PDF.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMenuOpen = (event: React.MouseEvent<HTMLElement>, sop: SOP | null) => {
    setDownloadMenu({ anchorEl: event.currentTarget, sop });
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenu({ anchorEl: null, sop: null });
  };

  const handleDownload = (format: string, sop: SOP | null) => {
    if (sop) {
      // Single SOP download
      switch (format) {
        case 'markdown':
          downloadMarkdown(sop);
          break;
        case 'plaintext':
          downloadPlainText(sop);
          break;
        case 'html':
          downloadHTML(sop);
          break;
        case 'pdf':
          downloadPDF(sop);
          break;
        default:
          break;
      }
    } else {
      // Bulk download all SOPs
      switch (format) {
        case 'markdown':
          downloadAllSOPsMarkdown();
          break;
        case 'plaintext':
          downloadAllSOPsPlainText();
          break;
        case 'html':
          downloadAllSOPsHTML();
          break;
        case 'pdf':
          downloadAllSOPsPDF();
          break;
        default:
          break;
      }
    }
    handleDownloadMenuClose();
  };

  const downloadAllSOPsMarkdown = () => {
    const allContent = sops.map(sop => generateMarkdown(sop)).join('\n\n---\n\n');
    const blob = new Blob([allContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_sops_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllSOPsPlainText = () => {
    const allContent = sops.map(sop => generatePlainText(sop)).join('\n\n' + '='.repeat(50) + '\n\n');
    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_sops_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllSOPsHTML = () => {
    const allContent = sops.map(sop => generateHTML(sop)).join('\n\n<hr>\n\n');
    const blob = new Blob([allContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_sops_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllSOPsPDF = () => {
    const allContent = sops.map(sop => generatePlainText(sop)).join('\n\n' + '='.repeat(50) + '\n\n');
    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_sops_${new Date().toISOString().split('T')[0]}_PDF.txt`;
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
      links: sop.links.length > 0 ? [...sop.links] : [''], // Initialize links properly
    });
  };
  const handleEditClose = () => {
    setEditSOP(null);
    setEditForm({ title: '', department: '', description: '', steps: '', links: [''] });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditLinkChange = (idx: number, value: string) => {
    const newLinks = [...editForm.links];
    newLinks[idx] = value;
    setEditForm({ ...editForm, links: newLinks });
  };
  const handleEditAddLink = () => {
    setEditForm({ ...editForm, links: [...editForm.links, ''] });
  };
  const handleEditRemoveLink = (idx: number) => {
    const newLinks = editForm.links.filter((_, i) => i !== idx);
    setEditForm({ ...editForm, links: newLinks });
  };
  const handleEditSave = () => {
    if (!editSOP) return;
    // Validate links
    const validLinks = editForm.links.filter(link => link.trim() !== '' && /^https?:\/\//.test(link));
    const newSOPs = sops.map((sop) =>
      sop.id === editSOP.id
        ? {
            ...sop,
            ...editForm,
            links: validLinks,
            version: sop.version + 1,
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : sop
    );
    setSOPs(newSOPs);
    saveSOPsToStorage(newSOPs);
    handleEditClose();
  };

  const handleDeleteOpen = (sop: SOP) => {
    setDeleteSOP(sop);
  };

  const handleDeleteClose = () => {
    setDeleteSOP(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteSOP) return;
    const newSOPs = sops.filter((sop) => sop.id !== deleteSOP.id);
    setSOPs(newSOPs);
    saveSOPsToStorage(newSOPs);
    handleDeleteClose();
  };

  const isSuperAdmin = userRole === 'superadmin';
  
  // Debug logging
  console.log('SOPManagement - userRole:', userRole);
  console.log('SOPManagement - isSuperAdmin:', isSuperAdmin);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Grid container spacing={3}>
        <Grid xs={12} sx={{ maxWidth: 900, mx: 'auto' }}>
          <Paper elevation={4} sx={{ p: 3, background: 'linear-gradient(120deg, #fffbe7 0%, #e3f0ff 100%)', mb: 3 }}>
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
                <li>Download SOPs in multiple formats (Markdown, Text, HTML)</li>
                <li>Bulk download all SOPs at once</li>
              </ul>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12} sx={{ maxWidth: 900, mx: 'auto' }}>
          <Paper elevation={4} sx={{ p: 3, mb: 3, background: 'linear-gradient(90deg, #e3ffe8 0%, #eaf6ff 100%)' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                Standard Operating Procedures
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownloadMenuOpen({ currentTarget: document.body } as any, null)}
                  sx={{ borderRadius: 3, fontWeight: 600 }}
                >
                  Download All
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpen}
                  sx={{ borderRadius: 3, fontWeight: 600, boxShadow: 2 }}
                >
                  Create SOP
                </Button>
              </Stack>
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
                        <Tooltip title="Download SOP">
                          <span>
                            <IconButton 
                              onClick={(e) => handleDownloadMenuOpen(e, sop)} 
                              color="primary"
                            >
                              <DownloadIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {/* Temporarily show delete for all users for testing */}
                        <Tooltip title="Delete SOP">
                          <span>
                            <IconButton onClick={() => handleDeleteOpen(sop)} color="error">
                              <DeleteIcon />
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
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Links (URLs)</Typography>
          {form.links.map((link, idx) => {
            const isValidUrl = !!link && /^https?:\/\//.test(link);
            return (
              <Box key={idx} display="flex" alignItems="center" mb={1}>
                <TextField
                  label={`Link #${idx + 1}`}
                  value={link}
                  onChange={e => handleLinkChange(idx, e.target.value)}
                  fullWidth
                  margin="dense"
                  type="url"
                  placeholder="https://example.com"
                  error={!!link && !isValidUrl}
                  helperText={!!link && !isValidUrl ? 'Enter a valid URL' : ''}
                />
                <IconButton onClick={() => handleRemoveLink(idx)} disabled={form.links.length === 1}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
          <Button onClick={handleAddLink} size="small" startIcon={<AddIcon />} sx={{ mb: 2 }}>
            Add Link
          </Button>
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
                {viewSOP.links && viewSOP.links.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>Links</Typography>
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      {viewSOP.links.map((link, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              color: '#1976d2',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              wordBreak: 'break-all'
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.color = '#1565c0';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.color = '#1976d2';
                            }}
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
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
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Links (URLs)</Typography>
          {editForm.links.map((link, idx) => {
            const isValidUrl = !!link && /^https?:\/\//.test(link);
            return (
              <Box key={idx} display="flex" alignItems="center" mb={1}>
                <TextField
                  label={`Link #${idx + 1}`}
                  value={link}
                  onChange={e => handleEditLinkChange(idx, e.target.value)}
                  fullWidth
                  margin="dense"
                  type="url"
                  placeholder="https://example.com"
                  error={!!link && !isValidUrl}
                  helperText={!!link && !isValidUrl ? 'Enter a valid URL' : ''}
                />
                <IconButton onClick={() => handleEditRemoveLink(idx)} disabled={editForm.links.length === 1}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
          <Button onClick={handleEditAddLink} size="small" startIcon={<AddIcon />} sx={{ mb: 2 }}>
            Add Link
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete SOP Dialog */}
      <Dialog open={!!deleteSOP} onClose={handleDeleteClose} fullWidth maxWidth="sm">
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete SOP "{deleteSOP?.title}"? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Download Menu */}
      <Menu
        anchorEl={downloadMenu.anchorEl}
        open={Boolean(downloadMenu.anchorEl)}
        onClose={handleDownloadMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {downloadMenu.sop ? (
          // Single SOP download options
          <>
            <MenuItem onClick={() => handleDownload('markdown', downloadMenu.sop)}>
              <DownloadIcon sx={{ mr: 1 }} />
              Download as Markdown (.md)
            </MenuItem>
            <MenuItem onClick={() => handleDownload('plaintext', downloadMenu.sop)}>
              <DownloadIcon sx={{ mr: 1 }} />
              Download as Plain Text (.txt)
            </MenuItem>
            <MenuItem onClick={() => handleDownload('html', downloadMenu.sop)}>
              <DownloadIcon sx={{ mr: 1 }} />
              Download as HTML (.html)
            </MenuItem>
            <MenuItem onClick={() => handleDownload('pdf', downloadMenu.sop)}>
              <DownloadIcon sx={{ mr: 1 }} />
              Download as Formatted Text (.txt)
            </MenuItem>
          </>
        ) : (
          // Bulk download all SOPs options
          <>
            <MenuItem onClick={() => handleDownload('markdown', null)}>
              <DownloadIcon sx={{ mr: 1 }} />
              Download All as Markdown (.md)
            </MenuItem>
            <MenuItem onClick={() => handleDownload('plaintext', null)}>
              <DownloadIcon sx={{ mr: 1 }} />
              Download All as Plain Text (.txt)
            </MenuItem>
            <MenuItem onClick={() => handleDownload('html', null)}>
              <DownloadIcon sx={{ mr: 1 }} />
              Download All as HTML (.html)
            </MenuItem>
            <MenuItem onClick={() => handleDownload('pdf', null)}>
              <DownloadIcon sx={{ mr: 1 }} />
              Download All as Formatted Text (.txt)
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
} 