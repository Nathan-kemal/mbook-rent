"use client";
import React from "react";
import OwnersTable from "./table";
import { Can } from "@casl/react";
import { defineAbilityFor } from "@/access-control/ability";

import { useSession } from "next-auth/react";

const Owners = () => {
  const session = useSession();
  const role = session.data?.user.role;
  const ability = defineAbilityFor({ role: role });
  console.log(role);
  return (
    <div>
      <Can I={"view"} a={"Owner"} ability={ability}>
        <OwnersTable />
      </Can>
    </div>
  );
};

export default Owners;
