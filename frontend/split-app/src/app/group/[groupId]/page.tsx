
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddExpenseModal from '@/components/addExpenseModal';
import ExpenseSplitModal from '@/components/ExpenseSplitModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchGroupTotalExpense } from '@/redux/groupExpenseSlice';

interface Member {
  id: number;
  name: string;
}

interface GroupDetails {
  title: string;
  description: string;
}

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<
    { id: number; description: string; amount: number; paidBy: { name: string } }[]
  >([]);
  const [expenseAdded, setExpenseAdded] = useState(false);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { total, loading: totalLoading } = useSelector(
    (state: RootState) => state.groupExpense
  );

  const handleOpenSplitModal = (expenseId: number) => {
    setSelectedExpenseId(expenseId);
    setSplitModalOpen(true);
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/expense/group/${groupId}`);
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [groupRes, membersRes] = await Promise.all([
          axios.get(`http://localhost:8080/group/${groupId}`),
          axios.get(`http://localhost:8080/group/${groupId}/members`),
        ]);
        setGroup(groupRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        console.error('Error fetching group details', err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchData();
      fetchExpenses();
      dispatch(fetchGroupTotalExpense(Number(groupId)));
    }
  }, [groupId]);

  useEffect(() => {
    if (expenseAdded) {
      fetchExpenses();
      dispatch(fetchGroupTotalExpense(Number(groupId)));
      setExpenseAdded(false);
    }
  }, [expenseAdded, groupId, dispatch]);

  const handleRemoveUser = async (userId: number) => {
    try {
      setRemovingUserId(userId);
      await axios.post('http://localhost:8080/group-member/remove-user', {
        groupId: Number(groupId),
        userId,
      });
      setMembers((prev) => prev.filter((m) => m.id !== userId));
    } catch (err) {
      console.error('Error removing user', err);
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleEditSubmit = async (id: number) => {
    try {
      await axios.patch(`http://localhost:8080/expense/${id}`, {
        description: editedDescription,
      });
      setEditingExpenseId(null);
      setEditedDescription('');
      fetchExpenses();
    } catch (err) {
      console.error('Failed to update expense', err);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {group?.title || `Group #${groupId}`}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        {group?.description}
      </Typography>

      {totalLoading ? (
        <Typography>Loading total expense...</Typography>
      ) : (
        <Typography variant="h6">
          Total Group Expense: ₹{total}
        </Typography>
      )}

      <Typography variant="h6" mt={4} mb={2}>
        Group Members
      </Typography>

      <Box display="flex" flexDirection="column" gap={1}>
        {members.map((member) => (
          <Box
            key={member.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            border="1px solid #ccc"
            borderRadius={2}
            px={2}
            py={1}
          >
            <Typography>{member.name}</Typography>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleRemoveUser(member.id)}
              disabled={removingUserId === member.id}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Typography variant="h6" mt={4} mb={2}>
        Group Expenses
      </Typography>

      {expenses.length === 0 ? (
        <Typography>No expenses yet</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1}>
          {expenses.map((exp) => (
            <Box
              key={exp.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              border="1px solid #ddd"
              borderRadius={2}
              p={2}
              sx={{ cursor: editingExpenseId === exp.id ? 'default' : 'pointer' }}
              onClick={() => {
                if (editingExpenseId !== exp.id) {
                  handleOpenSplitModal(exp.id);
                }
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                {editingExpenseId === exp.id ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                ) : (
                  <>
                    <Typography fontWeight="bold">{exp.description}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Paid by: {exp.paidBy.name}
                    </Typography>
                    <Typography fontWeight="bold">₹ {exp.amount}</Typography>
                  </>
                )}
              </Box>

              <Box display="flex" gap={1}>
                {editingExpenseId === exp.id ? (
                  <>
                    <Button
                      variant="text"
                      size="small"
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSubmit(exp.id);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingExpenseId(null);
                        setEditedDescription('');
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="text"
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingExpenseId(exp.id);
                        setEditedDescription(exp.description);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const confirm = window.confirm('Are you sure you want to delete this expense?');
                        if (!confirm) return;

                        try {
                          await axios.delete(`http://localhost:8080/expense/${exp.id}`);
                          fetchExpenses();
                          dispatch(fetchGroupTotalExpense(Number(groupId)));
                        } catch (err) {
                          console.error('Failed to delete expense', err);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Button variant="contained" onClick={() => setModalOpen(true)} sx={{ mt: 3 }}>
         Add Expense
      </Button>

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        groupId={Number(groupId)}
        onExpenseAdded={() => {
          setModalOpen(false);
          setExpenseAdded(true);
        }}
      />

      <Button variant="outlined" sx={{ mt: 4 }} onClick={() => router.push('/main')}>
         Back to Groups
      </Button>

      {selectedExpenseId !== null && (
        <ExpenseSplitModal
          open={splitModalOpen}
          onClose={() => setSplitModalOpen(false)}
          expenseId={selectedExpenseId}
          groupId={Number(groupId)}
        />
      )}
    </Box>
  );
};

export default GroupDetailPage;

