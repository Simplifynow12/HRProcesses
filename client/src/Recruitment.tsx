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
  email: string;
  phone: string;
  address: string;
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

const signatureTemplates = [
  'Offer',
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
    email: 'alice.johnson@example.com',
    phone: '+44 7700 900123',
    address: '123 High Street, London, SW1A 1AA',
  },
  {
    name: 'Brian Lee',
    role: 'Finance Assistant',
    status: 'Available',
    readiness: 'Pending',
    avatar: '',
    recruitmentStage: 0,
    checks: createInitialChecks(),
    email: 'brian.lee@example.com',
    phone: '+44 7700 900456',
    address: '456 Park Lane, Manchester, M1 1AA',
  },
  {
    name: 'Sophie Patel',
    role: 'HR Assistant',
    status: 'Unavailable',
    readiness: 'Ready',
    avatar: '',
    recruitmentStage: 0,
    checks: createInitialChecks(),
    email: 'sophie.patel@example.com',
    phone: '+44 7700 900789',
    address: '789 Queen Street, Birmingham, B1 1AA',
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
  const [offerLetterPreview, setOfferLetterPreview] = useState(false);
  const [offerLetterEdit, setOfferLetterEdit] = useState(false);
  const [editableOfferLetter, setEditableOfferLetter] = useState({
    companyName: 'Your Organisation Name',
    companyAddress: '123 Business Street, City, Postcode',
    hrManager: 'HR Manager Name',
    position: '',
    startDate: 'To be confirmed upon completion of all checks',
    location: 'To be discussed',
    employmentType: 'Full-time',
    salary: 'To be discussed',
    responseDeadline: '7 business days',
    additionalTerms: 'This offer is contingent upon the successful completion of all pre-employment requirements, including background checks, employment references, and address verification.'
  });
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

  const handlePreviousStage = (candidateName: string) => {
    setStandby(prev => prev.map(candidate => {
      if (candidate.name === candidateName) {
        return {
          ...candidate,
          recruitmentStage: candidate.recruitmentStage > 0 
            ? candidate.recruitmentStage - 1 
            : recruitmentSteps.length - 1
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

  const generateOfferLetter = () => {
    if (!selectedCandidate) return '';
    
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const position = editableOfferLetter.position || selectedCandidate.role;
    
    return `${editableOfferLetter.companyName}
${editableOfferLetter.companyAddress}

Date: ${currentDate}

Dear ${selectedCandidate.name},

We are pleased to offer you the position of ${position} at ${editableOfferLetter.companyName}.

${editableOfferLetter.additionalTerms}

Key Details:
• Position: ${position}
• Start Date: ${editableOfferLetter.startDate}
• Location: ${editableOfferLetter.location}
• Employment Type: ${editableOfferLetter.employmentType}
• Salary: ${editableOfferLetter.salary}

Please review this offer carefully. If you accept this offer, please respond within ${editableOfferLetter.responseDeadline}.

We look forward to welcoming you to our team.

Best regards,
${editableOfferLetter.hrManager}
HR Manager

Reference: ${selectedCandidate.name.replace(/\s+/g, '').toUpperCase()}-${Date.now().toString().slice(-6)}

---
E-Signature Required Below
Please sign this document electronically to accept the offer.

Candidate Signature: _________________
Date: _________________

HR Manager Signature: _________________
Date: _________________`;
  };

  const handleTemplateSubmit = () => {
    if (selectedCandidate && template) {
      console.log(`E-signature offer letter sent to ${selectedCandidate.email || 'candidate'}`);
      setTemplateSubmitted(true);
      setTemplate('');
      setTimeout(() => {
        setTemplateSubmitted(false);
      }, 5000);
    }
    setTemplateDialog(false);
  };

  const handleEditOfferLetter = () => {
    // Pre-populate position with candidate's role
    setEditableOfferLetter(prev => ({
      ...prev,
      position: selectedCandidate?.role || ''
    }));
    setOfferLetterEdit(true);
  };

  const handleSaveOfferLetter = () => {
    setOfferLetterEdit(false);
    // Template is automatically updated through state
  };

  const hasValidEmail = (candidate: Candidate): boolean => {
    return true; // Always return true to bypass email validation
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
      
      setStandby(prev => [...prev, newCandidate]);
      
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
      setStandby(prev => prev.map(candidate => {
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
      }));
      
      // Update selected candidate if it's the one being edited
      if (selectedCandidate?.name === editingCandidate.name) {
        setSelectedCandidate({
          ...selectedCandidate,
          name: newStaff.name.trim(),
          role: newStaff.role.trim(),
          status: newStaff.status,
          readiness: newStaff.readiness,
          email: newStaff.email.trim(),
          phone: newStaff.phone.trim(),
          address: newStaff.address.trim(),
        });
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

  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Box width="100%" maxWidth={900} mx={3}>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={3}>
          Recruitment Dashboard
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Team Member - always full width */}
          <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #e3ffe8 0%, #eaf6ff 100%)', width: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <GroupAddIcon color="success" fontSize="large" />
                  <Typography variant="h5" fontWeight={600} color="success.main">
                                         Team Member
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

                     

           {/* Selected candidate section */}
           {selectedCandidate && (
            <>
              {/* Selected candidate header */}
              <Typography variant="h4" fontWeight={800} color="primary.main">
                Selected: {selectedCandidate.name}
              </Typography>
              
              {/* Contact Information */}
              <Card elevation={2} sx={{ background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                <CardContent>
                  <Stack direction="row" spacing={4} flexWrap="wrap">
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography variant="body2">{selectedCandidate.email || 'Not provided'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Phone</Typography>
                      <Typography variant="body2">{selectedCandidate.phone || 'Not provided'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="caption" color="text.secondary">Address</Typography>
                      <Typography variant="body2">{selectedCandidate.address || 'Not provided'}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handlePreviousStage(selectedCandidate.name)}
                      disabled={selectedCandidate.recruitmentStage === 0}
                    >
                      Previous Stage
                    </Button>
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
                          {signatureTemplates.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={!template}
                        onClick={() => setOfferLetterPreview(true)}
                        startIcon={<CheckCircleIcon />}
                        fullWidth
                      >
                        Preview & Generate Document
                      </Button>

                      {templateSubmitted && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                          E-signature offer letter sent to {selectedCandidate?.email || 'candidate email'}! The candidate can now electronically sign the document.
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
        <DialogTitle>Send E-Signature Offer Letter</DialogTitle>
        <DialogContent>
          <Typography>
            The e-signature offer letter will be sent to <strong>{selectedCandidate?.email || 'candidate'}</strong> for the position of <strong>{selectedCandidate?.role}</strong>.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            This will send the offer letter with e-signature fields directly to the candidate's email address.
          </Alert>
          <Alert severity="warning" sx={{ mt: 1 }}>
            The candidate will be able to electronically sign the document to accept the offer.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog(false)}>Cancel</Button>
                      <Button 
              onClick={handleTemplateSubmit} 
              variant="contained" 
              color="secondary"
            >
              Send E-Signature Offer Letter
            </Button>
        </DialogActions>
      </Dialog>

      {/* Offer Letter Preview Dialog */}
      <Dialog 
        open={offerLetterPreview} 
        onClose={() => setOfferLetterPreview(false)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: { minHeight: '70vh' }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Offer Letter Preview</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                onClick={handleEditOfferLetter}
                startIcon={<AssignmentIndIcon />}
              >
                Edit Template
              </Button>
              <Typography variant="caption" color="text.secondary">
                {selectedCandidate?.name} - {selectedCandidate?.role}
              </Typography>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            p: 3, 
            backgroundColor: '#fafafa',
            fontFamily: 'serif',
            fontSize: '14px',
            lineHeight: 1.6,
            whiteSpace: 'pre-line'
          }}>
            {generateOfferLetter()}
          </Box>
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Recipient:</strong> {selectedCandidate?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Generated:</strong> {new Date().toLocaleString('en-GB')}
            </Typography>
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferLetterPreview(false)}>
            Cancel
          </Button>
                     <Button 
             onClick={() => {
               setOfferLetterPreview(false);
               setTemplateDialog(true);
             }} 
             variant="contained" 
             color="secondary"
           >
             Send Offer Letter
           </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Offer Letter Template Dialog */}
      <Dialog 
        open={offerLetterEdit} 
        onClose={() => setOfferLetterEdit(false)} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>Edit Offer Letter Template</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Company Name"
                value={editableOfferLetter.companyName}
                onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, companyName: e.target.value }))}
                fullWidth
              />
              <TextField
                label="HR Manager Name"
                value={editableOfferLetter.hrManager}
                onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, hrManager: e.target.value }))}
                fullWidth
              />
            </Box>
            
            <TextField
              label="Company Address"
              value={editableOfferLetter.companyAddress}
              onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, companyAddress: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Position"
                value={editableOfferLetter.position}
                onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, position: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Start Date"
                value={editableOfferLetter.startDate}
                onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, startDate: e.target.value }))}
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Location"
                value={editableOfferLetter.companyAddress}
                onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, location: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Employment Type"
                value={editableOfferLetter.employmentType}
                onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, employmentType: e.target.value }))}
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Salary"
                value={editableOfferLetter.salary}
                onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, salary: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Response Deadline"
                value={editableOfferLetter.responseDeadline}
                onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, responseDeadline: e.target.value }))}
                fullWidth
              />
            </Box>

            <TextField
              label="Additional Terms & Conditions"
              value={editableOfferLetter.additionalTerms}
              onChange={(e) => setEditableOfferLetter(prev => ({ ...prev, additionalTerms: e.target.value }))}
              fullWidth
              multiline
              rows={4}
              helperText="Customize the terms and conditions for this offer"
            />

            <Alert severity="info">
              Changes made here will be reflected in the offer letter preview above.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferLetterEdit(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveOfferLetter} 
            variant="contained" 
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}
