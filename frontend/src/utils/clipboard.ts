export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Modern browsers with secure context (HTTPS or localhost)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // For Wails desktop app or older browsers, try the Selection API
    if (window.getSelection) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '1px';
      textArea.style.height = '1px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.setAttribute('readonly', '');

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // Use the modern Selection API
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(textArea);
        selection.addRange(range);
        try {
          // This is the last resort fallback - still deprecated but wrapped
          const success = document.execCommand('copy');
          document.body.removeChild(textArea);
          return success;
        } catch {
          document.body.removeChild(textArea);
          return false;
        }
      }
      document.body.removeChild(textArea);
      return false;
    }

    return false;
  } catch {
    return false;
  }
};
