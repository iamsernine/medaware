const { Injectable } = require('@nestjs/common');
const { CATEGORIES } = require('./constants');

const CATEGORY_LIST = CATEGORIES.join(', ');

const SYSTEM_PROMPT = `You are a medical triage classifier. Output ONLY valid JSON, no other text, no markdown, no explanation.
Allowed categories (exactly one): ${CATEGORY_LIST}
Output format: {"category":"<one of the allowed categories>","confidence":<number between 0 and 1>}
Example: {"category":"cardiology","confidence":0.92}`;

const USER_PROMPT_PREFIX = 'Classify this medical/health text into exactly one category. Reply with only the JSON object.\n\nText:\n';

@Injectable()
class PromptBuilderService {
  getSystemPrompt() {
    return SYSTEM_PROMPT;
  }

  getUserPrompt(text) {
    return USER_PROMPT_PREFIX + String(text).slice(0, 8000);
  }
}

module.exports = { PromptBuilderService };
