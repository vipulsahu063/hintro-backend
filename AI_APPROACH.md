# AI Integration Approach

## Model Used
Groq API — llama3-8b-8192 with `response_format: { type: "json_object" }` and `temperature: 0.1`

## Prompt Design
The prompt uses a two-part structure:
1. **System prompt**: Establishes strict rules — only extract from transcript, never invent, all items must include citations referencing exact timestamps
2. **User prompt**: Provides the formatted transcript and a rigid JSON schema the model must follow

## Citation Strategy
Every generated item (summary, action items, decisions, follow-up suggestions) must include a `citations` array. Each citation references an exact `timestamp` from the input transcript. The transcript is pre-formatted as `[timestamp] speaker: text` so the model can directly reference timestamps in its output.

## Hallucination Prevention
Three-layer approach:
1. **System prompt rules**: Explicit instructions not to invent attendees, tasks, decisions, or outcomes
2. **Low temperature**: `temperature: 0.1` minimizes creative deviation from source material
3. **Post-generation validation**: After the AI responds, the code filters out any citations whose timestamps don't exist in the original transcript (`validateCitations()` function in `aiService.js`)

## Output Validation Strategy
After parsing the AI JSON response, each item's citations array is filtered to only include timestamps present in `validTimestamps` (extracted from the input transcript). Items with invalid citations are cleaned, not discarded — ensuring the API always returns a valid response.

## Known Limitations
- llama3-8b may miss subtle implicit decisions in long transcripts
- Very long transcripts (>10,000 tokens) may exceed model context limits
- The model may occasionally merge two similar action items into one
- Non-English transcripts are not officially tested