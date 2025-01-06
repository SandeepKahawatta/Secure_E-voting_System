import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// MUI Imports
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  AppBar, 
  Toolbar, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Stack
} from '@mui/material';
import { 
  Logout, 
  Language, 
  HowToVote, 
  Church,
  ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme, selected }) => ({
  transition: 'box-shadow 0.3s ease-in-out',
  cursor: 'pointer',
  backgroundColor: selected 
    ? theme.palette.action.selected 
    : 'inherit',
  border: selected 
    ? `2px solid ${theme.palette.primary.main}` 
    : '2px solid transparent',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const Voting = () => {
  const [nominees, setNominees] = useState([]);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: token }
        };
        const res = await axios.get('/api/nominees', config);
        setNominees(res.data);
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Error fetching nominees');
        setErrorOpen(true);
      }
    };
    fetchNominees();
  }, []);

  // Function to get localized name
  const getLocalizedName = (nominee) => {
    // Get the current language
    const currentLang = i18n.language;

    // Check if the nominee has a name in the current language
    if (nominee.name && nominee.name[currentLang]) {
      return nominee.name[currentLang];
    }

    // Fallback to English if no localized name exists
    return nominee.name?.en || nominee.name;
  };

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNomineeSelect = (nominee) => {
    setSelectedNominee(nominee);
  };

  const handleConfirmVote = async () => {
    if (!selectedNominee) {
      setErrorMessage('Please select a nominee before voting');
      setErrorOpen(true);
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: token }
      };
  
      const response = await axios.post('/api/vote', { 
        nomineeId: selectedNominee._id 
      }, config);
  
      console.log('Vote submission response:', response.data);
      navigate('/my-vote');
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
  
      setErrorMessage(
        err.response?.data?.message || 
        err.message || 
        'Voting failed'
      );
      setErrorOpen(true);
    }
  };

  const handleCloseError = () => {
    setErrorOpen(false);
  };

  const handleBackToNominees = () => {
    navigate('/nominees');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      pt: 8
    }}>
      {/* App Bar */}
      <AppBar position="fixed" color="primary" sx={{ top: 0, bottom: 'auto' }}>
        <Toolbar>
          <Church sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Church Presidential Election
          </Typography>
          
          {/* Language Selector */}
          <FormControl variant="outlined" size="small" sx={{ mr: 2, minWidth: 120 }}>
            <InputLabel>Language</InputLabel>
            <Select
              label="Language"
              value={i18n.language}
              onChange={handleLanguageChange}
              startAdornment={<Language />}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="local">Local Language</MenuItem>
              <MenuItem value="si">Sinhala</MenuItem>
              <MenuItem value="ta">Tamil</MenuItem>
            </Select>
          </FormControl>

          {/* Logout Button */}
          <Button 
            color="inherit" 
            startIcon={<Logout />} 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('Cast Your Vote')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('Select your preferred candidate carefully')}
          </Typography>
        </Box>

        {/* Nominees Grid */}
        <Grid container spacing={4}>
          {nominees.map((nominee) => (
            <Grid item xs={12} sm={6} md={4} key={nominee._id}>
              <StyledCard 
                selected={selectedNominee?._id === nominee._id}
                onClick={() => handleNomineeSelect(nominee)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={nominee.photo || '/default-nominee.jpg'}
                  alt={getLocalizedName(nominee)}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {getLocalizedName(nominee)}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Vote Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<HowToVote />}
              onClick={handleConfirmVote}
              disabled={!selectedNominee}
            >
              Submit Vote
            </Button>
          </Stack>
        </Box>

        {/* Back to Nominees Button */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={handleBackToNominees}
          >
            Back to Nominees
          </Button>
        </Box>

      </Container>

      {/* Error Snackbar */}
      <Snackbar 
        open={errorOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Voting;