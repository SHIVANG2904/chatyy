import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { Profile } from '../types';

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  selectedUser: Profile | null;
}

export function ChatInput({ onSendMessage, selectedUser }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="flex space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${selectedUser ? selectedUser.username : 'everyone'}...`}
          className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}