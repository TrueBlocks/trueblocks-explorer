import { useCallback, useEffect, useState } from 'react';

import { GetFormat, SetFormat, SilenceDialog } from '@app';
import { StyledButton, StyledModal, StyledText } from '@components';
import { Checkbox, Group, Radio, Stack } from '@mantine/core';
import { LogError } from '@utils';

export interface ExportFormatModalProps {
  opened: boolean;
  onClose: () => void;
  onFormatSelected: (format: string) => void;
}

const formatOptions = [
  { value: 'csv', label: 'CSV - Comma separated values (.csv)' },
  { value: 'txt', label: 'TXT - Tab separated values (.txt)' },
  { value: 'json', label: 'JSON - JavaScript Object Notation (.json)' },
];

export const ExportFormatModal = ({
  opened,
  onClose,
  onFormatSelected,
}: ExportFormatModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load the last format preference when modal opens
  useEffect(() => {
    if (opened) {
      setLoading(true);
      GetFormat()
        .then((lastFormat: string) => {
          setSelectedFormat(lastFormat || 'csv');
        })
        .catch((error: Error) => {
          LogError(`[ExportFormatModal] Error loading format: ${error}`);
          setSelectedFormat('csv');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [opened]);

  const handleFormatSelect = useCallback(
    async (format: string) => {
      try {
        // Save the selected format preference
        await SetFormat(format);

        // If user chose "don't show again", silence the dialog
        if (dontShowAgain) {
          await SilenceDialog('exportFormat');
          LogError('[ExportFormatModal] Export format dialog silenced');
        }

        // Close modal and proceed with export
        onClose();
        onFormatSelected(format);
      } catch (error) {
        LogError(`[ExportFormatModal] Error saving preferences: ${error}`);
        // Still proceed with export even if preference saving fails
        onClose();
        onFormatSelected(format);
      }
    },
    [dontShowAgain, onClose, onFormatSelected],
  );

  // Handle Enter key to trigger export
  useEffect(() => {
    if (!opened || loading) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleFormatSelect(selectedFormat);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [opened, selectedFormat, loading, handleFormatSelect]);

  const handleCancel = () => {
    onClose();
  };

  return (
    <StyledModal
      opened={opened}
      onClose={handleCancel}
      title="Select Export Format"
      size="md"
      centered
      withCloseButton={false}
    >
      <Stack gap="md">
        <StyledText variant="dimmed" size="sm">
          Choose the format for your exported data:
        </StyledText>

        <Radio.Group
          value={selectedFormat}
          onChange={setSelectedFormat}
          name="exportFormat"
        >
          <Stack gap="xs">
            {formatOptions.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={loading}
              />
            ))}
          </Stack>
        </Radio.Group>

        <Checkbox
          checked={dontShowAgain}
          onChange={(event) => setDontShowAgain(event.currentTarget.checked)}
          label="Don't show this dialog again"
          disabled={loading}
        />

        <Group justify="flex-end" gap="sm">
          <StyledButton
            variant="transparent"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </StyledButton>
          <StyledButton
            onClick={() => handleFormatSelect(selectedFormat)}
            loading={loading}
          >
            Export
          </StyledButton>
        </Group>
      </Stack>
    </StyledModal>
  );
};
