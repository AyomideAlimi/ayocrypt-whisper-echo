
import React, { useState, useEffect } from 'react';
import PinLock from '../components/PinLock';
import MessengerApp from '../components/MessengerApp';
import { BiometricAuth } from '@capacitor/biometric-auth';
import { toast } from 'sonner';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    // Check if PIN exists in localStorage
    const savedPin = localStorage.getItem('ayocrypt_pin');
    setStoredPin(savedPin);
    
    // Check if biometrics are enabled
    const biometricsStatus = localStorage.getItem('ayocrypt_biometrics');
    setBiometricsEnabled(biometricsStatus === 'enabled');
    
    // Try biometric auth on startup if enabled
    if (biometricsStatus === 'enabled' && savedPin) {
      attemptBiometricAuth();
    }
  }, []);

  const attemptBiometricAuth = async () => {
    try {
      const { isAvailable } = await BiometricAuth.isAvailable();
      
      if (isAvailable) {
        const result = await BiometricAuth.authenticate({
          reason: 'Authenticate to access AyoCrypt Messenger',
          title: 'Welcome Back',
          subtitle: 'Use your fingerprint to unlock the app',
          cancelButtonTitle: 'Use PIN instead'
        });
        
        if (result.verified) {
          setIsAuthenticated(true);
          toast.success('Authentication successful');
        }
      }
    } catch (error) {
      console.log('Biometric authentication failed or cancelled');
      // User will need to enter PIN instead
    }
  };

  const handlePinSuccess = () => {
    setIsAuthenticated(true);
    
    // Offer to enable biometrics if not already enabled
    if (!biometricsEnabled) {
      setTimeout(() => {
        toast('Would you like to enable fingerprint login?', {
          action: {
            label: 'Enable',
            onClick: () => enableBiometrics()
          },
          duration: 5000
        });
      }, 1000);
    }
  };

  const enableBiometrics = async () => {
    try {
      const { isAvailable } = await BiometricAuth.isAvailable();
      if (isAvailable) {
        localStorage.setItem('ayocrypt_biometrics', 'enabled');
        setBiometricsEnabled(true);
        toast.success('Fingerprint authentication enabled');
      } else {
        toast.error('Biometric authentication not available on this device');
      }
    } catch (error) {
      console.error('Error enabling biometrics:', error);
      toast.error('Failed to enable biometric authentication');
    }
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
