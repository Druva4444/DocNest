import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10); // start from 10 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate('/home');
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>✅ Subscription Successful</h1>
      <p>You’ll be redirected to the home page in {countdown} second{countdown !== 1 ? 's' : ''}.</p>
    </div>
  );
};

export default Success;
