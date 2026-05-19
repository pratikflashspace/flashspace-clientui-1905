/**
 * Password validation logic for FlashSpace
 * Policy:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */

export const validatePassword = (password: string) => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 
      ? `Password must contain ${errors.join(", ")}.`
      : ""
  };
};
