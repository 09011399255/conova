
import apiFetchWrapper, { ClientError } from "./apiFetchWrapper";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
let lastRefreshTime = 0;
let refreshIntervalId: number | null = null;
const REFRESH_INTERVAL = 1 * 60 * 1000; // 1 minute, cos of testing as ysf mentioned

/**
 * Authenticated version of apiFetchWrapper that handles token refresh stuff so that I don't have to think about it
 */

/**
 * created this to handle auth gracefully
 */
export default async function authFetch<T = any>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: any;
    customConfig?: RequestInit;
  } = {}
): Promise<T> {
  const { method = "GET", body, customConfig = {} } = options;

  //alwyas include credentials by default
  const enhancedConfig: RequestInit = {
    credentials: "include",
    ...customConfig,
    headers: {
      ...(customConfig.headers || {}),
    },
  };

  try {
    await checkRefreshTokens();

    return await apiFetchWrapper<T>(endpoint, {
      method,
      body,
      customConfig: enhancedConfig,
    });
  } catch (error) {
    if ((error as ClientError).status === 401) {
      const refreshed = await refreshTokens();
      if (refreshed) {
        return await apiFetchWrapper<T>(endpoint, {
          method,
          body,
          customConfig: enhancedConfig,
        });
      } else {
        console.error("Omo e don jand");
        throw {
          name: "ClientError",
          message: "Authentication expired",
          status: 420, // Custom status I came up with so that we can know that this authfetch ain't authing, you feel me? we might change it later but for debugging now sha
        } as ClientError;
      }
    }

    throw error;
  }
}

async function checkRefreshTokens(): Promise<void> {
  const now = Date.now();
  if (now - lastRefreshTime > REFRESH_INTERVAL) {
    await refreshTokens();
  }
}

async function refreshTokens(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    //basically cut it out if this get's called and the api request is still going through...
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = new Promise<boolean>(async (resolve) => {
    try {
      const response = await apiFetchWrapper("/auth/refresh/", {
        method: "POST",
        customConfig: {
          credentials: "include",
        },
      });

      if (response) {
        lastRefreshTime = Date.now();
      }

      resolve(true);
    } catch (error) {
      console.error("Token refresh failed:", error);
      resolve(false);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  });

  return refreshPromise;
}

export function initAuth(): void {
  refreshTokens().catch(console.error);

  if (refreshIntervalId !== null) {
    clearInterval(refreshIntervalId);
  }

  refreshIntervalId = window.setInterval(() => {
    refreshTokens().catch(console.error);
  }, REFRESH_INTERVAL);
}

export function clearAuth(): void {
  if (refreshIntervalId !== null) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
  lastRefreshTime = 0;
}


//Decided to put the login function here cos it felt the right thing to do and since we don't give af about what the api sends back, I kept it basic
export async function logout(): Promise<void> {
  try {
    await apiFetchWrapper("/auth/logout/", {
      method: "POST",
      customConfig: {
        credentials: "include",
      },
    });
  } catch (error) {
    console.error("Logout failed:", error);
    throw {
      name: "ClientError",
      message: "App no wan log me out keh?",
      status: 421, // Custom status 
    } as ClientError;
    
  } finally {
    clearAuth();
  }
}
