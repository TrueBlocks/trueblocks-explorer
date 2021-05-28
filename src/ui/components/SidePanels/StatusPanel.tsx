import React from "react";

import { Result, useCommand } from "@hooks/useCommand";
import { Loading } from "@components/Loading";
import { Badge, Divider } from "antd";
import { createUseStyles } from "react-jss";
import {
  ApiFilled,
  ClockCircleFilled,
  ExperimentFilled,
  EyeFilled,
} from "@ant-design/icons";
import { JsonResponse } from "@modules/core";

const useStyles = createUseStyles({
  container: { paddingBottom: "16px" },
  header: {
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    marginBottom: "20px",
  },
  itemContainer: { marginTop: "12px" },
  itemHeader: {
    fontSize: "9px",
    letterSpacing: "0.1em",
    fontWeight: 500,
  },
  itemIcon: { fontSize: "10px", marginRight: "4px" },
  statusItem: {
    fontSize: "9px",
    letterSpacing: "0.1em",
    fontWeight: 500,
    marginLeft: "4px",
  },
});

interface StatusPanelProps {
  status: Result;
  loading: boolean;
}

export const StatusPanel = ({ status, loading }: StatusPanelProps) => {
  const styles = useStyles();

  const statusContent = status.content[0] as JsonResponse;

  return (
    <Loading loading={loading}>
      <div className={styles.container}>
        <div className={styles.header}>ETHEREUM NODE</div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>STATUS</div>
          <div>
            <Badge status={status.status === "success" ? "success" : "error"} />
            {status.status === "success" ? "Connected" : "Error"}
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>LATEST</div>
          <div>
            <ClockCircleFilled className={styles.itemIcon} />
            12,519,522
          </div>
        </div>
        <div className={styles.header} style={{ marginTop: "24px" }}>
          TRUEBLOCKS
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>API</div>
          <div>
            <Badge status={statusContent.is_api ? "success" : "error"} />
            {statusContent.is_api ? "Connected" : "Not connected"}
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>SCRAPER</div>
          <div>
            <Badge status={statusContent.is_scraping ? "success" : "error"} />
            {statusContent.is_scraping ? "Scraping" : "Not scraping"}
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>BLOCKS</div>
          <div>
            <ApiFilled
              className={styles.itemIcon}
              style={{ color: "#52c41a" }}
            />
            12,358.738 <span className={styles.statusItem}>FINAL</span>
          </div>
          <div>
            <ApiFilled
              className={styles.itemIcon}
              style={{ color: "#fadb14" }}
            />
            12,358.738 <span className={styles.statusItem}>STAGING</span>
          </div>
          <div>
            <ApiFilled
              className={styles.itemIcon}
              style={{ color: "#f5222d" }}
            />
            12,358.738 <span className={styles.statusItem}>UNRIPE</span>
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>MONITORS</div>
          <div>
            <EyeFilled className={styles.itemIcon} />
            12,358.738
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>SLURPS</div>
          <div>
            <ExperimentFilled className={styles.itemIcon} />
            12,358.738
          </div>
        </div>
        <div className={styles.header} style={{ marginTop: "24px" }}>
          OPTIONS
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>RPC</div>
          <div>{statusContent.rpc_provider}</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>BALANCE PROVIDER</div>
          <div>{statusContent.balance_provider}</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>API</div>
          <div>{process.env.CORE_URL}</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>CACHE</div>
          <div>{statusContent.cache_path}</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>INDEX</div>
          <div>{statusContent.index_path}</div>
        </div>
        <div className={styles.header} style={{ marginTop: "24px" }}>
          VERSIONS
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>CLIENT</div>
          <div>{statusContent.client_version}</div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>TRUEBLOCKS</div>
          <div>{statusContent.trueblocks_version}</div>
        </div>
      </div>
    </Loading>
  );
};
