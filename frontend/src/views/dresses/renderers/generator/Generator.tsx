import { useCallback, useEffect, useMemo, useRef } from 'react';

import { StyledButton, StyledSelect, StyledText } from '@components';
import { useIconSets } from '@hooks';
import {
  Center,
  Container,
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

export type GeneratorProps = {
  pageData: dresses.DalleDressPage | null;
  viewStateKey: project.ViewStateKey; // Make required since persistence depends on it
};

export const Generator = ({ pageData, viewStateKey }: GeneratorProps) => {
  const thumbRowRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledOnMount = useRef(false);
  const icons = useIconSets();
  const SpeakIcon = icons.Speak;

  const {
    orig,
    series,
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
    const allDresseses = pageData?.dresses || [];
    ingestItems(allDresseses);
  }, [pageData?.dresses, ingestItems]);

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

  const handleGenerate = useCallback(() => {
    if (!selectedItem?.original || !selectedItem.series) return;
  }, [selectedItem?.original, selectedItem?.series]);

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
    if (!orig) return galleryItems;
    return galleryItems.filter((g) => g.original === orig);
  }, [galleryItems, orig]);

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
    <Container size="xl" py="md">
      <Stack gap="sm">
        <Group align="flex-end" gap="sm" wrap="nowrap">
          <StyledSelect
            label="Address"
            placeholder="Select address"
            searchable
            value={orig || ''}
            data={addressOptions.map((a) => ({ value: a, label: a }))}
            onChange={handleAddressChange}
            w={380}
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
            w={220}
            size="xs"
            disabled={!seriesOptions.length}
          />
          <StyledButton
            size="xs"
            variant="filled"
            onClick={handleGenerate}
            disabled={!selectedItem?.original || !selectedItem?.series}
            style={{ alignSelf: 'flex-end' }}
          >
            Generate
          </StyledButton>
        </Group>
        <div
          style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}
        >
          <div style={{ flex: '0 0 55%', maxWidth: '55%' }}>
            <Title order={6}>Image</Title>
            <div
              style={{
                border: '1px solid var(--skin-border-default)',
                background: 'var(--skin-surface-sunken)',
                marginTop: 4,
                width: '100%',
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
          <div
            style={{
              flex: '0 0 35%',
              maxWidth: '35%',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              paddingLeft: 12,
            }}
          >
            <div>
              <Title order={6}>Attributes</Title>
              <ScrollArea
                h={140}
                scrollbarSize={4}
                type="auto"
                offsetScrollbars
                style={{
                  marginTop: 4,
                  border: '1px solid var(--skin-border-default)',
                  background: 'var(--skin-surface-sunken)',
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
                h={160}
                scrollbarSize={4}
                type="auto"
                offsetScrollbars
                style={{
                  marginTop: 4,
                  border: '1px solid var(--skin-border-default)',
                  background: 'var(--skin-surface-sunken)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Title order={6} style={{ flexGrow: 1 }}>
                    Enhanced Prompt
                  </Title>
                  <StyledButton
                    variant="subtle"
                    size="xs"
                    loading={speaking}
                    onClick={speak}
                    leftSection={<SpeakIcon size={12} />}
                  >
                    Speak
                  </StyledButton>
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
                  h={160}
                  scrollbarSize={4}
                  type="auto"
                  offsetScrollbars
                  style={{
                    marginTop: 4,
                    border: '1px solid var(--skin-border-default)',
                    background: 'var(--skin-surface-sunken)',
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
          </div>
          <div
            style={{
              flex: '0 0 10%',
              maxWidth: '10%',
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: 12,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Claim', 'Mint', 'Burn', 'Trade', 'Eject', 'Merch'].map(
                (label) => (
                  <StyledButton
                    key={label}
                    variant="light"
                    size="xs"
                    fullWidth
                    onClick={() =>
                      Log('generator:button:' + label.toLowerCase())
                    }
                  >
                    {label}
                  </StyledButton>
                ),
              )}
            </div>
          </div>
        </div>
      </Stack>
    </Container>
  );
};
