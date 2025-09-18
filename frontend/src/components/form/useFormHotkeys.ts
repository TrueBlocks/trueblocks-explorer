import { useHotkeys } from 'react-hotkeys-hook';

interface UseFormHotkeysProps {
  mode?: 'display' | 'edit';
  setMode?: (mode: 'display' | 'edit') => void;
  onCancel?: () => void;
  submitButtonRef?: React.RefObject<HTMLButtonElement | null>;
  keys?: string[]; // which hotkeys to enable
}

export const useFormHotkeys = ({
  mode,
  setMode,
  onCancel,
  keys = [],
}: UseFormHotkeysProps): void => {
  const enableKey = (key: string) => keys.length === 0 || keys.includes(key);

  useHotkeys(
    'mod+a',
    (e) => {
      e.preventDefault();
      const activeElement = document.activeElement as HTMLInputElement;
      if (activeElement && activeElement.tagName.toLowerCase() === 'input') {
        const nativeInput = activeElement;
        nativeInput.setSelectionRange(0, nativeInput.value.length);
      }
    },
    { enableOnFormTags: true, enabled: enableKey('mod+a') },
  );

  useHotkeys(
    'enter',
    (e) => {
      const activeElement = document.activeElement as HTMLElement;
      if (mode === 'display') {
        e.preventDefault();
        setMode?.('edit');
        return;
      }

      // Only prevent default and attempt submission if not a TEXTAREA
      if (activeElement && activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const form = activeElement.closest('form') as HTMLFormElement;
        if (form) {
          const submitButton = form.querySelector(
            'button[type="submit"]',
          ) as HTMLButtonElement;
          if (submitButton) {
            submitButton.click();
          }
        }
      }
      // If it's a TEXTAREA, we do nothing here, allowing default 'Enter' behavior (new line)
    },
    { enableOnFormTags: true, enabled: enableKey('enter') },
  );

  useHotkeys(
    'esc',
    (e) => {
      e.preventDefault();
      setMode?.('display');
      onCancel?.();
    },
    { enableOnFormTags: true, enabled: enableKey('esc') },
  );
};
