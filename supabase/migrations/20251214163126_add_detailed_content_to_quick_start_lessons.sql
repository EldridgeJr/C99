/*
  # Add Detailed Content to Civil Litigation Quick Start Lessons

  ## Overview
  Updates all lessons in the Quick Start course with comprehensive, realistic educational content.
  Content is structured as JSON to support different lesson types (video, reading, interactive, quiz).

  ## Content Structure
  - Video lessons: description, key_points, transcript
  - Reading lessons: sections with formatted text
  - Interactive lessons: scenarios and exercises
  - Quiz lessons: questions array with options and correct answers

  ## Security
  - Uses existing RLS policies on lessons table
*/

-- Module 1, Lesson 1: What is Civil Litigation?
UPDATE lessons
SET content = jsonb_build_object(
  'description', 'Welcome to your first lesson! In this video, we''ll explain what civil litigation is, how it differs from criminal cases, and why understanding these basics is essential for your case.',
  'key_points', jsonb_build_array(
    'Civil litigation resolves disputes between individuals, businesses, or organizations',
    'Unlike criminal cases, civil cases seek compensation or specific actions, not punishment',
    'The plaintiff initiates the case; the defendant responds',
    'Most civil cases settle before trial through negotiation'
  ),
  'transcript', 'Civil litigation is the legal process used to resolve disputes between parties when they cannot reach an agreement on their own. Unlike criminal law, where the government prosecutes individuals for breaking laws, civil litigation involves private parties seeking remedies for wrongs or enforcement of rights.

In a civil case, one party—called the plaintiff—files a complaint against another party—the defendant—seeking compensation (damages) or specific actions (like enforcing a contract or stopping certain behavior). The standard of proof is lower than in criminal cases: instead of "beyond a reasonable doubt," civil cases require a "preponderance of evidence," meaning it''s more likely than not that the claim is valid.

Common examples include contract disputes, personal injury cases, property disagreements, and family law matters. Understanding that you''re in a civil case helps you know what to expect: you''re seeking a legal remedy, and the process follows specific procedural rules designed to be fair to both sides.'
)::text
WHERE id = '25c59222-eb44-4aa9-b3f0-5d8b01d5dc76';

-- Module 1, Lesson 2: Your Rights and Responsibilities
UPDATE lessons
SET content = jsonb_build_object(
  'description', 'Learn about your fundamental rights in civil court and the responsibilities you must fulfill as either a plaintiff or defendant.',
  'key_points', jsonb_build_array(
    'You have the right to legal representation and a fair hearing',
    'You must respond to court deadlines and document requests',
    'Both parties have equal rights to present evidence and witnesses',
    'You are responsible for following court procedures and rules'
  ),
  'transcript', 'Whether you''re the plaintiff or defendant, you have important rights in civil litigation. First, you have the right to be heard—to present your side of the story, submit evidence, and call witnesses. You have the right to legal representation, though in civil cases (unlike criminal), you''re not entitled to a court-appointed attorney if you cannot afford one.

You also have the right to due process, meaning proper notice of all proceedings, adequate time to prepare, and the opportunity to respond to claims against you. The court must treat both parties fairly and impartially.

With these rights come responsibilities. You must comply with all court orders and deadlines. If you''re served with documents, you must respond within the specified timeframe—typically 20-30 days. You''re expected to participate in discovery, providing requested documents and answering questions truthfully. You must appear at scheduled hearings and follow courtroom procedures and etiquette.

As the plaintiff, you bear the burden of proof—you must demonstrate your claim is valid. As the defendant, you have the right to challenge the plaintiff''s evidence and present your own defense. Both parties are responsible for acting in good faith throughout the process.'
)::text
WHERE id = 'fed66847-4eaa-4168-905d-8e0cd9744a8b';

-- Module 1, Lesson 3: Common Types of Civil Cases
UPDATE lessons
SET content = jsonb_build_object(
  'sections', jsonb_build_array(
    jsonb_build_object(
      'title', 'Introduction',
      'content', 'Civil litigation encompasses many types of disputes. Understanding where your case fits helps you know what legal standards apply and what evidence you''ll need to present.'
    ),
    jsonb_build_object(
      'title', 'Contract Disputes',
      'content', 'These cases arise when one party alleges another party breached (failed to fulfill) the terms of a written or oral agreement. Examples include:\n\n• Business contracts\n• Real estate agreements\n• Employment contracts\n• Service agreements\n\nTo win, the plaintiff must prove: (1) a valid contract existed, (2) they fulfilled their obligations, (3) the defendant breached the contract, and (4) the breach caused damages.'
    ),
    jsonb_build_object(
      'title', 'Personal Injury (Tort) Cases',
      'content', 'These involve claims that someone''s negligent or intentional actions caused physical, emotional, or financial harm. Common examples:\n\n• Car accidents\n• Slip and fall incidents\n• Medical malpractice\n• Defamation\n\nThe plaintiff must typically prove the defendant owed a duty of care, breached that duty, and caused measurable harm.'
    ),
    jsonb_build_object(
      'title', 'Property Disputes',
      'content', 'These cases involve disagreements over ownership, boundaries, or use of real or personal property:\n\n• Boundary disputes between neighbors\n• Landlord-tenant conflicts\n• Easement disputes\n• Title claims\n\nEvidence often includes deeds, surveys, photographs, and expert testimony.'
    ),
    jsonb_build_object(
      'title', 'Debt Collection',
      'content', 'Creditors may file civil lawsuits to recover unpaid debts. These cases involve:\n\n• Credit card debts\n• Medical bills\n• Personal loans\n• Business debts\n\nDefendants can challenge the amount owed, claim payment was made, or assert the debt is not valid.'
    ),
    jsonb_build_object(
      'title', 'Key Takeaway',
      'content', 'Each type of civil case has specific legal elements that must be proven. Understanding your case type helps you gather the right evidence and make appropriate legal arguments.'
    )
  )
)::text
WHERE id = '3b7af188-22f5-435a-9eec-578d1eef4db6';

