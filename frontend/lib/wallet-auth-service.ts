// Enhanced wallet authentication service
import { useAccount, useSignMessage } from 'wagmi';
import { apiService } from './api-service';

export interface WalletAuthConfig {
  autoConnect: boolean;
  requireSignature: boolean;
  sessionTimeout: number; // in milliseconds
  refreshInterval: number; // in milliseconds
}

export interface AuthState {
  isConnected: boolean;
  isAuthenticated: boolean;
  address: string | null;
  user: any | null;
  token: string | null;
  sessionExpiry: number | null;
}

class WalletAuthService {
  private config: WalletAuthConfig = {
    autoConnect: true,
    requireSignature: true,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  };

  private authState: AuthState = {
    isConnected: false,
    isAuthenticated: false,
    address: null,
    user: null,
    token: null,
    sessionExpiry: null,
  };

  private refreshTimer: NodeJS.Timeout | null = null;
  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor(config?: Partial<WalletAuthConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.initializeAuth();
  }

  private initializeAuth() {
    // Check for existing session
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      const storedExpiry = localStorage.getItem('auth_session_expiry');
      
      if (storedToken && storedExpiry) {
        const expiry = parseInt(storedExpiry);
        if (Date.now() < expiry) {
          this.authState.token = storedToken;
          this.authState.sessionExpiry = expiry;
          this.authState.isAuthenticated = true;
          apiService.setToken(storedToken);
          this.startRefreshTimer();
        } else {
          this.clearSession();
        }
      }
    }
  }

  // Connect wallet and authenticate
  async connectWallet(address: string, signature?: string): Promise<boolean> {
    try {
      if (this.config.requireSignature && !signature) {
        throw new Error('Signature required for authentication');
      }

      // Authenticate with backend
      const message = this.generateAuthMessage(address);
      const authResponse = await apiService.authenticate(
        address,
        signature || '',
        message
      );

      if (authResponse.success && authResponse.data.token) {
        this.authState.isConnected = true;
        this.authState.isAuthenticated = true;
        this.authState.address = address;
        this.authState.user = authResponse.data.user;
        this.authState.token = authResponse.data.token;
        this.authState.sessionExpiry = Date.now() + this.config.sessionTimeout;

        // Store session data
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', authResponse.data.token);
          localStorage.setItem('auth_session_expiry', this.authState.sessionExpiry.toString());
          localStorage.setItem('auth_address', address);
        }

        // Set token in API service
        apiService.setToken(authResponse.data.token);

        // Start refresh timer
        this.startRefreshTimer();

        // Notify listeners
        this.notifyListeners();

        return true;
      }

      return false;
    } catch (error) {
      console.error('Wallet authentication failed:', error);
      return false;
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    this.clearSession();
    this.notifyListeners();
  }

  // Clear session data
  private clearSession() {
    this.authState = {
      isConnected: false,
      isAuthenticated: false,
      address: null,
      user: null,
      token: null,
      sessionExpiry: null,
    };

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_session_expiry');
      localStorage.removeItem('auth_address');
    }

    apiService.clearToken();
    this.stopRefreshTimer();
  }

  // Generate authentication message
  private generateAuthMessage(address: string): string {
    const timestamp = Date.now();
    return `Civic DAO Authentication\nAddress: ${address}\nTimestamp: ${timestamp}\nNonce: ${Math.random().toString(36).substring(2)}`;
  }

  // Start refresh timer
  private startRefreshTimer() {
    this.stopRefreshTimer();
    
    this.refreshTimer = setInterval(async () => {
      if (this.authState.isAuthenticated && this.authState.sessionExpiry) {
        // Check if session is about to expire (within 5 minutes)
        const timeUntilExpiry = this.authState.sessionExpiry - Date.now();
        
        if (timeUntilExpiry < 5 * 60 * 1000) {
          // Refresh session
          await this.refreshSession();
        }
      }
    }, this.config.refreshInterval);
  }

  // Stop refresh timer
  private stopRefreshTimer() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Refresh session
  private async refreshSession(): Promise<boolean> {
    if (!this.authState.address || !this.authState.token) {
      return false;
    }

    try {
      // Get fresh user data
      const userResponse = await apiService.getUserProfile(this.authState.address);
      
      if (userResponse.success) {
        this.authState.user = userResponse.data.user;
        this.authState.sessionExpiry = Date.now() + this.config.sessionTimeout;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_session_expiry', this.authState.sessionExpiry.toString());
        }
        
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    }

    return false;
  }

  // Check if session is valid
  isSessionValid(): boolean {
    if (!this.authState.isAuthenticated || !this.authState.sessionExpiry) {
      return false;
    }
    
    return Date.now() < this.authState.sessionExpiry;
  }

  // Get current auth state
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getAuthState());
      } catch (error) {
        console.error('Error notifying auth listener:', error);
      }
    });
  }

  // Update user data
  async updateUser(userData: any): Promise<boolean> {
    if (!this.authState.isAuthenticated || !this.authState.address) {
      return false;
    }

    try {
      const response = await apiService.updateUserProfile(this.authState.address, userData);
      
      if (response.success) {
        this.authState.user = { ...this.authState.user, ...userData };
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }

    return false;
  }

  // Verify ZK identity
  async verifyZKIdentity(identityHash: string, proof: string, metadata: string): Promise<boolean> {
    if (!this.authState.isAuthenticated || !this.authState.address) {
      return false;
    }

    try {
      const response = await apiService.submitZKProof(
        this.authState.address,
        identityHash,
        proof,
        metadata
      );

      if (response.success) {
        // Update user verification status
        this.authState.user = {
          ...this.authState.user,
          verified: true,
          identityHash
        };
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error('ZK identity verification failed:', error);
    }

    return false;
  }

  // Get user stats
  async getUserStats() {
    if (!this.authState.isAuthenticated || !this.authState.address) {
      return null;
    }

    try {
      const response = await apiService.getUserStats(this.authState.address);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  }

  // Cleanup
  destroy() {
    this.stopRefreshTimer();
    this.listeners.clear();
    this.clearSession();
  }
}

// Export singleton instance
export const walletAuthService = new WalletAuthService();
export default walletAuthService;
