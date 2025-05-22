
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Lock } from 'lucide-react';

interface Message {
  id: string;
  original: string;
  encrypted: string;
  key: string;
  timestamp: Date;
  type: 'sent' | 'received';
}

interface MessageHistoryProps {
  messages: Message[];
  onClearHistory: () => void;
  onCopyMessage: (text: string) => void;
}

const MessageHistory = ({ messages, onClearHistory, onCopyMessage }: MessageHistoryProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Message History
        </CardTitle>
        {messages.length > 0 && (
          <Button 
            onClick={onClearHistory}
            variant="outline" 
            size="sm"
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No messages yet</p>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg border ${
                    message.type === 'sent' 
                      ? 'bg-green-900/30 border-green-600' 
                      : 'bg-blue-900/30 border-blue-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {message.type === 'sent' ? (
                        <Send className="w-4 h-4 text-green-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-blue-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        message.type === 'sent' ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        {message.type === 'sent' ? 'Sent' : 'Received'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Original:</p>
                      <p className="text-white text-sm">{message.original}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Encrypted:</p>
                      <p className="text-green-400 text-xs font-mono break-all">{message.encrypted}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      onClick={() => onCopyMessage(message.original)}
                      variant="outline" 
                      size="sm"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-xs"
                    >
                      Copy Original
                    </Button>
                    <Button 
                      onClick={() => onCopyMessage(message.encrypted)}
                      variant="outline" 
                      size="sm"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-xs"
                    >
                      Copy Encrypted
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageHistory;
