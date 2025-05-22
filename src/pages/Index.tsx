
import React, { useState, useEffect } from 'react';
import PinLock from '../components/PinLock';
import MessengerApp from '../components/MessengerApp';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storedPin, setStoredPin] = useState<string | null>(null);

  useEffect(() => {
    // Check if PIN exists in localStorage
    const savedPin = localStorage.getItem('ayocrypt_pin');
    setStoredPin(savedPin);
  }, []);

  const handlePinSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSetPin = (pin: string) => {
    localStorage.setItem('ayocrypt_pin', pin);
    setStoredPin(pin);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <PinLock 
        onSuccess={handlePinSuccess}
        onSetPin={handleSetPin}
        hasStoredPin={!!storedPin}
      />
    );
  }

  return <MessengerApp />;
};

export default Index;
