-- Add key_competencies column to performance_planning table
ALTER TABLE performance_planning 
ADD COLUMN IF NOT EXISTS key_competencies JSONB DEFAULT '[]';
