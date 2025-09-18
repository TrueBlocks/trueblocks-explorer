import { useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { dalle } from '@models';

interface SeriesModalProps {
  opened: boolean;
  mode: 'create' | 'edit' | 'duplicate';
  existing: dalle.Series[];
  initial?: dalle.Series | null;
  onSubmit: (s: dalle.Series) => void;
  onClose: () => void;
}

const EMPTY: dalle.Series = {
  suffix: '',
  last: 0,
  adverbs: [],
  adjectives: [],
  nouns: [],
  emotions: [],
  occupations: [],
  actions: [],
  artstyles: [],
  litstyles: [],
  colors: [],
  orientations: [],
  gazes: [],
  backstyles: [],
};

export const SeriesModal = ({
  opened,
  mode,
  existing,
  initial,
  onSubmit,
  onClose,
}: SeriesModalProps) => {
  const [suffix, setSuffix] = useState('');
  const [last, setLast] = useState<number>(0);
  const [touched, setTouched] = useState(false);

  const existingSet = useMemo(
    () => new Set(existing.map((s) => s.suffix)),
    [existing],
  );

  useEffect(() => {
    if (opened) {
      const base = initial?.suffix || '';
      if (mode === 'duplicate' && base) {
        let candidate = base + '-copy';
        let idx = 2;
        while (existingSet.has(candidate)) {
          candidate = base + '-copy' + String(idx++);
        }
        setSuffix(candidate);
        setLast(0);
      } else if (mode === 'edit' && initial) {
        setSuffix(initial.suffix);
        setLast(initial.last || 0);
      } else {
        setSuffix('');
        setLast(0);
      }
      setTouched(false);
    }
  }, [opened, mode, initial, existingSet]);

  const isDup = suffix !== (initial?.suffix || '') && existingSet.has(suffix);
  const canSubmit =
    suffix.trim().length > 0 &&
    !isDup &&
    (!touched || suffix.trim() === suffix);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const base: dalle.Series = initial ? { ...initial } : { ...EMPTY };
    base.suffix = suffix.trim();
    base.last = Number(last) || 0;
    onSubmit(base);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        mode === 'create'
          ? 'Create Series'
          : mode === 'edit'
            ? 'Edit Series'
            : 'Duplicate Series'
      }
      centered
      size="lg"
    >
      <Stack gap="sm">
        <Text size="sm">
          {mode === 'edit'
            ? 'Update fields and save.'
            : 'Enter series details.'}
        </Text>
        <TextInput
          label="Suffix"
          value={suffix}
          onChange={(e) => {
            setSuffix(e.currentTarget.value);
            setTouched(true);
          }}
          error={isDup ? 'Suffix already exists' : undefined}
          placeholder="unique-suffix"
          withAsterisk
          data-autofocus
        />
        <TextInput
          label="Last Index"
          value={String(last)}
          onChange={(e) => setLast(Number(e.currentTarget.value) || 0)}
          placeholder="0"
        />
        <Group gap="xs">
          <Badge
            variant="light"
            color="blue"
          >{`Existing: ${existing.length}`}</Badge>
          {isDup && <Badge color="red">Duplicate</Badge>}
        </Group>
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            {mode === 'edit' ? 'Save' : 'Submit'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
