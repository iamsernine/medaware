const { Injectable } = require('@nestjs/common');
const { MinimaxClientService } = require('./minimax-client.service');
const { FALLBACK } = require('./constants');
const { validateCategory, validateConfidence } = require('./dto/classify-category.dto');

@Injectable()
class ClassifyService {
  constructor(minimaxClient) {
    this.minimaxClient = minimaxClient;
  }

  async classifyCategory(text) {
    try {
      const raw = await this.minimaxClient.chat(text);
      const parsed = this.parseJsonResponse(raw);
      if (!parsed) return FALLBACK;
      const category = parsed.category;
      const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : Number(parsed.confidence);
      if (!validateCategory(category) || !validateConfidence(confidence)) {
        return FALLBACK;
      }
      return { category, confidence };
    } catch (_) {
      return FALLBACK;
    }
  }

  parseJsonResponse(raw) {
    if (typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch (_) {
      return null;
    }
  }
}

module.exports = { ClassifyService };
