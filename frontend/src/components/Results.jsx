import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import i18n from '../i18n';

const Results = () => {
  const [results, setResults] = useState([]);
  const [votingStatus, setVotingStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: token }
        };
  
        // Fetch results
        const resultsRes = await axios.get('/api/vote/results', config);
        setResults(resultsRes.data);
        console.log(JSON.stringify(results, null, 2));
  
        // Fetch voting status
        const statusRes = await axios.get('/api/vote/status', config);
        setVotingStatus(statusRes.data.hasVoted);
      } catch (err) {
        console.error('Full error:', err);
        console.error('Error response:', err.response);
      }
    };
  
    fetchData();
  }, []);
  if (votingStatus === null) {
    return <div>Loading...</div>;
  }

  if (!votingStatus) {
    return (
      <div>
        <h2>Voting Incomplete</h2>
        <p>You have not voted yet.</p>
        <button onClick={() => navigate('/vote')}>Go to Voting</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Voting Results</h2>
      <div>
        <h3>Your Vote Has Been Recorded</h3>
        {results.map(result => (
  <div key={result.id}>
    <h4>
      {typeof result.language === 'object' 
        ? (result.language[i18n.language] || result.nomineeName || 'Unknown')
        : (result.language || result.nomineeName)}
    </h4>
    <p>Total Votes: {result.voteCount}</p>
  </div>
))}
      </div>
    </div>
  );
};

export default Results;