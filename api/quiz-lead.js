// Serverless function to email quiz results to Jeff
// POST /api/quiz-lead with { name, email, business, eligibilityScore, category, agentScore, wvw, answers }

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, business, eligibilityScore, category, agentScore, wvw, answers } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Format answers for the email
    const answerLines = (answers || []).map(a => `Q${a.question}: Answer ${a.answer} (Score: ${a.score})`).join('\n');

    const emailBody = `
      <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2E4F; color: #fff; padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 20px;">New AI Eligibility Quiz Submission</h2>
        </div>
        <div style="padding: 24px; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <h3 style="color: #1B2E4F; margin-top: 0;">Contact Info</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${business ? `<p><strong>Business:</strong> ${business}</p>` : ''}
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <h3 style="color: #1B2E4F;">Results</h3>
          <p><strong>AI Eligibility Score:</strong> ${eligibilityScore}/25 (${category})</p>
          <p><strong>Worker vs. Wrench:</strong> ${wvw}</p>
          <p><strong>Agent Score:</strong> ${agentScore}/12</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <h3 style="color: #1B2E4F;">Answer Breakdown</h3>
          <pre style="font-size: 13px; background: #f7f9fb; padding: 12px; border-radius: 6px; overflow-x: auto;">${answerLines}</pre>
        </div>
      </div>
    `;

    // Send via Resend API
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured');
      // Fall back to just logging
      console.log('QUIZ_LEAD:', JSON.stringify(req.body));
      return res.status(200).json({ success: true, note: 'Logged (email not configured)' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Clear-Path AI Quiz <quiz@shouldigetai.com>',
        to: ['hapi@shouldigetai.com'],
        reply_to: email,
        subject: `New Quiz Result: ${name} — ${category} (${eligibilityScore}/25)`,
        html: emailBody
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      // Still return success to the user — we don't want to block their experience
      return res.status(200).json({ success: true, note: 'Submission received' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Quiz lead error:', error);
    return res.status(200).json({ success: true, note: 'Submission received' });
  }
}
