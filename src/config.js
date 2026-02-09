export const API_BASE_URL = "https://kutubxona.samduuf.uz";

export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};
