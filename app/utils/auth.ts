// Utility functions for authentication

/**
 * Generate a simple JWT-like token
 * In a production app, this would be done server-side
 */
export const generateToken = (username: string): string => {
  // Create a base64 encoded payload with username and expiration
  const payload = {
    username,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    iat: Date.now()
  };
  
  const base64Payload = btoa(JSON.stringify(payload));
  // In a real app, this would be signed with a secret key
  return `${base64Payload}.${createSignature(base64Payload)}`;
};

/**
 * Create a simple signature for the token
 * In a real app, this would use a proper signing algorithm with a secret key
 */
const createSignature = (data: string): string => {
  // Simple hash function for demo purposes
  // In production, use a proper JWT library and HMAC
  return btoa(
    String.fromCharCode.apply(
      null,
      Array.from(data).map(c => c.charCodeAt(0) ^ 42) // Simple XOR "signature"
    )
  );
};

/**
 * Verify if a token is valid
 */
export const verifyToken = (token: string): { valid: boolean; username?: string } => {
  try {
    // Split the token into payload and signature
    const [payloadBase64] = token.split('.');
    
    // Decode the payload
    const payload = JSON.parse(atob(payloadBase64));
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      return { valid: false };
    }
    
    // In a real app, you would verify the signature here
    
    return { valid: true, username: payload.username };
  } catch (error) {
    return { valid: false };
  }
};

/**
 * Store the auth token
 */
export const storeToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Get the stored auth token
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Remove the stored auth token (logout)
 */
export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
}; 