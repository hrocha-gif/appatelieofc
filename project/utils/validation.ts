export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const formatPhone = (phone: string): string => {
  // Remove all non-digits
  const numbers = phone.replace(/\D/g, '');
  
  // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

export const validateCEP = (cep: string): boolean => {
  const cepRegex = /^\d{5}-\d{3}$/;
  return cepRegex.test(cep);
};

export const formatCEP = (cep: string): string => {
  const numbers = cep.replace(/\D/g, '');
  if (numbers.length === 8) {
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  return cep;
};