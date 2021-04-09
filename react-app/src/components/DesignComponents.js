import React from "react";

export const Row = ({ children }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);
export const Column = ({ children, size }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: size || "100%",
    }}
  >
    {children}
  </div>
);
export const CentreAlign = ({ children, height, width }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      height: "100%",
      width: "100%",
    }}
  >
    <div
      style={{
        height,
        width,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  </div>
);
