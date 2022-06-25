import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Button,
  Box,
  CircularProgress,
  Drawer,
  Typography,
} from "@mui/material";
import { BlocklyWorkspace } from "react-blockly";
import { BlocklyOptions } from "blockly";
import { useSnackbar } from "notistack";
import {
  Save as SaveIcon,
  PrecisionManufacturing as PrecisionManufacturingIcon,
  RocketLaunch as RocketLaunchIcon,
  Code as CodeIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { BlocklySolidityGenerator } from "../../blockly/generator/solidity";
import AuthContext from "../../context/AuthContext";
import db, { UserContracts } from "../../firebase/db";
import { toolbox } from "../../blockly/toolbox";
import { useDeployContract } from "../../hooks/useDeployContract";
import { compileWithWorker } from "../../workers/utils";

const workspaceConfiguration: BlocklyOptions = {
  grid: {
    spacing: 20,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
    pinch: true,
  },
};

const Editor = () => {
  const { contractId } = useParams();
  const { user } = useContext(AuthContext);
  const { deploy } = useDeployContract();
  const { enqueueSnackbar } = useSnackbar();

  const [code, setCode] = useState("");
  const [contract, setContract] = useState<UserContracts>();
  const [compiledContract, setCompiledContract] = useState<string>();

  // Loading states
  const [savingContract, setSavingContract] = useState(false);
  const [compilingContract, setCompilingContract] = useState(false);
  const [deployingContract, setDeployingContract] = useState(false);

  const [isDrawerVisible, setDrawerVisibility] = useState(false);

  const getContract = useCallback(async () => {
    const querySnapshot = await db.userContract(user?.uid, contractId).get();
    const data = querySnapshot.data();
    setContract(data);
  }, [contractId, user?.uid]);

  const saveContract = async () => {
    setSavingContract(true);
    try {
      await db.userContract(user?.uid, contractId).update(contract);
    } catch (error) {
    } finally {
      setSavingContract(false);
    }
  };

  const compileCode = async () => {
    setCompilingContract(true);
    const result = await compileWithWorker({
      content: code,
    });

    setCompilingContract(false);
    const parsedResult = JSON.parse(result);
    if (parsedResult.errors) {
      parsedResult.errors.forEach((error) => {
        enqueueSnackbar(error.message, { variant: error.severity });
      });
      return;
    }

    setCompiledContract(result);
    enqueueSnackbar("O contrato foi compilado com sucesso", {
      variant: "success",
    });
  };

  const deployContract = async () => {
    if (!compiledContract) {
      return;
    }
    setDeployingContract(true);
    await deploy({ result: compiledContract });
    setDeployingContract(false);
  };

  const exportXML = () => {
    const element = document.createElement("a");
    const file = new Blob([contract.xml], {
      type: "text/xml",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${contract.name}.xml`;
    document.body.appendChild(element);
    element.click();
  };

  useEffect(() => {
    getContract();
  }, [getContract]);

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          marginBottom: 1,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "500" }}>
          {contract?.name}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <LoadingButton
            variant="outlined"
            onClick={() => setDrawerVisibility(true)}
            startIcon={<CodeIcon />}
            loadingPosition="start"
          >
            Código
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            onClick={saveContract}
            startIcon={<SaveIcon />}
            loadingPosition="start"
            loading={savingContract}
          >
            Salvar
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            onClick={compileCode}
            startIcon={<PrecisionManufacturingIcon />}
            loadingPosition="start"
            loading={compilingContract}
          >
            Compilar
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            onClick={deployContract}
            startIcon={<RocketLaunchIcon />}
            loadingPosition="start"
            loading={deployingContract}
          >
            Deploy
          </LoadingButton>
        </Box>
      </Box>
      {contract ? (
        <div style={{ display: "flex", flex: 1 }}>
          <BlocklyWorkspace
            toolboxConfiguration={toolbox}
            initialXml={contract.xml}
            className="fill-height"
            workspaceConfiguration={workspaceConfiguration}
            onWorkspaceChange={(workspace) => {
              setCode(BlocklySolidityGenerator.workspaceToCode(workspace));
            }}
            onXmlChange={(xml) => setContract((prev) => ({ ...prev, xml }))}
          />
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Drawer
        anchor={"right"}
        open={isDrawerVisible}
        onClose={() => setDrawerVisibility(false)}
        sx={{ zIndex: 1300 }}
        PaperProps={{
          sx: { width: "40%" },
        }}
      >
        <Box
          sx={{
            flex: 1,
            flexDirection: "column",
            display: "flex",
            paddingBlock: 3,
            paddingInline: 5,
          }}
        >
          <Box sx={{ display: "flex", marginBlock: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "500", flex: 1 }}>
              Código Solidity
            </Typography>
            <CopyToClipboard text={code}>
              <Button variant="outlined" startIcon={<ContentCopyIcon />}>
                Copiar
              </Button>
            </CopyToClipboard>
          </Box>
          <textarea
            style={{ height: "200px", width: "100%" }}
            value={code}
            readOnly
          />
          <Box sx={{ display: "flex", marginBlock: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "500", flex: 1 }}>
              Blockly XML
            </Typography>
            <Button
              variant="outlined"
              onClick={exportXML}
              startIcon={<CodeIcon />}
            >
              Exportar
            </Button>
          </Box>
          <textarea
            style={{ height: "200px", width: "100%" }}
            value={contract?.xml}
            readOnly
          />
        </Box>
      </Drawer>
    </div>
  );
};

export default Editor;
