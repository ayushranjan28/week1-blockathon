// Enhanced polling service for real-time updates
import { apiService } from './api-service';

export interface PollingConfig {
  interval: number;
  maxRetries: number;
  retryDelay: number;
  enabled: boolean;
}

export interface PollingCallbacks {
  onData?: (data: any) => void;
  onError?: (error: Error) => void;
  onRetry?: (attempt: number) => void;
  onSuccess?: () => void;
}

class PollingService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private retryCounts: Map<string, number> = new Map();
  private isPolling: Map<string, boolean> = new Map();

  // Start polling for governance stats
  startGovernancePolling(
    config: PollingConfig = {
      interval: 10000, // 10 seconds
      maxRetries: 3,
      retryDelay: 5000,
      enabled: true
    },
    callbacks: PollingCallbacks = {}
  ) {
    const key = 'governance-stats';
    this.stopPolling(key);
    
    if (!config.enabled) return;

    const poll = async () => {
      if (this.isPolling.get(key)) return;
      
      this.isPolling.set(key, true);
      
      try {
        const response = await apiService.getGovernanceStats();
        if (response.success) {
          callbacks.onData?.(response.data);
          callbacks.onSuccess?.();
          this.retryCounts.set(key, 0);
        } else {
          throw new Error('Failed to fetch governance stats');
        }
      } catch (error) {
        const retryCount = this.retryCounts.get(key) || 0;
        
        if (retryCount < config.maxRetries) {
          this.retryCounts.set(key, retryCount + 1);
          callbacks.onRetry?.(retryCount + 1);
          
          setTimeout(() => {
            this.isPolling.set(key, false);
            poll();
          }, config.retryDelay);
          return;
        }
        
        callbacks.onError?.(error as Error);
        this.retryCounts.set(key, 0);
      } finally {
        this.isPolling.set(key, false);
      }
    };

    // Initial poll
    poll();
    
    // Set up interval
    const interval = setInterval(poll, config.interval);
    this.intervals.set(key, interval);
  }

  // Start polling for proposals
  startProposalsPolling(
    config: PollingConfig = {
      interval: 15000, // 15 seconds
      maxRetries: 3,
      retryDelay: 5000,
      enabled: true
    },
    callbacks: PollingCallbacks = {}
  ) {
    const key = 'proposals';
    this.stopPolling(key);
    
    if (!config.enabled) return;

    const poll = async () => {
      if (this.isPolling.get(key)) return;
      
      this.isPolling.set(key, true);
      
      try {
        const response = await apiService.getProposals({ limit: 50 });
        if (response.success) {
          callbacks.onData?.(response.data);
          callbacks.onSuccess?.();
          this.retryCounts.set(key, 0);
        } else {
          throw new Error('Failed to fetch proposals');
        }
      } catch (error) {
        const retryCount = this.retryCounts.get(key) || 0;
        
        if (retryCount < config.maxRetries) {
          this.retryCounts.set(key, retryCount + 1);
          callbacks.onRetry?.(retryCount + 1);
          
          setTimeout(() => {
            this.isPolling.set(key, false);
            poll();
          }, config.retryDelay);
          return;
        }
        
        callbacks.onError?.(error as Error);
        this.retryCounts.set(key, 0);
      } finally {
        this.isPolling.set(key, false);
      }
    };

    // Initial poll
    poll();
    
    // Set up interval
    const interval = setInterval(poll, config.interval);
    this.intervals.set(key, interval);
  }

  // Start polling for user stats
  startUserStatsPolling(
    address: string,
    config: PollingConfig = {
      interval: 20000, // 20 seconds
      maxRetries: 3,
      retryDelay: 5000,
      enabled: true
    },
    callbacks: PollingCallbacks = {}
  ) {
    const key = `user-stats-${address}`;
    this.stopPolling(key);
    
    if (!config.enabled || !address) return;

    const poll = async () => {
      if (this.isPolling.get(key)) return;
      
      this.isPolling.set(key, true);
      
      try {
        const response = await apiService.getUserStats(address);
        if (response.success) {
          callbacks.onData?.(response.data);
          callbacks.onSuccess?.();
          this.retryCounts.set(key, 0);
        } else {
          throw new Error('Failed to fetch user stats');
        }
      } catch (error) {
        const retryCount = this.retryCounts.get(key) || 0;
        
        if (retryCount < config.maxRetries) {
          this.retryCounts.set(key, retryCount + 1);
          callbacks.onRetry?.(retryCount + 1);
          
          setTimeout(() => {
            this.isPolling.set(key, false);
            poll();
          }, config.retryDelay);
          return;
        }
        
        callbacks.onError?.(error as Error);
        this.retryCounts.set(key, 0);
      } finally {
        this.isPolling.set(key, false);
      }
    };

    // Initial poll
    poll();
    
    // Set up interval
    const interval = setInterval(poll, config.interval);
    this.intervals.set(key, interval);
  }

  // Start polling for notifications
  startNotificationsPolling(
    config: PollingConfig = {
      interval: 30000, // 30 seconds
      maxRetries: 3,
      retryDelay: 10000,
      enabled: true
    },
    callbacks: PollingCallbacks = {}
  ) {
    const key = 'notifications';
    this.stopPolling(key);
    
    if (!config.enabled) return;

    const poll = async () => {
      if (this.isPolling.get(key)) return;
      
      this.isPolling.set(key, true);
      
      try {
        // Simulate notification polling (replace with actual API call)
        const mockNotifications = [
          {
            id: Date.now().toString(),
            type: 'info',
            title: 'New Proposal',
            message: 'A new proposal has been submitted',
            timestamp: Date.now(),
            read: false
          }
        ];
        
        callbacks.onData?.(mockNotifications);
        callbacks.onSuccess?.();
        this.retryCounts.set(key, 0);
      } catch (error) {
        const retryCount = this.retryCounts.get(key) || 0;
        
        if (retryCount < config.maxRetries) {
          this.retryCounts.set(key, retryCount + 1);
          callbacks.onRetry?.(retryCount + 1);
          
          setTimeout(() => {
            this.isPolling.set(key, false);
            poll();
          }, config.retryDelay);
          return;
        }
        
        callbacks.onError?.(error as Error);
        this.retryCounts.set(key, 0);
      } finally {
        this.isPolling.set(key, false);
      }
    };

    // Initial poll
    poll();
    
    // Set up interval
    const interval = setInterval(poll, config.interval);
    this.intervals.set(key, interval);
  }

  // Stop specific polling
  stopPolling(key: string) {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
    }
    this.isPolling.set(key, false);
    this.retryCounts.set(key, 0);
  }

  // Stop all polling
  stopAllPolling() {
    this.intervals.forEach((interval, key) => {
      clearInterval(interval);
    });
    this.intervals.clear();
    this.isPolling.clear();
    this.retryCounts.clear();
  }

  // Check if polling is active
  isActive(key: string): boolean {
    return this.intervals.has(key);
  }

  // Get polling status
  getStatus() {
    return {
      active: Array.from(this.intervals.keys()),
      retryCounts: Object.fromEntries(this.retryCounts),
      isPolling: Object.fromEntries(this.isPolling)
    };
  }
}

// Export singleton instance
export const pollingService = new PollingService();
export default pollingService;