-- Module 1, Lesson 4: Quiz - Case Basics
UPDATE lessons
SET content = jsonb_build_object(
  'questions', jsonb_build_array(
    jsonb_build_object(
      'question', 'What is the main difference between civil and criminal litigation?',
      'options', jsonb_build_array(
        'Civil cases involve government prosecution, criminal cases involve private parties',
        'Civil cases seek compensation or remedies, criminal cases seek punishment',
        'Civil cases always go to trial, criminal cases usually settle',
        'There is no difference between civil and criminal litigation'
      ),
      'correct_answer', 1,
      'explanation', 'Civil litigation involves disputes between private parties seeking compensation or specific remedies, while criminal cases involve the government prosecuting individuals for violating laws, with punishment as the outcome.'
    ),
    jsonb_build_object(
      'question', 'In a civil case, what standard of proof must the plaintiff meet?',
      'options', jsonb_build_array(
        'Beyond a reasonable doubt',
        'Preponderance of evidence',
        'Clear and convincing evidence',
        'Absolute certainty'
      ),
      'correct_answer', 1,
      'explanation', 'Civil cases require a "preponderance of evidence," meaning it''s more likely than not (greater than 50% probability) that the claim is true. This is lower than the criminal standard of "beyond a reasonable doubt."'
    ),
    jsonb_build_object(
      'question', 'Who initiates a civil lawsuit?',
      'options', jsonb_build_array(
        'The defendant',
        'The judge',
        'The plaintiff',
        'The prosecutor'
      ),
      'correct_answer', 2,
      'explanation', 'The plaintiff is the party who files the complaint and initiates the civil lawsuit, claiming they have been wronged and seeking a legal remedy.'
    ),
    jsonb_build_object(
      'question', 'Which of the following is typically NOT a civil litigation matter?',
      'options', jsonb_build_array(
        'Contract dispute',
        'Theft prosecution',
        'Personal injury claim',
        'Property boundary dispute'
      ),
      'correct_answer', 1,
      'explanation', 'Theft prosecution is a criminal matter handled by the government, not a civil dispute between private parties. The other options are all examples of civil litigation.'
    ),
    jsonb_build_object(
      'question', 'In civil court, who has the burden of proof?',
      'options', jsonb_build_array(
        'The defendant must prove their innocence',
        'The judge decides who must prove what',
        'The plaintiff must prove their claim',
        'Both parties share the burden equally'
      ),
      'correct_answer', 2,
      'explanation', 'The plaintiff bears the burden of proof in civil litigation, meaning they must present sufficient evidence to prove their claims are more likely true than not. The defendant can challenge this evidence but doesn''t have to prove innocence.'
    )
  )
)::text
WHERE id = 'e77129d5-bfbb-4bee-96de-1ac69e05acec';

-- Module 2, Lesson 1: Filing Your Case or Responding
UPDATE lessons
SET content = jsonb_build_object(
  'description', 'Learn the essential first steps: how to file a lawsuit if you''re the plaintiff, or how to properly respond if you''re the defendant.',
  'key_points', jsonb_build_array(
    'Filing requires a written complaint stating your claims and requested relief',
    'Defendants typically have 20-30 days to respond after being served',
    'Missing deadlines can result in default judgment against you',
    'Proper filing includes paying court fees and following formatting rules'
  ),
  'transcript', 'The civil litigation process begins with filing or responding to a complaint. Let''s look at both sides.

If you''re the plaintiff, you start by drafting a complaint—a legal document that identifies the parties, describes what happened, explains which laws or rights were violated, and states what remedy you''re seeking. Your complaint must be filed with the appropriate court (one that has jurisdiction over your case) and you must pay a filing fee, though fee waivers are available for those who qualify.

Your complaint should be clear and specific. It must include: (1) the court''s name, (2) identification of all parties, (3) a statement of facts, (4) your legal claims, and (5) the relief you''re requesting (money damages, specific performance, injunction, etc.). Many courts provide forms for common types of cases.

If you''re the defendant, you''ll receive a summons and complaint through legal service. This is not something you can ignore. You typically have 20-30 days to respond with an "answer"—your written response to the plaintiff''s allegations. In your answer, you must admit or deny each allegation and can raise defenses or counterclaims.

Failing to respond by the deadline can result in a default judgment, meaning the court may grant the plaintiff what they requested without hearing your side. If you need more time, you can request an extension, but do so before the deadline expires.

Both filing and responding require attention to procedural rules. Check your local court''s requirements for formatting, number of copies, and submission methods.'
)::text
WHERE id = '73dc3014-0709-4ca3-9ea0-c3afd92d8cec';

