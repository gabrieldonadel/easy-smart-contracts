import BlocklyWorkspace from "../../components/BlocklyWorkspace";
import "../../customBlocks";

const Editor = () => {
  return (
    <div>
      <div style={{ marginLeft: 20 }}>
        <h1>Easy Smart Contracts</h1>
        <p>Gabriel Donadel Dall'Agnol</p>
      </div>
      <BlocklyWorkspace />
    </div>
  );
};

export default Editor;
