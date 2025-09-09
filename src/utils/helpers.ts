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
  dots: string = "...",
) => {
  if (text.length > length) {
    return `${text.slice(0, length)}${dots}`;
  } else {
    return text;
  }
};

export const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const getYouTubeThumbnailUrl = (videoUrl: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

  const match = videoUrl.match(regex);

  if (!match || !match[1]) {
    throw new Error("Invalid YouTube URL");
  }

  const videoId = match[1];

  // Վերադարձնում է բարձր որակի thumbnail հասցե
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

export const getRuTubeThumbnail = (videoUrl: string) => {
  const regex =
    /(?:rutube\.ru\/video\/([a-zA-Z0-9]+)\/?)|(?:rutube\.ru\/play\/embed\/([a-zA-Z0-9]+)\/?)|(?:rutube\.ru\/video\/embed\/([a-zA-Z0-9]+)\/?)/;
  const match = videoUrl.match(regex);

  let videoId: string | null = null;

  if (match) {
    videoId = match[1] || match[2] || match[3] || null;
  }

  if (!videoId) {
    throw new Error("Invalid RuTube URL");
  }

  return `https://rutube.ru/api/video/${videoId}/thumbnail/?redirect=1`;
};
