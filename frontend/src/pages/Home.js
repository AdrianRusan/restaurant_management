import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Container, Grid, Box, Snackbar, TextField } from '@mui/material';
import { Alert } from '@mui/material';
import axios from 'axios';
import CreateRestaurantModal from '../components/CreateRestaurantModal';
import EditRestaurantModal from '../components/EditRestaurantModal';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            query {
              restaurants(page: ${page}, pageSize: 5) {
                id
                name
                address
                email
                phone
              }
            }
          `,
        });
        setRestaurants(response.data.data.restaurants);
      } catch (error) {
        setError('Failed to fetch restaurants');
      }
    };

    fetchRestaurants();
  }, [page]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
          query {
            searchRestaurants(searchTerm: "${searchTerm}", page: ${page}, pageSize: 5) {
              id
              name
              address
              email
              phone
            }
          }
        `,
      });
      setSearchResults(response.data.data.searchRestaurants);
    } catch (error) {
      setError('Failed to search restaurants');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
          mutation {
            deleteRestaurant(id: "${id}")
          }
        `,
      });

      if (response.data.data.deleteRestaurant) {
        setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== id));
        setAlertMessage('Restaurant deleted successfully');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setError('Failed to delete restaurant');
    }
  };

  const handleEdit = (restaurant) => {
    setCurrentRestaurant(restaurant);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setCurrentRestaurant(null);
    setEditModalOpen(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');

    setTimeout(() => {
      navigate('/login')
    }, 500);
  };

  return (
    <Container>
      <Box mt={4} mb={2}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4" color="primary">Restaurants</Typography>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>Sign Out</Button>
        </Grid>
      </Box>
      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
      </Box>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      )}
      <Box textAlign="center" mb={4}>
        <Button variant="contained" color="primary" onClick={() => setCreateModalOpen(true)}>Add Restaurant</Button>
      </Box>
      <CreateRestaurantModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      <EditRestaurantModal open={editModalOpen} onClose={handleEditClose} restaurant={currentRestaurant} />
      <Grid container spacing={3}>
        {(searchResults.length > 0 ? searchResults : restaurants).map((restaurant) => (
          <Grid item key={restaurant.id} xs={12}>
            <Card 
              onClick={() => handleEdit(restaurant)}
              onMouseEnter={() => setCurrentRestaurant(restaurant)}
              onMouseLeave={() => setCurrentRestaurant(null)}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {restaurant.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Address: {restaurant.address}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Email: {restaurant.email}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Phone: {restaurant.phone}
                </Typography>
                {currentRestaurant === restaurant && (
                  <Box display="flex" justifyContent="flex-end" pt={2}>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(restaurant.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box my={4} textAlign="center">
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setPage(page + 1)} 
            disabled={searchResults.length > 0 ? searchResults.length < 5 : restaurants.length < 5}
          >
            Next
          </Button>
        </Box>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;