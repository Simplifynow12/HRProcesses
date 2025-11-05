import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import PolicyIcon from '@mui/icons-material/Policy';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const steps = [
  'Mission, Vision & Values',
  'Company Policies',
  'Job Description',
  'Onboarding Checklist',
  'Orientation Session',
  'Team Introduction',
  'Feedback Survey',
];

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const [acknowledged, setAcknowledged] = useState(Array(steps.length).fill(false));
  const [checklist, setChecklist] = useState([
    { label: 'Complete orientation', checked: false },
    { label: 'Review company policies', checked: false },
    { label: 'Meet your manager', checked: false },
    { label: 'Set up work tools', checked: false },
    { label: 'Submit required documents', checked: false },
  ]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleAcknowledge = (idx: number) => {
    const updated = [...acknowledged];
    updated[idx] = true;
    setAcknowledged(updated);
    if (idx < steps.length - 1) setActiveStep(idx + 1);
  };

  const handleChecklist = (idx: number) => {
    const updated = [...checklist];
    updated[idx].checked = !updated[idx].checked;
    setChecklist(updated);
  };

  const handleFeedbackSubmit = () => {
    setFeedbackOpen(false);
    setFeedbackSubmitted(true);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h4" fontWeight={700} color="primary.main" mb={3}>
        Onboarding Dashboard
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label, idx) => (
          <Step key={label} completed={acknowledged[idx]}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container spacing={3}>
        {activeStep === 0 && (
          <Grid xs={12}>
            <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #e3f0ff 0%, #f3ffe3 100%)' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <InfoIcon color="primary" fontSize="large" />
                  <Typography variant="h5" fontWeight={600} color="primary.main">
                    Mission, Vision & Core Values
                  </Typography>
                </Stack>
                <Typography variant="body1" mb={2}>
                  <strong>Mission:</strong> Empower people to do their best work.<br />
                  <strong>Vision:</strong> To be the most trusted and innovative HR team.<br />
                  <strong>Core Values:</strong> Integrity, Collaboration, Growth, Inclusion.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={acknowledged[0]}
                  onClick={() => handleAcknowledge(0)}
                  startIcon={<CheckCircleIcon />}
                >
                  {acknowledged[0] ? 'Acknowledged' : 'Acknowledge & Continue'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
        {activeStep === 1 && (
          <Grid xs={12}>
            <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #fffbe7 0%, #e3f0ff 100%)' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <PolicyIcon color="secondary" fontSize="large" />
                  <Typography variant="h5" fontWeight={600} color="secondary.main">
                    Company Policies
                  </Typography>
                </Stack>
                <Typography variant="body1" mb={2}>
                  Please review the following policies:
                </Typography>
                <Stack direction="row" spacing={2} mb={2}>
                  <Chip label="Code of Conduct" color="info" clickable />
                  <Chip label="Leave Policy" color="info" clickable />
                  <Chip label="IT Use" color="info" clickable />
                  <Chip label="DEI" color="info" clickable />
                </Stack>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={acknowledged[1]}
                  onClick={() => handleAcknowledge(1)}
                  startIcon={<CheckCircleIcon />}
                >
                  {acknowledged[1] ? 'Acknowledged' : 'Acknowledge & Continue'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
        {activeStep === 2 && (
          <Grid xs={12}>
            <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #ffe3f0 0%, #e3f0ff 100%)' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <AssignmentIndIcon color="success" fontSize="large" />
                  <Typography variant="h5" fontWeight={600} color="success.main">
                    Job Description
                  </Typography>
                </Stack>
                <Typography variant="body1" mb={2}>
                  <strong>Title:</strong> Software Engineer<br />
                  <strong>Responsibilities:</strong> Build and maintain HR systems, collaborate with teams, deliver high-quality code.<br />
                  <strong>KPIs:</strong> Project delivery, code quality, team feedback.<br />
                  <strong>Reporting to:</strong> Engineering Manager
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  disabled={acknowledged[2]}
                  onClick={() => handleAcknowledge(2)}
                  startIcon={<CheckCircleIcon />}
                >
                  {acknowledged[2] ? 'Acknowledged' : 'Acknowledge & Continue'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
        {activeStep === 3 && (
          <Grid xs={12}>
            <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #f0e3ff 0%, #ffe3f0 100%)' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <ListAltIcon color="info" fontSize="large" />
                  <Typography variant="h5" fontWeight={600} color="info.main">
                    Onboarding Checklist
                  </Typography>
                </Stack>
                <Typography variant="body1" mb={2}>
                  Track your onboarding progress:
                </Typography>
                <Stack spacing={1} mb={2}>
                  {checklist.map((item, idx) => (
                    <FormControlLabel
                      key={item.label}
                      control={<Checkbox checked={item.checked} onChange={() => handleChecklist(idx)} />}
                      label={item.label}
                    />
                  ))}
                </Stack>
                <Button
                  variant="contained"
                  color="info"
                  disabled={acknowledged[3] || !checklist.every((item) => item.checked)}
                  onClick={() => handleAcknowledge(3)}
                  startIcon={<CheckCircleIcon />}
                >
                  {acknowledged[3] ? 'Checklist Complete' : 'Mark Complete & Continue'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
        {activeStep === 4 && (
          <Grid xs={12}>
            <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #e3f0ff 0%, #f0e3ff 100%)' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <InfoIcon color="primary" fontSize="large" />
                  <Typography variant="h5" fontWeight={600} color="primary.main">
                    Welcome & Orientation Session
                  </Typography>
                </Stack>
                <Typography variant="body1" mb={2}>
                  You are scheduled for a welcome session with HR and an orientation covering company culture and tools. Please check your email for details.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={acknowledged[4]}
                  onClick={() => handleAcknowledge(4)}
                  startIcon={<CheckCircleIcon />}
                >
                  {acknowledged[4] ? 'Scheduled' : 'Acknowledge & Continue'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
        {activeStep === 5 && (
          <Grid xs={12}>
            <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #e3ffe8 0%, #eaf6ff 100%)' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <GroupIcon color="success" fontSize="large" />
                  <Typography variant="h5" fontWeight={600} color="success.main">
                    Meet Your Team
                  </Typography>
                </Stack>
                <Typography variant="body1" mb={2}>
                  You will be introduced to your manager and team members. Learn how your role fits within the team and contributes to company goals.
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  disabled={acknowledged[5]}
                  onClick={() => handleAcknowledge(5)}
                  startIcon={<CheckCircleIcon />}
                >
                  {acknowledged[5] ? 'Met Team' : 'Acknowledge & Continue'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
        {activeStep === 6 && (
          <Grid xs={12}>
            <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #fffbe7 0%, #e3f0ff 100%)' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <FeedbackIcon color="secondary" fontSize="large" />
                  <Typography variant="h5" fontWeight={600} color="secondary.main">
                    Feedback Survey
                  </Typography>
                </Stack>
                <Typography variant="body1" mb={2}>
                  Please complete a short survey about your onboarding experience.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setFeedbackOpen(true)}
                  startIcon={<FeedbackIcon />}
                  disabled={feedbackSubmitted}
                >
                  {feedbackSubmitted ? 'Feedback Submitted' : 'Complete Survey'}
                </Button>
                {feedbackSubmitted && <Alert severity="success" sx={{ mt: 2 }}>Thank you for your feedback!</Alert>}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Onboarding Feedback</DialogTitle>
        <DialogContent>
          <TextField
            label="How was your onboarding experience?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackOpen(false)}>Cancel</Button>
          <Button
            onClick={handleFeedbackSubmit}
            variant="contained"
            color="secondary"
            disabled={!feedback.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 