import { Button, Container, Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AppContext, setPopper, uploadFile, popperData } from "../AppContext";

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

export const ConfirmData = () => {
  const classes = useStyles();
  const { context, dispatch } = React.useContext(AppContext);
  const [page, setPage] = useState(1);

  const { data, title, showUploadButton } = popperData(context);

  useEffect(() => {
    console.log("setting page number to 1");
    setPage(1);
  }, [data]);
  return (
    <Paper>
      <Grid
        style={{ height: "100%", width: "100%" }}
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} className={classes.headerAndFooter}>
          <Typography>{title ? title.toUpperCase() : null}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.panels}>
          <Container style={{ height: "100%", width: "100%" }}>
            {Array.isArray(data) && data.length > 0 && (
              <DataGrid
                page={page}
                pageSize={4}
                checkboxSelection
                rows={data}
                components={{
                  Toolbar: CustomToolbar,
                }}
                columns={Object.keys(data[0]).map((key) => {
                  return {
                    field: key,
                    headerName: key.toUpperCase(),
                    width: 200,
                  };
                })}
              />
            )}
          </Container>
        </Grid>
        <Grid item xs={12} className={classes.headerAndFooter}>
          <Button onClick={() => setPopper(dispatch)}>CLOSE</Button>

          {showUploadButton && (
            <Button onClick={() => uploadFile(title)}>Upload</Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};
