
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinLock;
