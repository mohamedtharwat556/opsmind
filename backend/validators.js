/**
 * Validation Utilities للـ Backend
 * يتضمن: Email, Password, Text, Numbers, وغيره
 */

// Email Validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password Strength
const validatePassword = (password) => {
  // متطلبات: 8 أحرف، حرف كبير، حرف صغير، رقم
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return minLength && hasUpperCase && hasLowerCase && hasNumbers;
};

// Text Validation
const validateText = (text, minLength = 3, maxLength = 500) => {
  if (typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

// Array Validation
const validateArray = (arr, minLength = 1) => {
  return Array.isArray(arr) && arr.length >= minLength;
};

// Number Validation
const validateNumber = (num, min = 0, max = Infinity) => {
  const parsed = Number(num);
  return !isNaN(parsed) && parsed >= min && parsed <= max;
};

// Role Validation
const validateRole = (role) => {
  const validRoles = ['موظف', 'مدير', 'رئيس قسم', 'المدير العام'];
  return validRoles.includes(role);
};

// Status Validation
const validateStatus = (status) => {
  const validStatuses = ['نشط', 'غير نشط', 'معلق'];
  return validStatuses.includes(status);
};

// Case Status Validation
const validateCaseStatus = (status) => {
  const validStatuses = ['مفتوح', 'قيد العمل', 'محلول'];
  return validStatuses.includes(status);
};

// SOP Status Validation
const validateSOPStatus = (status) => {
  const validStatuses = ['مسودة', 'قيد المراجعة', 'فعال', 'مراجعة مطلوبة'];
  return validStatuses.includes(status);
};

// Priority Validation
const validatePriority = (priority) => {
  const validPriorities = ['منخفضة', 'متوسطة', 'عالية', 'حرجة'];
  return validPriorities.includes(priority);
};

// Request Body Validation (استخدام عام)
const validateObject = (obj, requiredFields) => {
  if (typeof obj !== 'object' || obj === null) return false;
  return requiredFields.every(field => field in obj && obj[field] !== null && obj[field] !== '');
};

// SQL Injection Protection
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/'/g, "''")
    .replace(/"/g, '""')
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .trim();
};

// XSS Protection
const sanitizeHTML = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

module.exports = {
  validateEmail,
  validatePassword,
  validateText,
  validateArray,
  validateNumber,
  validateRole,
  validateStatus,
  validateCaseStatus,
  validateSOPStatus,
  validatePriority,
  validateObject,
  sanitizeInput,
  sanitizeHTML
};
