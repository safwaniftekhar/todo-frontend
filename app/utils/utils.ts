export const getSubFromJWT = (token: string): string | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(base64);
    const payload = JSON.parse(decodedPayload);

    return payload.sub || null;
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
};
