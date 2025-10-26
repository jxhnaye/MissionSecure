/* ========================================
   CYBERSECURITY ASSESSMENT QUESTION DATA
   
   Base assessment questions with scoring weights and feedback notes.
   Extracted from App.jsx for better code organization.
======================================== */

/** Base 10 questions (best=1, iffy=0.5, bad=0) */
export const BASE_QUESTIONS = [
  /** Authentication & Access Control Question */
  { 
    id: "q1", 
    text: "How does your organization secure user authentication? (Examples: Strong passwords, multi-factor authentication, password managers)", 
    options: [
      { label: "Basic passwords only, no additional security measures", weight: 0, tag: "bad" },
      { label: "Strong password requirements OR multi-factor authentication (but not both)", weight: 0.5, tag: "iffy" },
      { label: "Both strong password policies AND multi-factor authentication enforced", weight: 1, tag: "best" }
    ], 
    noteBad: "Implement both strong password requirements and multi-factor authentication.", 
    noteIffy: "Great start! Add the missing piece - either MFA or stronger password policies." 
  },
  
  /** Access Control Question */
  { 
    id: "q2", 
    text: "Does your company enforce procedures that limit access to sensitive data and systems to designated staff with appropriate clearance? (Examples: Role-based access, approval workflows)", 
    options: [
      { label: "No, we don't have any such procedures", weight: 0, tag: "bad" },
      { label: "Some procedures exist but are not enforced", weight: 0.5, tag: "iffy" },
      { label: "Always enforced for all systems", weight: 1, tag: "best" }
    ], 
    noteBad: "Implement access controls based on roles and responsibilities.", 
    noteIffy: "Good start but consider enforcing it across all systems." 
  },
  
  /** Privacy and Data Protection Policy Question */
  { 
    id: "q3", 
    text: "Does your organization maintain a written policy that outlines how personal and customer data is collected, used, shared, and protected?", 
    options: [
      { label: "No policy exists", weight: 0, tag: "bad" },
      { label: "Draft exists but not enforced", weight: 0.5, tag: "iffy" },
      { label: "Written, shared with staff/customers, and regularly reviewed", weight: 1, tag: "best" }
    ], 
    noteBad: "Create a privacy policy that covers data collection and usage.", 
    noteIffy: "Add scheduled reviews of the policy." 
  },
  
  /** Incident Response Plan Question */
  { 
    id: "q4", 
    text: "Does your organization have a documented plan detailing how it will respond to a cyberattack or data breach? (Examples: Containment procedures, notification protocols, recovery plans)", 
    options: [
      { label: "No plan exists", weight: 0, tag: "bad" },
      { label: "Draft exists but not enforced", weight: 0.5, tag: "iffy" },
      { label: "Written, shared with staff/customers and they are trained regularly", weight: 1, tag: "best" }
    ], 
    noteBad: "Write a simple incident response plan.", 
    noteIffy: "Publish the plan and train staff." 
  },
  
  /** Business Continuity Plan Questions */
  { 
    id: "q5", 
    text: "Does your organization have a strategy to maintain operations in the event of a cyber incident? (Examples: Remote work policies, data backups, failover systems)", 
    options: [
      { label: "We are supposed to have one?", weight: 0, tag: "bad" },
      { label: "Kinda we have some stuff", weight: 0.5, tag: "iffy" },
      { label: "Yes we do have a plan and everyone is aware of it and trained on it", weight: 1, tag: "best" }
    ], 
    noteBad: "Create a simple business continuity plan.", 
    noteIffy: "Practice the plan with all staff." 
  },
  
  /** Device Security Question */
  { 
    id: "q6", 
    text: "How well are your organization's devices (laptops, phones, tablets) secured and maintained? (Examples: Encryption, antivirus/EDR, automatic updates, remote wipe capability)", 
    options: [
      { label: "Minimal security - basic antivirus only", weight: 0, tag: "bad" },
      { label: "Some security measures but inconsistently applied", weight: 0.5, tag: "iffy" },
      { label: "Comprehensive security: encryption, EDR/antivirus, auto-updates, and device management", weight: 1, tag: "best" }
    ], 
    noteBad: "Implement device encryption, endpoint protection, and automatic updates.", 
    noteIffy: "Ensure all security measures are consistently applied across all devices." 
  },
  
  /** Physical Security Question */
  { 
    id: "q7", 
    text: "If your organization has an office space, are there safeguards to ensure only authorized personnel can access servers, network equipment, and/or sensitive files?", 
    options: [
      { label: "No physical security measures in place", weight: 0, tag: "bad" },
      { label: "Basic measures like locked doors but no access tracking", weight: 0.5, tag: "iffy" },
      { label: "Comprehensive physical security with controlled access and logging", weight: 1, tag: "best" }
    ], 
    noteBad: "Implement physical access controls for sensitive areas and equipment.", 
    noteIffy: "Add access logging and regular security audits." 
  },
  
  /** Employee Training Question */
  { 
    id: "q8", 
    text: "Do employees receive regular cybersecurity training (at least annually) on phishing, safe internet use, and handling sensitive information?", 
    options: [
      { label: "No formal cybersecurity training provided", weight: 0, tag: "bad" },
      { label: "Occasional reminders or basic awareness materials", weight: 0.5, tag: "iffy" },
      { label: "Regular annual training plus ongoing phishing simulations and updates", weight: 1, tag: "best" }
    ], 
    noteBad: "Implement annual cybersecurity training covering phishing, data handling, and safe practices.", 
    noteIffy: "Add hands-on phishing simulations and regular security updates." 
  },
  
  /** Compliance Awareness Question */
  { 
    id: "q9", 
    text: "Is your organization familiar with federal cybersecurity standards and frameworks? (Examples: NIST SP 800-171, CISA guidance, Department of Defense requirements)", 
    options: [
      { label: "No awareness of federal cybersecurity standards", weight: 0, tag: "bad" },
      { label: "Some awareness but no formal compliance efforts", weight: 0.5, tag: "iffy" },
      { label: "Actively following and implementing relevant federal standards", weight: 1, tag: "best" }
    ], 
    noteBad: "Research applicable federal cybersecurity standards for your industry and organization type.", 
    noteIffy: "Develop a formal compliance plan and begin implementation of relevant standards." 
  },
  
  /** How are you feeling today Question */
  { 
    id: "q10", 
    text: "How are you feeling today about your organization's cybersecurity posture?", 
    options: [
      { label: "Very concerned - major gaps identified", weight: 0, tag: "bad" },
      { label: "Somewhat concerned - moderate gaps identified", weight: 0.5, tag: "iffy" },
      { label: "Feeling secure - no significant gaps identified", weight: 1, tag: "best" }
    ], 
    noteBad: "Prioritize addressing major gaps in your cybersecurity posture.", 
    noteIffy: "Continue monitoring and improving your cybersecurity measures." 
  }
];