import { Container, Divider, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { AppContext } from "../AppContext";

const useStyles = makeStyles((theme) => ({
  left: {
    textAlign: "left",
  },
  right: {
    textAlign: "right",
  },
  center: {
    textAlign: "center",
    margin: theme.spacing(1),
  },
}));

export const ShowAttendeeInfo = () => {
  const { context } = React.useContext(AppContext);

  const { attendeeInfo } = context;
  const classes = useStyles();
  return attendeeInfo ? (
    <Container style={{ width: 400, padding: 0 }}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={4} className={classes.left}>
          <Typography>Family</Typography>
        </Grid>

        <Grid item xs={8} className={classes.right}>
          <Typography align={"left"}>{attendeeInfo.family}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.center}>
          <Divider></Divider>
        </Grid>
        <Grid item xs={4} className={classes.left}>
          <Typography>Children</Typography>
        </Grid>
        <Grid item xs={8} className={classes.right}>
          <Typography align={"left"}>{attendeeInfo.children}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.center}>
          <Divider></Divider>
        </Grid>
        <Grid item xs={4} className={classes.left}>
          <Typography>Email</Typography>
        </Grid>
        <Grid item xs={8} className={classes.right}>
          <Typography align={"left"}>{attendeeInfo.emails}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.center}>
          <Divider></Divider>
        </Grid>
      </Grid>
    </Container>
  ) : null;
};
