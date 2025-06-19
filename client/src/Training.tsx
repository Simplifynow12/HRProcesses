import { Box, Button, Card, CardContent, Typography, Grid, LinearProgress, Rating, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState } from 'react';

interface Training {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  progress: number;
  enrolled: boolean;
}

interface TrainingProps {
  trainings: Training[];
  onEnrollment: (trainingId: number, enrolled: boolean) => void;
  onProgressUpdate: (trainingId: number, progress: number) => void;
}

export default function Training({ trainings, onEnrollment, onProgressUpdate }: TrainingProps) {
  const [enrollmentDialog, setEnrollmentDialog] = useState<{ open: boolean, training: Training | null }>({
    open: false,
    training: null
  });
  const [feedback, setFeedback] = useState<{ rating: number | null, comment: string }>({
    rating: null,
    comment: ''
  });

  const handleEnrollmentRequest = (training: Training) => {
    setEnrollmentDialog({ open: true, training });
  };

  const handleEnrollmentConfirm = () => {
    if (enrollmentDialog.training) {
      onEnrollment(enrollmentDialog.training.id, true);
    }
    setEnrollmentDialog({ open: false, training: null });
  };

  const handleFeedbackSubmit = () => {
    // In a real application, this would make an API call to submit feedback
    alert('Thank you for your feedback!');
    setFeedback({ rating: null, comment: '' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Training & Development
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          Available Training Programs
        </Typography>
        <Grid container spacing={2}>
          {trainings.map((training) => (
            <Grid item xs={12} md={6} lg={4} key={training.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{training.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {training.category} • {training.duration}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {training.description}
                  </Typography>
                  
                  {training.enrolled ? (
                    <>
                      <Typography variant="body2" gutterBottom>
                        Progress: {training.progress}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={training.progress} 
                        sx={{ mb: 2 }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => onProgressUpdate(training.id, Math.min(training.progress + 20, 100))}
                      >
                        Update Progress
                      </Button>
                      
                      {training.progress === 100 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1">Provide Feedback</Typography>
                          <Rating
                            value={feedback.rating}
                            onChange={(_, newValue) => setFeedback({ ...feedback, rating: newValue })}
                          />
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Your feedback..."
                            value={feedback.comment}
                            onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                            sx={{ mt: 1 }}
                          />
                          <Button
                            variant="contained"
                            onClick={handleFeedbackSubmit}
                            sx={{ mt: 1 }}
                          >
                            Submit Feedback
                          </Button>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleEnrollmentRequest(training)}
                    >
                      Request Enrollment
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Enrollment Confirmation Dialog */}
      <Dialog
        open={enrollmentDialog.open}
        onClose={() => setEnrollmentDialog({ open: false, training: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Enrollment Request</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to request enrollment in "{enrollmentDialog.training?.title}"? 
            Your line manager will be notified and will review your request.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEnrollmentDialog({ open: false, training: null })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEnrollmentConfirm}
            variant="contained"
            autoFocus
          >
            Confirm Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 