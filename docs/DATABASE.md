# Database Schema Documentation

## Overview
The TVET Appraisal System uses PostgreSQL as its database. This document describes the database schema, relationships, and data structures.

## Tables

### users
Stores user information and authentication data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| employee_id | VARCHAR(50) | UNIQUE, NOT NULL | Employee ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| name | VARCHAR(255) | NOT NULL | Full name |
| role | VARCHAR(100) | NOT NULL | User role |
| division | VARCHAR(100) | | Division |
| unit | VARCHAR(100) | | unit |
| position | VARCHAR(100) | | Position |
| grade | VARCHAR(50) | | Grade level |
| manager_id | UUID | FOREIGN KEY | Manager's user ID |
| phone | VARCHAR(20) | | Phone number |
| avatar_url | VARCHAR(500) | | Avatar image URL |
| is_active | BOOLEAN | DEFAULT true | Account status |
| last_login | TIMESTAMP | | Last login time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_users_employee_id` on `employee_id`
- `idx_users_email` on `email`
- `idx_users_manager_id` on `manager_id`
- `idx_users_role` on `role`
- `idx_users_is_active` on `is_active`

### appraisals
Stores performance appraisal data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| employee_id | UUID | NOT NULL, FOREIGN KEY | Employee being appraised |
| appraiser_id | UUID | NOT NULL, FOREIGN KEY | Person conducting appraisal |
| period_start | DATE | NOT NULL | Appraisal period start |
| period_end | DATE | NOT NULL | Appraisal period end |
| status | VARCHAR(50) | DEFAULT 'draft' | Appraisal status |
| employee_info | JSONB | NOT NULL | Employee information |
| appraiser_info | JSONB | NOT NULL | Appraiser information |
| training_received | JSONB | DEFAULT '[]' | Training records |
| key_result_areas | JSONB | DEFAULT '[]' | Key result areas |
| mid_year_review | JSONB | | Mid-year review data |
| end_of_year_review | JSONB | NOT NULL | End-year review data |
| core_competencies | JSONB | NOT NULL | Core competencies |
| non_core_competencies | JSONB | NOT NULL | Non-core competencies |
| overall_assessment | JSONB | NOT NULL | Overall assessment |
| appraiser_comments | TEXT | | Appraiser comments |
| training_development_plan | TEXT | | Development plan |
| assessment_decision | VARCHAR(50) | | Assessment decision |
| appraisee_comments | TEXT | | Appraisee comments |
| hod_comments | TEXT | | HOD comments |
| hod_name | VARCHAR(255) | | HOD name |
| hod_signature | VARCHAR(500) | | HOD signature |
| hod_date | DATE | | HOD signature date |
| appraiser_signature | VARCHAR(500) | | Appraiser signature |
| appraiser_signature_date | DATE | | Appraiser signature date |
| appraisee_signature | VARCHAR(500) | | Appraisee signature |
| appraisee_signature_date | DATE | | Appraisee signature date |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_appraisals_employee_id` on `employee_id`
- `idx_appraisals_appraiser_id` on `appraiser_id`
- `idx_appraisals_status` on `status`
- `idx_appraisals_period` on `period_start, period_end`
- `idx_appraisals_created_at` on `created_at`
- `idx_appraisals_employee_period` on `employee_id, period_start, period_end`

### training_records
Stores training and development records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY | User ID |
| institution | VARCHAR(255) | NOT NULL | Training institution |
| programme | VARCHAR(255) | NOT NULL | Training programme |
| start_date | DATE | NOT NULL | Start date |
| end_date | DATE | | End date |
| duration_hours | INTEGER | | Duration in hours |
| cost | DECIMAL(10,2) | | Training cost |
| funding_source | VARCHAR(100) | | Funding source |
| status | VARCHAR(50) | DEFAULT 'completed' | Training status |
| certificate_url | VARCHAR(500) | | Certificate URL |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_training_records_user_id` on `user_id`
- `idx_training_records_status` on `status`
- `idx_training_records_dates` on `start_date, end_date`
- `idx_training_records_institution` on `institution`

### key_result_areas
Stores key result areas for appraisals.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| appraisal_id | UUID | NOT NULL, FOREIGN KEY | Appraisal ID |
| area | VARCHAR(255) | NOT NULL | Key result area |
| targets | TEXT | NOT NULL | Targets |
| resources_required | TEXT | | Resources required |
| weight | DECIMAL(5,2) | DEFAULT 0.00 | Weight |
| mid_year_progress | TEXT | | Mid-year progress |
| mid_year_remarks | TEXT | | Mid-year remarks |
| end_year_assessment | TEXT | | End-year assessment |
| end_year_score | DECIMAL(5,2) | DEFAULT 0.00 | End-year score |
| end_year_comments | TEXT | | End-year comments |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_key_result_areas_appraisal_id` on `appraisal_id`
- `idx_key_result_areas_area` on `area`

