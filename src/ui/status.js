import { elements } from "./dom.js";

export function setStatus(message, type = "normal") {
  elements.statusMessage.textContent = message;
  elements.statusMessage.dataset.type = type;
}

export function reportError(
  error,
  fallbackMessage,
  prefix = "",
) {
  console.error(error);

  setStatus(
    error instanceof Error
      ? `${prefix}${error.message}`
      : fallbackMessage,
    "error",
  );
}
