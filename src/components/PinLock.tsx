
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Fingerprint } from 'lucide-react';
import { BiometricAuth } from '@capacitor/biometric-auth';
import { toast } from 'sonner';

interface PinLockProps {
  onSuccess: () => void;
  onSetPin: (pin: string) => void;
  hasStoredPin: boolean;
}

const PinLock = ({ onSuccess, onSetPin, hasStoredPin }: PinLockProps) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(!hasStoredPin);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const { isAvailable } = await BiometricAuth.isAvailable();
      setIsBiometricsAvailable(isAvailable);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsBiometricsAvailable(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await BiometricAuth.authenticate({
        reason: 'Authenticate to access AyoCrypt Messenger',
        title: 'Biometric Authentication',
        subtitle: 'Use your fingerprint to unlock the app',
        cancelButtonTitle: 'Use PIN instead'
      });
      
      if (result.verified) {
        toast.success('Biometric authentication successful');
        onSuccess();
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      toast.error('Biometric authentication failed. Please use PIN.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSettingPin) {
      if (pin !== confirmPin) {
        setError('PINs do not match');
        return;
      }
      if (pin.length < 4) {
        setError('PIN must be at least 4 digits');
        return;
      }
      onSetPin(pin);
    } else {
      const storedPin = localStorage.getItem('ayocrypt_pin');
      if (pin === storedPin) {
        onSuccess();
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            {isSettingPin ? 'Set Your PIN' : 'AyoCrypt Messenger'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder={isSettingPin ? "Enter 4+ digit PIN" : "Enter PIN"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="text-center text-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                maxLength={10}
              />
            </div>
            
            {isSettingPin && (
              <div>
                <Input
                  type="password"
                  placeholder="Confirm PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="text-center text-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  maxLength={10}
                />
              </div>
            )}
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={pin.length < 4 || (isSettingPin && confirmPin.length < 4)}
            >
              {isSettingPin ? 'Set PIN' : 'Unlock'}
            </Button>

            {!isSettingPin && isBiometricsAvailable && (
              <div className="text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-gray-400 bg-gray-800">Or</span>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleBiometricAuth}
                  className="mt-4 flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <Fingerprint className="w-5 h-5" />
                  Use Fingerprint
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinLock;
