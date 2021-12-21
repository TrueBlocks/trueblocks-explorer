import { ReactNode } from 'react-markdown';

import { ColumnType } from 'antd/lib/table';

import {
  renderActionsAsColumn, renderFlag, renderTagsWithClickHandler, TagClickHandler,
} from './mappers';

export type ColumnConfiguration<RecordType> = {
  title: string | ReactNode;
  dataIndex: string;
  key?: string;
  configuration?: ColumnType<RecordType>;
};

export function addColumn<RecordType>({
  title,
  dataIndex,
  key,
  configuration,
}: ColumnConfiguration<RecordType>): ColumnType<RecordType> {
  return {
    title,
    dataIndex,
    key,
    ellipsis: true,
    ...configuration,
  };
}

export function addNumColumn<RecordType>({
  title,
  dataIndex,
  key,
  configuration,
}: ColumnConfiguration<RecordType>): ColumnType<RecordType> {
  if (!configuration) configuration = {};
  if (!configuration.render) configuration.render = (num: number) => Intl.NumberFormat().format(num);
  configuration.align = 'right';
  return {
    title,
    dataIndex,
    key,
    ellipsis: true,
    ...configuration,
  };
}

export function addFlagColumn<RecordType>(configuration: ColumnConfiguration<RecordType>) {
  return {
    ...addColumn(configuration),
    ...{
      render: renderFlag,
    },
  };
}

export function addTagsColumn<RecordType>(
  configuration: ColumnConfiguration<RecordType>,
  onActionClick: TagClickHandler,
) {
  return {
    ...addColumn(configuration),
    ...{
      className: 'tags',
      render: renderTagsWithClickHandler(onActionClick),
    },
  };
}

export function addActionsColumn<RecordType>(
  configuration: ColumnConfiguration<RecordType>,
  {
    width,
    getComponent,
  }: {
    width: number;
    getComponent: (item: RecordType) => JSX.Element;
  },
) {
  return {
    ...addColumn(configuration),
    ...renderActionsAsColumn<RecordType>(width)(getComponent),
  };
}
