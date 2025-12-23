const RESERVED = [
  "api",
  "auth",
  "login",
  "register",
  "admin",
  "dashboard"
];

export const validateAlias = (alias) => {
  if (!alias || alias.length < 4 || alias.length > 30) return false;

  if (!/^[a-zA-Z0-9-_]+$/.test(alias)) return false;

  if (RESERVED.includes(alias.toLowerCase())) return false;

  return true;
};
