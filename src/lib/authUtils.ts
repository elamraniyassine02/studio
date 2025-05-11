// In a real application, use a strong library like bcrypt or Argon2, and perform hashing server-side.
// This is a simplified mock for client-side demonstration.
export async function hashPassword(password: string): Promise<string> {
  // Simulate async hashing
  await new Promise(resolve => setTimeout(resolve, 50));
  // Super simple "hash" - DO NOT USE IN PRODUCTION
  return `hashed_${password}_mock`;
}

export async function verifyPassword(password: string, hashedPassword?: string): Promise<boolean> {
  if (!hashedPassword) return false;
  // Simulate async verification
  await new Promise(resolve => setTimeout(resolve, 50));
  return `hashed_${password}_mock` === hashedPassword;
}
