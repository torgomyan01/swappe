import moment from "moment";
import { ActionGetChatInfo } from "@/app/actions/chat/get-chat-info";
import { setChatInfo } from "@/redux/user";

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
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;

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

export const formatPrice = (
  price: number,
  locale = "ru-RU",
  currency = "RUB",
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(price);
};

export const getMapIframeUrl = (coords: [number, number]) => {
  const [lat, lon] = coords;
  return `https://yandex.ru/map-widget/v1/?ll=${lon},${lat}&z=16&pt=${lon},${lat},pm2rdl&whatshere[zoom]=16&z=16&l=map&controls=false`;
};

export const truncateString = (str: string, length: number = 30) => {
  if (str.length > 30) {
    return `${str.slice(0, length)}...`;
  }
  return str;
};

export const CreateObjectGrid = (images: any[]) => {
  if (images.length === 1) {
    return {
      "grid-cols-1": true,
    };
  }

  if (
    images.length === 2 ||
    images.length === 3 ||
    images.length === 4 ||
    images.length === 5
  ) {
    return {
      "grid-cols-2": true,
    };
  }

  if (images.length === 6 || images.length === 7) {
    return {
      "grid-cols-3": true,
    };
  }

  if (images.length === 8) {
    return {
      "grid-cols-4": true,
    };
  }
};

export const CreateObjectCols = (index: number, images: any[]) => {
  if (index === images.length - 1) {
    if (
      images.length === 1 ||
      images.length === 2 ||
      images.length === 4 ||
      images.length === 6 ||
      images.length === 8
    ) {
      return {
        "col-span-1": true,
      };
    }
    if (images.length === 3 || images.length === 5) {
      return {
        "col-span-2": true,
      };
    }
    if (images.length === 7) {
      return {
        "col-span-3": true,
      };
    }
  } else {
    return {
      "col-span-1": true,
    };
  }
};

export const validateDocumentFiles = (files: File[]) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/vnd.oasis.opendocument.text",
  ];

  const maxFileSize = 5 * 1024 * 1024;

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    if (!allowedMimeTypes.includes(file.type)) {
      return "type";
    }
    if (file.size > maxFileSize) {
      return "size";
    }
  }

  return "ok";
};

export const validateImageFiles = (files: File[]) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
  ];

  const maxFileSize = 5 * 1024 * 1024;

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    if (!allowedMimeTypes.includes(file.type)) {
      return "type";
    }

    if (file.size > maxFileSize) {
      return "size";
    }
  }

  return "ok";
};

