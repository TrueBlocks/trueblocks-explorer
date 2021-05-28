import React from "react";

import { useCommand } from "@hooks/useCommand";
import { Loading } from "@components/Loading";
import { createUseStyles } from "react-jss";
import { WarningTwoTone } from "@ant-design/icons";

const useStyles = createUseStyles({});

export const HelpPanel = () => {
  const [help, loading] = useCommand("help");
  const styles = useStyles();
  return (
    <Loading loading={loading}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "16px",
          alignItems: "center",
          letterSpacing: "0.1em",
        }}
      >
        <WarningTwoTone style={{ marginRight: "8px" }} /> TODO
      </div>
      {/*<span>{JSON.stringify(help, null, 2)}</span>*/}
    </Loading>
  );
};
