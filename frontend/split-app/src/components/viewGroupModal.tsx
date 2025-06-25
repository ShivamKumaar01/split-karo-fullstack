'use client';
import {
  Box,
  Chip,
  CircularProgress,
  Modal,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface Props {
  open: boolean;
  onClose: () => void;
  groupId: number;
}

const ViewGroupModal: React.FC<Props> = ({ open, onClose, groupId }) => {
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/group/${groupId}/members`)
        .then((res) => {
          setMembers(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load group members');
          setLoading(false);
        });
    }
  }, [open, groupId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Group Members
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={1}>
            {members.map((member) => (
              <Chip key={member.id} label={member.name} />
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ViewGroupModal;
