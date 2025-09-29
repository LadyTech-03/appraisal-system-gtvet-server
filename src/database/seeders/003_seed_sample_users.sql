-- Insert sample users for testing
-- All passwords are 'password123' (hashed with bcrypt)

-- Director-General
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    is_active
) VALUES (
    'DG001',
    'dg@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Dr. Kwame Asante',
    'Director-General',
    'Administration',
    'Executive Office',
    'Director-General',
    'Grade 20',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Deputy Director-General
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    manager_id,
    is_active
) VALUES (
    'DDG001',
    'ddg@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Prof. Ama Osei',
    'Deputy Director-General',
    'Administration',
    'Executive Office',
    'Deputy Director-General',
    'Grade 19',
    (SELECT id FROM users WHERE employee_id = 'DG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Director
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    manager_id,
    is_active
) VALUES (
    'DIR001',
    'director@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr. Kofi Mensah',
    'Director',
    'Academic Affairs',
    'Academic Planning',
    'Director of Academic Affairs',
    'Grade 18',
    (SELECT id FROM users WHERE employee_id = 'DDG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Principal
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    manager_id,
    is_active
) VALUES (
    'PRIN001',
    'principal@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Dr. Efua Adjei',
    'Principal',
    'Academic Affairs',
    'Institution Management',
    'Principal',
    'Grade 17',
    (SELECT id FROM users WHERE employee_id = 'DIR001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Head of Unit
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    manager_id,
    is_active
) VALUES (
    'HOD001',
    'hod@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr. Yaw Boateng',
    'Unit Head',
    'Academic Affairs',
    'Engineering Unit',
    'Head of Engineering',
    'Grade 16',
    (SELECT id FROM users WHERE employee_id = 'PRIN001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Senior Lecturer
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    manager_id,
    is_active
) VALUES (
    'SL001',
    'senior.lecturer@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Dr. Akosua Nyarko',
    'Senior Lecturer',
    'Academic Affairs',
    'Engineering Unit',
    'Senior Lecturer - Mechanical Engineering',
    'Grade 15',
    (SELECT id FROM users WHERE employee_id = 'HOD001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Lecturer
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    manager_id,
    is_active
) VALUES (
    'LEC001',
    'lecturer@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr. Kwaku Appiah',
    'Lecturer',
    'Academic Affairs',
    'Engineering Unit',
    'Lecturer - Electrical Engineering',
    'Grade 14',
    (SELECT id FROM users WHERE employee_id = 'HOD001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Assistant Lecturer
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    manager_id,
    is_active
) VALUES (
    'AL001',
    'assistant.lecturer@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Ms. Abena Serwaa',
    'Assistant Lecturer',
    'Academic Affairs',
    'Engineering Unit',
    'Assistant Lecturer - Civil Engineering',
    'Grade 13',
    (SELECT id FROM users WHERE employee_id = 'HOD001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Administrative Staff
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    manager_id,
    is_active
) VALUES (
    'ADM001',
    'admin.staff@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mrs. Grace Ofori',
    'Administrative Staff',
    'Administration',
    'Human Resources',
    'HR Officer',
    'Grade 12',
    (SELECT id FROM users WHERE employee_id = 'DDG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Support Staff
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    grade,
    manager_id,
    is_active
) VALUES (
    'SUP001',
    'support.staff@tvet.gov.gh',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr. Kofi Asante',
    'Support Staff',
    'Administration',
    'Maintenance',
    'Maintenance Officer',
    'Grade 10',
    (SELECT id FROM users WHERE employee_id = 'ADM001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;
