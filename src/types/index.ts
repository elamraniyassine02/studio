export interface User {
  id: string;
  username: string;
  hashedPassword?: string; // Only stored in "database", not in client state after login
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
}

// For AI hint generation
export interface CredentialSecurityHint {
  hint: string;
}
