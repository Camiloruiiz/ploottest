export type AuthFragmentSession = {
  accessToken: string;
  refreshToken: string;
  next: string;
};

export function parseAuthFragment(hash: string, search = ""): AuthFragmentSession | null {
  const normalized = hash.startsWith("#") ? hash.slice(1) : hash;

  if (!normalized) {
    return null;
  }

  const params = new URLSearchParams(normalized);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return null;
  }

  const searchParams = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

  return {
    accessToken,
    refreshToken,
    next: searchParams.get("next") ?? "/cart",
  };
}
