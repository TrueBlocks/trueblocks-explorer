import React, { useMemo, useState } from 'react';

import { useGlobalState } from '@state';
import {
  Button,
  Form, Input, Modal, Spin,
} from 'antd';

type NamesEditModalProps = {
  loading: boolean,
  onEdit: () => void, // TODO: should this be named onFinish?
}

export function NamesEditModal({
  loading,
  onEdit,
}: NamesEditModalProps) {
  const {
    namesEditModal,
    namesEditModalVisible,
    setNamesEditModalVisible,
  } = useGlobalState();

  const [selectedNameName, setSelectedNameName] = useState(namesEditModal.name);
  const [selectedNameAddress, setSelectedNameAddress] = useState(namesEditModal.address);
  const [selectedNameDescription, setSelectedNameDescription] = useState(namesEditModal.description);
  const [selectedNameSource, setSelectedNameSource] = useState(namesEditModal.source);
  const [selectedNameTags, setSelectedNameTags] = useState(namesEditModal.tags);

  // TODO: use proper validation
  const addressInvalid = useMemo(
    () => selectedNameAddress.length && (selectedNameAddress.slice(0, 2) !== '0x' || selectedNameAddress.length !== 42),
    [selectedNameAddress],
  );
  const formHelp = useMemo(() => (
    addressInvalid
      ? 'Address must begin with 0x and be 42 characters'
      : ''
  ), [addressInvalid]);
  const formValidateStatus = useMemo(() => (
    addressInvalid
      ? 'error'
      : ''
  ), [addressInvalid]);

  return (
    <Modal
      visible={namesEditModalVisible}
      footer={null}
      onCancel={() => setNamesEditModalVisible(false)}
    >
      <Spin spinning={loading}>
        <Form onFinish={() => onEdit()}>
          <div style={{ marginTop: '24px' }}>
            <div style={{ marginTop: '16px' }}>
              <Form.Item
                label={<div style={{ minWidth: '64px' }}>Address</div>}
                name='address'
                rules={[{ required: true, message: 'Address required' }]}
                help={formHelp}
                validateStatus={formValidateStatus}
              >
                <Input
                  placeholder='Address'
                  value={selectedNameAddress}
                  onChange={(e) => setSelectedNameAddress(e.target.value)}
                />
              </Form.Item>
            </div>
            <div style={{ marginTop: '16px' }}>
              <Form.Item
                label={<div style={{ minWidth: '64px' }}>Name</div>}
                name='name'
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input
                  placeholder='Name'
                  value={selectedNameName}
                  onChange={(e) => setSelectedNameName(e.target.value)}
                />
              </Form.Item>
            </div>
            <div style={{ marginTop: '16px' }}>
              <Form.Item label={<div style={{ minWidth: '74px' }}>Description</div>} name='description'>
                <Input
                  placeholder='Description'
                  value={selectedNameDescription}
                  onChange={(e) => setSelectedNameDescription(e.target.value)}
                />
              </Form.Item>
            </div>
            <div style={{ marginTop: '16px' }}>
              <Form.Item label={<div style={{ minWidth: '74px' }}>Source</div>} name='source'>
                <Input
                  placeholder='Source'
                  value={selectedNameSource}
                  onChange={(e) => setSelectedNameSource(e.target.value)}
                />
              </Form.Item>
            </div>
            <div style={{ marginTop: '16px' }}>
              <Form.Item label={<div style={{ minWidth: '74px' }}>Tags</div>} name='tags'>
                <Input
                  placeholder='Tags'
                  value={selectedNameTags}
                  onChange={(e) => setSelectedNameTags(e.target.value)}
                />
              </Form.Item>
            </div>
            <Form.Item>
              <div style={{ marginTop: '16px' }}>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
}
