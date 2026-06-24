/**
 * Safe wrapper for window.alert to prevent runtime DOMExceptions and SecurityErrors
 * inside sandboxed iFrame environments.
 */
export function safeAlert(msg: string) {
  try {
    if (typeof window !== "undefined" && window.alert) {
      window.alert(msg);
    } else {
      console.log("[BANTConfirm Alert Fallback]:", msg);
    }
  } catch (err) {
    console.warn("[BANTConfirm Alert Blocked]:", msg);
  }
}
