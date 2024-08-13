import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Snackbar,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { keepPreviousData, useQuery } from "@tanstack/react-query"; //note: this is TanStack React Query V5
import {
  actionGetAllBooks,
  actionGetAllUploadedBook,
  actionGetUploadedBook,
} from "@/app/actions/db";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { defineAbilityFor } from "@/access-control/ability";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/store";
import EditIcon from "@mui/icons-material/Edit";

interface UploadedBook {
  id: string;
  quantity: number;
  rent: number;
  cover: string;
  userId: string;
  status: string;
  bookId: string;
  createdAt: Date;
}
interface Owner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  phoneNumber: string;
  status: string;
  approved: string;
  avatar: string | null;
  uploadedbooks: UploadedBook[];
}

interface OwnerResponse {
  data: Owner[];
  meta: {
    totalRowCount: number;
  };
}

const DashboardTable = () => {
  const { data: session } = useSession();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [snack, setSnack] = useState(false);

  const handleClose = () => {
    setSnack(false);
  };
  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<OwnerResponse>({
    queryKey: [
      "admin-data",
      columnFilters,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      const params = {
        start: `${pagination.pageIndex * pagination.pageSize}`,
        size: `${pagination.pageSize}`,
        filters: JSON.stringify(columnFilters ?? []),
        globalFilter: globalFilter ?? "",
        sorting: JSON.stringify(sorting ?? []),
      };

      const response = actionGetAllBooks(params);

      // const response = await fetch(fetchURL.href);
      // const json = (await response.json()) as BooksResponse;
      return response;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const columns = useMemo<MRT_ColumnDef<Owner>[]>(
    //column definitions...
    () => [
      {
        id: "bookNo",
        header: "Book No",
        Cell: ({ cell }) => (
          <Typography>{cell.row.original?.book?.bookNo}</Typography>
        ),
      },

      {
        id: "owner",
        header: "Owner",
        Cell: ({ cell }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              alt={cell.row.original?.User.firstName}
              src="/images/avatar/1.jpg"
            />
            <Typography>
              {cell.row.original?.User.firstName}{" "}
              {cell.row.original?.User.lastName}
            </Typography>
          </Stack>
        ),
      },

      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Typography variant="caption">
            {cell.row.original.status}
            <Switch
              checked
              sx={{
                width: 120, // increase the width here

                "& .MuiSwitch-switchBase": {
                  padding: 1,
                  "&.Mui-checked": {
                    transform: "translateX(80px)", // adjust based on the new width
                    color: "#fff",
                    "& + .MuiSwitch-track": {
                      backgroundColor: "#1976d2", // custom color for checked state
                      opacity: 1,
                      border: 0,
                    },
                  },
                },
                "& .MuiSwitch-thumb": {
                  width: 20, // adjust thumb size
                  height: 20,
                },
                "& .MuiSwitch-track": {
                  borderRadius: 20 / 2,
                  backgroundColor: "#E9E9EA",
                  opacity: 1,
                  transition: "background-color 0.3s",
                },
              }}
            />
          </Typography>
        ),
      },

      {
        accessorKey: "rent",
        header: "Price",
      },
    ],
    []
    //end
  );

  const table = useMaterialReactTable({
    columns,
    data,

    initialState: { showColumnFilters: false },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Typography
        sx={{
          mt: 2,
          ml: 2,
          fontWeight: "bold",
        }}
      >
        Live Book Status{" "}
      </Typography>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack}
        onClose={handleClose}
        message="Sccuess"
      />
    </Box>
  );
};

export default DashboardTable;
