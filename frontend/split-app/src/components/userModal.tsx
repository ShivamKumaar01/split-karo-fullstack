'use client';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUsersToGroup } from '@/redux/addUserToGroupSlice';

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

const AddUserModal: React.FC<Props> = ({ open, onClose, groupId }) => {
  const dispatch = useDispatch<any>();
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<{ users: number[] }>({
    defaultValues: {
      users: [],
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/user');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users', err);
      }
    };

    if (open) fetchUsers();
  }, [open]);

  const onSubmit = (data: { users: number[] }) => {
    console.log('Selected users:', data.users);
    console.log('For group ID:', groupId);
     dispatch(addUsersToGroup({ userIds: data.users, groupId }));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>Add Users to Group</Typography>

        <FormControl fullWidth margin="normal" error={!!errors.users}>
          <InputLabel id="user-select-label">Select Users</InputLabel>
          <Controller
            name="users"
            control={control}
            render={({ field }) => (
              <Select
                labelId="user-select-label"
                multiple
                value={field.value}
                onChange={(e) => {
                  const value = typeof e.target.value === 'string'
                    ? e.target.value.split(',').map(Number)
                    : e.target.value.map(Number);
                  field.onChange(value);
                }}
                input={<OutlinedInput label="Select Users" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((userId) => {
                      const user = users.find((u) => u.id === userId);
                      return (
                        <Chip key={userId} label={user?.name || userId} />
                      );
                    })}
                  </Box>
                )}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.users && (
            <Typography variant="caption" color="error">
              {errors.users.message}
            </Typography>
          )}
        </FormControl>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddUserModal;
