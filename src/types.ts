export interface NavItem {
  title: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  contributors: number;
}

export interface Profile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  bio?: string;
  location?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  badges?: string[];
  reputation?: number;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  creator: Profile;
  projectId: string;
}

export interface Resource {
  id: string;
  type: 'service' | 'skill' | 'material' | 'funding';
  title: string;
  description: string;
  provider: Profile;
  exchangeType: 'token' | 'collaboration' | 'future_benefit';
  status: 'available' | 'requested' | 'in_progress';
}

export interface Collaboration {
  id: string;
  projectId: string;
  title: string;
  description: string;
  participants: Profile[];
  status: 'active' | 'completed' | 'seeking';
  tokenId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'link' | 'file';
    url: string;
    name: string;
  }[];
  reactions?: {
    type: string;
    count: number;
    userIds: string[];
  }[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'meetup' | 'workshop' | 'hackathon' | 'showcase' | 'ama';
  date: string;
  time: string;
  duration: number;
  location: {
    type: 'online' | 'physical';
    url?: string;
    address?: string;
  };
  host: Profile;
  attendees: Profile[];
  maxAttendees?: number;
  tags: string[];
  image?: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  type: 'project' | 'interest' | 'location' | 'skill';
  members: Profile[];
  admins: Profile[];
  posts: CommunityPost[];
  events: CommunityEvent[];
  isPrivate: boolean;
  tags: string[];
  image?: string;
}

export interface CommunityPost {
  id: string;
  author: Profile;
  content: string;
  timestamp: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  tags?: string[];
  attachments?: {
    type: 'image' | 'link' | 'file';
    url: string;
    name: string;
  }[];
  group?: CommunityGroup;
}