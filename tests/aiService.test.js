const axios = require('axios');
const { analyzeMeeting } = require('../src/services/aiService');

jest.mock('axios');

describe('AI Service — Citation Validation', () => {
  const mockTranscript = [
    { timestamp: '00:10', speaker: 'John', text: 'We should launch next Friday.' },
    { timestamp: '00:20', speaker: 'Alice', text: 'I will prepare release notes.' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return analysis with citations', async () => {
    axios.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: JSON.stringify({
                summary: [
                  {
                    text: 'Team plans to launch next Friday.',
                    citations: [{ timestamp: '00:10' }],
                  },
                ],
                actionItems: [
                  {
                    task: 'Prepare release notes',
                    assignee: 'Alice',
                    citations: [{ timestamp: '00:20' }],
                  },
                ],
                decisions: [
                  {
                    text: 'Launch is planned for next Friday.',
                    citations: [{ timestamp: '00:10' }],
                  },
                ],
                followUpSuggestions: [
                  {
                    text: 'Review release readiness before launch.',
                    citations: [{ timestamp: '00:10' }],
                  },
                ],
              }),
            },
          },
        ],
      },
    });

    const analysis = await analyzeMeeting(mockTranscript);

    expect(analysis.summary.length).toBeGreaterThan(0);
    expect(analysis.actionItems.length).toBeGreaterThan(0);
    expect(analysis.decisions.length).toBeGreaterThan(0);
    expect(analysis.followUpSuggestions.length).toBeGreaterThan(0);
    expect(analysis.summary[0].citations[0].timestamp).toBe('00:10');
  });

  test('should filter out invalid citation timestamps', async () => {
    axios.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: JSON.stringify({
                summary: [
                  {
                    text: 'Team plans to launch next Friday.',
                    citations: [{ timestamp: '99:99' }, { timestamp: '00:10' }],
                  },
                ],
                actionItems: [],
                decisions: [],
                followUpSuggestions: [],
              }),
            },
          },
        ],
      },
    });

    const analysis = await analyzeMeeting(mockTranscript);

    expect(analysis.summary[0].citations).toEqual([{ timestamp: '00:10' }]);
  });
});