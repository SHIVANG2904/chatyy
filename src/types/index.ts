export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string;
  last_seen: string;
}

export interface Message {
  id: number;
  content: string;
  user_id: string;
  recipient_id: string | null;
  created_at: string;
  user_email: string;
}

export interface ChatState {
  selectedUser: Profile | null;
  messages: Message[];
  profiles: Profile[];
}