-- Module 2, Lesson 2: Document Service Essentials
UPDATE lessons
SET content = jsonb_build_object(
  'sections', jsonb_build_array(
    jsonb_build_object(
      'title', 'What is Service of Process?',
      'content', 'Service of process is the legal procedure of delivering court documents to notify parties about a lawsuit or court proceeding. Proper service is crucial—if done incorrectly, the court may not have authority to proceed.'
    ),
    jsonb_build_object(
      'title', 'Why Service Matters',
      'content', 'The law requires that defendants receive proper notice so they have an opportunity to respond. This protects everyone''s due process rights. Service also officially brings the defendant under the court''s jurisdiction.'
    ),
    jsonb_build_object(
      'title', 'Methods of Service',
      'content', 'Common service methods include:\n\n• **Personal Service**: Hand-delivering documents directly to the individual. This is the most reliable method.\n\n• **Substitute Service**: Leaving documents with another adult at the person''s home or business, then mailing a copy.\n\n• **Service by Mail**: Mailing documents via certified or registered mail with return receipt requested.\n\n• **Service by Publication**: Publishing a notice in a newspaper when the defendant cannot be located (requires court approval).\n\nEach jurisdiction has specific rules about which methods are acceptable for different types of documents.'
    ),
    jsonb_build_object(
      'title', 'Who Can Serve Documents?',
      'content', 'Generally, you cannot serve documents yourself. Service must be performed by:\n\n• A professional process server\n• A sheriff or marshal\n• Any adult who is not a party to the case\n\nThe person serving documents must complete a "proof of service" form confirming delivery.'
    ),
    jsonb_build_object(
      'title', 'When You Receive Documents',
      'content', 'If someone serves you with legal papers:\n\n1. **Accept them**—refusing service doesn''t make the lawsuit go away\n2. **Read everything carefully** and note all deadlines\n3. **Mark your calendar** with response deadlines\n4. **Calculate the response time** correctly (count calendar days, not business days, unless otherwise specified)\n5. **Keep all originals** in a safe place\n6. **Respond by the deadline**—this is crucial'
    ),
    jsonb_build_object(
      'title', 'Service Timeline',
      'content', 'The clock starts ticking when you''re properly served. In most jurisdictions:\n\n• Initial complaints: 20-30 days to respond\n• Motions: 10-21 days to respond\n• Discovery requests: 30 days to respond\n\nAlways check your specific jurisdiction''s rules and count carefully—missing deadlines can be disastrous.'
    )
  )
)::text
WHERE id = '2ec25fa9-3600-4b94-b67d-a12e9aa35b76';

-- Module 2, Lesson 3: Discovery in Plain English
UPDATE lessons
SET content = jsonb_build_object(
  'description', 'Discovery is the evidence-gathering phase where both parties exchange information. Learn what to expect and how to navigate this critical process.',
  'key_points', jsonb_build_array(
    'Discovery allows both sides to gather facts and evidence before trial',
    'Common methods include interrogatories, document requests, and depositions',
    'You must respond truthfully and completely within deadlines',
    'Discovery prevents "trial by ambush" by ensuring transparency'
  ),
  'transcript', 'Discovery is perhaps the most important phase of civil litigation. It''s the period when both sides gather evidence, learn about each other''s claims and defenses, and build their cases. Think of it as a fact-finding mission that happens before trial.

The main discovery tools include:

**Interrogatories**: Written questions that must be answered in writing under oath. These might ask about your background, what happened, who witnessed events, and what damages you claim. You typically have 30 days to respond with complete, accurate answers.

**Requests for Production**: These ask you to provide documents, photos, emails, text messages, contracts, medical records, or other physical evidence. You must either produce the documents or explain why you cannot.

**Depositions**: In-person questioning sessions where attorneys ask witnesses questions under oath while a court reporter records everything. Depositions can be intense—you''re answering questions for hours while being recorded. Preparation is essential.

**Requests for Admission**: Written statements you must admit or deny. These help narrow the issues for trial by establishing undisputed facts.

Discovery serves several purposes: it helps parties assess the strength of their cases, encourages settlement by revealing weaknesses, prevents surprises at trial, and narrows the disputed issues.

You have legal obligations during discovery. You must:
- Respond completely and truthfully
- Meet all deadlines
- Preserve relevant evidence (don''t destroy documents or delete emails)
- Update responses if information changes

Failure to comply with discovery can result in sanctions, including fines, evidence exclusion, or even dismissal of your case or defenses. If a discovery request is overly broad or seeks privileged information, you can object, but you must still respond to the parts that are proper.

Discovery can feel invasive, but remember: the other side is going through the same process. This exchange of information is designed to promote fairness and help cases resolve before trial.'
)::text
WHERE id = '993bb94d-6db5-4a17-b96a-e5c8adf95660';

