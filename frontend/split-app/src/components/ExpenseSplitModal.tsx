
'use client';

import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface Props {
  open: boolean;
  onClose: () => void;
  expenseId: number;
  groupId: number;
}

interface Split {
  amount: number;
  user: {
    id: number;
    name: string;
  };
}

const ExpenseSplitModal: React.FC<Props> = ({ open, onClose, expenseId, groupId }) => {
  const [splits, setSplits] = useState<Split[]>([]);
  const [loading, setLoading] = useState(false);
  const [paidUsers, setPaidUsers] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const LOCAL_STORAGE_KEY = `paidUsers_expense_${expenseId}`;

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      setCurrentUserId(decoded.id || decoded.userId || decoded.sub);
    }
  }, []);

  
  useEffect(() => {
    if (open && expenseId !== null) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/split/expense/${expenseId}`)
        .then((res) => {
          setSplits(res.data);

          const savedPaid = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedPaid) {
            setPaidUsers(JSON.parse(savedPaid));
          }
        })
        .catch((err) => console.error('Failed to load splits', err))
        .finally(() => setLoading(false));
    }
  }, [open, expenseId]);

  const handleSettleUp = async (payeeId: number, amount: number) => {
    if (!currentUserId || paidUsers.includes(payeeId)) return;

    try {
      await axios.post('http://localhost:8080/settle-up', {
        payerId: currentUserId,
        payeeId,
        amount,
        groupId,
      });

      const updatedPaidUsers = [...paidUsers, payeeId];
      setPaidUsers(updatedPaidUsers);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPaidUsers));
    } catch (error) {
      console.error('Error settling up:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Split Details
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : splits.length === 0 ? (
          <Typography>No splits found</Typography>
        ) : (
          <List>
            {splits.map((split, index) => {
              const isCurrentUser = split.user.id === currentUserId;
              const isPaid = paidUsers.includes(split.user.id);

              return (
                <ListItem key={index} sx={{ px: 0 }} secondaryAction={
                  isCurrentUser && (
                    <>
                      <Typography sx={{ mr: 1 }}>Payment done</Typography>
                      <Checkbox
                        checked={isPaid}
                        disabled={isPaid}
                        onChange={() => handleSettleUp(split.user.id, split.amount)}
                      />
                    </>
                  )
                }>
                  <ListItemText
                    primary={split.user.name}
                    secondary={`Owes ₹${split.amount}`}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default ExpenseSplitModal;