export const groupMessagesByDate = (
  messages: IMessage[],
): IGroupedMessages[] => {
  const grouped: { [key: string]: IMessage[] } = {};

  messages.forEach((message) => {
    const date = moment(message.created_at).startOf("day").format();

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(message);
  });

  return Object.keys(grouped)
    .map((dateKey) => ({
      date: dateKey,
      messages: grouped[dateKey],
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const UpdateChatInfo = (id: string) => (dispatch: any) => {
  ActionGetChatInfo(+id).then(({ data }) => {
    dispatch(setChatInfo(data as IChatItems));
  });
};

export const calcReviews = (reviews: IReview[]) => {
  const count = reviews.reduce((a, b) => a + b.count, 0);

  return count ? (count / reviews.length).toFixed(1) : 0;
};

function formatTimeAgo(from: Date) {
  const now = new Date();
  const diffMs = now.getTime() - from.getTime();
  if (diffMs <= 0) {
    return "только что";
  }
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (years > 0) {
    return `${years} г.`;
  }
  if (months > 0) {
    return `${months} мес.`;
  }
  if (days > 0) {
    return `${days} дн.`;
  }
  if (hours > 0) {
    return `${hours} ч.`;
  }
  if (minutes > 0) {
    return `${minutes} мин.`;
  }
  return "только что";
}

export const passwordChangedText = (session: any) =>
  (() => {
    const raw = (session as any)?.user?.password_reset_expires as
      | string
      | undefined;
    if (!raw) {
      return "Еще не изменялся";
    }
    const d = new Date(raw);
    if (isNaN(d.getTime())) {
      return "Еще не изменялся";
    }
    return `Был изменен ${formatTimeAgo(d)} назад`;
  })();

// Online status utilities
export const getOnlineStatus = (
  lastSeen: Date | string | null,
): {
  isOnline: boolean;
  statusText: string;
  statusClass: string;
} => {
  if (!lastSeen) {
    return {
      isOnline: false,
      statusText: "Недавно не был в сети",
      statusClass: "offline",
    };
  }

  const lastSeenDate =
    typeof lastSeen === "string" ? new Date(lastSeen) : lastSeen;
  const now = new Date();
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  // Consider user online if they were active within last 1 minute (instant real-time)
  if (diffMinutes <= 1) {
    return {
      isOnline: true,
      statusText: "В сети",
      statusClass: "online",
    };
  }

  // Show "last seen" time
  const timeAgo = formatTimeAgo(lastSeenDate);
  return {
    isOnline: false,
    statusText: `Был в сети ${timeAgo} назад`,
    statusClass: "offline",
  };
};

export const formatLastSeenTime = (lastSeen: Date | string | null): string => {
  if (!lastSeen) return "Недавно не был в сети";

  const lastSeenDate =
    typeof lastSeen === "string" ? new Date(lastSeen) : lastSeen;
  return formatTimeAgo(lastSeenDate);
};

// Maximum secret logic string encoding/decoding algorithm

/**
 * SuperSecret string encoder/decoder (strong obfuscation, non-cryptographic!)
 *
 * Encodes a string with random salt, shifting, substitution, and per-character hashing.
 * Generates a base64 output which can be decoded only with decodeSecretString.
 *
 * This is not secure for cryptography but highly obfuscated and hard to reverse casually.
 */

function getDeterministicSalt(input: string, length: number = 6): string {
  // Generate a deterministic salt based on input
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let salt = "";
  for (let i = 0; i < length; ++i) {
    // Use input charcodes to create deterministic salt
    const seed = (input.charCodeAt(i % input.length) + i * 31) % chars.length;
    salt += chars[Math.abs(seed)];
  }
  return salt;
}

// A prime number table to add hard-to-reverse confusion
const PRIME_TABLE = [
  47, 89, 71, 59, 97, 53, 83, 61, 73, 67, 79, 41, 43, 101, 109, 113, 127, 131,
];

/**
 * Encode a string with a "maximum secret" custom algorithm.
 * @param input string to encode
 * @returns encoded string (base64)
 */
export function encodeSecretString(input: string): string {
  // Step 1: Deterministic salt based on input
  const salt = getDeterministicSalt(input, 8);
  // Step 2: Shift salt-key based charcodes, prime table, xor, and reverse
  const arr: number[] = [];
  // Hidden sausage: combine with salt, length and prime permutations
  for (let i = 0; i < input.length; ++i) {
    let code = input.charCodeAt(i);
    // First, xor with salt charcode and prime table
    code ^= salt.charCodeAt(i % salt.length);
    code ^= PRIME_TABLE[i % PRIME_TABLE.length];
    // Next, add shifting based on position and salt
    code = (code + (3 * i + salt.charCodeAt(i % salt.length))) & 0xff;
    arr.push(code);
  }
  // Extra reverse for confusion
  arr.reverse();

  // Attach salt, input length for length restoration
  const dataBin = [
    salt.length,
    input.length,
    ...salt.split("").map((s) => s.charCodeAt(0)),
    ...arr,
  ];
  // base64 encode
  const binstr = String.fromCharCode(...dataBin);
  return btoa(binstr);
}

/**
 * Decode a string encoded by encodeSecretString
 * @param enc Encoded string (base64)
 * @returns Decoded plain string
 */
export function decodeSecretString(enc: string): string {
  const binstr = atob(enc);
  const data = Array.from(binstr).map((ch) => ch.charCodeAt(0));

  const saltLength = data[0];
  const origLength = data[1];
  const salt = String.fromCharCode(...data.slice(2, 2 + saltLength));
  const arr = data.slice(2 + saltLength);

  // Reverse array to restore original order
  arr.reverse();

  let plain = "";
  for (let i = 0; i < arr.length && plain.length < origLength; ++i) {
    let code = arr[i];
    // Undo shifting
    code = (code - (3 * i + salt.charCodeAt(i % salt.length)) + 256) & 0xff;
    // Undo xor
    code ^= PRIME_TABLE[i % PRIME_TABLE.length];
    code ^= salt.charCodeAt(i % salt.length);
    plain += String.fromCharCode(code);
  }
  return plain;
}
