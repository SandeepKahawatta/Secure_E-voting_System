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
  Stack
} from '@mui/material';
import { 
  Logout, 
  Language, 
  HowToVote, 
  Church,
  Visibility 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'box-shadow 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const Nominees = () => {
  const [nominees, setNominees] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedNominee, setVotedNominee] = useState(null);
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
        console.log('res.data', res.data)

        // Check voting status
        const statusRes = await axios.get('/api/vote/status', config);
        setHasVoted(statusRes.data.hasVoted);
        
        // If voted, fetch voted nominee details
        if (statusRes.data.hasVoted) {
          const voteRes = await axios.get('/api/my-vote', config);
          setVotedNominee(voteRes.data.nominee);
        }
      } catch (err) {
        console.error(err.response?.data?.message || 'Error fetching nominees');
      }
    };
    fetchNominees();
  }, []);

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProceedToVote = () => {
    if (hasVoted) {
      navigate('/my-vote');
    } else {
      navigate('/vote');
    }
  };

  // Function to get localized name
  const getLocalizedName = (nominee) => {
    // Get the current language
    const currentLang = i18n.language;

    // Check if the nominee has a name in the current language
    if (nominee.name[currentLang]) {
      return nominee.name[currentLang];
    }

    // Fallback to English if no localized name exists
    return nominee.name.en || nominee.name;
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
            {t('Nominee Candidates')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {hasVoted 
              ? t('You have already cast your vote') 
              : t('Select a candidate to proceed')}
          </Typography>
        </Box>

        {/* Nominees Grid */}
        <Grid container spacing={4}>
          {nominees.map((nominee) => (
            <Grid item xs={12} sm={6} md={4} key={nominee._id}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="300"
                  image={nominee.photo || '/default-nominee.jpg'}
                  alt={nominee.name}
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

        {/* Vote Buttons */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center"
          >
            <Button
              variant="contained"
              color={hasVoted ? 'secondary' : 'primary'}
              size="large"
              startIcon={hasVoted ? <Visibility /> : <HowToVote />}
              onClick={handleProceedToVote}
            >
              {hasVoted ? 'View My Vote' : 'Proceed to Vote'}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Nominees;