-- Module 2, Lesson 4: Settlement vs. Trial (Interactive)
UPDATE lessons
SET content = jsonb_build_object(
  'description', 'Explore the key decision every litigant faces: settling the case or proceeding to trial. This interactive lesson helps you understand the pros and cons of each option.',
  'scenarios', jsonb_build_array(
    jsonb_build_object(
      'title', 'The Settlement Option',
      'content', 'Most civil cases—approximately 95%—settle before trial. Settlement means the parties reach an agreement to resolve the dispute, typically with the defendant paying money or taking specific actions.\n\n**Advantages of Settlement:**\n• **Certainty**: You control the outcome rather than leaving it to a judge or jury\n• **Speed**: Settlements can happen at any time, ending the case quickly\n• **Cost**: Avoiding trial saves substantial attorney fees and court costs\n• **Privacy**: Settlement terms can be confidential\n• **Less stress**: No need to testify or face trial uncertainty\n• **Finality**: Once settled, the case is over (with limited exceptions)\n\n**Disadvantages of Settlement:**\n• You might receive less than a jury would award\n• The defendant doesn''t "lose" in public record\n• You give up your day in court\n• Settlement terms might not fully address all your concerns'
    ),
    jsonb_build_object(
      'title', 'Going to Trial',
      'content', 'If settlement isn''t reached, the case proceeds to trial where a judge or jury hears evidence and makes a decision.\n\n**Advantages of Trial:**\n• **Full compensation**: Juries might award more than settlement offers\n• **Vindication**: Public judgment in your favor\n• **Legal precedent**: Your case might establish important principles\n• **Complete presentation**: Tell your full story and present all evidence\n\n**Disadvantages of Trial:**\n• **Uncertainty**: You cannot predict what a judge or jury will decide\n• **Time**: Trials can take years to reach\n• **Expense**: Trial preparation and attorney fees are significant\n• **Stress**: Testifying and cross-examination are challenging\n• **Public record**: Everything becomes part of the public record\n• **Appeal risk**: The losing party might appeal, extending the process\n• **All-or-nothing**: You might lose completely and receive nothing'
    ),
    jsonb_build_object(
      'title', 'Making the Decision',
      'content', '**When Settlement Makes Sense:**\n• The offer is reasonable compared to trial risks\n• You want certainty and closure\n• Trial costs would consume much of any potential award\n• Your case has significant weaknesses or uncertainties\n• You want to avoid the stress and time commitment of trial\n\n**When Trial Makes Sense:**\n• Settlement offers are unreasonably low\n• You have a very strong case with solid evidence\n• Legal principles are important to establish\n• The defendant refuses to negotiate reasonably\n• Your damages are substantial and well-documented\n\n**Key Considerations:**\n1. Evaluate the strength of your evidence\n2. Consider the costs of proceeding to trial\n3. Assess the risks of losing\n4. Think about your emotional capacity for trial\n5. Get realistic advice from your attorney\n6. Remember: settlement can happen at any stage, even during trial'
    ),
    jsonb_build_object(
      'title', 'Negotiation Strategies',
      'content', 'If you choose to pursue settlement:\n\n• **Know your bottom line**: Decide minimum acceptable terms beforehand\n• **Start realistic**: Extreme demands kill negotiations\n• **Listen actively**: Understand the other side''s concerns\n• **Be flexible**: Look for creative solutions beyond just money\n• **Document everything**: Get settlement terms in writing\n• **Consider mediation**: A neutral third party can facilitate agreement\n• **Don''t rush**: Take time to evaluate offers carefully\n• **Consult advisors**: Get input from attorneys, accountants, or family\n\nRemember: choosing between settlement and trial is one of the most important decisions in litigation. Consider all factors carefully before deciding.'
    )
  )
)::text
WHERE id = '0acc5aa1-64d4-4f22-a025-5cc4d007c5f2';

-- Module 2, Lesson 5: Quiz - Court Procedures
UPDATE lessons
SET content = jsonb_build_object(
  'questions', jsonb_build_array(
    jsonb_build_object(
      'question', 'How long do defendants typically have to respond to a complaint after being served?',
      'options', jsonb_build_array(
        '7-10 days',
        '20-30 days',
        '60-90 days',
        '6 months'
      ),
      'correct_answer', 1,
      'explanation', 'Most jurisdictions give defendants 20-30 days to file a response after being properly served with a complaint. The exact deadline depends on local rules and the service method used.'
    ),
    jsonb_build_object(
      'question', 'What happens if a defendant fails to respond to a complaint by the deadline?',
      'options', jsonb_build_array(
        'The case is automatically dismissed',
        'The deadline is automatically extended',
        'The plaintiff may obtain a default judgment',
        'Nothing—the defendant can respond anytime'
      ),
      'correct_answer', 2,
      'explanation', 'If a defendant doesn''t respond by the deadline, the plaintiff can request a default judgment, meaning the court may grant the plaintiff''s requested relief without the defendant''s input. This is why responding on time is critical.'
    ),
    jsonb_build_object(
      'question', 'Which discovery method involves in-person questioning under oath with a court reporter present?',
      'options', jsonb_build_array(
        'Interrogatories',
        'Requests for production',
        'Depositions',
        'Requests for admission'
      ),
      'correct_answer', 2,
      'explanation', 'A deposition is an in-person session where attorneys question witnesses under oath while a court reporter transcribes everything. It''s one of the most important and intensive discovery methods.'
    ),
    jsonb_build_object(
      'question', 'Approximately what percentage of civil cases settle before going to trial?',
      'options', jsonb_build_array(
        '25%',
        '50%',
        '75%',
        '95%'
      ),
      'correct_answer', 3,
      'explanation', 'About 95% of civil cases settle before trial. Settlement provides certainty, saves costs, and reduces stress, which is why most parties ultimately reach agreements rather than proceeding to trial.'
    ),
    jsonb_build_object(
      'question', 'What is the primary purpose of the discovery process?',
      'options', jsonb_build_array(
        'To delay the trial as long as possible',
        'To gather evidence and facts before trial',
        'To determine which judge will hear the case',
        'To decide the amount of damages'
      ),
      'correct_answer', 1,
      'explanation', 'Discovery''s main purpose is to allow both parties to gather facts and evidence before trial. This promotes fairness, prevents surprises, encourages settlement, and helps both sides understand the strengths and weaknesses of their cases.'
    )
  )
)::text
WHERE id = 'e8cb93f1-9901-48f8-8207-a9ab9b9d20b6';

