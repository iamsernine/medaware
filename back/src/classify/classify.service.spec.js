const { ClassifyService } = require('./classify.service');
const { FALLBACK } = require('./constants');

describe('ClassifyService', () => {
  let minimaxChat;
  let service;

  beforeEach(() => {
    minimaxChat = jest.fn();
    service = new ClassifyService({ chat: minimaxChat });
  });

  it('returns fallback on minimax error', async () => {
    minimaxChat.mockRejectedValue(new Error('API error'));
    const result = await service.classifyCategory('some text');
    expect(result).toEqual(FALLBACK);
  });

  it('returns fallback on invalid JSON', async () => {
    minimaxChat.mockResolvedValue('not json at all');
    const result = await service.classifyCategory('some text');
    expect(result).toEqual(FALLBACK);
  });

  it('returns fallback on invalid category', async () => {
    minimaxChat.mockResolvedValue('{"category":"invalid_specialty","confidence":0.9}');
    const result = await service.classifyCategory('some text');
    expect(result).toEqual(FALLBACK);
  });

  it('returns fallback when confidence out of range', async () => {
    minimaxChat.mockResolvedValue('{"category":"cardiology","confidence":1.5}');
    const result = await service.classifyCategory('some text');
    expect(result).toEqual(FALLBACK);
  });

  it('returns fallback when confidence is NaN', async () => {
    minimaxChat.mockResolvedValue('{"category":"cardiology","confidence":"high"}');
    const result = await service.classifyCategory('some text');
    expect(result).toEqual(FALLBACK);
  });

  it('parses JSON with surrounding text and returns valid result', async () => {
    minimaxChat.mockResolvedValue('Here is the result:\n{"category":"neurology","confidence":0.88}\nEnd.');
    const result = await service.classifyCategory('headache and dizziness');
    expect(result).toEqual({ category: 'neurology', confidence: 0.88 });
  });

  it('returns valid category and confidence', async () => {
    minimaxChat.mockResolvedValue('{"category":"dermatology","confidence":0.92}');
    const result = await service.classifyCategory('rash on my arm');
    expect(result).toEqual({ category: 'dermatology', confidence: 0.92 });
  });

  it('returns fallback for empty category in JSON', async () => {
    minimaxChat.mockResolvedValue('{"category":"","confidence":0.5}');
    const result = await service.classifyCategory('text');
    expect(result).toEqual(FALLBACK);
  });
});
