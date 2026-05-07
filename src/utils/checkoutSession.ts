const CHECKOUT_RETURN_KEY = "flashspace_checkout_return_to";
const CHECKOUT_STATE_KEY = "flashspace_checkout_state";
const DEFAULT_LOGIN_RETURN_TO = "/";

const CHECKOUT_RETURN_PATHS = [
  "/booking/",
  "/space/",
  "/coworking-space/",
  "/meeting-room/",
];

const canUseSessionStorage = () =>
  typeof window !== "undefined" && Boolean(window.sessionStorage);

export const getCurrentCheckoutPath = () => {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

export const isSafeInternalPath = (path?: string | null) =>
  Boolean(path?.startsWith("/") && !path.startsWith("//"));

export const isCheckoutReturnPath = (path?: string | null) => {
  if (!isSafeInternalPath(path)) return false;

  return CHECKOUT_RETURN_PATHS.some((checkoutPath) =>
    path!.startsWith(checkoutPath),
  );
};

export const getLoginRedirectUrl = (returnTo = getCurrentCheckoutPath()) => {
  const safeReturnTo = isSafeInternalPath(returnTo)
    ? returnTo
    : DEFAULT_LOGIN_RETURN_TO;

  return `/login?redirectTo=${encodeURIComponent(safeReturnTo)}`;
};

export const getDefaultLoginUrl = () => "/login";

export const persistCheckoutState = (
  state: Record<string, unknown>,
  returnTo = getCurrentCheckoutPath(),
) => {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(CHECKOUT_RETURN_KEY, returnTo);
  window.sessionStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify(state));
};

export const readCheckoutState = <T>() => {
  if (!canUseSessionStorage()) return null;
  const rawState = window.sessionStorage.getItem(CHECKOUT_STATE_KEY);
  if (!rawState) return null;

  try {
    return JSON.parse(rawState) as T;
  } catch {
    return null;
  }
};

export const clearCheckoutState = () => {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(CHECKOUT_RETURN_KEY);
  window.sessionStorage.removeItem(CHECKOUT_STATE_KEY);
};