-- Module 3, Lesson 1: What to Expect in the Courtroom
UPDATE lessons
SET content = jsonb_build_object(
  'description', 'Take a detailed tour of what happens during a court hearing, from entering the courtroom to the judge''s decision.',
  'key_points', jsonb_build_array(
    'Arrive early, dress professionally, and bring all necessary documents',
    'Court proceedings follow a specific order with clear rules and procedures',
    'Address the judge as "Your Honor" and stand when speaking',
    'Turn off phones and maintain respectful silence when others are speaking'
  ),
  'transcript', 'Walking into a courtroom for the first time can be intimidating, but knowing what to expect helps you feel more confident and prepared.

**Before You Arrive:**
Plan to arrive at least 30 minutes early. This gives you time to find parking, go through security, locate the correct courtroom, and review your materials. Courts have security screenings similar to airports—avoid bringing prohibited items like weapons, scissors, or excessive electronics.

**Courtroom Layout:**
Most courtrooms have a similar layout. The judge''s bench is at the front, elevated above everyone else. The court clerk sits near the judge, handling documents and making records. The court reporter (or recording equipment) captures everything said. The witness stand is beside the judge''s bench. Tables facing the judge are for the plaintiff (typically on the right) and defendant (typically on the left). Public seating (the gallery) is behind a divider called the bar.

**What to Wear:**
Dress as if attending a job interview. For men: dress pants, button-up shirt, tie, and dress shoes (suit jacket optional). For women: dress pants or skirt with blouse, dress, or suit (modest and professional). Avoid: jeans, t-shirts, shorts, revealing clothing, flip-flops, hats, or sunglasses indoors.

**Courtroom Etiquette:**
• Stand when the judge enters or leaves
• Remain standing when speaking to the judge
• Address the judge as "Your Honor"
• Speak only when it''s your turn
• Turn off your phone completely (not just silent)
• Don''t eat, drink, or chew gum
• Don''t bring children unless necessary
• Don''t interrupt others while they''re speaking
• Don''t show emotions through outbursts or facial expressions

**The Hearing Process:**
1. **Calling the Case**: The clerk announces your case name and number
2. **Appearances**: Both sides state their names for the record
3. **Opening Statements** (in trials): Each side previews their case
4. **Plaintiff''s Case**: The plaintiff presents evidence and witnesses
5. **Defendant''s Case**: The defendant presents their evidence and witnesses
6. **Closing Arguments** (in trials): Each side summarizes their position
7. **Judge''s Decision**: The judge may rule immediately or take the matter "under advisement" and issue a written decision later

**During Your Testimony:**
If you testify, you''ll be sworn in to tell the truth. Sit up straight, speak clearly into the microphone, and look at the judge when answering. Listen carefully to questions—if you don''t understand, ask for clarification. Answer only what was asked; don''t volunteer extra information. It''s okay to say "I don''t know" or "I don''t remember" if that''s truthful. Never guess or exaggerate.

**After the Hearing:**
If the judge rules from the bench, listen carefully and take notes. If you don''t understand the ruling, your attorney can explain it afterward. If the judge takes the matter under advisement, ask when to expect a decision. Thank the judge before leaving and exit quietly.

Remember: Judges appreciate preparation, professionalism, and respect. Focus on the facts of your case, follow the rules, and trust the process.'
)::text
WHERE id = 'dd440be1-6c5a-439d-956c-eeb22ae25edb';