### mid_year_reviews
Stores mid-year review data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| appraisal_id | UUID | NOT NULL, FOREIGN KEY | Appraisal ID |
| review_date | DATE | NOT NULL | Review date |
| target_reviews | JSONB | NOT NULL DEFAULT '[]' | Target reviews |
| competency_reviews | JSONB | NOT NULL DEFAULT '[]' | Competency reviews |
| overall_progress | TEXT | | Overall progress |
| challenges_faced | TEXT | | Challenges faced |
| support_needed | TEXT | | Support needed |
| appraiser_signature | VARCHAR(500) | | Appraiser signature |
| appraisee_signature | VARCHAR(500) | | Appraisee signature |
| status | VARCHAR(50) | DEFAULT 'draft' | Review status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_mid_year_reviews_appraisal_id` on `appraisal_id`
- `idx_mid_year_reviews_review_date` on `review_date`
- `idx_mid_year_reviews_status` on `status`

### end_year_reviews
Stores end-year review data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| appraisal_id | UUID | NOT NULL, FOREIGN KEY | Appraisal ID |
| review_date | DATE | NOT NULL | Review date |
| target_assessments | JSONB | NOT NULL DEFAULT '[]' | Target assessments |
| competency_assessments | JSONB | NOT NULL DEFAULT '[]' | Competency assessments |
| total_score | DECIMAL(5,2) | DEFAULT 0.00 | Total score |
| average_score | DECIMAL(5,2) | DEFAULT 0.00 | Average score |
| weighted_score | DECIMAL(5,2) | DEFAULT 0.00 | Weighted score |
| overall_performance | TEXT | | Overall performance |
| strengths | TEXT | | Strengths |
| areas_for_improvement | TEXT | | Areas for improvement |
| development_recommendations | TEXT | | Development recommendations |
| appraiser_signature | VARCHAR(500) | | Appraiser signature |
| appraisee_signature | VARCHAR(500) | | Appraisee signature |
| status | VARCHAR(50) | DEFAULT 'draft' | Review status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_end_year_reviews_appraisal_id` on `appraisal_id`
- `idx_end_year_reviews_review_date` on `review_date`
- `idx_end_year_reviews_status` on `status`
- `idx_end_year_reviews_scores` on `total_score, average_score, weighted_score`

