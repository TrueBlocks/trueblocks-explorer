import { Button } from 'antd';
import React from 'react';
import useGlobalState from '../../../state';

export const Schemas = () => {
  const { debug, setDebug } = useGlobalState();
  return (
    <>
      <h4>Schemas</h4>
      <Button onClick={() => setDebug(!debug)}>Debug {debug ? 'true' : 'false'}</Button>
    </>
  );
}
