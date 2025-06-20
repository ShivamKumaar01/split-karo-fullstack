'use client'
import Dashboard from '@/components/dashboard'
import Navbar from '@/components/navbar'
import Box from '@mui/material/Box'
import React from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import '../main/main.css'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button'
import ModalForm from '@/components/modal-form'

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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <Box>

      <Dashboard></Dashboard>


      {/* <Box sx={{ p: 2, border: '1px dashed grey' }}>

      </Box> */}

      {/* this box is for modal */}
      <Box sx={{ p: 2, border: '1px dashed grey' }}>
        <Button onClick={handleOpen} className='create-group'> <AddCircleIcon fontSize="large" /></Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>

            <ModalForm></ModalForm>
          </Box>
        </Modal>

      </Box>

      {/* this is for table show for group */}




    </Box>
  )
}

export default Main