import {
  Button,
  Container,
  Grid,
  Input,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import React from "react";
import { uploadFile } from "../AppContext";

export const useStyles = makeStyles((theme) => ({
  headerAndFooter: {
    textAlign: "center",
  },
  panels: {
    textAlign: "center",
    height: 400,
    width: "90%",
    margin: theme.spacing(2),
  },
}));

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export const ConfirmData = ({ data, fileName, setPopper, upload }) => {
  const classes = useStyles();
  return (
    <Paper style={{ height: "90vh", width: "90vw" }}>
      <Grid
        style={{ height: "100%", width: "100%" }}
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} className={classes.headerAndFooter}>
          <Typography>{fileName}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.panels}>
          <Container style={{ height: "100%", width: "100%" }}>
            {Array.isArray(data) && data.length > 0 && (
              <DataGrid
                pageSize={4}
                checkboxSelection
                rows={data}
                components={{
                  Toolbar: CustomToolbar,
                }}
                columns={Object.keys(data[0]).map((key) => {
                  console.log(key);
                  return {
                    field: key,
                    headerName: key.toUpperCase(),
                    width: 260,
                  };
                })}
              />
            )}
          </Container>
        </Grid>
        <Grid item xs={12} className={classes.headerAndFooter}>
          <Button
            onClick={() => {
              setPopper({ events: false, atttendees: false });
            }}
          >
            CLOSE
          </Button>

          {upload && (
            <Button onClick={() => uploadFile(fileName)}>Upload</Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};
