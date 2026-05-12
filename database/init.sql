-- Data Structure Smart Learning Platform — Database Schema
-- PostgreSQL 15

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Users table
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- Knowledge Points table (mirror of Neo4j KnowledgeNode)
-- ============================================================
CREATE TABLE knowledge_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    neo4j_node_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
    category VARCHAR(50) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kp_neo4j ON knowledge_points(neo4j_node_id);
CREATE INDEX idx_kp_category ON knowledge_points(category);
CREATE INDEX idx_kp_difficulty ON knowledge_points(difficulty);

-- ============================================================
-- Exercises table
-- ============================================================
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_point_id UUID NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('choice', 'fill', 'code', 'simulation')),
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    answer JSONB NOT NULL,
    difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercises_kp ON exercises(knowledge_point_id);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);

-- ============================================================
-- Exercise Records table (user submission history)
-- ============================================================
CREATE TABLE exercise_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    user_answer JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_records_user ON exercise_records(user_id);
CREATE INDEX idx_records_exercise ON exercise_records(exercise_id);
CREATE INDEX idx_records_created ON exercise_records(created_at);

-- ============================================================
-- Knowledge Mastery table (user's mastery of each knowledge point)
-- ============================================================
CREATE TABLE knowledge_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    knowledge_point_id UUID NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
    mastery_score FLOAT NOT NULL DEFAULT 0.0 CHECK (mastery_score >= 0 AND mastery_score <= 1),
    total_attempts INTEGER NOT NULL DEFAULT 0,
    correct_attempts INTEGER NOT NULL DEFAULT 0,
    last_practiced_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, knowledge_point_id)
);

CREATE INDEX idx_mastery_user ON knowledge_mastery(user_id);
CREATE INDEX idx_mastery_kp ON knowledge_mastery(knowledge_point_id);
CREATE INDEX idx_mastery_score ON knowledge_mastery(mastery_score);

-- ============================================================
-- Trigger: auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_mastery_updated
    BEFORE UPDATE ON knowledge_mastery
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
