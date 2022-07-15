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
    Exemplo de código de um contador Lorem ipsum dolor sit amet,
    consectetur adipiscing elit. Proin venenatis nisi velit, quis rhoncus
    est tempor ut. Proin in libero nec dui iaculis pellentesque id id
    turpis. Praesent iaculis nulla non massa fermentum, vitae accumsan dui
    ullamcorper. Integer consequat odio congue euismod tempor. Praesent
    vitae tellus vitae justo aliquet finibus et a elit. Aliquam non turpis
    sit amet mauris porttitor fringilla eget vitae risus. Vestibulum quis
    diam vitae erat ultrices fermentum. Etiam interdum turpis vel sem
    mollis consequat. Morbi sit amet ligula finibus, mollis justo ac,
    pretium nisi. Integer mollis rhoncus pulvinar. Vestibulum scelerisque
    mattis sem vel tristique. Duis sagittis tempus tristique. Curabitur
    facilisis libero risus, non ullamcorper odio hendrerit quis. Aliquam
    ultricies fermentum efficitur. Cras pellentesque mollis nulla in
    iaculis. Aenean nisi odio, lobortis sed mollis vel, cursus euismod
    ligula. Donec ornare erat euismod dapibus venenatis. Mauris neque
    justo, vulputate at nisl in, rhoncus finibus turpis. Mauris elit enim,
    volutpat eu sapien mollis, fermentum ultrices elit. Cras at metus
    bibendum, cursus magna eget, sollicitudin nisl. Pellentesque eros
    enim, dignissim quis dignissim ac, tristique quis arcu. Integer dictum
    vehicula metus, quis varius ipsum consequat sed.`,
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
