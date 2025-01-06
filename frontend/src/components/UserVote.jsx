import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// MUI Imports
import { 
  Box, 
  Container, 
  Typography, 
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
  CircularProgress,
  Grid
} from '@mui/material';
import { 
  Logout, 
  Language, 
  Church, 
  ArrowBack,
  HowToVote 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const UserVote = () => {
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

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

  const handleBackToNominees = () => {
    navigate('/nominees');
  };

  useEffect(() => {
    const fetchUserVote = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: token },
        };
        
        const response = await axios.get('/api/vote/user-vote', config);
        setUserVote(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching vote');
        setLoading(false);
      }
    };
    
    fetchUserVote();
  }, []);

  if (loading) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h5" color="error">
        {error}
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={handleBackToNominees}
      >
        {t('Back to Nominees')}
      </Button>
    </Container>
  );

  if (!userVote) return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h5">
        {t('No vote found')}
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={handleBackToNominees}
      >
        {t('Back to Nominees')}
      </Button>
    </Container>
  );

  const nominee = userVote.nominee;
  const nomineeName = getLocalizedName(nominee);

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
            {t('Church Presidential Election')}
          </Typography>
          
          {/* Language Selector */}
          <FormControl variant="outlined" size="small" sx={{ mr: 2, minWidth: 120 }}>
            <InputLabel>{t('Language')}</InputLabel>
            <Select
              label={t('Language')}
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
            {t('Logout')}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('Your Vote Details')}
          </Typography>
        </Box>

        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={8}>
            <Card sx={{ 
              boxShadow: 3, 
              borderRadius: 2, 
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}>
              <CardMedia
                component="img"
                height="300"
                image={nominee.photo || '/default-nominee.jpg'}
                alt={nomineeName}
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom align="center">
                  {t('Voted Nominee')}
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary" align="center">
                      <strong>{t('Name')}</strong>: {nomineeName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary" align="center">
                      <strong>{t('Voted At')}</strong>: {new Date(userVote.votedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={handleBackToNominees}
            size="large"
          >
            {t('Back to Nominees')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default UserVote;