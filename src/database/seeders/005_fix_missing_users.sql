

-- APPRAISER 1
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
    'AP001',
    'appraiser-1@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Maxwell',
    'Kufuor',
    NULL,
    'Male',
    '2020-01-15',
    'Director-General',
    'Management Directorate',
    'Director General',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- APPRAISEE 1

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
    'APE001',
    'appraisee-1@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Kojo',
    'Nyantakyi',
    NULL,
    'Male',
    '2020-02-01',
    'Deputy Director-General',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'AP001'),
    true
) ON CONFLICT (employee_id) DO NOTHING;


-- APPRAISER 2
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
    'AP002',
    'appraiser-2@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mrs',
    'Patricia',
    'Amoateng',
    NULL,
    'Female',
    '2020-01-15',
    'Director-General',
    'Management Directorate',
    'Director General',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- APPRAISEE 2

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
    'APE002',
    'appraisee-2@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Owusu',
    'Kwadwo',
    NULL,
    'Male',
    '2020-02-01',
    'Deputy Director-General',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'AP002'),
    true
) ON CONFLICT (employee_id) DO NOTHING;


-- APPRAISER 3
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
    'AP003',
    'appraiser-3@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Asare',
    'Addo',
    NULL,
    'Male',
    '2020-01-15',
    'Director-General',
    'Management Directorate',
    'Director General',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- APPRAISEE 3

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
    'APE003',
    'appraisee-3@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mrs',
    'Comfort',
    'Andoh',
    NULL,
    'Female',
    '2020-02-01',
    'Deputy Director-General',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'AP003'),
    true
) ON CONFLICT (employee_id) DO NOTHING;


-- APPRAISER 4
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
    'AP004',
    'appraiser-4@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Daniel',
    'Amanfo',
    NULL,
    'Male',
    '2020-01-15',
    'Director-General',
    'Management Directorate',
    'Director General',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- APPRAISEE 4

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
    'APE004',
    'appraisee-4@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'George',
    'Quansah',
    NULL,
    'Male',
    '2020-02-01',
    'Deputy Director-General',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'AP004'),
    true
) ON CONFLICT (employee_id) DO NOTHING;


-- APPRAISER 5
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
    'AP005',
    'appraiser-5@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Mawuli',
    'Adu',
    NULL,
    'Male',
    '2020-01-15',
    'Director-General',
    'Management Directorate',
    'Director General',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- APPRAISEE 5

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
    'APE005',
    'appraisee-5@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Efua',
    'Adjaye',
    NULL,
    'Female',
    '2020-02-01',
    'Deputy Director-General',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'AP005'),
    true
) ON CONFLICT (employee_id) DO NOTHING;


-- APPRAISER 6
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
    'AP006',
    'appraiser-6@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Ebenezer ',
    'Nduom',
    NULL,
    'Male',
    '2020-01-15',
    'Director-General',
    'Management Directorate',
    'Director General',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- APPRAISEE 6

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
    'APE006',
    'appraisee-6@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Dorcas',
    'Amanfo',
    NULL,
    'Female',
    '2020-02-01',
    'Deputy Director-General',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'AP006'),
    true
) ON CONFLICT (employee_id) DO NOTHING;


-- APPRAISER 7 
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
    'AP007',
    'appraiser-7@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mrs',
    'Evelyn ',
    'Boateng',
    NULL,
    'Female',
    '2020-01-15',
    'Director-General',
    'Management Directorate',
    'Director General',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- APPRAISEE 7

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
    'APE007',
    'appraisee-7@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Berko ',
    'Awuah',
    NULL,
    'Male',
    '2020-02-01',
    'Deputy Director-General',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'AP007'),
    true
) ON CONFLICT (employee_id) DO NOTHING;


-- APPRAISER 8
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
    'AP008',
    'appraiser-8@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mrs',
    'Diana ',
    'Amanfo',
    NULL,
    'Female',
    '2020-01-15',
    'Director-General',
    'Management Directorate',
    'Director General',
    true
) ON CONFLICT (employee_id) DO NOTHING;

-- APPRAISEE 8

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
    'APE008',
    'appraisee-8@tvet.com',
    '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q',
    'Mr',
    'Berko ',
    'Amissah',
    NULL,
    'Male',
    '2020-02-01',
    'Deputy Director-General',
    'Management Directorate',
    'Deputy Director-General',
    (SELECT id FROM users WHERE employee_id = 'AP008'),
    true
) ON CONFLICT (employee_id) DO NOTHING;
