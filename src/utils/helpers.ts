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
  if (diffMs <= 0) return "только что";
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (years > 0) return `${years} г.`;
  if (months > 0) return `${months} мес.`;
  if (days > 0) return `${days} дн.`;
  if (hours > 0) return `${hours} ч.`;
  if (minutes > 0) return `${minutes} мин.`;
  return "только что";
}

export const passwordChangedText = (session: any) =>
  (() => {
    const raw = (session as any)?.user?.password_reset_expires as
      | string
      | undefined;
    if (!raw) return "Еще не изменялся";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return "Еще не изменялся";
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

  // Consider user online if they were active within last 5 minutes
  if (diffMinutes <= 5) {
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
