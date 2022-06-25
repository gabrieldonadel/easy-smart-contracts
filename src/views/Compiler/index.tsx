import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Collapse, Divider, Typography } from "@mui/material";
import {
  PrecisionManufacturing as PrecisionManufacturingIcon,
  RocketLaunch as RocketLaunchIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

import StorageContract from "../../contracts/Storage.sol";
import { useDeployContract } from "../../hooks/useDeployContract";
import { compileWithWorker } from "../../workers/utils";

const Compiler = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [code, setCode] = useState(StorageContract);
  const [compiledContract, setCompiledContract] = useState<string>();
  const [isAlertVisible, setAlertVisibility] = useState(true);

  const [compilingContract, setCompilingContract] = useState(false);
  const [deployingContract, setDeployingContract] = useState(false);

  const { deploy } = useDeployContract();

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

  return (
    <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex" }}>
        <Typography variant="h5" sx={{ fontWeight: "500", flex: 1 }}>
          Compilador Solidity
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
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
      <Collapse in={isAlertVisible}>
        <Alert
          severity="warning"
          onClose={() => setAlertVisibility(false)}
          sx={{ marginBlock: 1 }}
        >
          Esta é uma ferramenta avançada que permitir ao usuário escrever código
          Solidity diretamente, recomendamos o uso do editor Blocky acessível
          através da aba "Projetos"!
        </Alert>
      </Collapse>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h3>Código</h3>
          <textarea
            value={code}
            onChange={({ target }) => setCode(target.value)}
            style={{ flex: 1, padding: 10 }}
          ></textarea>
        </Box>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ marginInline: 2 }}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3>Resultado</h3>
          <textarea
            placeholder="Compile o código para ver o resultado"
            value={compiledContract}
            style={{ flex: 1, padding: 10 }}
          ></textarea>
        </Box>
      </Box>
    </Box>
  );
};

export default Compiler;
