import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut } from 'lucide-react';
import { UserList } from './UserList';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Message, Profile, ChatState } from '../types';

export function ChatRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<ChatState>({
    selectedUser: null,
    messages: [],
    profiles: [],
  });

  useEffect(() => {
    if (!user) return;
    
    fetchProfiles();
    fetchMessages();
    setupSubscriptions();
    updateUserStatus();
  }, [user]);

  const updateUserStatus = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: user.email?.split('@')[0],
        status: 'online',
        last_seen: new Date().toISOString(),
      });

    if (error) console.error('Error updating status:', error);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('last_seen', { ascending: false });
    
    if (error) console.error('Error fetching profiles:', error);
    else setState(s => ({ ...s, profiles: data || [] }));
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) console.error('Error fetching messages:', error);
    else setState(s => ({ ...s, messages: data || [] }));
  };

  const setupSubscriptions = () => {
    const messages = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, 
        payload => {
          setState(s => ({
            ...s,
            messages: [...s.messages, payload.new as Message],
          }));
        }
      )
      .subscribe();

    const profiles = supabase
      .channel('profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' },
        payload => {
          if (payload.eventType === 'UPDATE') {
            setState(s => ({
              ...s,
              profiles: s.profiles.map(profile =>
                profile.id === payload.new.id ? { ...profile, ...payload.new } : profile
              ),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      messages.unsubscribe();
      profiles.unsubscribe();
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          content,
          user_id: user.id,
          user_email: user.email,
          recipient_id: state.selectedUser?.id || null,
        },
      ]);

    if (error) console.error('Error sending message:', error);
  };

  const handleSignOut = async () => {
    if (!user) return;
    
    await supabase
      .from('profiles')
      .update({ status: 'offline' })
      .eq('id', user.id);
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <UserList
        profiles={state.profiles}
        currentUserId={user.id}
        onSelectUser={(user) => setState(s => ({ ...s, selectedUser: user }))}
        selectedUser={state.selectedUser}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {state.selectedUser ? `Chat with ${state.selectedUser.username}` : 'Global Chat'}
            </h1>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>

        <ChatMessages
          messages={state.messages}
          currentUser={user}
          selectedUser={state.selectedUser}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          selectedUser={state.selectedUser}
        />
      </div>
    </div>
  );
}