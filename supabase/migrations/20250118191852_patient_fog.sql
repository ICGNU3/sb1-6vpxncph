/*
  # Core Tables Schema

  1. New Tables
    - `projects`
      - Project details and metadata
      - Owned by users
      - Supports collaboration
    - `resources`
      - Marketplace resources
      - Linked to providers
    - `collaborations`
      - Project collaborations
      - Links users and projects
    - `events`
      - Community events
      - Supports both online and physical events
    - `posts`
      - Community discussions
      - Supports rich content
    - `comments`
      - Nested discussions
      - Supports threading

  2. Security
    - RLS enabled on all tables
    - Public read access where appropriate
    - Protected write access
    - Owner-based policies
*/

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  image_url text,
  status text DEFAULT 'draft',
  progress integer DEFAULT 0,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone" 
  ON projects FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own projects" 
  ON projects FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects" 
  ON projects FOR UPDATE 
  USING (auth.uid() = owner_id);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  description text,
  provider_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  exchange_type text NOT NULL,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone" 
  ON resources FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own resources" 
  ON resources FOR INSERT 
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Resource providers can update their resources" 
  ON resources FOR UPDATE 
  USING (auth.uid() = provider_id);

-- Collaborations Table
CREATE TABLE IF NOT EXISTS collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collaborations are viewable by involved users" 
  ON collaborations FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT owner_id FROM projects WHERE id = project_id
      UNION
      SELECT user_id FROM collaborations WHERE project_id = collaborations.project_id
    )
  );

CREATE POLICY "Project owners can manage collaborations" 
  ON collaborations FOR ALL 
  USING (
    auth.uid() IN (
      SELECT owner_id FROM projects WHERE id = project_id
    )
  );

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  duration integer,
  location jsonb NOT NULL,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  max_attendees integer,
  tags text[],
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" 
  ON events FOR SELECT 
  USING (true);

CREATE POLICY "Users can create events" 
  ON events FOR INSERT 
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Event hosts can update their events" 
  ON events FOR UPDATE 
  USING (auth.uid() = host_id);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  likes integer DEFAULT 0,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone" 
  ON posts FOR SELECT 
  USING (true);

CREATE POLICY "Users can create posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Post authors can update their posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = author_id);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" 
  ON comments FOR SELECT 
  USING (true);

CREATE POLICY "Users can create comments" 
  ON comments FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Comment authors can update their comments" 
  ON comments FOR UPDATE 
  USING (auth.uid() = author_id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_resources_provider ON resources(provider_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_project ON collaborations(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_user ON collaborations(user_id);
CREATE INDEX IF NOT EXISTS idx_events_host ON events(host_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);