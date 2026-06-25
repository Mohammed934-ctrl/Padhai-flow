export const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");

  if (name.length <= 4) {
    return `${name.slice(0, 2)}***@${domain}`;
  }

  return `${name.slice(0, 3)}***${name.slice(-2)}@${domain}`;
};