### competencies
Stores competency assessments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| appraisal_id | UUID | NOT NULL, FOREIGN KEY | Appraisal ID |
| competency_type | VARCHAR(50) | NOT NULL | Competency type |
| competency_name | VARCHAR(255) | NOT NULL | Competency name |
| description | TEXT | | Description |
| weight | DECIMAL(5,2) | DEFAULT 0.00 | Weight |
| mid_year_score | DECIMAL(5,2) | DEFAULT 0.00 | Mid-year score |
| end_year_score | DECIMAL(5,2) | DEFAULT 0.00 | End-year score |
| mid_year_comments | TEXT | | Mid-year comments |
| end_year_comments | TEXT | | End-year comments |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_competencies_appraisal_id` on `appraisal_id`
- `idx_competencies_type` on `competency_type`
- `idx_competencies_name` on `competency_name`

### signatures
Stores digital signatures.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| appraisal_id | UUID | NOT NULL, FOREIGN KEY | Appraisal ID |
| signatory_type | VARCHAR(50) | NOT NULL | Signatory type |
| signatory_id | UUID | FOREIGN KEY | Signatory user ID |
| signature_data | TEXT | NOT NULL | Signature data |
| signature_file_url | VARCHAR(500) | | Signature file URL |
| signed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Signature time |
| ip_address | INET | | IP address |
| user_agent | TEXT | | User agent |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

**Indexes:**
- `idx_signatures_appraisal_id` on `appraisal_id`
- `idx_signatures_signatory_type` on `signatory_type`
- `idx_signatures_signatory_id` on `signatory_id`
- `idx_signatures_signed_at` on `signed_at`

### access_requests
Stores access requests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| requester_id | UUID | NOT NULL, FOREIGN KEY | Requester user ID |
| target_user_id | UUID | FOREIGN KEY | Target user ID |
| request_type | VARCHAR(50) | NOT NULL | Request type |
| reason | TEXT | NOT NULL | Request reason |
| status | VARCHAR(50) | DEFAULT 'pending' | Request status |
| reviewed_by | UUID | FOREIGN KEY | Reviewer user ID |
| reviewed_at | TIMESTAMP | | Review time |
| review_notes | TEXT | | Review notes |
| expires_at | TIMESTAMP | | Expiration time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_access_requests_requester_id` on `requester_id`
- `idx_access_requests_target_user_id` on `target_user_id`
- `idx_access_requests_status` on `status`
- `idx_access_requests_type` on `request_type`
- `idx_access_requests_reviewed_by` on `reviewed_by`
- `idx_access_requests_created_at` on `created_at`

## Relationships

### Foreign Key Relationships
- `users.manager_id` → `users.id`
- `appraisals.employee_id` → `users.id`
- `appraisals.appraiser_id` → `users.id`
- `training_records.user_id` → `users.id`
- `key_result_areas.appraisal_id` → `appraisals.id`
- `mid_year_reviews.appraisal_id` → `appraisals.id`
- `end_year_reviews.appraisal_id` → `appraisals.id`
- `competencies.appraisal_id` → `appraisals.id`
- `signatures.appraisal_id` → `appraisals.id`
- `signatures.signatory_id` → `users.id`
- `access_requests.requester_id` → `users.id`
- `access_requests.target_user_id` → `users.id`
- `access_requests.reviewed_by` → `users.id`

## Data Types

### JSONB Fields
The following fields store JSON data:

- `appraisals.employee_info`: Employee personal information
- `appraisals.appraiser_info`: Appraiser information
- `appraisals.training_received`: Array of training records
- `appraisals.key_result_areas`: Array of key result areas
- `appraisals.mid_year_review`: Mid-year review data
- `appraisals.end_of_year_review`: End-year review data
- `appraisals.core_competencies`: Core competencies assessment
- `appraisals.non_core_competencies`: Non-core competencies assessment
- `appraisals.overall_assessment`: Overall assessment data
- `mid_year_reviews.target_reviews`: Target review data
- `mid_year_reviews.competency_reviews`: Competency review data
- `end_year_reviews.target_assessments`: Target assessment data
- `end_year_reviews.competency_assessments`: Competency assessment data

### Enums
The following fields use specific values:

- `appraisals.status`: 'draft', 'submitted', 'reviewed', 'closed'
- `appraisals.assessment_decision`: 'outstanding', 'suitable', 'likely_ready', 'not_ready', 'unlikely'
- `training_records.status`: 'planned', 'ongoing', 'completed', 'cancelled'
- `competencies.competency_type`: 'core', 'non_core'
- `signatures.signatory_type`: 'appraiser', 'appraisee', 'hod', 'hr'
- `access_requests.request_type`: 'appraisal_access', 'team_access', 'admin_access'
- `access_requests.status`: 'pending', 'approved', 'rejected'
- `mid_year_reviews.status`: 'draft', 'submitted', 'approved'
- `end_year_reviews.status`: 'draft', 'submitted', 'approved'

## Migrations
Database migrations are stored in `src/database/migrations/` and are numbered sequentially.

## Seeders
Database seeders are stored in `src/database/seeders/` and populate the database with initial data.
