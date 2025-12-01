// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ExecuteRowAction, GetContracts } from '@app';
import {
  GenerationProgressModal,
  RendererParams,
  StyledButton,
  StyledSelect,
} from '@components';
import { useIconSets, usePayload, usePreferences } from '@hooks';
import {
  Center,
  Grid,
  Image,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { dresses, model, project, types } from '@models';
import { Log, LogError, addressToHex } from '@utils';
import {
  PreparedTransaction,
  TransactionData,
  TxReviewModal,
  buildTransaction,
  useWallet,
  useWalletConnection,
  useWalletGatedAction,
} from '@wallet';

import { Thumbnail } from '../../components/Thumbnail';
import { useScrollSelectedIntoView } from '../../hooks/useScrollSelectedIntoView';
import { useSpeakPrompt } from '../../hooks/useSpeakPrompt';
import { getItemKey, useGalleryStore } from '../../store';

// EXISTING_CODE

export const GeneratorFacet = ({ params }: { params: RendererParams }) => {
  // EXISTING_CODE
  const { data } = params;
  const pageData = useMemo(
    () =>
      ({
        dalledress: data || [],
      }) as unknown as dresses.DressesPage,
    [data],
  );

  const [progressModalOpened, setProgressModalOpened] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [mintModal, setMintModal] = useState<{
    opened: boolean;
    transactionData: TransactionData | null;
  }>({ opened: false, transactionData: null });
  const [successModal, setSuccessModal] = useState<{
    opened: boolean;
    txHash: string | null;
  }>({ opened: false, txHash: null });

  const viewStateKey: project.ViewStateKey = useMemo(
    () => ({
      viewName: 'dresses',
      facetName: types.DataFacet.GENERATOR,
    }),
    [],
  );

  const createPayload = usePayload('dresses');
  const payload = useMemo(
    () => createPayload(types.DataFacet.GENERATOR),
    [createPayload],
  );

  const thumbRowRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledOnMount = useRef(false);
  const icons = useIconSets();
  const SpeakIcon = icons.Speak;
  const { chromeCollapsed } = usePreferences();

  const { createWalletGatedAction, isWalletConnected, isConnecting } =
    useWalletGatedAction();
  useWallet();
  const { sendTransaction } = useWalletConnection({
    onTransactionSigned: (txHash: string) => {
      setMintModal({ opened: false, transactionData: null });
      setSuccessModal({ opened: true, txHash });
      Log('mint:transaction:signed', txHash);
    },
    onError: (error: string) => {
      LogError('Mint transaction error:', error);
    },
  });

  // Get DalleDress contract ABI
  const [dalleDressContract, setDalleDressContract] =
    useState<types.Contract | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      const contracts = await GetContracts();
      const contract = contracts.find(
        (c: types.Contract) => c.name === 'DalleDress',
      );
      setDalleDressContract(contract || null);
    };
    fetchContract();
  }, []);

  const safeMintFunction = useMemo(() => {
    if (!dalleDressContract?.abi?.functions) return null;
    return dalleDressContract.abi.functions.find(
      (f: types.Function) => f.name === 'safeMint',
    );
  }, [dalleDressContract]);

  const {
    orig,
    series,
    sortMode,
    getSelectionKey,
    getSelectedItem,
    setSelection,
    clearSelection,
    ingestItems,
    galleryItems,
    ensureHydrated,
    hydrated,
    handleKey: sharedHandleKey,
  } = useGalleryStore();

  // Ingest all dresses data - backend now filters out deleted series
  useEffect(() => {
    const allDresseses = pageData?.dalledress || [];
    ingestItems(allDresseses);
  }, [pageData?.dalledress, ingestItems]);

  useEffect(() => {
    ensureHydrated(viewStateKey);
  }, [viewStateKey, ensureHydrated]);

  const seriesOptions = useMemo(() => {
    const set = new Set<string>();
    galleryItems.forEach((g) => {
      if (g.series) set.add(g.series);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [galleryItems]);

  const addressOptions = useMemo(() => {
    const set = new Set<string>();
    galleryItems.forEach((g) => set.add(g.original));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [galleryItems]);

  useEffect(() => {
    if (hydrated && !getSelectionKey() && galleryItems.length) {
      const first = galleryItems[0];
      if (first) setSelection(getItemKey(first), viewStateKey);
    }
  }, [getSelectionKey, galleryItems, setSelection, viewStateKey, hydrated]);

  const handleAddressChange = useCallback(
    (value: string | null) => {
      if (!value) return;
      const match = galleryItems.find((g) => g.original === value);
      if (match) setSelection(getItemKey(match), viewStateKey);
    },
    [galleryItems, setSelection, viewStateKey],
  );

  const handleSeriesChange = useCallback(
    (value: string | null) => {
      if (!value) return;
      const match =
        galleryItems.find(
          (g) => g.series === value && (!orig || g.original === orig),
        ) || galleryItems.find((g) => g.series === value);
      if (match) setSelection(getItemKey(match), viewStateKey);
    },
    [galleryItems, orig, setSelection, viewStateKey],
  );

  const selectedItem = getSelectedItem();

  // Reset generated image when selection changes
  useEffect(() => {
    setGeneratedImageUrl(null);
  }, [selectedItem?.original, selectedItem?.series]);

  const { speaking, audioUrl, audioRef, speak } = useSpeakPrompt({
    activeAddress: selectedItem?.original || null,
    selectedSeries: selectedItem?.series || null,
    hasEnhancedPrompt: !!selectedItem?.enhancedPrompt,
  });

  const handleConfirmTransaction = useCallback(
    async (preparedTx: PreparedTransaction) => {
      try {
        await sendTransaction(preparedTx);
      } catch (error) {
        LogError('Failed to send mint transaction:', String(error));
        throw error;
      }
    },
    [sendTransaction],
  );

  const createMintTransaction = useCallback(() => {
    if (!safeMintFunction || !dalleDressContract || !selectedItem) {
      LogError('Missing required data for mint transaction');
      return;
    }

    try {
      const contractAddress = addressToHex(dalleDressContract.address);
      const walletAddress = payload.connectedAddress || '';
      const tokenUri = selectedItem.imageUrl || '';

      Log(
        'mint:creating:transaction',
        contractAddress,
        walletAddress,
        tokenUri,
      );

      const transactionData: TransactionData = buildTransaction(
        contractAddress,
        safeMintFunction,
        [
          { name: 'to', type: 'address', value: walletAddress },
          { name: 'uri', type: 'string', value: tokenUri },
        ],
        '0.005', // mintCost in ETH
      );

      setMintModal({
        opened: true,
        transactionData,
      });
    } catch (error) {
      LogError('Creating mint transaction:', String(error));
    }
  }, [safeMintFunction, dalleDressContract, selectedItem, payload]);

  const handleMint = createWalletGatedAction(() => {
    createMintTransaction();
  }, 'Mint');

  const handleSuccessModalClose = useCallback(() => {
    setSuccessModal({ opened: false, txHash: null });
  }, []);

  const handleButtonClick = useCallback(
    (label: string) => {
      if (!selectedItem?.original || !selectedItem.series) return;
      Log('generator:button:' + label.toLowerCase());

      if (label === 'generate') {
        Log('generator:opening:modal');
        setProgressModalOpened(true);
        Log('generator:modal:state:' + progressModalOpened);
      }
    },
    [selectedItem?.original, selectedItem?.series, progressModalOpened],
  );

  const handleGenerationComplete = useCallback(() => {
    Log('generator:generation:complete');

    // Mock: Change last character of address from 3 to 2 to simulate new generation
    if (selectedItem?.imageUrl) {
      // Replace the last '3' with '2' in the URL (0x...533 -> 0x...532)
      const newUrl = selectedItem.imageUrl.replace(/533\.png$/, '532.png');
      setGeneratedImageUrl(newUrl);
      Log('generator:image:updated', newUrl);
    }
  }, [selectedItem?.imageUrl]);

  const handleThumbSelect = useCallback(
    (item: model.DalleDress) => {
      const key = getItemKey(item);
      setSelection(key, viewStateKey);
      if (item.original !== orig) {
        setSelection(key, viewStateKey);
      }
      if (item.series !== series) {
        setSelection(key, viewStateKey);
      }
    },
    [setSelection, orig, series, viewStateKey],
  );

  const handleThumbDouble = useCallback(async (item: model.DalleDress) => {
    const rowActionPayload = types.RowActionPayload.createFrom({
      collection: 'dresses',
      dataFacet: types.DataFacet.GENERATOR,
      rowData: {
        original: item.original,
        fileName: item.fileName,
        series: item.series,
      },
      rowAction: {
        type: 'navigate',
        target: {
          view: 'dresses',
          facet: 'gallery',
          rowIndex: 0,
          identifiers: [
            {
              type: 'address',
              fieldName: 'original',
              contextKey: 'address',
            },
          ],
        },
      },
    });

    try {
      await ExecuteRowAction(rowActionPayload);
    } catch (error) {
      console.error('Failed to execute row action:', error);
    }
  }, []);

  useEffect(() => {
    if (!orig && !series) return;
    let changed = false;
    if (series) {
      if (!selectedItem || selectedItem.series !== series) {
        const match =
          galleryItems.find(
            (g) => g.series === series && (!orig || g.original === orig),
          ) || galleryItems.find((g) => g.series === series);
        if (match) {
          setSelection(getItemKey(match), viewStateKey);
          changed = true;
        }
      }
    }
    if (changed) clearSelection(viewStateKey);
  }, [
    orig,
    series,
    selectedItem,
    galleryItems,
    setSelection,
    clearSelection,
    viewStateKey,
  ]);

  const selectedKey = getSelectionKey();
  useScrollSelectedIntoView(thumbRowRef, selectedKey, {
    block: 'nearest',
    inline: 'nearest',
  });

  // Force scroll on mount if we have a selected item in thumbnails
  useEffect(() => {
    if (hasScrolledOnMount.current || !thumbRowRef.current || !selectedKey)
      return;

    const attemptScroll = () => {
      if (!hasScrolledOnMount.current && thumbRowRef.current && selectedKey) {
        const el = thumbRowRef.current.querySelector(
          `[data-key="${selectedKey}"]`,
        );
        if (el && 'scrollIntoView' in el) {
          // Check if the container is visible and has dimensions
          const containerRect = thumbRowRef.current.getBoundingClientRect();
          if (containerRect.width > 0 && containerRect.height > 0) {
            (el as HTMLElement).scrollIntoView({
              block: 'nearest',
              inline: 'nearest',
              behavior: 'auto',
            });
            hasScrolledOnMount.current = true;
            return true;
          }
        }
      }
      return false;
    };

    // Try immediate scroll first
    if (attemptScroll()) return;

    // Use ResizeObserver to detect when container becomes visible
    if (!thumbRowRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      attemptScroll();
    });

    resizeObserver.observe(thumbRowRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedKey]); // This will only scroll once due to the ref guard

  const thumbItems = useMemo(() => {
    if (sortMode === 'series') {
      if (!series) return galleryItems;
      return galleryItems.filter((g) => g.series === series);
    } else {
      if (!orig) return galleryItems;
      return galleryItems.filter((g) => g.original === orig);
    }
  }, [galleryItems, orig, series, sortMode]);

  useEffect(() => {
    if (thumbRowRef.current) {
      thumbRowRef.current.focus({ preventScroll: true });
    }
  }, [selectedKey, thumbItems]);

  useEffect(() => {
    const selectedKey = getSelectionKey();
    if (hydrated && !selectedKey) return;
    if (!thumbItems.find((g) => getItemKey(g) === selectedKey)) {
      const first = thumbItems[0];
      if (first) setSelection(getItemKey(first), viewStateKey);
    }
  }, [thumbItems, getSelectionKey, setSelection, viewStateKey, hydrated]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      sharedHandleKey(
        e,
        thumbItems,
        viewStateKey,
        undefined,
        handleThumbDouble,
        undefined,
        undefined,
      );
    },
    [sharedHandleKey, thumbItems, viewStateKey, handleThumbDouble],
  );

  // selectedItem already defined above; maintain comment for context (Task 2).
  const attributes = selectedItem?.attributes || [];
  const displayImageUrl = useMemo(() => {
    // If we have a newly generated image, show that instead
    if (generatedImageUrl) return generatedImageUrl;

    if (selectedItem?.imageUrl) return selectedItem.imageUrl;
    const first = galleryItems.find((g) => g.original === orig);
    if (first?.imageUrl) return first.imageUrl;
    if (galleryItems.length && galleryItems[0])
      return galleryItems[0].imageUrl || '';
    return '';
  }, [generatedImageUrl, selectedItem, galleryItems, orig]);

  return (
    <div
      style={{
        padding: '16px',
      }}
    >
      <Grid gutter="md">
        {!chromeCollapsed && <Grid.Col span={1}></Grid.Col>}
        <Grid.Col span={chromeCollapsed ? 7 : 6}>
          <Stack gap="md">
            <div>
              <Title order={6}>Image</Title>
              <div
                style={{
                  border: '1px solid var(--mantine-color-gray-4)',
                  background: 'var(--mantine-color-gray-2)',
                  marginTop: 4,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {displayImageUrl ? (
                  <Image
                    alt="Generated"
                    fit="contain"
                    radius="sm"
                    src={displayImageUrl}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                    onError={() => Log('generator:image:error')}
                  />
                ) : (
                  <Center h={160}>
                    <Text variant="dimmed" size="sm">
                      No image
                    </Text>
                  </Center>
                )}
              </div>

              {/* Debug Info */}
              {displayImageUrl && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 8,
                    backgroundColor: 'var(--mantine-color-yellow-1)',
                    border: '1px solid var(--mantine-color-yellow-4)',
                    borderRadius: 4,
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                >
                  <Text
                    size="xs"
                    style={{ fontWeight: 'bold', marginBottom: 4 }}
                  >
                    Image Debug:
                  </Text>
                  <div>URL: {displayImageUrl}</div>
                  <div>Generated: {generatedImageUrl ? 'Yes' : 'No'}</div>
                  <div>Series: {selectedItem?.series || 'none'}</div>
                  <div>Address: {selectedItem?.original || 'none'}</div>
                </div>
              )}
            </div>
          </Stack>
        </Grid.Col>
        <Grid.Col span={chromeCollapsed ? 5 : 4}>
          <Grid gutter="sm">
            <Grid.Col span={8}>
              <Stack gap="sm">
                <StyledSelect
                  label="Address"
                  placeholder="Select address"
                  searchable
                  value={orig || ''}
                  data={addressOptions.map((a) => ({ value: a, label: a }))}
                  onChange={handleAddressChange}
                  style={{ flex: 1 }}
                  size="sm"
                />
                <StyledSelect
                  label="Series"
                  placeholder="Series"
                  value={series || ''}
                  data={seriesOptions.map((s) => ({
                    value: s,
                    label: s,
                  }))}
                  onChange={handleSeriesChange}
                  style={{ flex: 1 }}
                  size="sm"
                  disabled={!seriesOptions.length}
                />
                <div>
                  <Title order={6}>Attributes</Title>
                  <ScrollArea
                    h={80}
                    scrollbarSize={4}
                    type="auto"
                    offsetScrollbars
                    style={{
                      marginTop: 4,
                      border: '1px solid var(--mantine-color-gray-4)',
                      background: 'var(--mantine-color-gray-1)',
                      padding: 6,
                    }}
                  >
                    <Stack gap={2}>
                      {attributes.length === 0 && (
                        <Text variant="dimmed" size="sm">
                          No attributes
                        </Text>
                      )}
                      {attributes.map((a, i) => (
                        <div key={i}>
                          <Text variant="secondary" size="sm">
                            {a.name}:{' '}
                            {a.value || a.selector || a.number || a.count || ''}
                          </Text>
                        </div>
                      ))}
                    </Stack>
                  </ScrollArea>
                </div>

                <div>
                  <Title order={6}>Prompt</Title>
                  <ScrollArea
                    h={90}
                    scrollbarSize={4}
                    type="auto"
                    offsetScrollbars
                    style={{
                      marginTop: 4,
                      border: '1px solid var(--mantine-color-gray-4)',
                      background: 'var(--mantine-color-gray-1)',
                      padding: 6,
                    }}
                  >
                    <Text variant="secondary" size="sm">
                      {selectedItem?.prompt || ''}
                    </Text>
                  </ScrollArea>
                </div>

                {!!selectedItem?.enhancedPrompt && (
                  <div>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Title order={6} style={{ flexGrow: 1 }}>
                        Enhanced Prompt
                      </Title>
                      <StyledButton
                        variant="primary"
                        size="sm"
                        loading={speaking}
                        onClick={() => {
                          Log('generator:button:speak');
                          speak();
                        }}
                        leftSection={<SpeakIcon size={12} />}
                      />
                    </div>
                    {audioUrl && (
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        controls
                        style={{ width: '100%', marginTop: 6 }}
                        onPlay={() => Log('readtome:play:start')}
                        onEnded={() => Log('readtome:play:end')}
                        onError={() => Log('readtome:play:error')}
                        autoPlay
                      />
                    )}
                    <ScrollArea
                      h={90}
                      scrollbarSize={4}
                      type="auto"
                      offsetScrollbars
                      style={{
                        marginTop: 4,
                        border: '1px solid var(--mantine-color-gray-4)',
                        background: 'var(--mantine-color-gray-1)',
                        padding: 6,
                      }}
                    >
                      <Text variant="secondary" size="sm">
                        {selectedItem?.enhancedPrompt || ''}
                      </Text>
                    </ScrollArea>
                  </div>
                )}

                <div>
                  <Title order={6}>Thumbnails</Title>
                  <Thumbnail
                    items={thumbItems}
                    selectedKey={getSelectionKey()}
                    onItemClick={handleThumbSelect}
                    onItemDoubleClick={handleThumbDouble}
                    containerRef={thumbRowRef}
                    onKeyDown={handleKey}
                  />
                </div>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack gap="xs">
                <Title order={6}>Actions</Title>
                <div style={{ minWidth: '120px' }}>
                  <StyledButton
                    size="sm"
                    variant="primary"
                    style={{ width: '100%' }}
                    onClick={() => handleButtonClick('generate')}
                    disabled={!selectedItem?.original || !selectedItem.series}
                  >
                    Generate
                  </StyledButton>
                  <StyledButton
                    size="sm"
                    variant="primary"
                    style={{ width: '100%', marginTop: '8px' }}
                    onClick={handleMint}
                    disabled={
                      !selectedItem?.original ||
                      !selectedItem.series ||
                      !safeMintFunction ||
                      isConnecting
                    }
                    title={
                      isConnecting
                        ? 'Connecting wallet... Please check your wallet app'
                        : !isWalletConnected
                          ? 'Connect wallet to mint NFT'
                          : !safeMintFunction
                            ? 'Contract ABI not available'
                            : !selectedItem?.imageUrl
                              ? 'No image to mint'
                              : 'Mint this image as an NFT (0.005 ETH)'
                    }
                  >
                    {isConnecting ? 'Connecting...' : 'Mint'}
                  </StyledButton>
                  {['Burn', 'Merch'].map((label) => (
                    <StyledButton
                      key={label}
                      size="sm"
                      variant="primary"
                      style={{ width: '100%', marginTop: '8px' }}
                      onClick={() => handleButtonClick(label)}
                    >
                      {label}
                    </StyledButton>
                  ))}
                </div>
              </Stack>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        {!chromeCollapsed && <Grid.Col span={1}></Grid.Col>}
      </Grid>

      <GenerationProgressModal
        opened={progressModalOpened}
        onClose={() => {
          Log('generator:modal:closing');
          setProgressModalOpened(false);
        }}
        onComplete={handleGenerationComplete}
      />

      <TxReviewModal
        opened={mintModal.opened}
        onClose={() => setMintModal({ opened: false, transactionData: null })}
        transactionData={mintModal.transactionData}
        onConfirm={handleConfirmTransaction}
        editable={true}
        rowData={{
          tokenAddress: dalleDressContract?.address
            ? addressToHex(dalleDressContract.address)
            : undefined,
        }}
      />

      {successModal.opened && successModal.txHash && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
            }}
            onClick={handleSuccessModalClose}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '24px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '400px',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>✅</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#28a745' }}>
                NFT Minted!
              </h3>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                Your mint transaction has been submitted to the network.
              </p>
            </div>
            <div
              style={{
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              <p
                style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}
              >
                Transaction Hash:
              </p>
              <code
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  display: 'block',
                  padding: '4px',
                }}
              >
                {successModal.txHash}
              </code>
            </div>
            <div
              style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
            >
              <button
                onClick={handleSuccessModalClose}
                style={{
                  padding: '10px 16px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Debug info */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'yellow',
          padding: '5px',
          fontSize: '12px',
          zIndex: 9999,
        }}
      >
        Modal State: {progressModalOpened ? 'OPEN' : 'CLOSED'}
      </div>
    </div>
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
