import { useCallback, useEffect, useState } from 'react';

import { GetAppPreferences, SetAppPreferences } from '@app';
import { StyledButton, StyledModal, StyledText } from '@components';
import { Checkbox, Group, Stack } from '@mantine/core';
import { LogError, updateAppPreferencesSafely } from '@utils';

interface ConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  dialogKey: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const ConfirmModal = ({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  dialogKey,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}: ConfirmModalProps) => {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (dontAskAgain && dialogKey) {
      try {
        // Save the silenced dialog preference
        const currentPrefs = await GetAppPreferences();
        const updatedPrefs = updateAppPreferencesSafely(currentPrefs, {
          silencedDialogs: {
            ...currentPrefs.silencedDialogs,
            [dialogKey]: true,
          },
        });
        await SetAppPreferences(updatedPrefs);
      } catch (error) {
        LogError(
          'Failed to save silenced dialog preference:',
          JSON.stringify(error),
        );
        // Continue with the action even if saving preferences fails
      }
    }
    onConfirm();
    onClose();
  }, [dontAskAgain, dialogKey, onConfirm, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  // Reset checkbox when modal opens
  useEffect(() => {
    if (opened) {
      setDontAskAgain(false);
    }
  }, [opened]);

  return (
    <StyledModal
      opened={opened}
      onClose={handleCancel}
      title={title}
      centered
      size="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="md">
        <StyledText variant="primary" size="sm">
          {message}
        </StyledText>

        <Checkbox
          label="Don't ask again"
          checked={dontAskAgain}
          onChange={(event) => setDontAskAgain(event.currentTarget.checked)}
        />

        <Group justify="flex-end" gap="sm">
          <StyledButton variant="transparent" onClick={handleCancel}>
            {cancelButtonText}
          </StyledButton>
          <StyledButton onClick={handleConfirm}>
            {confirmButtonText}
          </StyledButton>
        </Group>
      </Stack>
    </StyledModal>
  );
};
