import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Chip,
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
  Alert,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CancelIcon from '@mui/icons-material/Cancel';

interface Candidate {
  name: string;
  role: string;
  status: string;
  readiness: string;
  avatar: string;
  recruitmentStage: number;
  checks: Check[];
}

interface Check {
  label: string;
  status: 'Pending' | 'Passed' | 'Failed';
  file: string;
}

const recruitmentSteps = [
  'Job Requisition',
  'Posting',
  'Shortlisting',
  'Interviewing',
  'Background Checks',
  'Selection',
  'Offer',
  'Onboarding',
];

const createInitialChecks = (): Check[] => [
  { label: 'DBS/Background Check', status: 'Pending' as const, file: '' },
  { label: 'Employment References', status: 'Pending' as const, file: '' },
  { label: 'Home Address Verification', status: 'Pending' as const, file: '' },
];

const initialCandidates: Candidate[] = [
  {
    name: 'Alice Johnson',
    role: 'Support Staff',
    status: 'Available',
    readiness: 'Ready',
    avatar: '',
    recruitmentStage: 0,
    checks: createInitialChecks(),
  },
  {
    name: 'Brian Lee',
    role: 'Finance Assistant',
    status: 'Available',
    readiness: 'Pending',
    avatar: '',
    recruitmentStage: 0,
    checks: createInitialChecks(),
  },
  {
    name: 'Sophie Patel',
    role: 'HR Assistant',
    status: 'Unavailable',
    readiness: 'Ready',
    avatar: '',
    recruitmentStage: 0,
    checks: createInitialChecks(),
  },
];

const STORAGE_KEY = 'recruitment_data';

