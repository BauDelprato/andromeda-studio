export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return nameRegex.test(name.trim());
};

export const isValidDni = (dni: string): boolean => {
  const dniRegex = /^\d{8}$/;
  return dniRegex.test(dni.trim());
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+]+$/;
  return phoneRegex.test(phone.trim());
};