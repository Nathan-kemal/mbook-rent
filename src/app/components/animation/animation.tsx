import React, { CSSProperties, useState } from "react";
import { PropagateLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const PropagateAnimation = ({
  loading,
  color,
}: {
  loading: boolean;
  color: string;
}) => {
  return (
    <PropagateLoader
      color={color}
      loading={loading}
      cssOverride={override}
      size={15}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default PropagateAnimation;
