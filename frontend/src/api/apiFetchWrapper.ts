

export interface ClientError extends Error {
    status?: number;
    data?: any;
  }
  
  /**
   * Simplified API client optimized for React Query
   * @param endpoint API endpoint path
   * @param options Request options including method, body, etc.
   * @returns Promise resolving to the API response data
   */
  export default async function apiFetchWrapper<T = any>(
    endpoint: string,
    { 
      method = 'GET',
      body, 
      customConfig = {} 
    }: { 
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; 
      body?: any; 
      customConfig?: RequestInit 
    } = {}
  ): Promise<T> {

    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
    const headers = { 'content-type': 'application/json' };
    
    const config: RequestInit = {
      method,
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
      credentials: 'include',
      // Only include body for non-GET requests
      body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
    };
  
    try {
      const response = await fetch(`${BASE_API_URL}${endpoint}`, config);
      
      // For successful responses, just return the data directly
      if (response.ok) {
        // For successful DELETE requests that don't return content
        if (response.status === 204) {
          return {} as T;
        }
        return await response.json();
      }
      
      // Handle error responses
      const errorData = await response.json().catch(() => ({ message: 'Error parsing response' }));



      console.log(errorData);
      
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
        networkError.status = 0; // Using this on frontend fam
        throw networkError;
      }
      
      // Handle truly unexpected errors
      const genericError: ClientError = new Error('An unexpected error occurred');
      genericError.name = 'UnknownError';
      throw genericError;
    }
  }