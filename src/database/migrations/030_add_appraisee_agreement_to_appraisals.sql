-- Add appraisee_agreement_decision column to appraisals table
ALTER TABLE appraisals 
ADD COLUMN appraisee_agreement_decision VARCHAR(10) 
CHECK (appraisee_agreement_decision IN ('yes', 'no'));

-- Add comment for documentation
COMMENT ON COLUMN appraisals.appraisee_agreement_decision IS 'Indicates whether the appraisee agrees with the appraiser''s comments and decisions (yes/no)';
