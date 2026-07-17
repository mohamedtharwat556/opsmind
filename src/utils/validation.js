/**
 * Validation Utilities للـ Frontend (React)
 */

// Email Validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'البريد الإلكتروني غير صحيح' };
  }
  return { valid: true };
};

// Password Validation
export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
  }
  return { valid: true };
};

// Text Field Validation
export const validateTextField = (value, minLength = 3, maxLength = 500) => {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: 'هذا الحقل مطلوب' };
  }
  if (value.trim().length < minLength) {
    return { valid: false, error: `يجب أن يكون الحقل ${minLength} أحرف على الأقل` };
  }
  if (value.length > maxLength) {
    return { valid: false, error: `لا يمكن تجاوز ${maxLength} حرف` };
  }
  return { valid: true };
};

// Required Field Validation
export const validateRequired = (value, fieldName = 'هذا الحقل') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: `${fieldName} مطلوب` };
  }
  return { valid: true };
};

// Validate Form
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && !value) {
      errors[field] = `${rule.label || field} مطلوب`;
      return;
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} يجب أن يكون ${rule.minLength} أحرف على الأقل`;
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} لا يمكن تجاوز ${rule.maxLength} حرف`;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.errorMessage || `${rule.label || field} غير صحيح`;
    }

    if (rule.custom && value) {
      const customError = rule.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

// URL Validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'رابط غير صحيح' };
  }
};

// Phone Validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9\-\+\(\)]{7,}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'رقم الهاتف غير صحيح' };
  }
  return { valid: true };
};

// Number Validation
export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: 'يجب أن تكون قيمة رقمية' };
  }
  if (num < min) {
    return { valid: false, error: `القيمة لا يمكن أن تكون أقل من ${min}` };
  }
  if (num > max) {
    return { valid: false, error: `القيمة لا يمكن أن تكون أكثر من ${max}` };
  }
  return { valid: true };
};

// File Validation
export const validateFile = (file, maxSizeMB = 5, allowedTypes = ['pdf', 'doc', 'docx']) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!file) {
    return { valid: false, error: 'الملف مطلوب' };
  }

  if (file.size > maxSizeBytes) {
    return { valid: false, error: `حجم الملف يجب أن لا يتجاوز ${maxSizeMB}MB` };
  }

  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    return { valid: false, error: `الأنواع المسموحة: ${allowedTypes.join(', ')}` };
  }

  return { valid: true };
};

// Sanitize Input (XSS Protection)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Debounce for validation
export const debounce = (func, delay = 500) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};