export default function Recruitment() {
  // Load saved data or use initial data
  const [standby, setStandby] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialCandidates;
  });
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [uploadDialog, setUploadDialog] = useState({ open: false, idx: -1 });
  const [uploadFile, setUploadFile] = useState('');
  const [template, setTemplate] = useState('');
  const [templateDialog, setTemplateDialog] = useState(false);
  const [templateSubmitted, setTemplateSubmitted] = useState(false);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(standby));
  }, [standby]);

  const handleCheckStatus = (candidateName: string, checkIdx: number, status: 'Pending' | 'Passed' | 'Failed') => {
    setStandby(prev => prev.map(candidate => {
      if (candidate.name === candidateName) {
        const updatedChecks = [...candidate.checks];
        updatedChecks[checkIdx] = { ...updatedChecks[checkIdx], status };
        return { ...candidate, checks: updatedChecks };
      }
      return candidate;
    }));
  };

  const handleUpload = () => {
    if (uploadDialog.idx >= 0 && selectedCandidate) {
      setStandby(prev => prev.map(candidate => {
        if (candidate.name === selectedCandidate.name) {
          const updatedChecks = [...candidate.checks];
          updatedChecks[uploadDialog.idx] = {
            ...updatedChecks[uploadDialog.idx],
            file: uploadFile,
            status: 'Passed'
          };
          return { ...candidate, checks: updatedChecks };
        }
        return candidate;
      }));
    }
    setUploadDialog({ open: false, idx: -1 });
    setUploadFile('');
  };

  const handleNextStage = (candidateName: string) => {
    setStandby(prev => prev.map(candidate => {
      if (candidate.name === candidateName) {
        return {
          ...candidate,
          recruitmentStage: candidate.recruitmentStage < recruitmentSteps.length - 1 
            ? candidate.recruitmentStage + 1 
            : 0
        };
      }
      return candidate;
    }));
  };

  // Update selectedCandidate when standby changes
  useEffect(() => {
    if (selectedCandidate) {
      const updated = standby.find(c => c.name === selectedCandidate.name);
      setSelectedCandidate(updated || null);
    }
  }, [standby]);

  const handleTemplateSubmit = () => {
    setTemplateDialog(false);
    setTemplateSubmitted(true);
  };

  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Box width="100%" maxWidth={900} mx={3}>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={3}>
          Recruitment Dashboard
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Standby Staff Pool - always full width */}
          <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #e3ffe8 0%, #eaf6ff 100%)', width: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <GroupAddIcon color="success" fontSize="large" />
                <Typography variant="h5" fontWeight={600} color="success.main">
                  Standby Staff Pool
                </Typography>
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
                      <TableCell>Status</TableCell>
                      <TableCell>Readiness</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {standby.map((c) => (
                      <TableRow
                        key={c.name}
                        hover
                        selected={selectedCandidate?.name === c.name}
                        onClick={() => setSelectedCandidate(c)}
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Selected candidate section */}
          {selectedCandidate && (
            <>
              {/* Selected candidate header */}
              <Typography variant="h4" fontWeight={800} color="primary.main">
                Selected: {selectedCandidate.name}
              </Typography>

              {/* Standard Recruitment Workflow - Full width */}
              <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #e3f0ff 0%, #eaf6ff 100%)' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <TimelineIcon color="primary" fontSize="large" />
                    <Typography variant="h5" fontWeight={600} color="primary.main">
                      Standard Recruitment Workflow
                    </Typography>
                  </Stack>
                  <Stepper 
                    activeStep={selectedCandidate.recruitmentStage} 
                    orientation="horizontal" 
                    alternativeLabel
                    sx={{ 
                      overflowX: 'auto',
                      '& .MuiStepLabel-label': {
                        mt: 1,
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    {recruitmentSteps.map((label, idx) => (
                      <Step key={label} completed={selectedCandidate.recruitmentStage > idx}>
                        <StepLabel onClick={() => handleNextStage(selectedCandidate.name)} style={{ cursor: 'pointer' }}>
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNextStage(selectedCandidate.name)}
                    >
                      Next Stage
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Background & Verification Checks and Signature Templates row */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Background & Verification Checks - Left 2/3 */}
                <Box sx={{ flex: 2 }}>
                  <Card elevation={4} sx={{ height: '100%', background: 'linear-gradient(90deg, #fffbe7 0%, #e3f0ff 100%)' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <VerifiedUserIcon color="secondary" fontSize="large" />
                        <Typography variant="h5" fontWeight={600} color="secondary.main">
                          Background & Verification Checks
                        </Typography>
                      </Stack>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Check</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Evidence</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedCandidate.checks.map((check, idx) => (
                              <TableRow key={check.label}>
                                <TableCell>{check.label}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={check.status}
                                    color={
                                      check.status === 'Passed'
                                        ? 'success'
                                        : check.status === 'Failed'
                                        ? 'error'
                                        : 'warning'
                                    }
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  {check.file ? (
                                    <Tooltip title="Download Evidence">
                                      <IconButton>
                                        <FileDownloadIcon color="primary" />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Typography variant="caption" color="text.secondary">
                                      No file
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Stack direction="row" spacing={1}>
                                    <Tooltip title="Upload Evidence">
                                      <IconButton 
                                        onClick={() => setUploadDialog({ open: true, idx })}
                                        disabled={check.status === 'Failed'}
                                      >
                                        <UploadFileIcon color={check.status === 'Failed' ? 'disabled' : 'info'} />
                                      </IconButton>
                                    </Tooltip>
                                    {check.status === 'Pending' && (
                                      <Tooltip title="Mark as Failed">
                                        <IconButton onClick={() => handleCheckStatus(selectedCandidate.name, idx, 'Failed')}>
                                          <CancelIcon color="error" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {check.status === 'Failed' && (
                                      <Tooltip title="Reset to Pending">
                                        <IconButton onClick={() => handleCheckStatus(selectedCandidate.name, idx, 'Pending')}>
                                          <TimelineIcon color="warning" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Box>

                {/* Signature Templates - Right 1/3 */}
                <Box sx={{ flex: 1 }}>
                  <Card elevation={4} sx={{ height: '100%', background: 'linear-gradient(90deg, #fffbe7 0%, #e3f0ff 100%)' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <AssignmentIndIcon color="secondary" fontSize="large" />
                        <Typography variant="h5" fontWeight={600} color="secondary.main">
                          Signature Templates
                        </Typography>
                      </Stack>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Template</InputLabel>
                        <Select
                          value={template}
                          label="Select Template"
                          onChange={(e) => setTemplate(e.target.value)}
                        >
                          {recruitmentSteps.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={!template}
                        onClick={() => setTemplateDialog(true)}
                        startIcon={<CheckCircleIcon />}
                        fullWidth
                      >
                        Generate Document
                      </Button>
                      {templateSubmitted && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                          Document generated and sent for e-signature!
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Upload Evidence Dialog */}
      <Dialog open={uploadDialog.open} onClose={() => setUploadDialog({ open: false, idx: -1 })} fullWidth maxWidth="xs">
        <DialogTitle>Upload Evidence</DialogTitle>
        <DialogContent>
          <TextField
            label="File Name (simulated)"
            value={uploadFile}
            onChange={(e) => setUploadFile(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog({ open: false, idx: -1 })}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" color="primary" disabled={!uploadFile.trim()}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Signature Template Dialog */}
      <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Send for E-Signature</DialogTitle>
        <DialogContent>
          <Typography>
            Document "{template}" will be generated and sent to the candidate for e-signature.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog(false)}>Cancel</Button>
          <Button onClick={handleTemplateSubmit} variant="contained" color="secondary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 