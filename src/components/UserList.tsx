import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Profile } from '../types';
import { Users } from 'lucide-react';

interface UserListProps {
  profiles: Profile[];
  currentUserId: string;
  onSelectUser: (user: Profile) => void;
  selectedUser: Profile | null;
}

export function UserList({ profiles, currentUserId, onSelectUser, selectedUser }: UserListProps) {
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a.status === 'online' && b.status !== 'online') return -1;
    if (a.status !== 'online' && b.status === 'online') return 1;
    return new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime();
  });

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {profiles.length - 1}
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sortedProfiles.map((profile) => {
          if (profile.id === currentUserId) return null;
          
          return (
            <button
              key={profile.id}
              onClick={() => onSelectUser(profile)}
              className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                selectedUser?.id === profile.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`}
                  alt={profile.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    profile.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                  }`}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.username}
                  </p>
                  <span className="text-xs text-gray-500">
                    {profile.status === 'online'
                      ? 'Online'
                      : formatDistanceToNow(new Date(profile.last_seen), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}