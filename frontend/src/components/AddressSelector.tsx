import { useEffect, useState } from 'react';

import { GetAddressName } from '@app';
import { AddAddressModal, StyledSelect } from '@components';
import { useActiveProject } from '@hooks';
import { Text } from '@mantine/core';
import { addressToHex } from '@utils';

interface AddressSelectorProps {
  label?: string;
  visible?: boolean;
}

export const AddressSelector = ({
  label,
  visible = true,
}: AddressSelectorProps) => {
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [addressNames, setAddressNames] = useState<Record<string, string>>({});
  const { activeAddress, setActiveAddress } = useActiveProject();
  const { projects } = useActiveProject();

  const currentProject = projects.find((p) => p.isActive);

  // Fetch names for all addresses when project changes
  useEffect(() => {
    const fetchNames = async () => {
      if (!currentProject?.addresses?.length) return;

      const names: Record<string, string> = {};
      for (const address of currentProject.addresses) {
        try {
          const name = await GetAddressName(addressToHex(address));
          if (name && name.trim()) {
            names[addressToHex(address)] = name;
          }
        } catch {
          // Silently ignore errors - just show address without name
        }
      }
      setAddressNames(names);
    };

    fetchNames();
  }, [currentProject?.addresses]);

  const addressOptions =
    currentProject?.addresses?.map((address) => {
      const fullAddress = addressToHex(address);
      const name = addressNames[fullAddress];
      const shortAddress = `${fullAddress.slice(0, 6)}...${fullAddress.slice(-4)}`;

      return {
        value: address,
        label: name ? `${name} (${shortAddress})` : fullAddress,
      };
    }) || [];

  addressOptions.push({
    value: '__add_address__',
    label: 'Add address...',
  });

  const handleAddressChange = async (address: string | null) => {
    if (address === '__add_address__') {
      setAddModalOpened(true);
      return;
    }
    if (address && address !== activeAddress) {
      await setActiveAddress(address);
    }
  };

  if (!visible) return null;
  return (
    <>
      {label && <Text size="sm">{label}</Text>}
      <StyledSelect
        size="sm"
        placeholder="Address"
        value={activeAddress}
        data={addressOptions}
        onChange={handleAddressChange}
        w={420}
      />
      <AddAddressModal
        opened={addModalOpened}
        onSubmit={() => {
          setAddModalOpened(false);
        }}
        onCancel={() => {
          setAddModalOpened(false);
        }}
      />
    </>
  );
};
