import { useEffect, useState } from 'react';

import { AddAddressToProject, ConvertToAddress, SetActiveAddress } from '@app';
import {
  StyledButton,
  StyledModal,
  StyledSelect,
  StyledText,
} from '@components';
import { useActiveProject, useIconSets } from '@hooks';
import { ActionIcon, Group, Stack, TextInput, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { base } from '@models';
import {
  ADDRESS_PLACEHOLDER,
  Log,
  LogError,
  addressToHex,
  getDisplayAddress,
  validateAddressOrEns,
} from '@utils';

import { GetAddresses } from '../../wailsjs/go/project/Project';

interface AddressOption {
  value: string;
  label: string;
}

interface AddAddressForm {
  address: string;
}

export const AddressSelector = () => {
  const [addresses, setAddresses] = useState<base.Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const { activeAddress } = useActiveProject();
  const { Create, Switch } = useIconSets();

  const form = useForm<AddAddressForm>({
    initialValues: { address: '' },
    validate: {
      address: (value) => validateAddressOrEns(value),
    },
  });

  const loadAddresses = async () => {
    try {
      const projectAddresses = await GetAddresses();
      setAddresses(projectAddresses || []);
    } catch (error) {
      LogError(`Loading addresses: ${error}`);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const addressOptions: AddressOption[] = addresses.map((addr) => ({
    value: addressToHex(addr),
    label: getDisplayAddress(addr),
  }));

  const handleAddressChange = async (value: string | null) => {
    if (!value) return;

    try {
      setLoading(true);

      // Find the address object
      const selectedAddr = addresses.find(
        (addr) => addressToHex(addr) === value,
      );
      if (selectedAddr) {
        await SetActiveAddress(addressToHex(selectedAddr));
        Log(`Switched to address: ${getDisplayAddress(selectedAddr)}`);
      }
    } catch (error) {
      LogError(`Switching address: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (values: AddAddressForm) => {
    try {
      setLoading(true);

      const trimmedValues = {
        ...values,
        address: values.address?.trim() || '',
      };
      const result = await ConvertToAddress(trimmedValues.address);
      if (result && typeof result === 'object' && 'hex' in result) {
        await AddAddressToProject(addressToHex(result as base.Address));
        await loadAddresses();
        form.reset();
        setAddModalOpened(false);
        Log(`Added address: ${trimmedValues.address}`);
      } else {
        throw new Error('Invalid address format');
      }
    } catch (error) {
      LogError(`Adding address: ${error}`);
      form.setFieldError('address', `Failed to add address: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Group gap="xs">
        <StyledSelect
          value={activeAddress}
          onChange={handleAddressChange}
          data={addressOptions}
          placeholder="Select address"
          disabled={loading}
          leftSection={<Switch size={16} />}
          comboboxProps={{
            withinPortal: true,
          }}
          style={{ minWidth: 120 }}
        />

        <Tooltip label="Add Address">
          <ActionIcon
            variant="light"
            onClick={() => setAddModalOpened(true)}
            disabled={loading}
          >
            <Create size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <StyledModal
        opened={addModalOpened}
        onClose={() => {
          setAddModalOpened(false);
          form.reset();
        }}
        title="Add Address to Project"
        centered
      >
        <form onSubmit={form.onSubmit(handleAddAddress)}>
          <Stack gap="md">
            <StyledText variant="dimmed" size="sm">
              Add a new Ethereum address to this project. You can use ENS names
              (like vitalik.eth) or standard addresses (0x...).
            </StyledText>

            <TextInput
              label="Address"
              placeholder={ADDRESS_PLACEHOLDER}
              required
              {...form.getInputProps('address')}
            />

            <Group justify="flex-end">
              <StyledButton
                variant="light"
                onClick={() => {
                  setAddModalOpened(false);
                  form.reset();
                }}
              >
                Cancel
              </StyledButton>
              <StyledButton type="submit" loading={loading}>
                Add Address
              </StyledButton>
            </Group>
          </Stack>
        </form>
      </StyledModal>
    </>
  );
};
