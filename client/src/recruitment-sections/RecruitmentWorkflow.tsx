import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';

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

interface RecruitmentWorkflowProps {
  selectedCandidate: Candidate | null;
  onNextStage: (candidateName: string) => void;
  onPreviousStage: (candidateName: string) => void;
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

export default function RecruitmentWorkflow({ 
  selectedCandidate, 
  onNextStage, 
  onPreviousStage 
}: RecruitmentWorkflowProps) {
  if (!selectedCandidate) {
    return (
      <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #e3f0ff 0%, #eaf6ff 100%)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <TimelineIcon color="primary" fontSize="large" />
            <Typography variant="h5" fontWeight={600} color="primary.main">
              Standard Recruitment Workflow
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Please select a team member to view their recruitment workflow.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={4} sx={{ background: 'linear-gradient(90deg, #e3f0ff 0%, #eaf6ff 100%)' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <TimelineIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight={600} color="primary.main">
            Standard Recruitment Workflow
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Current candidate: <strong>{selectedCandidate.name}</strong> - {selectedCandidate.role}
        </Typography>
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
              <StepLabel onClick={() => onNextStage(selectedCandidate.name)} style={{ cursor: 'pointer' }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onPreviousStage(selectedCandidate.name)}
            disabled={selectedCandidate.recruitmentStage === 0}
          >
            Previous Stage
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onNextStage(selectedCandidate.name)}
          >
            Next Stage
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

