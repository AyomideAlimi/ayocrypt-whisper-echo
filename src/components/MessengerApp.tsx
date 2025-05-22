
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Lock, Send, MessageCircle } from 'lucide-react';
import AyoCrypt from '../utils/ayocrypt';
import MessageHistory from './MessageHistory';

const MessengerApp = () => {
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptionInput, setDecryptionInput] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    original: string;
    encrypted: string;
    key: string;
    timestamp: Date;
    type: 'sent' | 'received';
  }>>([]);

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('ayocrypt_messages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  const saveMessages = (newMessages: typeof messages) => {
    localStorage.setItem('ayocrypt_messages', JSON.stringify(newMessages));
    setMessages(newMessages);
  };

  const handleEncrypt = () => {
    if (!message.trim() || !secretKey.trim()) {
      toast.error('Please enter both message and secret key');
      return;
    }

    const encrypted = AyoCrypt.encrypt(message, secretKey);
    setEncryptedMessage(encrypted);
    
    const newMessage = {
      id: Date.now().toString(),
      original: message,
      encrypted,
      key: secretKey,
      timestamp: new Date(),
      type: 'sent' as const
    };
    
    saveMessages([...messages, newMessage]);
    toast.success('Message encrypted successfully!');
  };

  const handleDecrypt = () => {
    if (!decryptionInput.trim() || !secretKey.trim()) {
      toast.error('Please enter both encrypted message and secret key');
      return;
    }

    try {
      const decrypted = AyoCrypt.decrypt(decryptionInput, secretKey);
      setDecryptedMessage(decrypted);
      
      const newMessage = {
        id: Date.now().toString(),
        original: decrypted,
        encrypted: decryptionInput,
        key: secretKey,
        timestamp: new Date(),
        type: 'received' as const
      };
      
      saveMessages([...messages, newMessage]);
      toast.success('Message decrypted successfully!');
    } catch (error) {
      toast.error('Failed to decrypt message. Check your key and message.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('ayocrypt_messages');
    setMessages([]);
    toast.success('Message history cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-green-600 rounded-full">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">AyoCrypt Messenger</h1>
          <p className="text-gray-300 text-sm">Secure messaging with custom encryption</p>
        </div>

        <div className="mb-4">
          <Input
            type="password"
            placeholder="Secret Key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        <Tabs defaultValue="encrypt" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="encrypt" className="text-white data-[state=active]:bg-green-600">
              Encrypt
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="text-white data-[state=active]:bg-green-600">
              Decrypt
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white data-[state=active]:bg-green-600">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Encrypt Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your message to encrypt..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                />
                <Button 
                  onClick={handleEncrypt}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!message.trim() || !secretKey.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Encrypt Message
                </Button>
                {encryptedMessage && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">Encrypted Message:</p>
                    <div className="p-3 bg-gray-700 rounded border border-gray-600">
                      <p className="text-green-400 font-mono text-sm break-all">{encryptedMessage}</p>
                    </div>
                    <Button 
                      onClick={() => copyToClipboard(encryptedMessage)}
                      variant="outline" 
                      size="sm"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Copy Encrypted Message
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decrypt">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Decrypt Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste encrypted message here..."
                  value={decryptionInput}
                  onChange={(e) => setDecryptionInput(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[100px] font-mono"
                />
                <Button 
                  onClick={handleDecrypt}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!decryptionInput.trim() || !secretKey.trim()}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Decrypt Message
                </Button>
                {decryptedMessage && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">Decrypted Message:</p>
                    <div className="p-3 bg-gray-700 rounded border border-gray-600">
                      <p className="text-white">{decryptedMessage}</p>
                    </div>
                    <Button 
                      onClick={() => copyToClipboard(decryptedMessage)}
                      variant="outline" 
                      size="sm"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Copy Decrypted Message
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <MessageHistory 
              messages={messages} 
              onClearHistory={clearHistory}
              onCopyMessage={copyToClipboard}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MessengerApp;
