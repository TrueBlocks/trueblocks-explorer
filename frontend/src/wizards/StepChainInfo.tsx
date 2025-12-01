import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { GetUserPreferences, SetUserPreferences } from '@app';
import { FormField, WizardForm } from '@components';
import { useIconSets } from '@hooks';
import { ActionIcon, Card, Group, Tabs, Text } from '@mantine/core';
import { preferences } from '@models';
import { LogError, emitStatus } from '@utils';

import { WizardStepProps } from '.';
import { WizardStateData } from './WizardTypes';

export const StepChainInfo = ({
  state,
  onSubmit,
  onBack,
  updateData,
  validateRpc,
  onCancel,
}: WizardStepProps) => {
  const { rpcUrl, chainName, chainId, symbol, remoteExplorer } = state.data;
  const { rpcError, chainError } = state.validation;
  const { Create, Delete } = useIconSets();
  const [chains, setChains] = useState<preferences.Chain[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('new');
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);
  }, [activeTab]);

  const updateFormWithChain = useCallback(
    (chain: preferences.Chain) => {
      if (!updateData) return;

      updateData({
        chainName: chain.chain,
        chainId: chain.chainId.toString(),
        symbol: chain.symbol,
        remoteExplorer: chain.remoteExplorer,
        rpcUrl:
          chain.rpcProviders && chain.rpcProviders.length > 0
            ? chain.rpcProviders[0]
            : '',
      });
    },
    [updateData],
  );

  const clearForm = useCallback(() => {
    if (!updateData) return;

    updateData({
      chainName: '',
      chainId: '',
      symbol: '',
      remoteExplorer: '',
      rpcUrl: '',
    });
  }, [updateData]);

  useEffect(() => {
    const loadChains = async () => {
      try {
        const userPrefs = await GetUserPreferences();
        if (userPrefs.chains && userPrefs.chains.length > 0) {
          setChains(userPrefs.chains);
          setActiveTab('0');
          if (userPrefs.chains[0]) {
            updateFormWithChain(userPrefs.chains[0]);
          }
        } else {
          setActiveTab('new');
          clearForm();
        }
      } catch (error) {
        LogError(`Error trying to load chains: ${error}`);
        emitStatus(`Error trying to load chains: ${error}`);
      }
    };

    loadChains();
  }, [clearForm, updateFormWithChain]);

  const handleTabChange = (value: string | null) => {
    if (!value) {
      clearForm();
      setActiveTab('new');
      return;
    }

    if (value === 'new') {
      clearForm();
      setActiveTab('new');
    } else {
      const index = parseInt(value, 10);
      if (!isNaN(index) && index >= 0 && index < chains.length) {
        const chain = chains[index];
        if (chain) {
          updateFormWithChain(chain);
          setActiveTab(value);
        }
      }
    }
  };

  const handleRemoveChain = async (index: number, e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const updatedChains = [...chains];
      updatedChains.splice(index, 1);

      const userPrefs = await GetUserPreferences();
      userPrefs.chains = updatedChains;
      await SetUserPreferences(userPrefs);

      setChains(updatedChains);

      if (updatedChains.length === 0) {
        clearForm();
        setActiveTab('new');
      } else {
        if (activeTab !== null && parseInt(activeTab, 10) === index) {
          setActiveTab('0');
          if (updatedChains[0]) {
            updateFormWithChain(updatedChains[0]);
          }
        } else if (activeTab !== null && activeTab !== 'new') {
          const currentIndex = parseInt(activeTab, 10);
          if (currentIndex > index) {
            const newIndex = (currentIndex - 1).toString();
            setActiveTab(newIndex);
          }
        }
      }

      emitStatus('Chain removed successfully');
    } catch (error) {
      LogError(`Error removing chain: ${error}`);
      emitStatus(`Error removing chain: ${error}`);
    }
  };

  const saveChain = async () => {
    if (!chainName || !chainId || !symbol || !remoteExplorer || !rpcUrl) {
      emitStatus('Please fill all fields');
      return false;
    }

    try {
      const chainIdNum = parseInt(chainId, 10);
      if (isNaN(chainIdNum)) {
        emitStatus('Chain ID must be a number');
        return false;
      }

      const newChain: preferences.Chain = {
        chain: chainName,
        chainId: chainIdNum,
        symbol: symbol,
        remoteExplorer: remoteExplorer,
        rpcProviders: [rpcUrl],
      };

      let updatedChains: preferences.Chain[];

      if (activeTab === 'new') {
        updatedChains = [...chains, newChain];
        setActiveTab((updatedChains.length - 1).toString());
      } else if (activeTab !== null) {
        updatedChains = [...chains];
        const index = parseInt(activeTab, 10);
        if (!isNaN(index) && index >= 0 && index < updatedChains.length) {
          updatedChains[index] = newChain;
        } else {
          return false;
        }
      } else {
        return false;
      }

      const userPrefs = await GetUserPreferences();
      userPrefs.chains = updatedChains;
      await SetUserPreferences(userPrefs);

      setChains(updatedChains);

      emitStatus(
        `Chain ${activeTab === 'new' ? 'added' : 'updated'} successfully`,
      );
      return true;
    } catch (error) {
      LogError(`Error saving chain: ${error}`);
      emitStatus(`Error saving chain: ${error}`);
      return false;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await saveChain();
    if (saved && validateRpc && validateRpc()) {
      onSubmit(e);
    }
  };

  const formFields: FormField<WizardStateData>[] = useMemo(
    () => [
      {
        name: 'rpcUrl',
        value: rpcUrl || '',
        label: 'RPC URL',
        placeholder: 'Enter your RPC endpoint',
        required: true,
        error: rpcError || '',
        onChange: (e) => updateData?.({ rpcUrl: e.target.value }),
        onBlur: validateRpc,
      },
      {
        name: 'chainName',
        value: chainName || '',
        label: 'Chain Name',
        placeholder: 'e.g. mainnet, gnosis',
        required: true,
        error: chainError || '',
        onChange: (e) => updateData?.({ chainName: e.target.value }),
      },
      {
        name: 'chainId',
        value: chainId || '',
        label: 'Chain ID',
        placeholder: 'e.g. 1, 100',
        required: true,
        onChange: (e) => updateData?.({ chainId: e.target.value }),
      },
      {
        name: 'symbol',
        value: symbol || '',
        label: 'Token Symbol',
        placeholder: 'e.g. ETH, GNO',
        required: true,
        onChange: (e) => updateData?.({ symbol: e.target.value }),
      },
      {
        name: 'remoteExplorer',
        value: remoteExplorer || '',
        label: 'Block Explorer URL',
        placeholder: 'e.g. https://etherscan.io',
        required: true,
        onChange: (e) => updateData?.({ remoteExplorer: e.target.value }),
      },
    ],
    [
      rpcUrl,
      chainName,
      chainId,
      symbol,
      remoteExplorer,
      rpcError,
      chainError,
      updateData,
      validateRpc,
    ],
  );

  return (
    <WizardForm<WizardStateData>
      title="Chain Configuration"
      description="Configure the blockchain network details."
      fields={formFields}
      onSubmit={onSubmit}
      onBack={onBack}
      onCancel={onCancel}
    >
      <Group justify="space-between">
        <Text variant="primary" size="md" fw={600}>
          Chain Configuration
        </Text>
      </Group>

      <Card p="md" withBorder>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List>
            {chains.map((chain, index) => (
              <Tabs.Tab
                key={index}
                value={index.toString()}
                rightSection={
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={(e) => handleRemoveChain(index, e)}
                    tabIndex={0}
                    c="error"
                  >
                    <Delete size={12} />
                  </ActionIcon>
                }
              >
                {chain.chain}
              </Tabs.Tab>
            ))}
            <Tabs.Tab value="new" rightSection={<Create size={12} />}>
              Add Chain
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={activeTab || 'new'} pt="xs">
            <WizardForm<WizardStateData>
              fields={formFields}
              onBack={onBack}
              onSubmit={handleFormSubmit}
              onCancel={onCancel}
              submitText="Next"
            />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </WizardForm>
  );
};
