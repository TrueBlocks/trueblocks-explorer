import { createErrorNotification } from '@modules/error_notification';
import { Card, Col, notification, Row } from 'antd';
import React from 'react';
import { createUseStyles } from 'react-jss';

const showError = () => notification.error(createErrorNotification({ description: 'Just testing' }));

const useStyles = createUseStyles({
  card: {
    margin: '2px',
    border: '1px brown dashed',
    width: 300,
    height: 400
  },
});

export const Overview = () => {
  const styles = useStyles();
  return (
  <>
  <Row>
    <Col>
    <Card hoverable title="Balance Histories" extra={<a href="#">More...</a>} className={styles.card}>A chart of the history of balances in eth, tokens, dollars</Card>
    </Col>
    <Col>
    <Card hoverable title="Monitors" extra={<a href="#">More...</a>} className={styles.card}>A list of all monitored addresses</Card>
    </Col>
    <Col>
    <Card hoverable title="Alerts" extra={<a href="#">More...</a>} className={styles.card}>A list of active alerts</Card>
    </Col>
    <Col>
    <Card hoverable title="Neighbors" extra={<a href="#">More...</a>} className={styles.card}>A graph of neighboring addresses</Card>
    </Col>
    </Row>
    <br />
  </>
)};
