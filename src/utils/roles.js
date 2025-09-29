const ROLES = {
    // MANAGEMENT DIVISION
    'DIRECTOR_GENERAL': 'Director-General',
    'DEPUTY_DIRECTOR_GENERAL_MANAGEMENT': 'Deputy Director-General, Management Services',
    'DEPUTY_DIRECTOR_GENERAL_OPERATIONS': 'Deputy Director-General, Operations',
    'INTERNAL_AUDIT': 'Internal Audit',
    'LEGAL_SERVICES': 'Legal Services',
    'CORPORATE_AFFAIRS': 'Corporate Affairs',
    
    // OTHER DIVISIONS
    'HR_MANAGEMENT_HEAD': 'HR Management and Development Division Head',
    'FINANCE_DIVISION_HEAD': 'Finance Division Head',
    'ADMINISTRATION_DIVISION_HEAD': 'Administration Division Head',
    'RESEARCH_INNOVATION_HEAD': 'Research, Innovation, Monitoring & Evaluation Division Head',
    'EDUTECH_DIVISION_HEAD': 'EduTech Division Head',
    'INFRASTRUCTURE_PLANNING_HEAD': 'Infrastructure Planning & Development Division Head',
    'APPRENTICESHIP_DIVISION_HEAD': 'Apprenticeship Division Head',
    'PARTNERSHIPS_WEL_INCLUSION_HEAD': 'Partnerships,WEL and Inclusion Division Head',
    'TRAINING_ASSESSMENT_QUALITY_HEAD': 'Training Assessment and Quality Head',
    'REGIONAL_PARAMOUNTING': 'Regional Director',
    
    // UNITS
    'HR_PLANNING_ANALYSIS_UNIT_HEAD': 'HR Planning & Analysis Unit Head',
    'TALENT_MANAGEMENT_UNIT_HEAD': 'Talent Management & Development Unit Head',
    'ACCOUNTING_FINANCIAL_REPORTING_UNIT_HEAD': 'Accounting & Financial Reporting Unit Head',
    'BUDGETING_DISBURSEMENT_TREASURY_UNIT_HEAD': 'Budgeting, Disbursement & Treasury Unit Head',
    'GENERAL_ADMIN_UNIT_HEAD': 'General Admin Unit Head',
    'TRANSPORT_UNIT_HEAD': 'Transport Unit Head',
    'RECORDS_MANAGEMENT_UNIT_HEAD': 'Records Management Unit Head',
    'LIBRARY_UNIT_HEAD': 'Library Unit Head',
    'PROCUREMENT_UNIT_HEAD': 'Procurement Unit Head',
    'POLICY_PLANNING_UNIT_HEAD': 'Policy Planning Unit Head',
    'RESEARCH_INNOVATION_UNIT_HEAD': 'Research & Innovation Unit Head',
    'MONITORING_EVALUATION_UNIT_HEAD': 'Monitoring & Evaluation Unit Head',
    'SYSTEM_ACCESS_EDUCATIONAL_DELIVERY_UNIT_HEAD': 'System Access & Educational Delivery Unit Head',
    'MANAGEMENT_INFORMATION_SYSTEMS_UNIT_HEAD': 'Management Information Systems Unit Head',
    'PLANNING_DEVELOPMENT_UNIT_HEAD': 'Planning & Development Unit Head',
    'FACILITIES_MANAGEMENT_UNIT_HEAD': 'Facilities Management Unit Head',
    'APPRENTICESHIP_SKILLS_DELIVERY_UNIT_HEAD': 'Apprenticeship Skills Delivery Unit Head',
    'APPRENTICESHIP_COORDINATION_UNIT_HEAD': 'Apprenticeship Coordination Unit Head',
    'PARTNERSHIP_RESOURCE_MOBILISATION_UNIT_HEAD': 'Partnership & Resource Mobilisation Unit Head',
    'WEL_UNIT_HEAD': 'WEL Unit Head',
    'DIVERSITY_INCLUSIVE_EDUCATION_UNIT_HEAD': 'Diversity & Inclusive Education Unit Head',
    'TRAINING_DEVELOPMENT_UNIT_HEAD': 'Training & Development Unit Head',
    'ASSESSMENT_QUALITY_ASSURANCE_UNIT_HEAD': 'Assessment & Quality Assurance Unit Head',
    'CAREER_GUIDANCE_COUNSELLING_UNIT_HEAD': 'Career Guidance & Counselling Unit Head',
    'TECHNICAL_INSTITUTIONS_UNIT_HEAD': 'Technical Institutions Unit Head',
    
    // GENERAL POSITIONS
    'SUPERVISOR': 'Supervisor',
    'STAFF_OFFICER': 'Staff Officer'
  };
  
  // Get array of role values
  const ROLE_VALUES = Object.values(ROLES);

  // Get Divisions
  const DIVISIONS = {
    'MANAGEMENT_DIRECTORATE': 'Management Directorate',
    'HR_MANAGEMENT_AND_DEVELOPMENT': 'HR Management and Development',
    'FINANCE': 'Finance',
    'ADMINISTRATION': 'Administration',
    'RESEARCH_INNOVATION_MONITORING_AND_EVALUATION': 'Research, Innovation, Monitoring & Evaluation',
    'EDUTECH': 'EduTech',
    'INFRASTRUCTURE_PLANNING_DEVELOPMENT': 'Infrastructure Planning & Development',
    'APPRENTICESHIP': 'Apprenticeship',
    'PARTNERSHIPS_WEL_INCLUSION': 'Partnerships, WEL & Inclusion',
    'TRAINING_ASSESSMENT_QUALITY': 'Training, Assessment & Quality Assurance',
    'REGIONAL_DIRECTORATE': 'Regional Directorate'
  }

  // Get array of division values
  const DIVISION_VALUES = Object.values(DIVISIONS);

  // Get Units
  const UNITS = {
    'HR_PLANNING_AND_ANALYSIS': 'HR Planning & Analysis',
    'TALENT_MANAGEMENT': 'Talent Management & Development',
    'ACCOUNTING_AND_FINANCIAL_REPORTING': 'Accounting & Financial Reporting',
    'BUDGETING_DISBURSEMENT_AND_TREASURY': 'Budgeting, Disbursement & Treasury',
    'GENERAL_ADMIN': 'General Admin',
    'TRANSPORT': 'Transport',
    'RECORDS_MANAGEMENT': 'Records Management',
    'LIBRARY': 'Library',
    'PROCUREMENT': 'Procurement',
    'POLICY_PLANNING': 'Policy Planning',
    'RESEARCH_INNOVATION': 'Research & Innovation',
    'MONITORING_EVALUATION': 'Monitoring & Evaluation',
    'SYSTEM_ACCESS_EDUCATIONAL_DELIVERY': 'System Access & Educational Delivery',
    'MANAGEMENT_INFORMATION_SYSTEMS': 'Management Information Systems',
    'PLANNING_DEVELOPMENT': 'Planning & Development',
    'FACILITIES_MANAGEMENT': 'Facilities Management',
    'APPRENTICESHIP_SKILLS_DELIVERY': 'Apprenticeship Skills Delivery',
    'APPRENTICESHIP_COORDINATION': 'Apprenticeship Coordination',
    'PARTNERSHIP_RESOURCE_MOBILISATION': 'Partnership & Resource Mobilisation',
    'WEL': 'WEL',
    'DIVERSITY_INCLUSIVE_EDUCATION': 'Diversity & Inclusive Education',
    'TRAINING_DEVELOPMENT': 'Training & Development',
    'ASSESSMENT_QUALITY_ASSURANCE': 'Assessment & Quality Assurance',
    'CAREER_GUIDANCE_COUNSELLING': 'Career Guidance & Counselling',
    'TECHNICAL_INSTITUTIONS': 'Technical Institutions',
  }

  // Get array of unit values
  const UNIT_VALUES = Object.values(UNITS);

  
  
  module.exports = {
    ROLES,
    ROLE_VALUES,
    DIVISIONS,
    DIVISION_VALUES,
    UNITS,
    UNIT_VALUES
  };