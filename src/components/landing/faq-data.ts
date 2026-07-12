export const faqItems = [
  {
    question: 'Is ReceiptFlow multi-tenant?',
    answer:
      'Yes. Every user belongs to one company. Data is scoped by company_id and protected with Row Level Security so tenants cannot see each other.',
  },
  {
    question: 'Can I email invoices with a PDF attached?',
    answer:
      'Yes. Generate a branded PDF, store it securely, and send it through Resend with your company name in the subject line.',
  },
  {
    question: 'Do you support reports and exports?',
    answer:
      'Daily and monthly sales charts, invoice mix, top customers, and CSV or Excel downloads are included.',
  },
  {
    question: 'How do I become a super admin?',
    answer:
      'Platform super admins are granted in the database by your operator. The Super Admin panel is never available through self-serve signup.',
  },
  {
    question: 'What happens if my company is disabled?',
    answer:
      'Tenant users are locked out until a platform admin re-enables the workspace. Your data remains intact while disabled.',
  },
]
