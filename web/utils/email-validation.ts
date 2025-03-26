const blacklist = [
  "nqmo.com",
  "qabq.com",
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "temp-mail.org",
  "yopmail.com",
  "throwawaymail.com",
  "dispostable.com",
  "getnada.com",
  "maildrop.cc",
];

const pattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateEmail = (email: string) => {
  const emailLower = email.toLowerCase();
  const domain = emailLower.split("@")[1];

  if (!pattern.test(emailLower)) return false;
  if (blacklist.includes(domain)) return false;

  return true;
};
