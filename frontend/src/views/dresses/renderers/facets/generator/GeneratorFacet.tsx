import { useCallback, useEffect, useMemo, useRef } from 'react';

import { StyledButton, StyledSelect, StyledText } from '@components';
import { useIconSets, usePreferences } from '@hooks';
import {
  Center,
  Grid,
  Group,
  Image,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core';
import { dresses, model, project } from '@models';
import { Log } from '@utils';

import { DalleDressCard } from '../../components';
import { useScrollSelectedIntoView } from '../../hooks/useScrollSelectedIntoView';
import { useSpeakPrompt } from '../../hooks/useSpeakPrompt';
import { getItemKey, useGalleryStore } from '../../store';

export type GeneratorFacetProps = {
  pageData: dresses.DressesPage | null;
  viewStateKey: project.ViewStateKey; // Make required since persistence depends on it
};

export const GeneratorFacet = ({
  pageData,
  viewStateKey,
}: GeneratorFacetProps) => {
  const thumbRowRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledOnMount = useRef(false);
  const icons = useIconSets();
  const SpeakIcon = icons.Speak;
  const { chromeCollapsed } = usePreferences();

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

  const { speaking, audioUrl, audioRef, speak } = useSpeakPrompt({
    activeAddress: selectedItem?.original || null,
    selectedSeries: selectedItem?.series || null,
    hasEnhancedPrompt: !!selectedItem?.enhancedPrompt,
  });

  const handleButtonClick = useCallback(
    (label: string) => {
      if (!selectedItem?.original || !selectedItem.series) return;
      Log('generator:button:' + label.toLowerCase());
      // TODO: Implement actual button click logic
    },
    [selectedItem?.original, selectedItem?.series],
  );

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

  const handleThumbDouble = useCallback(
    (item: model.DalleDress) => {
      handleThumbSelect(item);
    },
    [handleThumbSelect],
  );

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
        undefined,
        undefined,
        undefined,
      );
    },
    [sharedHandleKey, thumbItems, viewStateKey],
  );

  // selectedItem already defined above; maintain comment for context (Task 2).
  const attributes = selectedItem?.attributes || [];
  const displayImageUrl = useMemo(() => {
    if (selectedItem?.imageUrl) return selectedItem.imageUrl;
    const first = galleryItems.find((g) => g.original === orig);
    if (first?.imageUrl) return first.imageUrl;
    if (galleryItems.length && galleryItems[0])
      return galleryItems[0].imageUrl || '';
    return '';
  }, [selectedItem, galleryItems, orig]);

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
            <Group align="flex-end" gap="sm" wrap="nowrap">
              <StyledSelect
                label="Address"
                placeholder="Select address"
                searchable
                value={orig || ''}
                data={addressOptions.map((a) => ({ value: a, label: a }))}
                onChange={handleAddressChange}
                style={{ flex: 1 }}
                size="xs"
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
                size="xs"
                disabled={!seriesOptions.length}
              />
              <StyledButton
                size="xs"
                variant="primary"
                onClick={() => handleButtonClick('generate')}
                disabled={!selectedItem?.original || !selectedItem.series}
              >
                Generate
              </StyledButton>
            </Group>

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
                    <StyledText variant="dimmed" size="xs">
                      No image
                    </StyledText>
                  </Center>
                )}
              </div>
            </div>
          </Stack>
        </Grid.Col>
        <Grid.Col span={chromeCollapsed ? 5 : 4}>
          <Grid gutter="sm">
            <Grid.Col span={10}>
              <Stack gap="sm">
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
                    <Stack
                      gap={2}
                      style={{ fontFamily: 'monospace', fontSize: 11 }}
                    >
                      {attributes.length === 0 && (
                        <StyledText variant="dimmed" size="xs">
                          No attributes
                        </StyledText>
                      )}
                      {attributes.map((a, i) => (
                        <StyledText variant="secondary" size="sm" key={i}>
                          {a.name}:{' '}
                          {a.value || a.selector || a.number || a.count || ''}
                        </StyledText>
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
                    <StyledText variant="secondary" size="xs">
                      {selectedItem?.prompt || ''}
                    </StyledText>
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
                        size="xs"
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
                      <StyledText variant="secondary" size="xs">
                        {selectedItem?.enhancedPrompt || ''}
                      </StyledText>
                    </ScrollArea>
                  </div>
                )}

                <div>
                  <Title order={6}>Thumbnails</Title>
                  <div
                    style={{
                      display: 'flex',
                      gap: 4,
                      overflowX: 'auto',
                      padding: '4px 2px',
                      marginTop: 4,
                    }}
                    ref={thumbRowRef}
                    tabIndex={0}
                    onKeyDown={handleKey}
                  >
                    {thumbItems.map((g) => {
                      const itemKey = getItemKey(g);
                      return (
                        <div
                          key={itemKey}
                          data-key={itemKey}
                          style={{ width: 72, flex: '0 0 auto' }}
                        >
                          <DalleDressCard
                            item={g}
                            onClick={handleThumbSelect}
                            onDoubleClick={handleThumbDouble}
                            selected={itemKey === getSelectionKey()}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Stack>
            </Grid.Col>
            <Grid.Col span={2}>
              <Stack gap="xs">
                <Title order={6}>Actions</Title>
                {['Claim', 'Mint', 'Burn', 'Trade', 'Eject', 'Merch'].map(
                  (label) => (
                    <StyledButton
                      key={label}
                      size="xs"
                      variant="primary"
                      fullWidth
                      onClick={() => handleButtonClick(label)}
                    >
                      {label}
                    </StyledButton>
                  ),
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        {!chromeCollapsed && <Grid.Col span={1}></Grid.Col>}
      </Grid>
    </div>
  );
};
