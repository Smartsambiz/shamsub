// src/services/userService.ts
// Stub implementation for userService to fix import errors in AuthContext

export type RegisterUserData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  // Add more fields as needed, e.g. name?: string;
};

export type LoginUserData = {
  email: string;
  password: string;
};

export const userService = {
  async getUserProfile(userId: string) {
    // Simulate fetching a user profile
    return { success: true, profile: { id: userId, email: `${userId}@example.com` } };
  },
  async registerUser(userData: RegisterUserData) {
    // Simulate registration logic using userData
    if (userData.email && userData.password) {
      return { success: true };
    }
    return { success: false };
  },
  async loginUser(loginData: LoginUserData) {
    // Simulate login logic using loginData
    if (loginData.email && loginData.password) {
      return { success: true };
    }
    return { success: false };
  },
  async logoutUser() {
    // Simulate logout
    return { success: true };
  }
};
