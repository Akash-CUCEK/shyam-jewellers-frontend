export function getUserRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(window.atob(base64));
    return decodedPayload.role; // 👈 JWT claim "role"
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