-- Module 3, Lesson 2: Organizing Your Evidence (Interactive)
UPDATE lessons
SET content = jsonb_build_object(
  'description', 'Learn practical strategies for collecting, organizing, and presenting your evidence effectively.',
  'scenarios', jsonb_build_array(
    jsonb_build_object(
      'title', 'Types of Evidence',
      'content', 'Understanding what qualifies as evidence helps you build a strong case.\n\n**Documentary Evidence:**\n• Contracts and agreements\n• Emails, letters, and text messages\n• Photographs and videos\n• Medical records and bills\n• Receipts and financial records\n• Business records\n• Property deeds and titles\n\n**Testimonial Evidence:**\n• Your own testimony\n• Witness statements\n• Expert opinions (doctors, appraisers, engineers)\n\n**Physical Evidence:**\n• Damaged property\n• Defective products\n• Physical injuries (documented through photos/medical records)\n\n**Digital Evidence:**\n• Social media posts\n• Website screenshots\n• Electronic communications\n• Digital photos with metadata'
    ),
    jsonb_build_object(
      'title', 'Collection Best Practices',
      'content', '**Start Early:**\nBegin collecting evidence immediately. Memories fade, documents get lost, and witnesses become harder to find.\n\n**Preserve Everything:**\n• Don''t delete emails, texts, or social media posts\n• Keep all original documents in a safe place\n• Take photos of damaged property before repairs\n• Get witness contact information promptly\n• Save voicemails and call logs\n\n**Document Thoroughly:**\n• Take multiple photos from different angles\n• Include date stamps or write dates on the back of photos\n• Make copies of everything—keep originals separate\n• Create a timeline of events while details are fresh\n• Save all receipts related to your case\n\n**Authenticate Your Evidence:**\n• Note where and when you obtained each item\n• Identify who created or sent documents\n• Keep chain of custody clear for physical items\n• Screenshot digital evidence with dates visible'
    ),
    jsonb_build_object(
      'title', 'Organization System',
      'content', '**Create a Master Binder or Digital Folder:**\n\n**Section 1: Case Overview**\n• Timeline of events\n• List of parties involved\n• Summary of your claims/defenses\n\n**Section 2: Court Documents**\n• Complaint/Answer\n• Motions and orders\n• Court notices\n• Service documentation\n\n**Section 3: Communications**\n• Organized chronologically\n• Letters, emails, texts\n• Note logs of phone conversations\n\n**Section 4: Financial Records**\n• Receipts\n• Bills and invoices\n• Bank statements\n• Estimates and quotes\n• Proof of damages\n\n**Section 5: Photographs**\n• Labeled with date and description\n• Organized by subject\n• Include date photos were taken\n\n**Section 6: Witness Information**\n• Contact details\n• Written statements\n• Notes about what each witnessed\n\n**Section 7: Expert Reports**\n• Medical records\n• Professional evaluations\n• Appraisals\n• Technical reports\n\n**Tips:**\n• Use tabs or dividers for easy access\n• Create a table of contents\n• Number pages for easy reference\n• Keep backups of everything\n• Bring copies to court, never originals (unless required)'
    ),
    jsonb_build_object(
      'title', 'Presenting Evidence at Trial',
      'content', '**Preparation:**\n1. Review all evidence the night before\n2. Mark exhibits clearly (Exhibit A, B, C, etc.)\n3. Make multiple copies—one for you, one for opposing counsel, one for the judge, one for the witness\n4. Create an exhibit list describing each piece of evidence\n5. Arrange evidence in the order you''ll present it\n\n**During Presentation:**\n• Wait for the judge''s permission before approaching witnesses or the bench\n• Hand the witness the exhibit first, then show it to the judge\n• Ask the witness to identify the document: "Can you tell the court what this is?"\n• Lay proper foundation: establish the document''s authenticity\n• Formally offer the evidence: "Your Honor, I offer Exhibit A into evidence"\n• Wait for the judge to admit it before proceeding\n\n**Common Mistakes to Avoid:**\n• Don''t approach the judge without permission\n• Don''t show documents to witnesses without showing opposing counsel\n• Don''t forget to formally offer exhibits into evidence\n• Don''t bring too much irrelevant material\n• Don''t disorganize your materials—fumbling wastes time and appears unprepared\n\n**Digital Evidence Tips:**\n• Print digital evidence as physical copies\n• Include full headers showing sender, recipient, date\n• Bring the original device if required\n• Authenticate screenshots by testifying about when/how obtained\n• Consider having an expert verify digital evidence authenticity for critical items'
    )
  )
)::text
WHERE id = '02049bc9-b531-42d2-9c26-33fb65a7df84';

-- Module 3, Lesson 3: Testifying Effectively
UPDATE lessons
SET content = jsonb_build_object(
  'description', 'Master the art of giving clear, credible testimony. Learn what to say, what not to say, and how to handle tough questions.',
  'key_points', jsonb_build_array(
    'Tell the truth, the whole truth—credibility is everything',
    'Listen carefully to each question and answer only what''s asked',
    'Speak clearly, directly to the judge, and stay calm under pressure',
    'Prepare thoroughly but don''t memorize—be natural and honest'
  ),
  'transcript', 'Testifying in court is often the most stressful part of litigation, but with proper preparation and these strategies, you can present your case effectively and credibly.

**Before You Testify:**

**Prepare Your Story**: Review the facts of your case thoroughly. Go over the timeline, refresh your memory with documents, and identify the key points you need to convey. However, don''t memorize a script—you need to sound natural and truthful, not rehearsed.

**Anticipate Questions**: Think about what the other side will ask. What are the weaknesses in your case? What will they try to challenge? Prepare honest answers for difficult questions. Practice with someone playing devil''s advocate.

**Review Documents**: Look over all relevant documents, emails, and photos before testifying. You may be asked about specific details, dates, or contents. If you reviewed a document years ago, refresh your memory so you can testify accurately.

**The Oath**: When you take the witness stand, you''ll be sworn in. Take the oath seriously—commit to telling the complete truth. False testimony is perjury, a serious crime, but it also destroys your credibility, which can lose your case.

**During Your Testimony:**

**Listen Carefully**: This is the most important rule. Wait until the entire question is asked before answering. If you start answering before the question is complete, you might misunderstand or miss key details.

**Answer Only What''s Asked**: Don''t volunteer extra information. If asked "What time did you arrive?" say "3:15 PM," not "3:15 PM and I remember because I was stressed about being late and I had to stop for gas." Stick to the question.

**Speak Clearly**: Project your voice so everyone can hear. Speak at a moderate pace—not too fast or too slow. Avoid saying "um," "like," or "you know." Take a breath before answering if you need to collect your thoughts.

**Look at the Judge**: When answering, direct your responses to the judge (or jury if there is one), not to the attorney asking questions. This helps you stay focused and makes your testimony more persuasive.

**It''s Okay Not to Know**: If you don''t remember something, say "I don''t recall." If you don''t understand a question, say "Could you please rephrase that?" Never guess or make up an answer. "I don''t know" is a perfectly acceptable response when it''s true.

**Stay Calm**: Attorneys may try to provoke emotional reactions, especially during cross-examination. Stay composed. Don''t argue, get defensive, or show anger. Take a breath if you feel frustrated. Respond calmly and factually.

**Handle Inconsistencies**: If confronted with a statement that contradicts something you said earlier, don''t panic. If you made an error, acknowledge it: "I was mistaken before. The correct information is..." Honesty about mistakes is better than stubbornly defending an error.

**Cross-Examination Strategies:**

Cross-examination can be challenging—the opposing attorney is trying to undermine your credibility or weaken your case.

**Expect Leading Questions**: The other side will ask questions that suggest the answer they want: "Isn''t it true that you didn''t see the accident happen?" You can answer "yes" or "no," but if the question is misleading, politely correct it: "That''s not accurate. I saw the moment of impact."

**Don''t Get Defensive**: Remain professional even if questions feel accusatory. Don''t argue with the attorney. Answer truthfully and let your attorney object if questions are improper.

**Don''t Speculate**: If asked to guess or speculate, don''t. Say "I can only testify to what I personally know" or "I can''t speculate about that."

**Watch for Compound Questions**: Sometimes attorneys pack multiple questions into one. If this happens, ask them to break it down: "That question has several parts. Could you ask one question at a time?"

**Final Tips:**

• **Dress Professionally**: Your appearance matters. Show respect for the court.
• **Be Respectful**: Address the judge as "Your Honor." Be polite to everyone.
• **No Exaggeration**: Don''t overstate facts or embellish your story. Exaggeration damages credibility.
• **Admit Uncertainty**: It''s better to say you''re not sure than to commit to something you''re uncertain about.
• **Pause Before Answering**: A brief pause lets you think and gives your attorney time to object if needed.
• **Body Language**: Sit up straight, don''t fidget, and maintain appropriate eye contact.

Remember: judges can usually tell when someone is being honest versus evasive. Your best strategy is simply to tell the truth clearly and directly. Credibility is your most valuable asset in court.'
)::text
WHERE id = 'deeb0ebf-02d2-419d-b35b-8e6ee12b4ba5';

