
'use client';
import Dashboard from '@/components/dashboard';
import Box from '@mui/material/Box';
import React, { useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import '../main/main.css';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ModalForm from '@/components/modal-form';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchGroupsByUserId } from '@/redux/useringroupSlice';
import Divider from '@mui/material/Divider';
import AddUserModal from '@/components/userModal';

const style = {
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

const Main = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [addUserModalOpen, setAddUserModalOpen] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState<number | null>(null);

  const handleOpenAddUserModal = (groupId: number) => {
    setSelectedGroupId(groupId);
    setAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setSelectedGroupId(null);
    setAddUserModalOpen(false);
  };

  const { groups, loading, error } = useSelector((state: RootState) => state.groups);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.id || decoded.userId || decoded.sub;

      dispatch(fetchGroupsByUserId({ userId, page: 1, limit: 10 }));
    } catch (err) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [dispatch, router]);

  return (
    <Box>
      <Dashboard />

      {/* Modal open btn */}
      <Box sx={{ p: 2, border: '1px dashed grey' }}>
        <Button onClick={handleOpen} className="create-group">
          <AddCircleIcon fontSize="large" />
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <ModalForm />
          </Box>
        </Modal>
      </Box>

      
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Groups
        </Typography>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {groups.length === 0 && !loading && (
          <Typography variant="body1">You are not part of any groups.</Typography>
        )}

        {groups.map((group) => (
          <Box
            key={group.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            border="1px solid #ccc"
            borderRadius={2}
            padding={2}
            mb={2}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {group.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {group.description}
              </Typography>
            </Box>

            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleOpenAddUserModal(group.id)}
              >
                Add User
              </Button>
              <Button
                variant="contained"
                size="small"
                
                onClick={() => router.push(`/group/${group.id}`)}
              >
                View Group
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* AddUserModal triggered  */}
      {selectedGroupId !== null && (
        <AddUserModal
          open={addUserModalOpen}
          onClose={handleCloseAddUserModal}
          groupId={selectedGroupId}
        />
      )}
    </Box>
  );
};

export default Main;


