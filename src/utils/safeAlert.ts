/**
 * Safe wrapper for window.alert to prevent runtime DOMExceptions and SecurityErrors
 * inside sandboxed iFrame environments.
 */
/**
 * Safe wrapper for window.alert to prevent runtime DOMExceptions and SecurityErrors
 * inside sandboxed iFrame environments. Supports elegant custom in-app toasts.
 */
export function safeAlert(msg: string, type: "success" | "error" | "info" | "warning" = "info") {
  try {
    if (typeof window !== "undefined" && (window as any).__showToast) {
      (window as any).__showToast(msg, type);
    } else if (typeof window !== "undefined" && window.alert) {
      window.alert(msg);
    } else {
      console.log(`[BANTConfirm Alert Fallback - ${type}]:`, msg);
    }
  } catch (err) {
    console.warn(`[BANTConfirm Alert Blocked - ${type}]:`, msg);
  }
}

