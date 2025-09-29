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
    position,
    is_active
) VALUES (
    'DG001',
    'dg@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Frank Koomson',
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
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'DDG001',
    'ddgms@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Joseph Quaye',
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
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'DDG002',
    'ddgo@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Joseph Quaye',
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
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'HRD001',
    'hrd@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Kwame Adu',
    'HR Management and Development Division Head',
    'HR Management and Development',
    'HR Management and Development Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Finance Division Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'FD001',
    'fd@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'David Tettey',
    'Finance Division Head',
    'HR Management and Development',
    'Finance Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Administration Division Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'AD001',
    'ad@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Ernest Frempong',
    'Administration Division Head',
    'HR Management and Development',
    'Administration Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Research, Innovation, Monitoring & Evaluation Division Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'RIMED001',
    'rimed@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Felix Danquah',
    'Research, Innovation, Monitoring & Evaluation Division Head',
    'Research, Innovation, Monitoring & Evaluation',
    'Research, Innovation, Monitoring & Evaluation Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- EduTech Division Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'ETD001',
    'etd@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Joseph Quarshie',
    'EduTech Division Head',
    'EduTech',
    'EduTech Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG002'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Infrastructure Planning & Development Division Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'IPDD001',
    'ipdd@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'David Iddrisu',
    'Infrastructure Planning & Development Division Head',
    'Infrastructure Planning & Development',
    'Infrastructure Planning & Development Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG002'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Apprenticeship Division Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'APP001',
    'app@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Samuel Yeboah',
    'Apprenticeship Division Head',
    'Apprenticeship',
    'Apprenticeship Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG002'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Partnerships, WEL and Inclusion Division Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'PWI001',
    'pwi@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Kwame Osei',
    'Partnerships, WEL and Inclusion Division Head',
    'Partnerships, WEL and Inclusion',
    'Partnerships, WEL and Inclusion Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG002'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Training, Assessment and Quality Assurance Division Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'TAQ001',
    'taq@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'James Nkansah',
    'Training, Assessment and Quality Assurance Division Head',
    'Training, Assessment and Quality Assurance',
    'Training, Assessment and Quality Assurance Division Head',
    (SELECT id FROM users WHERE employee_id = 'DDG002'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- Regional Directorate
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    position,
    manager_id,
    is_active
) VALUES (
    'RD001',
    'rd@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'William Sarfo',
    'Regional Director',
    'Regional Directorate',
    'Regional Director',
    (SELECT id FROM users WHERE employee_id = 'DDG002'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- HR Planning & Analysis Unit Head
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
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
    'Ama Osei',
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
    name,
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
    'Priscilla Quansah',
    'Talent Management & Development Unit Head',
    'HR Management and Development',
    'Talent Management & Development',
    'Talent Management & Development Unit Head',
    (SELECT id FROM users WHERE employee_id = 'HRD001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- HR Planning & Analysis Unit Supervisor
INSERT INTO users (
    employee_id,
    email,
    password_hash,
    name,
    role,
    division,
    unit,
    position,
    manager_id,
    is_active
) VALUES (
    'HPRS001',
    'hprs@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Isaac Adu',
    'HR Planning & Analysis Unit Supervisor',
    'HR Management and Development',
    'HR Planning & Analysis',
    'HR Planning & Analysis Unit Supervisor',
    (SELECT id FROM users WHERE employee_id = 'HPR001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;
