import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Message, Profile } from '../types';
import clsx from 'clsx';

interface ChatMessagesProps {
  messages: Message[];
  currentUser: any;
  selectedUser: Profile | null;
}

export function ChatMessages({ messages, currentUser, selectedUser }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredMessages = messages.filter(
    (message) =>
      (!message.recipient_id && !selectedUser) || // Show global messages in global chat
      (selectedUser && // Show DMs in private chat
        ((message.user_id === currentUser.id && message.recipient_id === selectedUser.id) ||
         (message.user_id === selectedUser.id && message.recipient_id === currentUser.id)))
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {filteredMessages.map((message) => (
        <div
          key={message.id}
          className={clsx(
            'flex flex-col max-w-xs mx-2 space-y-2',
            message.user_id === currentUser.id ? 'ml-auto' : ''
          )}
        >
          <div
            className={clsx(
              'rounded-lg px-4 py-2 break-words',
              message.user_id === currentUser.id
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-200 text-gray-900'
            )}
          >
            {message.content}
          </div>
          <div
            className={clsx(
              'text-xs text-gray-500',
              message.user_id === currentUser.id ? 'text-right' : 'text-left'
            )}
          >
            {message.user_id !== currentUser.id && (
              <span className="font-medium">{message.user_email} · </span>
            )}
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}