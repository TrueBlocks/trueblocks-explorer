import React, { ReactElement } from 'react';

import { Tag } from 'antd';
import { option as Option } from 'fp-ts';
import { pipe } from 'fp-ts/function';

export function renderFlag(flag?: boolean): ReactElement {
  return pipe(
    flag,
    Option.fromPredicate((flagOrUndefined) => flagOrUndefined !== undefined),
    Option.fold(
      () => <></>,
      (someFlag) => <Tag color={someFlag ? 'green' : 'volcano'}>{someFlag ? 'Yes' : 'No'}</Tag>,
    ),
  );
}

export type TagClickHandler = (rawTag: string) => void;
export function renderTagsWithClickHandler(onClick: TagClickHandler) {
  return function renderTags(tagsString?: string) {
    return pipe(
      tagsString,
      Option.fromPredicate<string | undefined>(Boolean),
      Option.fold(
        () => <></>,
        (someTagsString) => (
          <>
            {someTagsString!.split(':').map((tag) => (
              <Tag onClick={() => onClick(someTagsString!)} key={tag}>
                {tag}
              </Tag>
            ))}
          </>
        ),
      ),
    );
  };
}

export function renderActionsAsColumn<Item>(columnWidth: number) {
  return function getActionsColumn(getActions: (record: Item) => ReactElement) {
    return {
      fixed: 'right' as const,
      width: columnWidth,
      render(text: string, record: Item) {
        return getActions(record);
      },
    };
  };
}
