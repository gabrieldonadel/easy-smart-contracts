import {
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

import AuthContext from "../../context/AuthContext";
import db from "../../firebase/db";
import styles from "./styles.module.css";

const Contracts = () => {
  const { user } = useContext(AuthContext);

  const [contracts, setContracts] = useState<{ id: string; name: string }[]>(
    []
  );
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

  const createExample = async () => {
    const name = `Contract ${contracts.length + 1}`;
    try {
      const newContract = await db
        .userContracts(user?.uid)
        .add({ xml: "test", name });

      setContracts((prev) => [...prev, { id: newContract.id, name }]);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className={styles.container}>
      <Typography variant="body1">Lista de Contratos</Typography>
      <List>
        {contracts.map(({ id, name }) => (
          <ListItem
            key={id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            }
            disablePadding
            component={Link}
            to={`/editor/${id}`}
          >
            <ListItemButton role={undefined}>
              <ListItemText primary={name} secondary={id} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Fab
        color="primary"
        aria-label="add"
        onClick={createExample}
        className={styles.addButton}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default Contracts;
