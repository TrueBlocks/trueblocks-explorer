import { useState } from 'react';

import { AddAddressesToProject } from '@app';
import { useActiveProject, useIconSets } from '@hooks';
import { Button, Group, Modal, Paper, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { LogError } from '@utils';

import { AddressInput } from './AddressInput';

interface AddAddressModalProps {
  opened: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

interface AddAddressForm extends Record<string, unknown> {
  addresses: string;
}

export const AddAddressModal = ({
  opened,
  onCancel,
  onSubmit,
}: AddAddressModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { Create } = useIconSets();
  const { hasActiveProject } = useActiveProject();

  const form = useForm<AddAddressForm>({
    initialValues: {
      addresses: '',
    },
  });

  const handleAddAddresses = async (values: AddAddressForm) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      if (!hasActiveProject) {
        throw new Error(
          'No active project found. Please create or open a project first.',
        );
      }
      await AddAddressesToProject(values.addresses);
      if (onSubmit) {
        onSubmit();
      }
    } catch (err) {
      const errorMsg = `Failed to add addresses: ${err}`;
      LogError(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      centered
      size="md"
      withCloseButton
      closeOnClickOutside
      closeOnEscape
      title="Add Addresses to Project"
      overlayProps={{
        backgroundOpacity: 0.8,
        blur: 3,
      }}
    >
      <Stack gap="lg">
        <Text c="dimmed" size="sm">
          Add multiple Ethereum addresses or ENS names to your current project
        </Text>

        {error && (
          <Text c="red" size="sm">
            {error}
          </Text>
        )}

        <Paper p="md" withBorder>
          <form onSubmit={form.onSubmit(handleAddAddresses)}>
            <Stack gap="md">
              <Group gap="xs">
                <Create size={20} />
                <Title order={4}>Add Addresses</Title>
              </Group>
              <AddressInput form={form} fieldName="addresses" rows={6} />
              <Group justify="flex-end" gap="sm">
                <Button variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  leftSection={<Create size={16} />}
                >
                  Add Addresses
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Modal>
  );
};
