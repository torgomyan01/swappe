export const RandomKey = (length = 5) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const getPasswordStrength = (password: string) => {
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score++;
  }

  // Contains both lower & upper case
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  }

  // Contains numbers or special characters
  if (/\d/.test(password) || /[^a-zA-Z0-9]/.test(password)) {
    score++;
  }

  return score;
};

export const sliceText = (
  text: string,
  length: number = 30,
  dots?: string = "...",
) => {
  if (text.length > length) {
    return `${text.slice(0, length)}${dots}`;
  } else {
    return text;
  }
};
