export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  

export const getInitials = (name = '') => {
  const words = name
    .trim()
    .split(/\s+/) // handles multiple spaces
    .filter(Boolean); // removes empty strings

  const initials = words.slice(0, 2).map(word => word[0]).join('');

  return initials.toUpperCase();
};
