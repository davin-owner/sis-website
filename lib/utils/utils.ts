import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates phone number format
 * Supports multiple formats:
 * - (555) 123-4567
 * - 555-123-4567
 * - 555.123.4567
 * - 5551234567
 * - +1 555-123-4567
 * - +1 (555) 123-4567
 *
 * @param phone - The phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhoneNumber(phone: string | null | undefined): boolean {
  if (!phone) return false;

  // Remove all non-digit characters for length check
  const digitsOnly = phone.replace(/\D/g, '');

  // Must have 10 digits (US) or 11 digits (with country code)
  if (digitsOnly.length < 10 || digitsOnly.length > 11) {
    return false;
  }

  // Regex pattern for common US phone formats
  const phoneRegex = /^(\+?1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;

  return phoneRegex.test(phone);
}

/**
 * Normalizes a phone number for consistent database storage
 * Accepts any format, strips to digits, removes leading 1
 *
 * Examples:
 * - "(555) 123-4567" → "5551234567"
 * - "1-555-123-4567" → "5551234567"
 * - "555.123.4567" → "5551234567"
 *
 * @param phone - The phone number to normalize
 * @returns Normalized 10-digit phone number
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';

  // Remove all non-digit characters
  let digitsOnly = phone.replace(/\D/g, '');

  // Remove leading 1 (country code) if present
  if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
    digitsOnly = digitsOnly.slice(1);
  }

  // Return 10-digit number
  return digitsOnly;
}

/**
 * Formats a phone number to a consistent format: (555) 123-4567
 *
 * @param phone - The phone number to format
 * @returns Formatted phone number or original if invalid
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Format based on length
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }

  // Return original if we can't format it
  return phone;
}
