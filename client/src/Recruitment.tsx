import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';

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
  fileData?: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    content: string; // Base64 encoded content
  };
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


  const handleFileUpload = async (candidateName: string, checkIdx: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Validate file type (common document types)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, image, or document file');
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          content: content
        };

        setStandby(prev => prev.map(candidate => {
          if (candidate.name === candidateName) {
            const updatedChecks = [...candidate.checks];
            updatedChecks[checkIdx] = {
              ...updatedChecks[checkIdx],
              file: file.name,
              fileData: fileData,
              status: 'Passed'
            };
            return { ...candidate, checks: updatedChecks };
          }
          return candidate;
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  const handleFileDownload = (candidateName: string, checkIdx: number) => {
    const candidate = standby.find(c => c.name === candidateName);
    if (!candidate || !candidate.checks[checkIdx].fileData) return;

    const fileData = candidate.checks[checkIdx].fileData;
    if (!fileData) return;
    
    const byteCharacters = atob(fileData.content.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileData.type });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileRemove = (candidateName: string, checkIdx: number) => {
    setStandby(prev => prev.map(candidate => {
      if (candidate.name === candidateName) {
        const updatedChecks = [...candidate.checks];
        updatedChecks[checkIdx] = {
          ...updatedChecks[checkIdx],
          file: '',
          fileData: undefined,
          status: 'Pending'
        };
        return { ...candidate, checks: updatedChecks };
      }
      return candidate;
    }));
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

  const generateOfferLetter = (candidate: Candidate) => {
    const template = editableOfferLetter;
    return `Dear ${candidate.name},

We are pleased to offer you the position of ${candidate.role} at ${template.companyName}.

${template.companyName}
${template.companyAddress}

Position: ${candidate.role}
Start Date: ${template.startDate}
Location: ${template.location}
Employment Type: ${template.employmentType}
Salary: ${template.salary}

Please respond by: ${template.responseDeadline}

${template.additionalTerms}

We look forward to welcoming you to our team.

Best regards,
${template.hrManager}
HR Manager`;
  };

  const handleTemplateSubmit = () => {
    if (selectedCandidate && template) {
      // Validate email address before sending
      const candidateEmail = selectedCandidate.email;
      if (candidateEmail && candidateEmail.trim() !== '') {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(candidateEmail)) {
          console.log(`E-signature offer letter sent to ${candidateEmail}`);
          // Here you would typically integrate with your email service
          // For now, we'll show a success message with the email address
          setTemplateSubmitted(true);
          
          // Reset template selection
          setTemplate('');
          
          // Show success message
          setTimeout(() => {
            setTemplateSubmitted(false);
          }, 5000);
        } else {
          console.error('Invalid email format:', candidateEmail);
          alert(`Invalid email format: ${candidateEmail}. Please update the candidate's email address.`);
        }
      } else {
        console.error('No valid email address found for candidate');
        alert('No valid email address found for this candidate. Please add an email address before sending the offer letter.');
      }
    }
    setTemplateDialog(false);
  };

  const handleEditOfferLetter = () => {
    if (selectedCandidate) {
      setEditableOfferLetter(prev => ({
        ...prev,
        position: selectedCandidate.role
      }));
      setOfferLetterEdit(true);
    }
  };

  const handleSaveOfferLetter = () => {
    setOfferLetterEdit(false);
    // Template is automatically updated through state
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

  const handleEditStaff = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setNewStaff({
      name: candidate.name,
      role: candidate.role,
      status: candidate.status,
      readiness: candidate.readiness,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address
    });
    setEditStaffDialog(true);
  };

  const handleUpdateStaff = () => {
    if (validateForm() && editingCandidate) {
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
      setEditStaffDialog(false);
      setEditingCandidate(null);
    }
  };

  const handleCloseAddStaffDialog = () => {
    setAddStaffDialog(false);
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

  const handleCloseEditStaffDialog = () => {
    setEditStaffDialog(false);
    setEditingCandidate(null);
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

  const validateForm = (): boolean => {
    const errors = {
      name: validateField('name', newStaff.name),
      role: validateField('role', newStaff.role),
      email: validateField('email', newStaff.email),
      phone: validateField('phone', newStaff.phone),
      address: validateField('address', newStaff.address),
    };
    
    setValidationErrors(errors);
    
    return Object.values(errors).every(error => error === '');
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

  const handleEditableOfferLetterChange = (field: string, value: string) => {
    setEditableOfferLetter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update selectedCandidate when standby changes
  useEffect(() => {
    if (selectedCandidate) {
      const updated = standby.find(c => c.name === selectedCandidate.name);
      setSelectedCandidate(updated || null);
    }
  }, [standby]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h3" fontWeight={800} color="primary.main" mb={3}>
        Recruitment Management
      </Typography>

      {/* Success Alert */}
      {templateSubmitted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          E-signature offer letter has been sent successfully!
        </Alert>
      )}

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
          
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
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
                    onClick={() => setSelectedCandidate(c)}
                    sx={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedCandidate?.name === c.name ? 'action.selected' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                          }}
                        >
                          {c.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </Box>
                        <Typography variant="body1" fontWeight={600}>
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
                        color={c.readiness === 'Ready' ? 'success' : 'warning'}
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
                        >
                          <EditIcon />
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
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <VerifiedUserIcon color="primary" fontSize="large" />
                <Typography variant="h5" fontWeight={600} color="primary.main">
                  Recruitment Workflow
                </Typography>
              </Stack>
              
              <Stepper activeStep={selectedCandidate.recruitmentStage} alternativeLabel>
                {recruitmentSteps.map((step) => (
                  <Step key={step}>
                    <StepLabel>{step}</StepLabel>
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

          {/* Background Checks - Full width */}
          <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #fff3e0 0%, #fff8e1 100%)' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <VerifiedUserIcon color="warning" fontSize="large" />
                <Typography variant="h5" fontWeight={600} color="warning.main">
                  Background & Verification Checks
                </Typography>
              </Stack>
              
              <Stack spacing={3}>
                {selectedCandidate.checks.map((check, idx) => (
                  <Box key={idx} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fafafa' }}>
                    {/* Check Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {check.label}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant={check.status === 'Pending' ? 'contained' : 'outlined'}
                          color="inherit"
                          onClick={() => handleCheckStatus(selectedCandidate.name, idx, 'Pending')}
                        >
                          Pending
                        </Button>
                        <Button
                          size="small"
                          variant={check.status === 'Passed' ? 'contained' : 'outlined'}
                          color="success"
                          startIcon={<VerifiedUserIcon />}
                          onClick={() => handleCheckStatus(selectedCandidate.name, idx, 'Passed')}
                        >
                          Passed
                        </Button>
                        <Button
                          size="small"
                          variant={check.status === 'Failed' ? 'contained' : 'outlined'}
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleCheckStatus(selectedCandidate.name, idx, 'Failed')}
                        >
                          Failed
                        </Button>
                      </Box>
                    </Box>

                    {/* File Upload Section */}
                    <Box sx={{ mt: 2 }}>
                      {check.fileData ? (
                        /* File Display */
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1, border: '1px solid #4caf50' }}>
                          <AttachFileIcon color="success" />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {check.fileData.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(check.fileData.size / 1024).toFixed(1)} KB • {new Date(check.fileData.lastModified).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Tooltip title="Download File">
                            <IconButton
                              size="small"
                              onClick={() => handleFileDownload(selectedCandidate.name, idx)}
                              color="primary"
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove File">
                            <IconButton
                              size="small"
                              onClick={() => handleFileRemove(selectedCandidate.name, idx)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        /* File Upload */
                        <Box sx={{ p: 2, border: '2px dashed #ccc', borderRadius: 1, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                          <input
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                            style={{ display: 'none' }}
                            id={`file-upload-${idx}`}
                            type="file"
                            onChange={(e) => handleFileUpload(selectedCandidate.name, idx, e)}
                          />
                          <label htmlFor={`file-upload-${idx}`}>
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                              sx={{ mb: 1 }}
                            >
                              Upload Document
                            </Button>
                          </label>
                          <Typography variant="caption" color="text.secondary" display="block">
                            PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Signature Templates - Full width */}
          <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #f3e5f5 0%, #fce4ec 100%)' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <SendIcon color="secondary" fontSize="large" />
                <Typography variant="h5" fontWeight={600} color="secondary.main">
                  E-Signature Templates
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl sx={{ minWidth: 200 }}>
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
                  variant="outlined"
                  startIcon={<SendIcon />}
                  onClick={() => setOfferLetterPreview(true)}
                  disabled={!template}
                  sx={{ borderRadius: 3, fontWeight: 600 }}
                >
                  Preview Offer Letter
                </Button>
                
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SendIcon />}
                  onClick={() => setTemplateDialog(true)}
                  disabled={!template || !selectedCandidate.email || selectedCandidate.email.trim() === ''}
                  sx={{ borderRadius: 3, fontWeight: 600 }}
                >
                  Send for E-Signature
                </Button>
              </Stack>
              
              {!selectedCandidate.email || selectedCandidate.email.trim() === '' ? (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  Email address required to send offer letter
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Offer letter will be sent to: {selectedCandidate.email}
                </Typography>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Signature Template Dialog */}
      <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Send for E-Signature</DialogTitle>
        <DialogContent>
          <Typography>
            Document "{template}" will be generated and sent to the candidate for e-signature!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog(false)}>Cancel</Button>
          <Button onClick={handleTemplateSubmit} variant="contained" color="secondary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Offer Letter Preview Dialog */}
      <Dialog open={offerLetterPreview} onClose={() => setOfferLetterPreview(false)} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Offer Letter Preview</Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditOfferLetter}
              size="small"
            >
              Edit Template
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            p: 2, 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            backgroundColor: '#fafafa',
            fontFamily: 'monospace',
            whiteSpace: 'pre-line'
          }}>
            {selectedCandidate && generateOfferLetter(selectedCandidate)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferLetterPreview(false)}>Close</Button>
          <Button 
            onClick={() => {
              setOfferLetterPreview(false);
              setTemplateDialog(true);
            }} 
            variant="contained" 
            color="secondary"
            disabled={!selectedCandidate?.email || selectedCandidate.email.trim() === ''}
          >
            Send for E-Signature
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Offer Letter Template Dialog */}
      <Dialog open={offerLetterEdit} onClose={() => setOfferLetterEdit(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Offer Letter Template</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Company Name"
              value={editableOfferLetter.companyName}
              onChange={(e) => handleEditableOfferLetterChange('companyName', e.target.value)}
              fullWidth
            />
            <TextField
              label="Company Address"
              value={editableOfferLetter.companyAddress}
              onChange={(e) => handleEditableOfferLetterChange('companyAddress', e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="HR Manager Name"
              value={editableOfferLetter.hrManager}
              onChange={(e) => handleEditableOfferLetterChange('hrManager', e.target.value)}
              fullWidth
            />
            <TextField
              label="Start Date"
              value={editableOfferLetter.startDate}
              onChange={(e) => handleEditableOfferLetterChange('startDate', e.target.value)}
              fullWidth
            />
            <TextField
              label="Location"
              value={editableOfferLetter.location}
              onChange={(e) => handleEditableOfferLetterChange('location', e.target.value)}
              fullWidth
            />
            <TextField
              label="Employment Type"
              value={editableOfferLetter.employmentType}
              onChange={(e) => handleEditableOfferLetterChange('employmentType', e.target.value)}
              fullWidth
            />
            <TextField
              label="Salary"
              value={editableOfferLetter.salary}
              onChange={(e) => handleEditableOfferLetterChange('salary', e.target.value)}
              fullWidth
            />
            <TextField
              label="Response Deadline"
              value={editableOfferLetter.responseDeadline}
              onChange={(e) => handleEditableOfferLetterChange('responseDeadline', e.target.value)}
              fullWidth
            />
            <TextField
              label="Additional Terms"
              value={editableOfferLetter.additionalTerms}
              onChange={(e) => handleEditableOfferLetterChange('additionalTerms', e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferLetterEdit(false)}>Cancel</Button>
          <Button onClick={handleSaveOfferLetter} variant="contained" color="primary">
            Save Template
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
              label="Email"
              value={newStaff.email}
              onChange={(e) => handleNewStaffChange('email', e.target.value)}
              fullWidth
              type="email"
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <TextField
              label="Phone Number"
              value={newStaff.phone}
              onChange={(e) => handleNewStaffChange('phone', e.target.value)}
              fullWidth
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
            Add Team Member
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
              label="Email"
              value={newStaff.email}
              onChange={(e) => handleNewStaffChange('email', e.target.value)}
              fullWidth
              type="email"
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <TextField
              label="Phone Number"
              value={newStaff.phone}
              onChange={(e) => handleNewStaffChange('phone', e.target.value)}
              fullWidth
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
