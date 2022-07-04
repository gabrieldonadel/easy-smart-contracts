import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

import AuthContext from "../../context/AuthContext";
import db from "../../firebase/db";
import { readFileAsText } from "../../utils";

const Contracts = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);

  const [contracts, setContracts] =
    useState<{ id: string; name: string }[]>(undefined);
  const [deleteModalContractId, setDeleteModalContractId] = useState(undefined);
  const [isDeletingContract, setIsDeletingContract] = useState(false);
  const [isCreateContractModalOpen, setIsCreateContractModalOpen] =
    useState(false);
  const [isCreatingContract, setIsCreatingContract] = useState(false);

  useEffect(() => {
    db.userContracts(user?.uid)
      .get()
      .then((querySnapshot) => {
        setContracts(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }))
        );
      });
  }, [user?.uid]);

  const createContract = async (event) => {
    event.preventDefault();
    setIsCreatingContract(true);
    let xml = "";
    const name = event.target.name.value;
    const xmlFile = event.target?.xmlFile?.files?.[0];

    try {
      if (xmlFile) {
        xml = await readFileAsText(xmlFile);
      }
      const newContract = await db.userContracts(user?.uid).add({ xml, name });

      setContracts((prev) => [{ id: newContract.id, name }, ...prev]);
    } catch (error) {
      console.log("error", error);
    }
    setIsCreatingContract(false);
    event.target.reset();
    closeCreateModal();
  };

  const closeCreateModal = () => {
    setIsCreateContractModalOpen(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalContractId(undefined);
  };

  const deleteContract = async () => {
    setIsDeletingContract(true);
    try {
      await db.userContract(user?.uid, deleteModalContractId).delete();
      setContracts((prev) =>
        prev.filter(({ id }) => id !== deleteModalContractId)
      );
      setIsDeletingContract(false);
      closeDeleteModal();
      enqueueSnackbar("Contrato deletado com sucesso", {
        variant: "success",
      });
    } catch (error) {
      console.log("error", error);
      setIsDeletingContract(false);
    }
  };

  return (
    <Box sx={{ pt: 2, flex: 1, display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" sx={{ pl: 2, fontWeight: "500" }}>
        Seus Projetos
      </Typography>
      {contracts ? (
        <List>
          {contracts.map(({ id, name }) => (
            <ListItem
              key={id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => setDeleteModalContractId(id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton component={Link} to={`/editor/${id}`}>
                <ListItemText
                  primary={name}
                  secondary={`Identificador: ${id}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setIsCreateContractModalOpen(true)}
        sx={{ position: "absolute", right: 24, bottom: 24 }}
      >
        <AddIcon />
      </Fab>
      {/* Create Contract Dialog */}
      <Dialog open={isCreateContractModalOpen} onClose={closeCreateModal}>
        <DialogTitle>Criar projeto de contrato</DialogTitle>
        <Box component="form" onSubmit={createContract}>
          <DialogContent>
            <DialogContentText>
              Insira o nome do projeto que você deseja criar e opcionalmente
              importe um contrato através de uma arquivo XML.
            </DialogContentText>
            <TextField
              autoFocus
              id="name"
              label="Nome do projeto"
              fullWidth
              variant="outlined"
              required
              margin="normal"
              name="name"
            />
            <Box>
              <input
                accept=".xml"
                id="contained-button-file"
                multiple
                type="file"
                name="xmlFile"
                hidden
              />
              <label htmlFor="contained-button-file">
                <Button component="span" sx={{ mt: 1 }} variant="outlined">
                  Importar
                </Button>
              </label>
              <input type="submit" id="submit-button" hidden />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCreateModal} disabled={isCreatingContract}>
              Cancelar
            </Button>
            <label htmlFor="submit-button">
              <LoadingButton loading={isCreatingContract} component="span">
                Criar
              </LoadingButton>
            </label>
          </DialogActions>
        </Box>
      </Dialog>
      {/* Delete Contract Dialog */}
      <Dialog
        open={Boolean(deleteModalContractId)}
        onClose={closeDeleteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Você tem certeza que deseja deletar este contrato?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta é uma ação irreversível e uma vez que o contrato for deletado
            você perderá todos os dados atrelados a este contrato.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} disabled={isDeletingContract}>
            Cancelar
          </Button>
          <LoadingButton
            onClick={deleteContract}
            color="error"
            loading={isDeletingContract}
          >
            Deletar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contracts;
