import { useQuery } from "@tanstack/react-query";

export const fetchUser = async () => {
  const res = await fetch("/api/auth/me");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
