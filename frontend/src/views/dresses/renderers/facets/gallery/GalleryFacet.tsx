import { useCallback, useEffect, useRef } from 'react';

import { ExecuteRowAction } from '@app';
import { Center, Container, Title } from '@mantine/core';
import { dresses, model, project, types } from '@models';

import { GalleryControls, GalleryGrouping } from '../../components';
import { useScrollSelectedIntoView } from '../../hooks/useScrollSelectedIntoView';
import { getItemKey, useGalleryStore } from '../../store';

export type GalleryFacetProps = {
  pageData: dresses.DressesPage | null;
  viewStateKey: project.ViewStateKey;
};

export const GalleryFacet = ({ pageData, viewStateKey }: GalleryFacetProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const keyScopeRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledOnMount = useRef(false);

  const {
    getSelectionKey,
    setSelection,
    ingestItems,
    galleryItems,
    sortMode,
    columns,
    ensureHydrated,
    hydrated,
    useDerived,
    handleKey: sharedHandleKey,
  } = useGalleryStore();
  const { groupNames, groupedItems } = useDerived(sortMode);

  // Ingest all dresses data - backend now filters out deleted series
  useEffect(() => {
    const allDresseses = pageData?.dalledress || [];
    ingestItems(allDresseses);
  }, [pageData?.dalledress, ingestItems]);

  useEffect(() => {
    ensureHydrated(viewStateKey);
  }, [viewStateKey, ensureHydrated]);

  useEffect(() => {
    if (hydrated && !getSelectionKey() && galleryItems.length > 0) {
      const firstItem = galleryItems[0];
      if (firstItem) {
        setSelection(getItemKey(firstItem), viewStateKey);
      }
    }
  }, [galleryItems, getSelectionKey, setSelection, viewStateKey, hydrated]);

  useEffect(() => {
    keyScopeRef.current?.focus({ preventScroll: true });
  }, []);

  // --------------------------------------
  const selectedKey = getSelectionKey();
  useScrollSelectedIntoView(scrollRef, selectedKey, { block: 'nearest' });

  // Force scroll on mount if we have a selected item
  useEffect(() => {
    if (hasScrolledOnMount.current || !scrollRef.current || !selectedKey)
      return;

    const attemptScroll = () => {
      if (!hasScrolledOnMount.current && scrollRef.current && selectedKey) {
        const el = scrollRef.current.querySelector(
          `[data-key="${selectedKey}"]`,
        );
        if (el && 'scrollIntoView' in el) {
          // Check if the container is visible and has dimensions
          const containerRect = scrollRef.current.getBoundingClientRect();
          if (containerRect.width > 0 && containerRect.height > 0) {
            (el as HTMLElement).scrollIntoView({
              block: 'nearest',
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
    if (!scrollRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      attemptScroll();
    });

    resizeObserver.observe(scrollRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedKey]); // This will only scroll once due to the ref guard

  useEffect(() => {
    keyScopeRef.current?.focus({ preventScroll: true });
  }, [selectedKey, galleryItems]);

  // --------------------------------------
  const handleItemClick = useCallback(
    (item: model.DalleDress) => {
      setSelection(getItemKey(item), viewStateKey);
    },
    [setSelection, viewStateKey],
  );

  const handleItemDoubleClick = useCallback(async (item: model.DalleDress) => {
    const rowActionPayload = types.RowActionPayload.createFrom({
      collection: 'dresses',
      dataFacet: types.DataFacet.GALLERY,
      rowData: {
        original: item.original,
        fileName: item.fileName,
        series: item.series,
      },
      rowAction: {
        type: 'navigate',
        target: {
          view: 'dresses',
          facet: 'generator',
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

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      sharedHandleKey(
        e,
        galleryItems,
        viewStateKey,
        columns,
        handleItemDoubleClick,
        groupNames,
        groupedItems,
      );
    },
    [
      sharedHandleKey,
      galleryItems,
      viewStateKey,
      columns,
      handleItemDoubleClick,
      groupNames,
      groupedItems,
    ],
  );

  // --------------------------------------
  return (
    <Container
      size="xl"
      py="md"
      ref={keyScopeRef}
      tabIndex={0}
      onKeyDown={handleKey}
      onMouseDown={() => keyScopeRef.current && keyScopeRef.current.focus()}
      style={{ outline: 'none', width: '100%' }}
    >
      <Title order={4} mb="sm">
        Preview Gallery
      </Title>
      <GalleryControls />
      {!galleryItems.length && (
        <Center
          style={{
            opacity: 0.6,
            fontSize: 12,
            fontFamily: 'monospace',
          }}
        >
          No images found
        </Center>
      )}
      <div
        ref={scrollRef}
        style={{
          maxHeight: 'calc(100vh - 260px)',
          overflowY: 'auto',
          paddingRight: 4,
        }}
      >
        {groupNames.map((series) => (
          <GalleryGrouping
            key={series || 'unknown'}
            series={series}
            items={groupedItems[series] || []}
            columns={columns}
            sortMode={sortMode}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            selected={selectedKey}
          />
        ))}
      </div>
    </Container>
  );
};
