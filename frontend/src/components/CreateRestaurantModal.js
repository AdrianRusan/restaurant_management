import React, { useState } from 'react';
import { Modal, TextField, Button, Box, Typography, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const CreateRestaurantModal = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    try {
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
          mutation {
            createRestaurant(name: "${name}", address: "${address}", email: "${email}", phone: "${phone}") {
              id
            }
          }
        `,
      });
      if (response.data.errors && response.data.errors.length > 0) {
        setError(response.data.errors[0].message);
      } else {
        handleClose();
      }    
    } catch (error) {
      console.error("Error creating restaurant:", error);
      setError("Failed to create restaurant. Please try again later.");
    }
  };

  const handleClose = () => {
    setName('');
    setAddress('');
    setEmail('');
    setPhone('');
    setError('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh" 
        p={2}
      >
        <Paper 
          style={{
            padding: '20px', 
            maxWidth: '500px', 
            width: '100%', 
            backgroundColor: '#fff', 
            borderRadius: '10px',
            position: 'relative'
          }}
          elevation={3}
        >
          <IconButton
            style={{ position: 'absolute', right: '10px', top: '10px' }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom align="center">
            Create Restaurant
          </Typography>
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <TextField 
              label="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              variant="outlined" 
              fullWidth 
              required 
            />
            <TextField 
              label="Address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              variant="outlined" 
              fullWidth 
              required 
            />
            <TextField 
              label="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              variant="outlined" 
              fullWidth 
              required 
              type="email" 
              error={error !== ''}
              helperText={error}
            />
            <TextField 
              label="Phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              variant="outlined" 
              fullWidth 
              required 
              type="tel" 
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreate}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default CreateRestaurantModal;