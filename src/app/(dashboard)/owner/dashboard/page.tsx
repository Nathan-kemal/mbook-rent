"use client";

import React, { useEffect, useState } from "react";

import DoughnutChart from "@/app/components/charts/Dongnut";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LineGraph from "@/app/components/charts/Line";
import OwnerDashboardTable from "./table";
import MDateRangePicker from "@/app/components/ui/date-range-picker";
import { useSession } from "next-auth/react";
import { actionGetOwnerBookData } from "@/app/actions/db";

const Dashboard = () => {
  const session = useSession();
  const [chartData, setChartData] = useState<{}>({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(
    "(max-width: 1366px) and (max-height: 768px)"
  );

  useEffect(() => {
    const fetch = async () => {
      const data = await actionGetOwnerBookData(session.data?.user?.id);
      if (data) {
        setChartData(data);
      }
    };

    fetch();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        gap: 2,
        height: "85vh",
        width: "auto",
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "row" : "column",
          gap: 2,
        }}
      >
        <Card>
          <CardContent>
            <Typography>This Month Statistics</Typography>
            <Typography variant="caption">14-15-12</Typography>
          </CardContent>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>Income</Typography>
              <Typography>This Month</Typography>
            </Box>
            <Divider />
            <Typography variant="h5">ETB 9460.00</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>Available Books</CardContent>
          <Box>
            <DoughnutChart data={chartData} />
          </Box>
        </Card>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "100%",
        }}
      >
        <Box
          sx={{
            height: "50%",
            background: "white",
          }}
        >
          <OwnerDashboardTable />
        </Box>

        <Card
          sx={{
            height: "50%",
            background: "white",
          }}
        >
          <Stack direction="row" spacing={2} alignItems={"center"} ml={2}>
            <Typography>Earning Summary</Typography>
            <MDateRangePicker />
          </Stack>

          <Box
            sx={{
              height: "80%",
              background: "white",
            }}
          >
            <LineGraph />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
