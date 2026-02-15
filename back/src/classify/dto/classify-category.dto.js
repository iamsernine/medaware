const Joi = require('joi');
const { CATEGORIES } = require('../constants');

const classifyCategoryBodySchema = Joi.object({
  text: Joi.string().required().max(50000),
});

const categoryAllowlist = new Set(CATEGORIES);

function validateBody(body) {
  const { error, value } = classifyCategoryBodySchema.validate(body, { stripUnknown: true });
  if (error) return { error: error.message, value: null };
  return { error: null, value };
}

function validateCategory(cat) {
  return typeof cat === 'string' && categoryAllowlist.has(cat);
}

function validateConfidence(n) {
  return typeof n === 'number' && !Number.isNaN(n) && n >= 0 && n <= 1;
}

module.exports = {
  classifyCategoryBodySchema,
  categoryAllowlist,
  validateBody,
  validateCategory,
  validateConfidence,
};
