/*
  # Seed Comprehensive Course Catalog

  1. Purpose
    - Add sample courses for all major category groups
    - Provide at least one course per category to enable filtering and search

  2. Categories Covered
    - Court Preparation (Before Court, During Court, Communication & Behavior, Mental Readiness, Information & Organization, After Court)
    - Core / General Law Subjects (Constitutional, Administrative, Civil, Criminal, Procedural, Evidence, Jurisprudence, Comparative)
    - Private Law (Contract, Tort, Property, Family, Inheritance, Trusts, Consumer Protection)
    - Commercial & Business Law (Corporate, Company, Commercial, Business Litigation, Shareholder, M&A, Insolvency, Restructuring, Securities, Banking, Investment)
    - Employment & Labor Law
    - Public Law & Government
    - Criminal & Enforcement
    - Litigation & Dispute Resolution
    - Intellectual Property
    - Technology & Data
    - Regulatory & Compliance
    - International & Cross-Border
    - Sector-Specific Law
    - Tax & Finance
    - Environmental & Sustainability
    - Human Rights & Social Law
    - Education & Nonprofit
    - Military & Security

  3. Course Details
    - Each course includes title, description, category, difficulty level, estimated hours
    - Difficulty levels: beginner, intermediate, advanced
    - Courses marked as free with certificates enabled
*/

