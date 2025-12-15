-- Insert sample users for testing with simplified fields
-- All passwords are 'password123' (hashed with bcrypt)

-- Director-General
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    title,
    first_name,
    surname,
    other_names,
    gender,
    appointment_date,
    role,
    division,
    position,
    is_active
) VALUES (
    'DG001',
    'dg@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Frank',
    'Koomson',
    NULL,
    'Male',
    '2020-01-15',
    'Director-General',
    'Management Directorate',
    'Director General',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Deputy Director-General, Management Services
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    title,
    first_name,
    surname,
    other_names,
    gender,
    appointment_date,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'DDG001',
    'ddgms@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Joseph',
    'Quaye',
    NULL,
    'Male',
    '2020-02-01',
    'Deputy Director-General, Management Services',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'DG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Deputy Director-General, Operations  
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    title,
    first_name,
    surname,
    other_names,
    gender,
    appointment_date,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'DDG002',
    'ddgo@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Joseph',
    'Quaye',
    NULL,
    'Male',
    '2020-02-01',
    'Deputy Director-General, Operations',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'DG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- HR Management and Development Division Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    title,
    first_name,
    surname,
    gender,
    appointment_date,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'HRD001',
    'hrd@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Kwame',
    'Adu',
    'Male',
    '2020-03-10',
    'HR Management and Development Division Head',
    'HR Management and Development',
    'HR Management and Development Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- HR Planning & Analysis Unit Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    title,
    first_name,
    surname,
    gender,
    appointment_date,
    role,
    division,
    unit,
    position,
    manager_id,
    is_active
) VALUES (
    'HPR001',
    'hpr@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mrs',
    'Ama',
    'Osei',
    'Female',
    '2021-05-20',
    'HR Planning & Analysis Unit Head',
    'HR Management and Development',
    'HR Planning & Analysis',
    'HR Planning & Analysis Unit Head',
    (SELECT id FROM users WHERE employee_id = 'HRD001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Talent Management & Development Unit Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    title,
    first_name,
    surname,
    gender,
    appointment_date,
    role,
    division,
    unit,
    position,
    manager_id,
    is_active
) VALUES (
    'TM001',
    'tm@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mrs',
    'Priscilla',
    'Quansah',
    'Female',
    '2021-06-01',
    'Talent Management & Development Unit Head',
    'HR Management and Development',
    'Talent Management & Development',
    'Talent Management & Development Unit Head',
    (SELECT id FROM users WHERE employee_id = 'HRD001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;
