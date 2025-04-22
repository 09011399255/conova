//Just extending this for now, I hav not really tested api behaviour

export interface ClientError extends Error {
    status?: number;
    data?: any;
  }
  
  /**
   * Simplified API client optimized for React Query
   * @param endpoint API endpoint path
   * @param options Request options
   * @returns Promise resolving to the API response data
   */
  export default async function client<T = any>(
    endpoint: string,
    { body, customConfig = {} }: { body?: any; customConfig?: RequestInit } = {}
  ): Promise<T> {
      const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
    const headers = { 'content-type': 'application/json' };
    
    const config: RequestInit = {
      method: body ? 'POST' : 'GET',
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };
  
    try {
      const response = await fetch(`${BASE_API_URL}${endpoint}`, config);
      
      // For successful responses, just return the data directly
      if (response.ok) {
        return await response.json();
      }
      
      // Handle error responses
      const errorData = await response.json().catch(() => ({ message: 'Error parsing response' }));
      
      const error: ClientError = new Error(errorData.message || `Request failed with status ${response.status}`);
      error.name = `HTTP Error ${response.status}`;
      error.status = response.status;
      error.data = errorData;
      
      throw error;
    } catch (error) {
      if (error instanceof Error) {
        // If it's already our processed error from above, just rethrow it
        if ((error as ClientError).status) {
          throw error;
        }
        
        // Handle network errors
        const networkError: ClientError = new Error(
          error.message || 'A network error occurred'
        );
        networkError.name = 'NetworkError';
        networkError.status = 0; // Convention for network errors
        throw networkError;
      }
      
      // Handle truly unexpected errors
      const genericError: ClientError = new Error('An unexpected error occurred');
      genericError.name = 'UnknownError';
      throw genericError;
    }
  }