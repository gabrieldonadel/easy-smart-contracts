import { useContext } from "react";

import BlocklyWorkspace from "../../components/BlocklyWorkspace";
import AuthContext from "../../context/AuthContext";
import "../../customBlocks";

const Editor = () => {
  const { user } = useContext(AuthContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <div>
          <h1>Easy Smart Contracts</h1>
          <p>Gabriel Donadel Dall'Agnol</p>
        </div>
        <div>
          <p>User: {user.displayName}</p>
          <a href="" onClick={() => {}}>
            Logout
          </a>
        </div>
      </div>
      <BlocklyWorkspace />
    </div>
  );
};

export default Editor;
