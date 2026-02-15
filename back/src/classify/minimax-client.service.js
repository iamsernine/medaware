const { Injectable } = require('@nestjs/common');
const { PromptBuilderService } = require('./prompt-builder.service');

const MODEL = 'M2-her';
const TEMPERATURE = 0;
const MAX_COMPLETION_TOKENS = 128;

@Injectable()
class MinimaxClientService {
  constructor(promptBuilder) {
    this.promptBuilder = promptBuilder;
    this.apiKey = process.env.MINIMAX_API_KEY || '';
    this.baseUrl = (process.env.MINIMAX_BASE_URL || 'https://api.minimax.io').replace(/\/$/, '');
  }

  async chat(userText) {
    if (!this.apiKey) {
      throw new Error('MINIMAX_API_KEY is not set');
    }
    const url = `${this.baseUrl}/v1/text/chatcompletion_v2`;
    const systemPrompt = this.promptBuilder.getSystemPrompt();
    const userPrompt = this.promptBuilder.getUserPrompt(userText);
    const body = {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: TEMPERATURE,
      max_completion_tokens: MAX_COMPLETION_TOKENS,
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Minimax API error ${res.status}: ${text}`);
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (content == null) {
      throw new Error('Minimax API returned no content');
    }
    return content;
  }
}

module.exports = { MinimaxClientService };
