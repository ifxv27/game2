import { useState, useCallback } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useValidation = (rules: { [key: string]: ValidationRules }) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((data: { [key: string]: any }): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((field) => {
      const value = data[field];
      const fieldRules = rules[field];

      if (fieldRules.required && !value) {
        newErrors[field] = 'This field is required';
        isValid = false;
      }

      if (value && fieldRules.minLength && value.length < fieldRules.minLength) {
        newErrors[field] = `Minimum length is ${fieldRules.minLength} characters`;
        isValid = false;
      }

      if (value && fieldRules.maxLength && value.length > fieldRules.maxLength) {
        newErrors[field] = `Maximum length is ${fieldRules.maxLength} characters`;
        isValid = false;
      }

      if (value && fieldRules.pattern && !fieldRules.pattern.test(value)) {
        newErrors[field] = 'Invalid format';
        isValid = false;
      }

      if (value && fieldRules.custom && !fieldRules.custom(value)) {
        newErrors[field] = 'Invalid value';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getError = useCallback((field: string): string | undefined => {
    return errors[field];
  }, [errors]);

  return {
    validate,
    errors,
    clearErrors,
    getError,
  };
};
