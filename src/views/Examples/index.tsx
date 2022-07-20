import { useContext, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import { Biotech as BiotechIcon } from "@mui/icons-material/";
import { useNavigate } from "react-router-dom";

import Contador from "../../assets/examples/contador.png";
import db from "../../firebase/db";
import AuthContext from "../../context/AuthContext";
import { conterExampleContract } from "./examples";

const exampleProjects = [
  {
    id: "1",
    image: Contador,
    name: "Contador",
    description: `
    Este é exemplo de um projeto contrato que armazena em um estado interno um contador. Através dos blocos de Smart Contract (bloco em verde),
    e do bloco de instanciação podemos definir estados para um contrato arrastando blocos para a seção de states, é por meio dela que todos os estados
    da entidade Contrato são declarados. Fazendo o uso dos blocos de métodos (blocos em roxo) podemos declarar funções, que podem ou não receber
    parâmetros e executar qualquer tipo de código dentro na seção code. Desta forma basta que sejam arrastados os blocos de métodos juntamente com os
    blocos atualizadores de valores (blocos em azul claro) para que o código do contrato esteja pronto. Agora que você entendeu como este contrato funciona
    experimente cria-lo do zero criando um novo projeto pela aba projetos, em caso de dúvidas você também pode apertar no botão "Criar Projeto" para criar um
    novo projeto contendo o código completo deste exemplo.
`,
    contract: conterExampleContract,
  },
];

const Examples = () => {
  const [isCreatingContract, setIsCreatingContract] = useState<{
    [id: string]: boolean;
  }>({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const createContract = async (id: string) => {
    setIsCreatingContract((prev) => ({ ...prev, [id]: true }));

    try {
      const newContract = await db
        .userContracts(user?.uid)
        .add(exampleProjects.find((p) => p.id === id).contract);

      setIsCreatingContract((prev) => ({ ...prev, [id]: false }));
      navigate(`/editor/${newContract.id}`);
    } catch (error) {
      setIsCreatingContract((prev) => ({ ...prev, [id]: false }));
      console.log("error", error);
    }
  };

  return (
    <Box sx={{ p: 2, pb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "500" }}>
        Exemplos de Contratos
      </Typography>
      {exampleProjects?.map(({ id, name, description }) => {
        return (
          <Box sx={{ mt: 2 }} key={id}>
            <Box sx={{ display: "flex" }}>
              <Typography variant="h6" sx={{ fontWeight: "500" }}>
                {name}
              </Typography>
              <LoadingButton
                variant="outlined"
                onClick={() => createContract(id)}
                startIcon={<BiotechIcon />}
                loadingPosition="start"
                loading={isCreatingContract?.[id]}
                sx={{ ml: 2 }}
              >
                Criar projeto
              </LoadingButton>
            </Box>
            <img src={Contador} alt="Imagem do contrato" />
            <Typography variant="body1">{description}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Examples;
