const axios = require('axios');

const analyzeMeeting = async (transcript) => {
  const transcriptText = transcript
    .map((entry) => `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`)
    .join('\n');

  const validTimestamps = transcript.map((entry) => entry.timestamp);

  const systemPrompt = `
You are a precise meeting analyst.

Rules:
1. Only use facts explicitly present in the transcript.
2. Do not invent attendees, action items, decisions, or outcomes.
3. Every item must include at least one citation.
4. Each citation timestamp must be one of these exact values: ${JSON.stringify(validTimestamps)}
5. Return only JSON.
`;

  const userPrompt = `
Analyze this transcript and return exactly this JSON shape:

{
  "summary": [
    { "text": "string", "citations": [{ "timestamp": "00:10" }] }
  ],
  "actionItems": [
    { "task": "string", "assignee": "string", "citations": [{ "timestamp": "00:20" }] }
  ],
  "decisions": [
    { "text": "string", "citations": [{ "timestamp": "00:30" }] }
  ],
  "followUpSuggestions": [
    { "text": "string", "citations": [{ "timestamp": "00:40" }] }
  ]
}

If a section has no items, return an empty array.

Transcript:
${transcriptText}
`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const raw = response.data.choices?.[0]?.message?.content;
    console.log('Groq raw content:', raw);

    const analysis = JSON.parse(raw);

    const cleanItems = (items = []) =>
      items.map((item) => ({
        ...item,
        citations: (item.citations || []).filter(
          (c) => c?.timestamp && validTimestamps.includes(c.timestamp)
        )
      }));

    return {
      summary: cleanItems(analysis.summary),
      actionItems: cleanItems(analysis.actionItems),
      decisions: cleanItems(analysis.decisions),
      followUpSuggestions: cleanItems(analysis.followUpSuggestions)
    };
  } catch (error) {
    console.error('Groq response data:', error.response?.data);
    console.error('Groq response status:', error.response?.status);
    console.error('Groq raw error:', error.message);

    throw new Error(
      error.response?.data?.error?.message ||
      error.message ||
      'AI analysis failed'
    );
  }
};

module.exports = { analyzeMeeting };