-- Court Preparation Courses
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Preparing Before Court: Essential Checklist', 'Master the critical steps to take before your court appearance including document preparation, evidence organization, and case strategy.', 'Before Court', 'beginner', 8, true, true, now(), now()),
  ('Courtroom Conduct and Procedures', 'Learn proper courtroom etiquette, procedures, and how to conduct yourself during hearings and trials.', 'During Court', 'beginner', 6, true, true, now(), now()),
  ('Effective Communication in Court', 'Develop strong communication skills for presenting arguments, addressing judges, and interacting with court personnel.', 'Communication & Behavior', 'intermediate', 10, true, true, now(), now()),
  ('Mental Preparation for Court', 'Build mental resilience and confidence to handle the stress and pressure of court proceedings.', 'Mental Readiness', 'beginner', 5, true, true, now(), now()),
  ('Document Organization and Case Management', 'Learn systematic approaches to organizing legal documents, evidence, and case files for easy access.', 'Information & Organization', 'intermediate', 7, true, true, now(), now()),
  ('Post-Hearing Actions and Follow-Up', 'Understand the steps to take after your court hearing including orders, appeals, and compliance requirements.', 'After Court', 'intermediate', 6, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Core / General Law Subjects
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Constitutional Law Fundamentals', 'Explore the foundations of constitutional law including rights, freedoms, and government powers.', 'Constitutional Law', 'intermediate', 20, true, true, now(), now()),
  ('Administrative Law Essentials', 'Study administrative procedures, judicial review, and the relationship between government agencies and citizens.', 'Administrative Law', 'intermediate', 18, true, true, now(), now()),
  ('Civil Law Principles', 'Comprehensive overview of civil law principles including obligations, contracts, and civil liability.', 'Civil Law', 'beginner', 15, true, true, now(), now()),
  ('Criminal Law Overview', 'Understand the fundamentals of criminal law including offenses, defenses, and criminal procedure.', 'Criminal Law', 'intermediate', 25, true, true, now(), now()),
  ('Procedural Law in Practice', 'Master court procedures, filing requirements, and litigation processes from start to finish.', 'Procedural Law', 'intermediate', 22, true, true, now(), now()),
  ('Evidence Law and Rules', 'Learn the rules of evidence including admissibility, relevance, hearsay, and expert testimony.', 'Evidence Law', 'advanced', 20, true, true, now(), now()),
  ('Introduction to Jurisprudence', 'Explore legal philosophy, theories of law, and jurisprudential thought from historical to modern perspectives.', 'Jurisprudence / Legal Theory', 'advanced', 16, true, true, now(), now()),
  ('Comparative Law Systems', 'Compare common law and civil law systems along with other legal traditions around the world.', 'Comparative Law', 'advanced', 14, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Private Law (Civil / Commercial)
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Contract Law Essentials', 'Master the principles of contract formation, performance, breach, and remedies.', 'Contract Law', 'intermediate', 20, true, true, now(), now()),
  ('Tort Law and Civil Liability', 'Understand negligence, intentional torts, strict liability, and damage awards.', 'Tort Law', 'intermediate', 18, true, true, now(), now()),
  ('Property and Real Estate Law', 'Learn about property rights, real estate transactions, mortgages, and land use regulations.', 'Property Law / Real Estate Law', 'intermediate', 22, true, true, now(), now()),
  ('Family Law Fundamentals', 'Navigate divorce, custody, support, property division, and family legal matters.', 'Family Law', 'intermediate', 16, true, true, now(), now()),
  ('Inheritance and Succession Law', 'Study wills, estates, probate procedures, and inheritance rights and disputes.', 'Inheritance / Succession Law', 'intermediate', 14, true, true, now(), now()),
  ('Trusts and Estate Planning', 'Comprehensive guide to creating and managing trusts, estate planning strategies, and wealth transfer.', 'Trusts & Estates', 'advanced', 18, true, true, now(), now()),
  ('Consumer Protection Law', 'Understand consumer rights, unfair practices, product liability, and consumer remedies.', 'Consumer Protection Law', 'beginner', 12, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Commercial & Business Law
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Corporate Law Fundamentals', 'Learn corporate structure, governance, duties of directors, and corporate compliance.', 'Corporate Law', 'intermediate', 24, true, true, now(), now()),
  ('Company Law in Practice', 'Comprehensive study of company formation, management, shareholder rights, and dissolution.', 'Company Law', 'intermediate', 20, true, true, now(), now()),
  ('Commercial Law Essentials', 'Master sales agreements, commercial transactions, payment systems, and commercial disputes.', 'Commercial Law', 'intermediate', 18, true, true, now(), now()),
  ('Business Litigation Strategies', 'Learn strategies for resolving business disputes through litigation and alternative methods.', 'Business Litigation', 'advanced', 22, true, true, now(), now()),
  ('Shareholder Rights and Disputes', 'Understand shareholder agreements, rights, remedies, and dispute resolution mechanisms.', 'Shareholder Law', 'advanced', 16, true, true, now(), now()),
  ('Mergers and Acquisitions', 'Comprehensive guide to M&A transactions including due diligence, valuation, and deal structures.', 'Mergers & Acquisitions (M&A)', 'advanced', 28, true, true, now(), now()),
  ('Insolvency and Bankruptcy Law', 'Navigate insolvency procedures, creditor rights, reorganization, and liquidation processes.', 'Insolvency / Bankruptcy Law', 'advanced', 20, true, true, now(), now()),
  ('Corporate Restructuring', 'Learn restructuring strategies, debt reorganization, and turnaround management from legal perspective.', 'Restructuring Law', 'advanced', 18, true, true, now(), now()),
  ('Securities Law and Regulation', 'Study securities offerings, trading regulations, disclosure requirements, and securities litigation.', 'Securities Law', 'advanced', 24, true, true, now(), now()),
  ('Banking and Finance Law', 'Comprehensive overview of banking regulations, lending, secured transactions, and financial services law.', 'Banking & Finance Law', 'intermediate', 22, true, true, now(), now()),
  ('Investment Law and Regulation', 'Understand investment vehicles, fund management, investor protection, and regulatory compliance.', 'Investment Law', 'advanced', 20, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Employment & Labor Law
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Employment Law Fundamentals', 'Master employment contracts, termination, discrimination, and workplace rights.', 'Employment Law', 'intermediate', 18, true, true, now(), now()),
  ('Labor Law and Unions', 'Study collective bargaining, union organizing, labor disputes, and labor relations.', 'Labor Law', 'intermediate', 16, true, true, now(), now()),
  ('Workplace Discrimination Law', 'Understand anti-discrimination laws, protected classes, harassment, and enforcement mechanisms.', 'Workplace Discrimination Law', 'intermediate', 14, true, true, now(), now()),
  ('Collective Bargaining Law', 'Learn negotiation processes, collective agreements, and labor-management relations.', 'Collective Bargaining Law', 'advanced', 15, true, true, now(), now()),
  ('Occupational Health and Safety', 'Study workplace safety regulations, employer duties, worker rights, and safety compliance.', 'Occupational Health & Safety Law', 'intermediate', 12, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Public Law & Government
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Public International Law', 'Explore international legal principles, treaties, state sovereignty, and international organizations.', 'Public International Law', 'advanced', 26, true, true, now(), now()),
  ('Constitutional Litigation', 'Master constitutional challenges, judicial review, and constitutional rights enforcement.', 'Constitutional Litigation', 'advanced', 24, true, true, now(), now()),
  ('Government Contracts Law', 'Learn public procurement, government contracting, bid protests, and contract administration.', 'Government Contracts', 'intermediate', 18, true, true, now(), now()),
  ('Regulatory Law Essentials', 'Understand regulatory frameworks, compliance requirements, and regulatory enforcement.', 'Regulatory Law', 'intermediate', 16, true, true, now(), now()),
  ('Public Procurement Law', 'Study public tendering, procurement procedures, fairness principles, and challenges.', 'Public Procurement Law', 'intermediate', 14, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Criminal & Enforcement
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('White-Collar Crime', 'Understand fraud, embezzlement, insider trading, and other business-related crimes.', 'White-Collar Crime', 'advanced', 22, true, true, now(), now()),
  ('Financial Crime Investigation', 'Learn to identify, investigate, and prosecute financial crimes including money laundering.', 'Financial Crime', 'advanced', 20, true, true, now(), now()),
  ('Fraud Law and Prevention', 'Comprehensive study of fraud types, detection methods, and legal remedies.', 'Fraud Law', 'intermediate', 16, true, true, now(), now()),
  ('Anti-Money Laundering Compliance', 'Master AML regulations, reporting requirements, and compliance programs.', 'Anti-Money Laundering (AML)', 'advanced', 18, true, true, now(), now()),
  ('Cybercrime Law', 'Study computer crimes, hacking, data breaches, and digital forensics in criminal law.', 'Cybercrime Law', 'advanced', 20, true, true, now(), now()),
  ('International Sanctions Law', 'Understand sanctions regimes, compliance requirements, and enforcement mechanisms.', 'Sanctions Law', 'advanced', 16, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Litigation & Dispute Resolution
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Commercial Litigation Practice', 'Master business dispute litigation from pleadings through trial and appeals.', 'Commercial Litigation', 'advanced', 28, true, true, now(), now()),
  ('Arbitration Fundamentals', 'Learn arbitration procedures, agreements, awards, and enforcement in domestic and international contexts.', 'Arbitration', 'intermediate', 18, true, true, now(), now()),
  ('Mediation and Negotiation', 'Develop skills in mediation processes, negotiation strategies, and settlement techniques.', 'Mediation', 'intermediate', 14, true, true, now(), now()),
  ('Alternative Dispute Resolution', 'Explore ADR methods including mediation, arbitration, negotiation, and collaborative law.', 'Alternative Dispute Resolution (ADR)', 'intermediate', 16, true, true, now(), now()),
  ('Class Action Litigation', 'Understand class certification, representative actions, settlements, and mass tort litigation.', 'Class Action Litigation', 'advanced', 24, true, true, now(), now()),
  ('International Arbitration', 'Master international commercial arbitration including treaties, procedures, and enforcement.', 'International Arbitration', 'advanced', 26, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Intellectual Property
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Intellectual Property Law Overview', 'Comprehensive introduction to IP rights including patents, trademarks, copyrights, and trade secrets.', 'Intellectual Property Law', 'intermediate', 20, true, true, now(), now()),
  ('Copyright Law and Practice', 'Study copyright protection, infringement, fair use, and licensing in the digital age.', 'Copyright Law', 'intermediate', 16, true, true, now(), now()),
  ('Trademark Law Essentials', 'Learn trademark registration, protection, infringement, and brand management.', 'Trademark Law', 'intermediate', 14, true, true, now(), now()),
  ('Patent Law Fundamentals', 'Understand patent applications, prosecution, validity, and patent litigation.', 'Patent Law', 'advanced', 24, true, true, now(), now()),
  ('Trade Secrets Protection', 'Master trade secret identification, protection strategies, and misappropriation remedies.', 'Trade Secrets Law', 'intermediate', 12, true, true, now(), now()),
  ('IP Licensing and Transactions', 'Learn to structure, negotiate, and draft intellectual property licenses and transfers.', 'Licensing Law', 'advanced', 18, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Technology & Data
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Technology Law Essentials', 'Navigate legal issues in technology including software, hardware, and digital services.', 'Technology Law', 'intermediate', 18, true, true, now(), now()),
  ('IT Law and Contracts', 'Study IT service agreements, software licenses, SaaS agreements, and technology disputes.', 'IT Law', 'intermediate', 16, true, true, now(), now()),
  ('Data Protection and Privacy Law', 'Master data protection principles, privacy rights, and compliance requirements.', 'Data Protection & Privacy Law', 'intermediate', 20, true, true, now(), now()),
  ('GDPR Compliance', 'Comprehensive guide to GDPR requirements, implementation, and enforcement.', 'GDPR / Privacy Compliance', 'advanced', 22, true, true, now(), now()),
  ('Cybersecurity Law', 'Understand cybersecurity regulations, breach notification, and security compliance obligations.', 'Cybersecurity Law', 'advanced', 18, true, true, now(), now()),
  ('Artificial Intelligence Law', 'Explore legal and ethical issues in AI including liability, bias, transparency, and regulation.', 'Artificial Intelligence Law', 'advanced', 20, true, true, now(), now()),
  ('Platform Regulation', 'Study regulation of digital platforms, content moderation, and platform liability.', 'Platform Regulation', 'advanced', 16, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Regulatory & Compliance
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Regulatory Compliance Programs', 'Build effective compliance programs including policies, training, and monitoring.', 'Regulatory Compliance', 'intermediate', 16, true, true, now(), now()),
  ('Financial Regulation', 'Study banking regulation, securities law, and financial services compliance.', 'Financial Regulation', 'advanced', 24, true, true, now(), now()),
  ('Competition and Antitrust Law', 'Understand competition law, merger control, cartels, and abuse of dominance.', 'Competition / Antitrust Law', 'advanced', 22, true, true, now(), now()),
  ('Consumer Regulation', 'Learn consumer protection regulations, advertising standards, and consumer remedies.', 'Consumer Regulation', 'intermediate', 14, true, true, now(), now()),
  ('Telecommunications Law', 'Study telecom regulation, licensing, spectrum management, and industry compliance.', 'Telecommunications Law', 'intermediate', 16, true, true, now(), now()),
  ('Energy Regulation', 'Understand energy sector regulation, markets, renewable energy, and regulatory frameworks.', 'Energy Regulation', 'intermediate', 18, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- International & Cross-Border
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('International Law Essentials', 'Foundation in international law including sources, treaties, and international institutions.', 'International Law', 'intermediate', 20, true, true, now(), now()),
  ('International Trade Law', 'Study WTO law, trade agreements, tariffs, and international commercial transactions.', 'International Trade Law', 'advanced', 24, true, true, now(), now()),
  ('Customs Law and Practice', 'Learn customs procedures, classification, valuation, and customs compliance.', 'Customs Law', 'intermediate', 14, true, true, now(), now()),
  ('WTO Law and Dispute Settlement', 'Master WTO agreements, dispute resolution procedures, and trade remedies.', 'WTO Law', 'advanced', 20, true, true, now(), now()),
  ('Cross-Border Transactions', 'Navigate multi-jurisdictional transactions including structuring, tax, and regulatory issues.', 'Cross-Border Transactions', 'advanced', 22, true, true, now(), now()),
  ('Private International Law', 'Study conflict of laws, jurisdiction, choice of law, and recognition of foreign judgments.', 'Conflict of Laws / Private International Law', 'advanced', 18, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Sector-Specific Law
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Healthcare Law Fundamentals', 'Learn healthcare regulation, patient rights, medical privacy, and healthcare compliance.', 'Healthcare Law', 'intermediate', 18, true, true, now(), now()),
  ('Medical Malpractice Law', 'Understand medical negligence, standard of care, causation, and malpractice litigation.', 'Medical Malpractice Law', 'advanced', 20, true, true, now(), now()),
  ('Pharmaceutical Law', 'Study drug approval, marketing, safety regulation, and pharmaceutical litigation.', 'Pharmaceutical Law', 'advanced', 18, true, true, now(), now()),
  ('Insurance Law Essentials', 'Master insurance contracts, coverage disputes, bad faith, and insurance regulation.', 'Insurance Law', 'intermediate', 16, true, true, now(), now()),
  ('Construction Law', 'Learn construction contracts, project delivery, delays, defects, and construction disputes.', 'Construction Law', 'intermediate', 20, true, true, now(), now()),
  ('Infrastructure Law', 'Study infrastructure projects, public-private partnerships, financing, and regulatory frameworks.', 'Infrastructure Law', 'advanced', 18, true, true, now(), now()),
  ('Transportation and Aviation Law', 'Understand transportation regulation, aviation law, carrier liability, and safety standards.', 'Transportation & Aviation Law', 'intermediate', 16, true, true, now(), now()),
  ('Maritime and Admiralty Law', 'Learn maritime jurisdiction, shipping law, cargo claims, and maritime liens.', 'Maritime / Admiralty Law', 'advanced', 20, true, true, now(), now()),
  ('Sports Law', 'Study athlete contracts, sports governance, doping, intellectual property, and sports disputes.', 'Sports Law', 'intermediate', 14, true, true, now(), now()),
  ('Entertainment and Media Law', 'Master entertainment contracts, rights clearance, defamation, and media regulation.', 'Entertainment & Media Law', 'intermediate', 18, true, true, now(), now()),
  ('Gaming and Gambling Law', 'Understand gaming regulation, licensing, responsible gaming, and gambling compliance.', 'Gaming & Gambling Law', 'intermediate', 14, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Tax & Finance
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Tax Law Fundamentals', 'Comprehensive overview of income tax, business tax, and tax compliance.', 'Tax Law', 'intermediate', 22, true, true, now(), now()),
  ('International Tax Law', 'Study cross-border taxation, transfer pricing, tax treaties, and international tax planning.', 'International Tax Law', 'advanced', 24, true, true, now(), now()),
  ('Corporate Tax Planning', 'Learn corporate tax strategies, deductions, credits, and tax-efficient structuring.', 'Corporate Tax', 'advanced', 20, true, true, now(), now()),
  ('VAT and Sales Tax', 'Understand value-added tax, sales tax, collection, reporting, and compliance.', 'VAT / Sales Tax', 'intermediate', 14, true, true, now(), now()),
  ('Transfer Pricing', 'Master transfer pricing principles, documentation, disputes, and advance pricing agreements.', 'Transfer Pricing', 'advanced', 18, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Environmental & Sustainability
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Environmental Law Essentials', 'Study environmental regulation, permits, enforcement, and environmental liability.', 'Environmental Law', 'intermediate', 18, true, true, now(), now()),
  ('Climate Change Law', 'Understand climate regulation, emissions trading, carbon pricing, and climate litigation.', 'Climate Change Law', 'advanced', 20, true, true, now(), now()),
  ('Energy Law Fundamentals', 'Learn energy markets, regulation, renewable energy, and energy transactions.', 'Energy Law', 'intermediate', 16, true, true, now(), now()),
  ('Sustainability and ESG Law', 'Study ESG disclosure, sustainable finance, corporate sustainability, and ESG compliance.', 'Sustainability & ESG Law', 'intermediate', 14, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Human Rights & Social Law
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Human Rights Law', 'Explore international human rights law, treaties, enforcement mechanisms, and human rights litigation.', 'Human Rights Law', 'intermediate', 20, true, true, now(), now()),
  ('Refugee and Asylum Law', 'Understand refugee status, asylum procedures, protection standards, and deportation.', 'Refugee & Asylum Law', 'intermediate', 16, true, true, now(), now()),
  ('Immigration Law', 'Learn immigration procedures, visas, citizenship, deportation, and immigration appeals.', 'Immigration Law', 'intermediate', 18, true, true, now(), now()),
  ('Social Security Law', 'Study social benefits, disability claims, pension rights, and social security appeals.', 'Social Security Law', 'intermediate', 14, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Education & Nonprofit
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Education Law', 'Study education rights, school governance, special education, and education disputes.', 'Education Law', 'intermediate', 14, true, true, now(), now()),
  ('Nonprofit and Charity Law', 'Learn nonprofit formation, tax-exemption, governance, fundraising, and compliance.', 'Nonprofit / Charity Law', 'intermediate', 16, true, true, now(), now()),
  ('NGO Law and Regulation', 'Understand NGO registration, operations, foreign funding, and regulatory compliance.', 'NGO Law', 'intermediate', 12, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Military & Security
INSERT INTO courses (title, description, category, difficulty_level, estimated_hours, is_free, certificate_enabled, created_at, updated_at)
VALUES
  ('Military Law', 'Study military justice, courts-martial, military offenses, and servicemember rights.', 'Military Law', 'advanced', 18, true, true, now(), now()),
  ('National Security Law', 'Understand national security powers, surveillance, terrorism laws, and security clearances.', 'National Security Law', 'advanced', 20, true, true, now(), now())
ON CONFLICT (id) DO NOTHING;
