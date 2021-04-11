import { Typography, Container } from "@material-ui/core";
import React from "react";

export const ShowAttendeeInfo = ({ attendeInfo }) => {
  return attendeInfo ? (
    <Container style={{ width: 400 }}>
      <Typography>Family : {attendeInfo.family} </Typography>
      <Typography>Children : {attendeInfo.children} </Typography>
      <Typography>Email : {attendeInfo.emails} </Typography>
    </Container>
  ) : null;
};
