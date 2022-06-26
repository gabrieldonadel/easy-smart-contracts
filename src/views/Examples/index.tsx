import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import { Biotech as BiotechIcon } from "@mui/icons-material/";

import Contador from "../../assets/examples/contador.png";

const Examples = () => {
  return (
    <Box sx={{ p: 2, pb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "500" }}>
        Exemplos de Contratos
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h6" sx={{ fontWeight: "500" }}>
            Contador
          </Typography>
          <LoadingButton
            variant="outlined"
            onClick={() => {}}
            startIcon={<BiotechIcon />}
            loadingPosition="start"
            // loading={compilingContract}
            sx={{ ml: 2 }}
          >
            Criar projeto
          </LoadingButton>
        </Box>
        <img src={Contador} />
        <Typography variant="body1">
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
          vehicula metus, quis varius ipsum consequat sed.
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "500" }}>
          Contador
        </Typography>
        <img src={Contador} />
        <Typography variant="body1">
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
          vehicula metus, quis varius ipsum consequat sed.
        </Typography>
      </Box>
    </Box>
  );
};

export default Examples;
