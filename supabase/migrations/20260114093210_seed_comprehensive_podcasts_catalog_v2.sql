/*
  # Seed Comprehensive Podcasts Catalog
  
  1. Changes
    - Deletes all existing podcasts and episodes
    - Creates comprehensive podcast catalog aligned with course categories
    - Adds sample episodes for each podcast category
    
  2. New Podcasts
    Creates podcasts covering all major legal categories including:
    - Before Court, During Court, After Court
    - Communication & Behavior, Mental Readiness
    - Information & Organization
    - Civil Law, Criminal Law, Constitutional Law
    - Business Litigation, Commercial Law, Corporate Law
    - Contract Law, Property Law, Family Law
    - Employment Law, Labor Law, Tax Law
    - Intellectual Property, Technology Law, Cybersecurity
    - Environmental Law, Energy Law, Healthcare Law
    - International Law, Immigration Law, Human Rights
    - And many more specialized areas
    
  3. Features
    - Each podcast has relevant category alignment
    - Episodes include descriptions and XP rewards
    - All content is published and ready for use
*/

-- Delete existing podcast episodes first (due to foreign key)
DELETE FROM podcast_episodes;

-- Delete existing podcasts
DELETE FROM podcasts;

-- Insert comprehensive podcasts aligned with course categories

-- Court Preparation Categories
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000001', 'Before Court Essentials', 'Essential preparation steps before your court appearance. Learn how to organize documents, prepare evidence, and build your case strategy.', 'Legal Expert Panel', 'Before Court', 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg', true),
('10000001-0000-0000-0000-000000000002', 'Courtroom Mastery', 'Master courtroom procedures, etiquette, and presentation skills. Learn what happens during hearings and how to conduct yourself professionally.', 'Judge Sarah Miller', 'During Court', 'https://images.pexels.com/photos/8730555/pexels-photo-8730555.jpeg', true),
('10000001-0000-0000-0000-000000000003', 'After Court Actions', 'Navigate post-hearing procedures including appeals, enforcement, and compliance. Understand your options after the court decision.', 'Attorney David Chen', 'After Court', 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg', true),
('10000001-0000-0000-0000-000000000004', 'Court Communication Skills', 'Develop effective communication strategies for court. Learn to present arguments clearly and interact professionally with judges and court staff.', 'Communication Coach Lisa Brown', 'Communication & Behavior', 'https://images.pexels.com/photos/7876050/pexels-photo-7876050.jpeg', true),
('10000001-0000-0000-0000-000000000005', 'Mental Resilience for Legal Challenges', 'Build mental strength and manage stress during legal proceedings. Expert strategies for maintaining composure and confidence.', 'Dr. Robert Hayes', 'Mental Readiness', 'https://images.pexels.com/photos/6798397/pexels-photo-6798397.jpeg', true),
('10000001-0000-0000-0000-000000000006', 'Legal Organization Strategies', 'Master document organization, case management, and information systems for effective self-representation.', 'Paralegal Expert Team', 'Information & Organization', 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg', true);

-- Core Legal Areas
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000007', 'Civil Law Fundamentals', 'Comprehensive exploration of civil law principles, obligations, contracts, and civil liability in modern legal systems.', 'Professor James Wilson', 'Civil Law', 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg', true),
('10000001-0000-0000-0000-000000000008', 'Criminal Law Explained', 'Understanding criminal law, offenses, defenses, and criminal procedure. Essential knowledge for navigating the criminal justice system.', 'Former Prosecutor Maria Garcia', 'Criminal Law', 'https://images.pexels.com/photos/8112171/pexels-photo-8112171.jpeg', true),
('10000001-0000-0000-0000-000000000009', 'Constitutional Rights Today', 'Exploring constitutional law, fundamental rights, freedoms, and government powers in contemporary society.', 'Constitutional Scholar Dr. Thompson', 'Constitutional Law', 'https://images.pexels.com/photos/8111849/pexels-photo-8111849.jpeg', true),
('10000001-0000-0000-0000-000000000010', 'Civil Litigation Podcast', 'Deep dive into civil litigation procedures from filing to trial. Learn the entire litigation process step by step.', 'Litigation Attorney Panel', 'Civil Litigation', 'https://images.pexels.com/photos/5668774/pexels-photo-5668774.jpeg', true);

-- Business Law Categories
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000011', 'Business Litigation Strategies', 'Navigate business disputes with expert strategies for resolution through litigation and alternative methods.', 'Business Law Experts', 'Business Litigation', 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg', true),
('10000001-0000-0000-0000-000000000012', 'Commercial Law in Practice', 'Master commercial transactions, sales agreements, payment systems, and resolving commercial disputes.', 'Commercial Attorney Sarah Lee', 'Commercial Law', 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg', true),
('10000001-0000-0000-0000-000000000013', 'Corporate Governance Podcast', 'Learn corporate structure, governance, director duties, and corporate compliance requirements.', 'Corporate Law Team', 'Corporate Law', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg', true),
('10000001-0000-0000-0000-000000000014', 'Contract Law Essentials', 'Understanding contract formation, performance, breach, and remedies in various business contexts.', 'Contract Specialist Panel', 'Contract Law', 'https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg', true),
('10000001-0000-0000-0000-000000000015', 'M&A Insights', 'Comprehensive guide to mergers and acquisitions including due diligence, valuation, and deal structures.', 'M&A Attorney John Davis', 'Mergers & Acquisitions (M&A)', 'https://images.pexels.com/photos/7413916/pexels-photo-7413916.jpeg', true);

-- Specialized Business Law
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000016', 'Tax Law Today', 'Navigate income tax, business tax, and tax compliance with expert guidance and practical strategies.', 'Tax Attorney Rachel Green', 'Tax Law', 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg', true),
('10000001-0000-0000-0000-000000000017', 'Corporate Tax Strategies', 'Learn corporate tax planning, deductions, credits, and tax-efficient business structuring.', 'Tax Strategy Team', 'Corporate Tax', 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg', true),
('10000001-0000-0000-0000-000000000018', 'International Tax Law', 'Explore cross-border taxation, transfer pricing, tax treaties, and international tax planning.', 'International Tax Expert', 'International Tax Law', 'https://images.pexels.com/photos/3769120/pexels-photo-3769120.jpeg', true),
('10000001-0000-0000-0000-000000000019', 'Securities Law Podcast', 'Understanding securities offerings, trading regulations, disclosure requirements, and securities litigation.', 'Securities Attorney Panel', 'Securities Law', 'https://images.pexels.com/photos/6801872/pexels-photo-6801872.jpeg', true),
('10000001-0000-0000-0000-000000000020', 'Banking & Finance Law', 'Comprehensive overview of banking regulations, lending, secured transactions, and financial services law.', 'Finance Law Experts', 'Banking & Finance Law', 'https://images.pexels.com/photos/6771900/pexels-photo-6771900.jpeg', true);

-- Intellectual Property
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000021', 'IP Law Essentials', 'Introduction to intellectual property rights including patents, trademarks, copyrights, and trade secrets.', 'IP Attorney Susan Clark', 'Intellectual Property Law', 'https://images.pexels.com/photos/8112176/pexels-photo-8112176.jpeg', true),
('10000001-0000-0000-0000-000000000022', 'Patent Law Explained', 'Understanding patent applications, prosecution, validity, and patent litigation strategies.', 'Patent Expert Dr. Anderson', 'Patent Law', 'https://images.pexels.com/photos/5673488/pexels-photo-5673488.jpeg', true),
('10000001-0000-0000-0000-000000000023', 'Trademark Law Podcast', 'Learn trademark registration, protection, infringement, and effective brand management.', 'Trademark Attorney Team', 'Trademark Law', 'https://images.pexels.com/photos/6476804/pexels-photo-6476804.jpeg', true),
('10000001-0000-0000-0000-000000000024', 'Copyright in the Digital Age', 'Study copyright protection, infringement, fair use, and licensing in modern digital contexts.', 'Copyright Specialist Panel', 'Copyright Law', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', true),
('10000001-0000-0000-0000-000000000025', 'Trade Secrets Protection', 'Master trade secret identification, protection strategies, and misappropriation remedies.', 'Trade Secret Attorney', 'Trade Secrets Law', 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg', true);

-- Technology & Data
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000026', 'Technology Law Today', 'Navigate legal issues in technology including software, hardware, cloud services, and digital innovation.', 'Tech Law Expert Panel', 'Technology Law', 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg', true),
('10000001-0000-0000-0000-000000000027', 'Cybersecurity Law Podcast', 'Understanding cybersecurity regulations, breach notification, and security compliance obligations.', 'Cybersecurity Attorney', 'Cybersecurity Law', 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg', true),
('10000001-0000-0000-0000-000000000028', 'Data Protection & Privacy', 'Master data protection principles, privacy rights, GDPR, and compliance requirements.', 'Privacy Law Experts', 'Data Protection & Privacy Law', 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg', true),
('10000001-0000-0000-0000-000000000029', 'AI Law & Ethics', 'Explore legal and ethical issues in artificial intelligence including liability, bias, and regulation.', 'AI Law Scholar', 'Artificial Intelligence Law', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg', true),
('10000001-0000-0000-0000-000000000030', 'IT Contracts & Agreements', 'Study IT service agreements, software licenses, SaaS agreements, and technology disputes.', 'IT Law Team', 'IT Law', 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg', true);

-- Employment & Labor
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000031', 'Employment Law Essentials', 'Master employment contracts, termination, discrimination, and workplace rights for employers and employees.', 'Employment Attorney Lisa Martinez', 'Employment Law', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg', true),
('10000001-0000-0000-0000-000000000032', 'Labor Law & Unions', 'Study collective bargaining, union organizing, labor disputes, and labor-management relations.', 'Labor Law Expert', 'Labor Law', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg', true),
('10000001-0000-0000-0000-000000000033', 'Workplace Discrimination Law', 'Understand anti-discrimination laws, protected classes, harassment, and enforcement mechanisms.', 'Civil Rights Attorney', 'Workplace Discrimination Law', 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg', true),
('10000001-0000-0000-0000-000000000034', 'Occupational Health & Safety', 'Study workplace safety regulations, employer duties, worker rights, and safety compliance.', 'Safety Law Panel', 'Occupational Health & Safety Law', 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg', true);

-- Property & Real Estate
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000035', 'Property Law Fundamentals', 'Learn about property rights, real estate transactions, mortgages, and land use regulations.', 'Real Estate Attorney', 'Property Law / Real Estate Law', 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg', true),
('10000001-0000-0000-0000-000000000036', 'Construction Law Podcast', 'Learn construction contracts, project delivery, delays, defects, and construction disputes.', 'Construction Law Expert', 'Construction Law', 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg', true);

-- Family & Personal Law
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000037', 'Family Law Matters', 'Navigate divorce, custody, support, property division, and other family legal matters.', 'Family Law Attorney', 'Family Law', 'https://images.pexels.com/photos/4545168/pexels-photo-4545168.jpeg', true),
('10000001-0000-0000-0000-000000000038', 'Estate Planning & Trusts', 'Comprehensive guide to creating and managing trusts, estate planning strategies, and wealth transfer.', 'Estate Planning Expert', 'Trusts & Estates', 'https://images.pexels.com/photos/5668467/pexels-photo-5668467.jpeg', true),
('10000001-0000-0000-0000-000000000039', 'Inheritance Law Explained', 'Study wills, estates, probate procedures, and inheritance rights and disputes.', 'Probate Attorney', 'Inheritance / Succession Law', 'https://images.pexels.com/photos/5668842/pexels-photo-5668842.jpeg', true);

-- Regulatory & Compliance
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000040', 'Regulatory Compliance Today', 'Build effective compliance programs including policies, training, monitoring, and enforcement.', 'Compliance Officer Panel', 'Regulatory Compliance', 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg', true),
('10000001-0000-0000-0000-000000000041', 'Environmental Law Podcast', 'Study environmental regulation, permits, enforcement, and environmental liability.', 'Environmental Attorney', 'Environmental Law', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', true),
('10000001-0000-0000-0000-000000000042', 'Energy Law & Markets', 'Learn energy markets, regulation, renewable energy, and energy transactions.', 'Energy Law Expert', 'Energy Law', 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg', true),
('10000001-0000-0000-0000-000000000043', 'Healthcare Law Essentials', 'Learn healthcare regulation, patient rights, medical privacy, and healthcare compliance.', 'Healthcare Attorney', 'Healthcare Law', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg', true),
('10000001-0000-0000-0000-000000000044', 'Pharmaceutical Regulation', 'Study drug approval, marketing, safety regulation, and pharmaceutical litigation.', 'Pharma Law Expert', 'Pharmaceutical Law', 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg', true);

-- Financial Services & Compliance
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000045', 'Financial Regulation Podcast', 'Study banking regulation, securities law, and financial services compliance requirements.', 'Financial Regulatory Expert', 'Financial Regulation', 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg', true),
('10000001-0000-0000-0000-000000000046', 'Anti-Money Laundering', 'Master AML regulations, reporting requirements, and compliance programs.', 'AML Compliance Team', 'Anti-Money Laundering (AML)', 'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg', true),
('10000001-0000-0000-0000-000000000047', 'Financial Crime Prevention', 'Learn to identify, investigate, and prosecute financial crimes including money laundering.', 'Financial Crime Expert', 'Financial Crime', 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg', true),
('10000001-0000-0000-0000-000000000048', 'Fraud Law & Detection', 'Comprehensive study of fraud types, detection methods, and legal remedies.', 'Fraud Prevention Team', 'Fraud Law', 'https://images.pexels.com/photos/5668840/pexels-photo-5668840.jpeg', true);

-- International Law
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000049', 'International Law Today', 'Foundation in international law including sources, treaties, and international institutions.', 'International Law Scholar', 'International Law', 'https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg', true),
('10000001-0000-0000-0000-000000000050', 'International Trade Law', 'Study WTO law, trade agreements, tariffs, and international commercial transactions.', 'Trade Law Expert', 'International Trade Law', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg', true),
('10000001-0000-0000-0000-000000000051', 'International Arbitration', 'Master international commercial arbitration including treaties, procedures, and enforcement.', 'Arbitration Specialist', 'International Arbitration', 'https://images.pexels.com/photos/5668838/pexels-photo-5668838.jpeg', true),
('10000001-0000-0000-0000-000000000052', 'Cross-Border Transactions', 'Navigate multi-jurisdictional transactions including structuring, tax, and regulatory issues.', 'Cross-Border Attorney', 'Cross-Border Transactions', 'https://images.pexels.com/photos/3769120/pexels-photo-3769120.jpeg', true);

-- Specialized International
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000053', 'Immigration Law Guide', 'Learn immigration procedures, visas, citizenship, deportation, and immigration appeals.', 'Immigration Attorney', 'Immigration Law', 'https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg', true),
('10000001-0000-0000-0000-000000000054', 'Refugee & Asylum Law', 'Understand refugee status, asylum procedures, protection standards, and deportation defense.', 'Asylum Law Expert', 'Refugee & Asylum Law', 'https://images.pexels.com/photos/7710089/pexels-photo-7710089.jpeg', true),
('10000001-0000-0000-0000-000000000055', 'Human Rights Law', 'Explore international human rights law, treaties, enforcement mechanisms, and human rights litigation.', 'Human Rights Attorney', 'Human Rights Law', 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg', true),
('10000001-0000-0000-0000-000000000056', 'Sanctions Law Compliance', 'Understand sanctions regimes, compliance requirements, and enforcement mechanisms.', 'Sanctions Expert', 'Sanctions Law', 'https://images.pexels.com/photos/6801872/pexels-photo-6801872.jpeg', true);

-- Dispute Resolution
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000057', 'ADR Strategies', 'Explore alternative dispute resolution methods including mediation, arbitration, and negotiation.', 'ADR Specialist Panel', 'Alternative Dispute Resolution (ADR)', 'https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg', true),
('10000001-0000-0000-0000-000000000058', 'Arbitration Fundamentals', 'Learn arbitration procedures, agreements, awards, and enforcement in domestic and international contexts.', 'Arbitration Expert', 'Arbitration', 'https://images.pexels.com/photos/5668838/pexels-photo-5668838.jpeg', true),
('10000001-0000-0000-0000-000000000059', 'Mediation Skills', 'Develop skills in mediation processes, negotiation strategies, and settlement techniques.', 'Mediator Panel', 'Mediation', 'https://images.pexels.com/photos/8730558/pexels-photo-8730558.jpeg', true);

-- Litigation Specialties
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000060', 'Class Action Litigation', 'Understand class certification, representative actions, settlements, and mass tort litigation.', 'Class Action Attorney', 'Class Action Litigation', 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg', true),
('10000001-0000-0000-0000-000000000061', 'Constitutional Litigation', 'Master constitutional challenges, judicial review, and constitutional rights enforcement.', 'Constitutional Litigator', 'Constitutional Litigation', 'https://images.pexels.com/photos/8111849/pexels-photo-8111849.jpeg', true),
('10000001-0000-0000-0000-000000000062', 'Medical Malpractice Law', 'Understand medical negligence, standard of care, causation, and malpractice litigation.', 'Malpractice Attorney', 'Medical Malpractice Law', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg', true);

-- Administrative & Government
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000063', 'Administrative Law Podcast', 'Study administrative procedures, judicial review, and the relationship between agencies and citizens.', 'Administrative Law Expert', 'Administrative Law', 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg', true),
('10000001-0000-0000-0000-000000000064', 'Government Contracts', 'Learn public procurement, government contracting, bid protests, and contract administration.', 'Government Contract Attorney', 'Government Contracts', 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg', true),
('10000001-0000-0000-0000-000000000065', 'Public Procurement Law', 'Study public tendering, procurement procedures, fairness principles, and procurement challenges.', 'Procurement Law Expert', 'Public Procurement Law', 'https://images.pexels.com/photos/5668474/pexels-photo-5668474.jpeg', true);

-- Consumer & Tort Law
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000066', 'Consumer Protection Law', 'Understand consumer rights, unfair practices, product liability, and consumer remedies.', 'Consumer Rights Attorney', 'Consumer Protection Law', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg', true),
('10000001-0000-0000-0000-000000000067', 'Tort Law Essentials', 'Understand negligence, intentional torts, strict liability, and damage awards.', 'Tort Law Expert', 'Tort Law', 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg', true);

-- Insolvency & Restructuring
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000068', 'Bankruptcy & Insolvency', 'Navigate insolvency procedures, creditor rights, reorganization, and liquidation processes.', 'Bankruptcy Attorney', 'Insolvency / Bankruptcy Law', 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg', true),
('10000001-0000-0000-0000-000000000069', 'Corporate Restructuring', 'Learn restructuring strategies, debt reorganization, and turnaround management from legal perspective.', 'Restructuring Expert', 'Restructuring Law', 'https://images.pexels.com/photos/7413916/pexels-photo-7413916.jpeg', true);

-- Specialized Practice Areas
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000070', 'Insurance Law Podcast', 'Master insurance contracts, coverage disputes, bad faith claims, and insurance regulation.', 'Insurance Attorney', 'Insurance Law', 'https://images.pexels.com/photos/5668467/pexels-photo-5668467.jpeg', true),
('10000001-0000-0000-0000-000000000071', 'Competition Law Today', 'Understand competition law, merger control, cartels, and abuse of dominance.', 'Competition Law Expert', 'Competition / Antitrust Law', 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg', true),
('10000001-0000-0000-0000-000000000072', 'Entertainment & Media Law', 'Master entertainment contracts, rights clearance, defamation, and media regulation.', 'Entertainment Attorney', 'Entertainment & Media Law', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg', true),
('10000001-0000-0000-0000-000000000073', 'Sports Law Podcast', 'Study athlete contracts, sports governance, doping, intellectual property, and sports disputes.', 'Sports Law Expert', 'Sports Law', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg', true),
('10000001-0000-0000-0000-000000000074', 'Gaming & Gambling Law', 'Understand gaming regulation, licensing, responsible gaming, and gambling compliance.', 'Gaming Law Attorney', 'Gaming & Gambling Law', 'https://images.pexels.com/photos/3661193/pexels-photo-3661193.jpeg', true);

-- Emerging & Specialized Areas
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000075', 'Climate Change Law', 'Understand climate regulation, emissions trading, carbon pricing, and climate litigation.', 'Climate Law Expert', 'Climate Change Law', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', true),
('10000001-0000-0000-0000-000000000076', 'Sustainability & ESG', 'Study ESG disclosure, sustainable finance, corporate sustainability, and ESG compliance.', 'ESG Law Team', 'Sustainability & ESG Law', 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg', true),
('10000001-0000-0000-0000-000000000077', 'Education Law Podcast', 'Study education rights, school governance, special education, and education disputes.', 'Education Law Attorney', 'Education Law', 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg', true),
('10000001-0000-0000-0000-000000000078', 'Nonprofit Law Essentials', 'Learn nonprofit formation, tax-exemption, governance, fundraising, and compliance.', 'Nonprofit Attorney', 'Nonprofit / Charity Law', 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg', true);

-- Additional Specialized Areas
INSERT INTO podcasts (id, title, description, host_name, category, thumbnail_url, is_published) VALUES
('10000001-0000-0000-0000-000000000079', 'White-Collar Crime', 'Understand fraud, embezzlement, insider trading, and other business-related crimes.', 'White-Collar Defense Attorney', 'White-Collar Crime', 'https://images.pexels.com/photos/8112171/pexels-photo-8112171.jpeg', true),
('10000001-0000-0000-0000-000000000080', 'Cybercrime Law', 'Study computer crimes, hacking, data breaches, and digital forensics in criminal law.', 'Cybercrime Prosecutor', 'Cybercrime Law', 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg', true),
('10000001-0000-0000-0000-000000000081', 'Maritime Law Podcast', 'Learn maritime jurisdiction, shipping law, cargo claims, and maritime liens.', 'Admiralty Attorney', 'Maritime / Admiralty Law', 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg', true),
('10000001-0000-0000-0000-000000000082', 'Aviation & Transportation', 'Understand transportation regulation, aviation law, carrier liability, and safety standards.', 'Aviation Law Expert', 'Transportation & Aviation Law', 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg', true),
('10000001-0000-0000-0000-000000000083', 'Telecommunications Law', 'Study telecom regulation, licensing, spectrum management, and industry compliance.', 'Telecom Attorney', 'Telecommunications Law', 'https://images.pexels.com/photos/33999/pexels-photo.jpg', true),
('10000001-0000-0000-0000-000000000084', 'Infrastructure Law', 'Study infrastructure projects, public-private partnerships, financing, and regulatory frameworks.', 'Infrastructure Law Expert', 'Infrastructure Law', 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg', true);

-- Add sample episodes for first 10 podcasts to demonstrate functionality
INSERT INTO podcast_episodes (id, podcast_id, episode_number, title, description, audio_url, duration_minutes, published_date, is_published, xp_reward) VALUES
-- Before Court Essentials Episodes
('20000001-0000-0000-0000-000000000001', '10000001-0000-0000-0000-000000000001', 1, 'Essential Documents Checklist', 'Learn which documents you need to prepare before your court appearance and how to organize them effectively.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, '2024-01-15', true, 50),
('20000001-0000-0000-0000-000000000002', '10000001-0000-0000-0000-000000000001', 2, 'Building Your Case Strategy', 'Develop a winning strategy for your case by understanding legal arguments and evidence presentation.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, '2024-01-22', true, 50),
('20000001-0000-0000-0000-000000000003', '10000001-0000-0000-0000-000000000001', 3, 'Evidence Organization Techniques', 'Master the art of organizing and presenting evidence to support your case effectively.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 28, '2024-01-29', true, 50),

-- Courtroom Mastery Episodes  
('20000001-0000-0000-0000-000000000004', '10000001-0000-0000-0000-000000000002', 1, 'Courtroom Etiquette 101', 'Essential rules of courtroom behavior and how to address judges and court personnel properly.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 22, '2024-02-05', true, 50),
('20000001-0000-0000-0000-000000000005', '10000001-0000-0000-0000-000000000002', 2, 'Presenting Your Arguments', 'Learn how to present clear, persuasive arguments in court with confidence and professionalism.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 35, '2024-02-12', true, 50),
('20000001-0000-0000-0000-000000000006', '10000001-0000-0000-0000-000000000002', 3, 'Handling Cross-Examination', 'Strategies for responding to questions during cross-examination and maintaining composure.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 32, '2024-02-19', true, 50),

-- After Court Actions Episodes
('20000001-0000-0000-0000-000000000007', '10000001-0000-0000-0000-000000000003', 1, 'Understanding Court Orders', 'Learn how to read and interpret court orders and what steps to take next.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 26, '2024-02-26', true, 50),
('20000001-0000-0000-0000-000000000008', '10000001-0000-0000-0000-000000000003', 2, 'Appeals Process Explained', 'Comprehensive guide to filing appeals, deadlines, and what to expect during the appeals process.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 40, '2024-03-04', true, 50),
('20000001-0000-0000-0000-000000000009', '10000001-0000-0000-0000-000000000003', 3, 'Enforcement and Compliance', 'How to enforce court orders and ensure compliance with court decisions.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 29, '2024-03-11', true, 50),

-- Court Communication Skills Episodes
('20000001-0000-0000-0000-000000000010', '10000001-0000-0000-0000-000000000004', 1, 'Effective Legal Communication', 'Master the art of communicating legal concepts clearly and persuasively in court.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 27, '2024-03-18', true, 50),
('20000001-0000-0000-0000-000000000011', '10000001-0000-0000-0000-000000000004', 2, 'Body Language in Court', 'Understanding non-verbal communication and how it impacts your court presentation.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 24, '2024-03-25', true, 50),

-- Mental Resilience Episodes
('20000001-0000-0000-0000-000000000012', '10000001-0000-0000-0000-000000000005', 1, 'Managing Court Anxiety', 'Proven techniques to manage stress and anxiety before and during court proceedings.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, '2024-04-01', true, 50),
('20000001-0000-0000-0000-000000000013', '10000001-0000-0000-0000-000000000005', 2, 'Building Confidence for Court', 'Strategies to build and maintain confidence throughout your legal journey.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 28, '2024-04-08', true, 50),

-- Legal Organization Episodes
('20000001-0000-0000-0000-000000000014', '10000001-0000-0000-0000-000000000006', 1, 'Digital Case Management', 'Using technology to organize your case files, documents, and deadlines effectively.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, '2024-04-15', true, 50),
('20000001-0000-0000-0000-000000000015', '10000001-0000-0000-0000-000000000006', 2, 'Document Control Systems', 'Create a systematic approach to managing legal documents and maintaining version control.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 23, '2024-04-22', true, 50),

-- Civil Law Fundamentals Episodes
('20000001-0000-0000-0000-000000000016', '10000001-0000-0000-0000-000000000007', 1, 'Introduction to Civil Law', 'Overview of civil law principles and how they differ from other legal systems.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 33, '2024-04-29', true, 50),
('20000001-0000-0000-0000-000000000017', '10000001-0000-0000-0000-000000000007', 2, 'Civil Obligations Explained', 'Understanding civil obligations, contracts, and civil liability in modern law.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 36, '2024-05-06', true, 50),

-- Criminal Law Episodes
('20000001-0000-0000-0000-000000000018', '10000001-0000-0000-0000-000000000008', 1, 'Criminal Law Basics', 'Fundamental principles of criminal law including offenses and defenses.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 31, '2024-05-13', true, 50),
('20000001-0000-0000-0000-000000000019', '10000001-0000-0000-0000-000000000008', 2, 'Criminal Procedure Overview', 'Navigate the criminal justice process from arrest to trial.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 38, '2024-05-20', true, 50),

-- Constitutional Rights Episodes
('20000001-0000-0000-0000-000000000020', '10000001-0000-0000-0000-000000000009', 1, 'Your Constitutional Rights', 'Understanding your fundamental rights and freedoms under the constitution.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 34, '2024-05-27', true, 50),
('20000001-0000-0000-0000-000000000021', '10000001-0000-0000-0000-000000000009', 2, 'Government Powers and Limits', 'How constitutional law limits government power and protects individual rights.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 37, '2024-06-03', true, 50),

-- Civil Litigation Episodes
('20000001-0000-0000-0000-000000000022', '10000001-0000-0000-0000-000000000010', 1, 'Filing Your Lawsuit', 'Step-by-step guide to initiating a civil lawsuit and filing requirements.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 29, '2024-06-10', true, 50),
('20000001-0000-0000-0000-000000000023', '10000001-0000-0000-0000-000000000010', 2, 'Discovery Process', 'Understanding discovery, depositions, and evidence gathering in civil litigation.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 42, '2024-06-17', true, 50),
('20000001-0000-0000-0000-000000000024', '10000001-0000-0000-0000-000000000010', 3, 'Preparing for Trial', 'Complete trial preparation including witness preparation and trial strategy.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 45, '2024-06-24', true, 50);
