/*
  # Seed Comprehensive Business Resources

  1. Purpose
    - Add sample business resources for all major category groups
    - Provide at least one resource per category to enable filtering and search

  2. Categories Covered
    - All categories matching the Course Catalog structure
    - Each resource provides practical guidance and essential information

  3. Resource Details
    - Each resource includes title, subtitle, content, and category
    - Resources marked as published
    - Content formatted in markdown-like syntax for rendering
*/

-- Court Preparation Resources
INSERT INTO business_resources (title, subtitle, content, category, order_index, is_published, created_at, updated_at)
VALUES
  ('Before Court Preparation Guide', 'Essential steps before your court appearance', '# Before Court Preparation\n\nBefore appearing in court, thorough preparation is essential for success.\n\n## Key Steps\n\n- Gather all relevant documents and evidence\n- Review your case timeline and facts\n- Prepare your arguments and key points\n- Research applicable laws and precedents\n- Organize materials in a logical order\n\n## What to Bring\n\n- All relevant documents\n- Evidence and exhibits\n- Pen and notepad\n- List of questions or points to address\n\n## Final Checklist\n\n- Confirm court date, time, and location\n- Dress appropriately\n- Arrive early\n- Turn off mobile devices', 'Before Court', 1, true, now(), now()),
  
  ('During Court Best Practices', 'How to conduct yourself in the courtroom', '# Courtroom Conduct\n\nProper conduct during court proceedings demonstrates respect and professionalism.\n\n## General Rules\n\n- Stand when the judge enters or leaves\n- Address the judge appropriately\n- Speak clearly and respectfully\n- Wait for your turn to speak\n- Avoid interrupting others\n\n## Communication Tips\n\n- Answer questions directly and honestly\n- Admit when you don''t know something\n- Stay calm and composed\n- Avoid emotional outbursts\n\n## What to Avoid\n\n- Arguing with the judge\n- Speaking out of turn\n- Using inappropriate language\n- Showing disrespect to opposing counsel', 'During Court', 2, true, now(), now()),
  
  ('Effective Court Communication', 'Master communication skills for court', '# Communication & Behavior in Court\n\n## Speaking Effectively\n\n- Use clear, simple language\n- Organize your thoughts before speaking\n- Make eye contact appropriately\n- Control your pace and volume\n\n## Body Language\n\n- Maintain good posture\n- Avoid fidgeting\n- Show attentiveness\n- Project confidence\n\n## Responding to Questions\n\n- Listen carefully to the full question\n- Take a moment to think before responding\n- Answer truthfully and directly\n- Ask for clarification if needed', 'Communication & Behavior', 3, true, now(), now()),
  
  ('Mental Readiness for Court', 'Prepare your mind for court proceedings', '# Mental Preparation\n\n## Managing Stress\n\n- Practice relaxation techniques\n- Get adequate sleep before court\n- Exercise to reduce anxiety\n- Visualize positive outcomes\n\n## Building Confidence\n\n- Know your case thoroughly\n- Practice presenting your arguments\n- Remind yourself of your rights\n- Trust in your preparation\n\n## Staying Focused\n\n- Minimize distractions beforehand\n- Stay present during proceedings\n- Take notes to maintain engagement\n- Remember your purpose', 'Mental Readiness', 4, true, now(), now()),
  
  ('Document Organization Guide', 'Organize your case materials effectively', '# Information & Organization\n\n## Filing System\n\n- Create clearly labeled folders\n- Use chronological order\n- Keep originals separate from copies\n- Maintain a master index\n\n## Digital Organization\n\n- Scan important documents\n- Use cloud backup\n- Create searchable file names\n- Maintain version control\n\n## Quick Reference\n\n- Create a case summary\n- List key dates and deadlines\n- Note important contacts\n- Track all correspondence', 'Information & Organization', 5, true, now(), now()),
  
  ('After Court Actions', 'Steps to take after your hearing', '# Post-Court Procedures\n\n## Immediate Actions\n\n- Review any orders or judgments\n- Note important dates and deadlines\n- Request copies of documents if needed\n- Follow up on required actions\n\n## Understanding Orders\n\n- Read orders carefully\n- Note compliance requirements\n- Understand appeal deadlines\n- Seek clarification if confused\n\n## Next Steps\n\n- Comply with court orders\n- File necessary follow-up documents\n- Monitor case status\n- Consider appeal options if applicable', 'After Court', 6, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Core Law Subjects Resources (selecting key ones)
INSERT INTO business_resources (title, subtitle, content, category, order_index, is_published, created_at, updated_at)
VALUES
  ('Constitutional Rights Overview', 'Understanding your fundamental rights', '# Constitutional Law Basics\n\n## Fundamental Rights\n\n- Right to due process\n- Freedom of speech\n- Equal protection under law\n- Right to counsel\n\n## Government Powers\n\n- Separation of powers\n- Checks and balances\n- Federal vs state authority\n- Constitutional limitations\n\n## Protecting Your Rights\n\n- Know your constitutional rights\n- Assert rights when appropriate\n- Seek legal advice for violations\n- Understand remedies available', 'Constitutional Law', 7, true, now(), now()),
  
  ('Civil Law Essentials', 'Key principles of civil law', '# Civil Law Overview\n\n## Types of Civil Cases\n\n- Contract disputes\n- Property matters\n- Personal injury\n- Family law issues\n\n## Civil Procedure\n\n- Filing a complaint\n- Service of process\n- Discovery phase\n- Trial and judgment\n\n## Remedies\n\n- Monetary damages\n- Injunctions\n- Specific performance\n- Declaratory relief', 'Civil Law', 8, true, now(), now()),
  
  ('Criminal Law Guide', 'Understanding criminal proceedings', '# Criminal Law Fundamentals\n\n## Criminal Process\n\n- Investigation\n- Arrest and charges\n- Arraignment\n- Trial or plea\n\n## Your Rights\n\n- Right to remain silent\n- Right to attorney\n- Right to fair trial\n- Protection from self-incrimination\n\n## Defenses\n\n- Alibi\n- Self-defense\n- Insanity\n- Lack of intent', 'Criminal Law', 9, true, now(), now()),
  
  ('Evidence in Court', 'Understanding rules of evidence', '# Evidence Law Basics\n\n## Types of Evidence\n\n- Documentary evidence\n- Testimonial evidence\n- Physical evidence\n- Digital evidence\n\n## Admissibility\n\n- Relevance requirement\n- Authentication\n- Hearsay rules\n- Privilege considerations\n\n## Presenting Evidence\n\n- Proper foundation\n- Chain of custody\n- Expert testimony\n- Demonstrative exhibits', 'Evidence Law', 10, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Private Law Resources
INSERT INTO business_resources (title, subtitle, content, category, order_index, is_published, created_at, updated_at)
VALUES
  ('Contract Law Basics', 'Essential contract principles', '# Contract Law Fundamentals\n\n## Contract Formation\n\n- Offer and acceptance\n- Consideration\n- Mutual assent\n- Legal capacity\n\n## Contract Terms\n\n- Express terms\n- Implied terms\n- Conditions and warranties\n- Exclusion clauses\n\n## Breach and Remedies\n\n- Material breach\n- Anticipatory breach\n- Damages\n- Specific performance', 'Contract Law', 11, true, now(), now()),
  
  ('Property Rights Guide', 'Understanding property law', '# Property Law Essentials\n\n## Property Types\n\n- Real property\n- Personal property\n- Intellectual property\n- Joint ownership\n\n## Property Rights\n\n- Ownership rights\n- Leasehold interests\n- Easements\n- Mortgages\n\n## Transfers\n\n- Sales and purchases\n- Gifts\n- Inheritance\n- Adverse possession', 'Property Law / Real Estate Law', 12, true, now(), now()),
  
  ('Family Law Matters', 'Navigating family legal issues', '# Family Law Overview\n\n## Common Issues\n\n- Divorce and separation\n- Child custody and support\n- Spousal support\n- Property division\n\n## Child Custody\n\n- Legal vs physical custody\n- Best interests standard\n- Parenting plans\n- Modification of orders\n\n## Support Obligations\n\n- Child support calculations\n- Spousal support factors\n- Modification procedures\n- Enforcement mechanisms', 'Family Law', 13, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Business Law Resources
INSERT INTO business_resources (title, subtitle, content, category, order_index, is_published, created_at, updated_at)
VALUES
  ('Corporate Law Fundamentals', 'Essential corporate principles', '# Corporate Law Basics\n\n## Corporate Structure\n\n- Formation and incorporation\n- Board of directors\n- Officers and management\n- Shareholders\n\n## Corporate Governance\n\n- Fiduciary duties\n- Decision-making processes\n- Conflicts of interest\n- Compliance requirements\n\n## Corporate Actions\n\n- Mergers and acquisitions\n- Stock issuance\n- Dividends\n- Dissolution', 'Corporate Law', 14, true, now(), now()),
  
  ('Business Litigation Overview', 'Understanding business disputes', '# Business Litigation\n\n## Common Disputes\n\n- Contract breaches\n- Partnership disputes\n- Shareholder conflicts\n- Intellectual property\n\n## Litigation Strategy\n\n- Evaluate case strength\n- Consider settlement\n- Preserve evidence\n- Manage costs\n\n## Alternative Resolution\n\n- Mediation\n- Arbitration\n- Negotiation\n- Settlement agreements', 'Business Litigation', 15, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Employment Law Resources
INSERT INTO business_resources (title, subtitle, content, category, order_index, is_published, created_at, updated_at)
VALUES
  ('Employment Rights Guide', 'Know your workplace rights', '# Employment Law Basics\n\n## Employee Rights\n\n- Fair wages and hours\n- Safe workplace\n- Freedom from discrimination\n- Protection from retaliation\n\n## Employment Contracts\n\n- At-will employment\n- Written agreements\n- Non-compete clauses\n- Severance terms\n\n## Termination\n\n- Lawful vs wrongful termination\n- Notice requirements\n- Final pay\n- Unemployment benefits', 'Employment Law', 16, true, now(), now()),
  
  ('Workplace Discrimination', 'Recognizing and addressing discrimination', '# Workplace Discrimination Law\n\n## Protected Classes\n\n- Race and color\n- Sex and gender\n- Age\n- Disability\n- Religion and national origin\n\n## Types of Discrimination\n\n- Hiring discrimination\n- Unequal pay\n- Harassment\n- Retaliation\n\n## Filing Claims\n\n- Document incidents\n- Report internally\n- File with EEOC or equivalent\n- Consider legal action', 'Workplace Discrimination Law', 17, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Litigation & Dispute Resolution
INSERT INTO business_resources (title, subtitle, content, category, order_index, is_published, created_at, updated_at)
VALUES
  ('Civil Litigation Process', 'Understanding civil litigation', '# Civil Litigation Guide\n\n## Litigation Stages\n\n- Pleadings\n- Discovery\n- Pre-trial motions\n- Trial\n- Appeal\n\n## Discovery Process\n\n- Interrogatories\n- Document requests\n- Depositions\n- Expert witnesses\n\n## Trial Preparation\n\n- Organize evidence\n- Prepare witnesses\n- Develop strategy\n- Practice presentations', 'Civil Litigation', 18, true, now(), now()),
  
  ('Alternative Dispute Resolution', 'Resolving disputes outside court', '# ADR Methods\n\n## Mediation\n\n- Neutral mediator facilitates\n- Voluntary process\n- Confidential discussions\n- Parties control outcome\n\n## Arbitration\n\n- Binding decision\n- Arbitrator hears evidence\n- Less formal than court\n- Limited appeal rights\n\n## Benefits of ADR\n\n- Faster resolution\n- Lower costs\n- Privacy maintained\n- Preserved relationships', 'Alternative Dispute Resolution (ADR)', 19, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Intellectual Property
INSERT INTO business_resources (title, subtitle, content, category, order_index, is_published, created_at, updated_at)
VALUES
  ('Intellectual Property Overview', 'Protecting your IP rights', '# IP Rights Guide\n\n## Types of IP\n\n- Patents\n- Trademarks\n- Copyrights\n- Trade secrets\n\n## Patent Protection\n\n- Utility patents\n- Design patents\n- Application process\n- Patent duration\n\n## Trademark Protection\n\n- Brand identification\n- Registration benefits\n- Trademark search\n- Enforcement\n\n## Copyright Basics\n\n- Automatic protection\n- Registration advantages\n- Fair use\n- Infringement remedies', 'Intellectual Property Law', 20, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Technology & Data
INSERT INTO business_resources (title, subtitle, content, category, order_index, is_published, created_at, updated_at)
VALUES
  ('Data Protection Guide', 'Protecting personal data', '# Data Protection Basics\n\n## Key Principles\n\n- Lawful processing\n- Purpose limitation\n- Data minimization\n- Accuracy\n- Storage limitation\n- Security\n\n## Individual Rights\n\n- Right to access\n- Right to rectification\n- Right to erasure\n- Right to data portability\n\n## Compliance\n\n- Privacy policies\n- Consent mechanisms\n- Data breach procedures\n- Accountability measures', 'Data Protection & Privacy Law', 21, true, now(), now()),
  
  ('Cybersecurity Essentials', 'Protecting against cyber threats', '# Cybersecurity Law\n\n## Security Obligations\n\n- Implement safeguards\n- Monitor systems\n- Incident response plan\n- Regular updates\n\n## Breach Response\n\n- Contain the breach\n- Assess impact\n- Notify affected parties\n- Report to authorities\n\n## Best Practices\n\n- Encryption\n- Access controls\n- Employee training\n- Regular audits', 'Cybersecurity Law', 22, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Additional Key Categories
INSERT INTO business_resources (title, subtitle, content, category, order_index, is_published, created_at, updated_at)
VALUES
  ('Tax Law Basics', 'Understanding tax obligations', '# Tax Law Fundamentals\n\n## Tax Types\n\n- Income tax\n- Business tax\n- Property tax\n- Sales tax\n\n## Tax Compliance\n\n- Filing requirements\n- Payment deadlines\n- Record keeping\n- Deductions and credits\n\n## Tax Disputes\n\n- Audits\n- Appeals process\n- Tax court\n- Settlement options', 'Tax Law', 23, true, now(), now()),
  
  ('Environmental Compliance', 'Meeting environmental obligations', '# Environmental Law\n\n## Key Regulations\n\n- Air quality standards\n- Water protection\n- Waste management\n- Land use restrictions\n\n## Compliance Requirements\n\n- Permits and licenses\n- Reporting obligations\n- Environmental assessments\n- Remediation duties\n\n## Enforcement\n\n- Inspections\n- Penalties\n- Corrective actions\n- Legal defenses', 'Environmental Law', 24, true, now(), now()),
  
  ('Immigration Law Guide', 'Navigating immigration processes', '# Immigration Law Basics\n\n## Visa Types\n\n- Work visas\n- Student visas\n- Family-based visas\n- Temporary vs permanent\n\n## Application Process\n\n- Gather documentation\n- Complete forms\n- Submit applications\n- Attend interviews\n\n## Rights and Obligations\n\n- Maintaining status\n- Work authorization\n- Travel restrictions\n- Path to citizenship', 'Immigration Law', 25, true, now(), now()),
  
  ('Insurance Law Essentials', 'Understanding insurance matters', '# Insurance Law Overview\n\n## Policy Types\n\n- Property insurance\n- Liability insurance\n- Life insurance\n- Health insurance\n\n## Policy Terms\n\n- Coverage limits\n- Exclusions\n- Deductibles\n- Premiums\n\n## Claims Process\n\n- Reporting claims\n- Documentation required\n- Investigation\n- Settlement or denial\n\n## Disputes\n\n- Bad faith claims\n- Coverage disputes\n- Appraisal process\n- Litigation options', 'Insurance Law', 26, true, now(), now())
ON CONFLICT (id) DO NOTHING;
