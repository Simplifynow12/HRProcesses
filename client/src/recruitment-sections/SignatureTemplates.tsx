import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

interface SignatureTemplatesProps {
  selectedCandidate: Candidate | null;
  onTemplateSubmit: (candidate: Candidate, template: string) => void;
}

const signatureTemplates = [
  'Offer',
];

export default function SignatureTemplates({ 
  selectedCandidate, 
  onTemplateSubmit 
}: SignatureTemplatesProps) {
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
      onTemplateSubmit(selectedCandidate, template);
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

  if (!selectedCandidate) {
    return (
      <Card elevation={4} sx={{ height: '100%', background: 'linear-gradient(90deg, #fffbe7 0%, #e3f0ff 100%)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <AssignmentIndIcon color="secondary" fontSize="large" />
            <Typography variant="h5" fontWeight={600} color="secondary.main">
              Signature Templates
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Please select a team member to view signature templates.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card elevation={4} sx={{ height: '100%', background: 'linear-gradient(90deg, #fffbe7 0%, #e3f0ff 100%)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <AssignmentIndIcon color="secondary" fontSize="large" />
            <Typography variant="h5" fontWeight={600} color="secondary.main">
              Signature Templates
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Candidate: <strong>{selectedCandidate.name}</strong> - {selectedCandidate.role}
          </Typography>
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
                value={editableOfferLetter.location}
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
    </>
  );
}