-- Module 3, Lesson 4: Final Preparation Checklist
UPDATE lessons
SET content = jsonb_build_object(
  'sections', jsonb_build_array(
    jsonb_build_object(
      'title', 'One Week Before Your Hearing',
      'content', '**Confirm Details:**\n□ Verify hearing date, time, and courtroom location\n□ Confirm whether it''s in-person or remote/virtual\n□ Know which judge is assigned to your case\n□ Understand what type of hearing it is (motion hearing, trial, settlement conference, etc.)\n\n**Review Your Case:**\n□ Read through all filed documents (complaint, answer, motions)\n□ Review your evidence and exhibits\n□ Go over your timeline of events\n□ Identify the strongest points in your favor\n□ Acknowledge weaknesses and prepare responses\n\n**Organize Materials:**\n□ Create clearly labeled exhibit folders\n□ Make multiple copies of all documents\n□ Prepare an exhibit list\n□ Compile witness contact information\n□ Organize your master binder with tabs\n\n**Prepare Witnesses:**\n□ Confirm witnesses are available and willing to appear\n□ Review what each witness will testify about\n□ Explain courtroom procedures to witnesses\n□ Provide witnesses with address and parking information'
    ),
    jsonb_build_object(
      'title', 'Two Days Before Your Hearing',
      'content', '**Practice and Preparation:**\n□ Practice your opening statement (if applicable)\n□ Rehearse your testimony\n□ Prepare questions for your witnesses\n□ Anticipate opposing counsel''s arguments\n□ Practice staying calm under pressure\n\n**Practical Arrangements:**\n□ Plan your route and estimate travel time\n□ Arrange for extra time in case of delays\n□ Arrange childcare if needed\n□ Request time off work\n□ Prepare professional attire\n\n**Communication:**\n□ Inform witnesses of final details\n□ Touch base with your attorney (if you have one)\n□ Notify anyone who needs to know you''ll be unavailable\n\n**Self-Care:**\n□ Get adequate sleep\n□ Eat healthy meals\n□ Avoid alcohol\n□ Practice relaxation techniques\n□ Maintain a positive mindset'
    ),
    jsonb_build_object(
      'title', 'The Night Before',
      'content', '**Final Document Check:**\n□ Review all exhibits one more time\n□ Ensure all copies are complete and organized\n□ Pack everything in an organized bag or briefcase\n□ Include pens, notepad, and highlighters\n□ Print extra copies of key documents\n\n**Personal Preparation:**\n□ Lay out your courtroom attire\n□ Charge your phone (but remember to turn it off in court)\n□ Set multiple alarms\n□ Prepare a healthy breakfast\n□ Review your notes one final time\n\n**Mental Preparation:**\n□ Visualize a successful hearing\n□ Remember your key talking points\n□ Focus on facts, not emotions\n□ Remind yourself to stay calm and respectful\n□ Get a good night''s sleep'
    ),
    jsonb_build_object(
      'title', 'The Morning Of',
      'content', '**Before Leaving Home:**\n□ Eat a nutritious breakfast\n□ Dress in professional attire\n□ Double-check you have all materials\n□ Review parking and security information\n□ Leave extra early to account for delays\n\n**Bring With You:**\n□ Photo ID (required for court security)\n□ All exhibits and evidence organized in your binder\n□ Extra copies of everything\n□ Notepad and pens\n□ Water bottle (may not be allowed in courtroom—check)\n□ Any court-issued documents or summons\n□ Contact information for witnesses and attorneys\n□ Parking money or payment method\n\n**Do NOT Bring:**\n□ Weapons of any kind\n□ Sharp objects (scissors, knives)\n□ Children (unless absolutely necessary)\n□ Food or drinks that might spill\n□ Electronics you don''t need\n□ Anything on the court''s prohibited items list'
    ),
    jsonb_build_object(
      'title', 'At the Courthouse',
      'content', '**Arrival (30+ minutes early):**\n□ Go through security screening\n□ Find the courtroom and check in with the clerk if required\n□ Use restroom before hearing begins\n□ Review your key points quietly\n□ Turn off your phone completely\n□ Observe courtroom etiquette\n\n**During the Hearing:**\n□ Stand when the judge enters\n□ Listen carefully to all instructions\n□ Speak only when it''s your turn\n□ Address the judge as "Your Honor"\n□ Stay calm and professional\n□ Take notes of important points\n□ Ask for clarification if you don''t understand\n\n**After the Hearing:**\n□ Thank the judge before leaving\n□ Get a copy of any orders issued\n□ Ask about next steps or deadlines\n□ Collect all your materials\n□ Exit quietly and respectfully'
    ),
    jsonb_build_object(
      'title', 'Emergency Checklist',
      'content', '**If You''re Running Late:**\n• Call the court clerk immediately\n• Explain the situation\n• Ask if the hearing can be delayed or rescheduled\n• Never simply fail to appear\n\n**If You Forgot Documents:**\n• Inform the judge at the start of the hearing\n• Explain what''s missing\n• Ask for permission to submit later or request a continuance\n• Apologize for the oversight\n\n**If You Feel Overwhelmed:**\n• Take deep breaths\n• Ask for a brief recess if needed\n• Drink water\n• Focus on one question at a time\n• Remember: the judge wants to hear the facts clearly\n\n**If Something Unexpected Happens:**\n• Stay calm\n• Be honest with the judge\n• Ask for guidance on how to proceed\n• Don''t be afraid to say "I don''t know what to do next"\n\n**Remember**: Judges understand that most people aren''t lawyers. Being prepared, respectful, and honest is what matters most.'
    )
  )
)::text
WHERE id = '5f2d0f2e-1f3a-4fee-ad86-394b3c9a18c2';

