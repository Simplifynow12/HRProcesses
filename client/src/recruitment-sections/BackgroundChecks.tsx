import { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
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
  Button,
  Tooltip,
  Chip,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CancelIcon from '@mui/icons-material/Cancel';
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

interface BackgroundChecksProps {
  selectedCandidate: Candidate | null;
  onCheckStatus: (candidateName: string, checkIdx: number, status: 'Pending' | 'Passed' | 'Failed') => void;
  onUpload: (candidateName: string, checkIdx: number, fileName: string) => void;
}

export default function BackgroundChecks({ 
  selectedCandidate, 
  onCheckStatus, 
  onUpload 
}: BackgroundChecksProps) {
  const [uploadDialog, setUploadDialog] = useState({ open: false, idx: -1 });
  const [uploadFile, setUploadFile] = useState('');

  const handleUpload = () => {
    if (uploadDialog.idx >= 0 && selectedCandidate) {
      onUpload(selectedCandidate.name, uploadDialog.idx, uploadFile);
    }
    setUploadDialog({ open: false, idx: -1 });
    setUploadFile('');
  };

  if (!selectedCandidate) {
    return (
      <Card elevation={4} sx={{ height: '100%', background: 'linear-gradient(90deg, #fffbe7 0%, #e3f0ff 100%)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <VerifiedUserIcon color="secondary" fontSize="large" />
            <Typography variant="h5" fontWeight={600} color="secondary.main">
              Background & Verification Checks
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Please select a team member to view their background checks.
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
            <VerifiedUserIcon color="secondary" fontSize="large" />
            <Typography variant="h5" fontWeight={600} color="secondary.main">
              Background & Verification Checks
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Candidate: <strong>{selectedCandidate.name}</strong>
          </Typography>
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
                            <IconButton onClick={() => onCheckStatus(selectedCandidate.name, idx, 'Failed')}>
                              <CancelIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {check.status === 'Failed' && (
                          <Tooltip title="Reset to Pending">
                            <IconButton onClick={() => onCheckStatus(selectedCandidate.name, idx, 'Pending')}>
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
    </>
  );
}
