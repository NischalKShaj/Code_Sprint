// file to add problems in the admin side

// importing the required modules
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import React from "react";

const Problems = () => {
  return (
    <div>
      <SpinnerWrapper>
        <AdminSidePanel />
        <>problems</>
      </SpinnerWrapper>
    </div>
  );
};

export default Problems;