-- Module 3, Lesson 5: Quiz - Ready for Court
UPDATE lessons
SET content = jsonb_build_object(
  'questions', jsonb_build_array(
    jsonb_build_object(
      'question', 'When should you arrive at the courthouse for your hearing?',
      'options', jsonb_build_array(
        'Exactly at the scheduled time',
        '10 minutes early',
        'At least 30 minutes early',
        'An hour after the scheduled time'
      ),
      'correct_answer', 2,
      'explanation', 'You should arrive at least 30 minutes early to allow time for parking, security, finding the courtroom, and reviewing your materials before the hearing begins.'
    ),
    jsonb_build_object(
      'question', 'How should you address the judge during your hearing?',
      'options', jsonb_build_array(
        'Judge [Last Name]',
        'Sir or Ma''am',
        'Your Honor',
        'Mr./Mrs. [Last Name]'
      ),
      'correct_answer', 2,
      'explanation', 'Always address judges as "Your Honor" in court. This is the proper and respectful form of address that shows you understand courtroom protocol.'
    ),
    jsonb_build_object(
      'question', 'What should you do if you don''t understand a question while testifying?',
      'options', jsonb_build_array(
        'Make your best guess at what they''re asking',
        'Answer a different question you do understand',
        'Ask them to rephrase or clarify the question',
        'Stay silent and hope they move on'
      ),
      'correct_answer', 2,
      'explanation', 'If you don''t understand a question, it''s perfectly acceptable—and important—to ask the attorney to rephrase or clarify it. Never guess at what''s being asked; answer only questions you clearly understand.'
    ),
    jsonb_build_object(
      'question', 'What''s the most important rule when testifying in court?',
      'options', jsonb_build_array(
        'Make yourself look as sympathetic as possible',
        'Tell the complete truth',
        'Volunteer as much information as you can',
        'Argue with opposing counsel to show strength'
      ),
      'correct_answer', 1,
      'explanation', 'The most important rule is to tell the complete truth. Your credibility is everything in court. Judges can usually tell when someone is being dishonest, and false testimony can lose your case and potentially result in perjury charges.'
    ),
    jsonb_build_object(
      'question', 'Which of the following should you NOT bring to court?',
      'options', jsonb_build_array(
        'Photo identification',
        'Organized exhibits and evidence',
        'Your mobile phone turned off',
        'Sharp objects like scissors'
      ),
      'correct_answer', 3,
      'explanation', 'Courts prohibit weapons and sharp objects including scissors, knives, and other potentially dangerous items. You must bring photo ID, your evidence, and you can bring your phone as long as it''s completely turned off in the courtroom.'
    ),
    jsonb_build_object(
      'question', 'When organizing evidence for court, what should you do?',
      'options', jsonb_build_array(
        'Bring only original documents—never copies',
        'Organize chronologically with clear labels and make multiple copies',
        'Wait until the hearing to organize everything',
        'Bring everything in no particular order'
      ),
      'correct_answer', 1,
      'explanation', 'You should organize evidence chronologically with clear labels (Exhibit A, B, C) and make multiple copies—one for you, one for opposing counsel, one for the judge, and one for witnesses. Organization demonstrates preparedness and makes presenting your case much easier.'
    )
  )
)::text
WHERE id = '7fe8b2eb-39ac-462a-a883-aa3bcca15ec4';
