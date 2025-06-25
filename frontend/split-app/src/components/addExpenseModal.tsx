

'use client';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface Props {
  open: boolean;
  onClose: () => void;
  groupId: number;
  onExpenseAdded: () => void;
}

const AddExpenseModal: React.FC<Props> = ({
  open,
  onClose,
  groupId,
  onExpenseAdded,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paidBy, setPaidBy] = useState<number | ''>('');
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (open) {
      axios
        .get(`http://localhost:8080/group/${groupId}/members`)
        .then((res) => setMembers(res.data))
        .catch((err) => console.error('Failed to load group members', err));
    }
  }, [open, groupId]);

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8080/expense', {
        description,
        amount: Number(amount),
        paidBy,
        groupId,
      });

      onExpenseAdded(); 

      setDescription('');
      setAmount('');
      setPaidBy('');
    } catch (err) {
      console.error('Failed to add expense', err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Add Expense
        </Typography>

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <TextField
          select
          label="Paid By"
          fullWidth
          margin="normal"
          value={paidBy}
          onChange={(e) => setPaidBy(Number(e.target.value))}
        >
          {members.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.name}
            </MenuItem>
          ))}
        </TextField>

        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!description || !amount || !paidBy}
          >
            Add Expense
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddExpenseModal;
