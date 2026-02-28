"use client";

import { useCallback } from "react";
import useSWR from "swr";

interface User {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
}

interface Repo {
  owner: string;
  name: string;
}

interface AuthData {
  user: User | null;
  repo: Repo | null;
}

const fetcher = (url: string): Promise<AuthData> =>
  fetch(url).then((r) => r.json());

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<AuthData>(
    "/api/auth/me",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const login = useCallback(() => {
    window.location.href = "/api/auth/github";
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    mutate({ user: null, repo: null }, false);
  }, [mutate]);

  const setRepo = useCallback(
    (repo: Repo) => {
      mutate((prev) => (prev ? { ...prev, repo } : { user: null, repo }), false);
    },
    [mutate]
  );

  return {
    user: data?.user ?? null,
    repo: data?.repo ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    isAuthenticated: !!data?.user,
    login,
    logout,
    setRepo,
    refetch: mutate,
  };
}
