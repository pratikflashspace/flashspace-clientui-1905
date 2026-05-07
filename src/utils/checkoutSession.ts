const CHECKOUT_RETURN_KEY = "flashspace_checkout_return_to";
const CHECKOUT_STATE_KEY = "flashspace_checkout_state";

const canUseSessionStorage = () =>
  typeof window !== "undefined" && Boolean(window.sessionStorage);

export const getCurrentCheckoutPath = () => {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

export const getLoginRedirectUrl = (returnTo = getCurrentCheckoutPath()) =>
  `/login?redirectTo=${encodeURIComponent(returnTo)}`;

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
