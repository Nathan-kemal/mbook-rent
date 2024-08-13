import { ChangeEvent, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { keepPreviousData, QueryClient, useQuery } from "@tanstack/react-query"; //note: this is TanStack React Query V5
import {
  actionApproveOwner,
  actionDisableOwner,
  actionGetAllBooks,
  actionGetAllOwners,
} from "@/app/actions/db";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

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

type OwnerInfo = {
  name: string;
  email: string;
  location: string;
  phoneNumber: string;
};

const OwnersTable = () => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const defaultOwnerInfo = {
    name: "",
    email: "",
    location: "",
    phoneNumber: "",
  };
  const [snack, setSnack] = useState(false);
  const [isOwnerInfoOpen, setOpenOwnerInfo] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>(defaultOwnerInfo);

  const handleApproveButton = async (userId: string) => {
    const response = await actionApproveOwner(userId);
    if (response?.status == 201) {
      // Update the data state (triggers re-render)
      refetch();
      setSnack(true);
    }
  };

  const handleOpenOwnerInfo = (ownerInfo: OwnerInfo) => {
    setOwnerInfo(ownerInfo);
    setOpenOwnerInfo(true);
  };
  const handleClose = () => {
    setSnack(false);
    setOpenOwnerInfo(false);
    setOwnerInfo(defaultOwnerInfo);
  };

  const handleSwitchChange = async (
    id: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const switch_staus = event.target.checked ? "ACTIVE" : "DISABLE";
      const statusUpdate = await actionDisableOwner(id, switch_staus);
      if (statusUpdate?.status == 201) {
        refetch();
      }
    } catch (error) {}
  };
  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<OwnerResponse>({
    queryKey: [
      "dashboard-table-data",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      const params = {
        start: `${pagination.pageIndex * pagination.pageSize}`,
        size: `${pagination.pageSize}`,
        filters: JSON.stringify(columnFilters ?? []),
        globalFilter: globalFilter ?? "",
        sorting: JSON.stringify(sorting ?? []),
      };

      const response = actionGetAllOwners(params);

      return response;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const columns = useMemo<MRT_ColumnDef<Owner>[]>(
    //column definitions...
    () => [
      {
        id: "owner",
        header: "Owner",
        Cell: ({ cell }) => (
          <Typography>
            {cell.row.original.firstName} {cell.row.original.lastName}
          </Typography>
        ),
      },
      {
        id: "upload",
        header: "Upload",
        Cell: ({ cell }) => (
          <Typography>
            {cell.row.original.uploadedbooks?.length} Books
          </Typography>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Box
            sx={{
              display: "flex ",

              alignItems: "center",
            }}
          >
            <Typography variant="caption">
              {cell.row.original.status}
            </Typography>
            <Switch
              checked={cell.row.original.status === "ACTIVE" ? true : false}
              onChange={(event) =>
                handleSwitchChange(cell.row.original.id, event)
              }
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
          </Box>
        ),
      },

      {
        id: "action",
        header: "Action",
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip title="Show">
              <IconButton
                onClick={() =>
                  handleOpenOwnerInfo({
                    name:
                      cell.row.original.firstName +
                      " " +
                      cell.row.original.lastName,
                    email: cell.row.original.email,
                    phoneNumber: cell.row.original.phoneNumber,
                    location: cell.row.original.location,
                  })
                }
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },

      {
        id: "approved",
        header: "",
        Cell: ({ cell }) => (
          <Button
            disabled={cell.row.original.approved === "APPROVED" ? true : false}
            variant="contained"
            onClick={() => handleApproveButton(cell.row.original.id)}
            sx={{
              background:
                cell.row.original.approved === "APPROVED"
                  ? "#00ABFF"
                  : "#E2DAD6",
            }}
          >
            {cell.row.original.approved}
          </Button>
        ),
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
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
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
      <Dialog open={isOwnerInfoOpen} onClose={handleClose}>
        <DialogTitle>Info</DialogTitle>
        <DialogContent
          sx={{
            width: "30rem",
          }}
        >
          <Box
            sx={{
              mt: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              disabled
              id="outlined-disabled"
              label="Name"
              defaultValue={ownerInfo.name}
            />

            <TextField
              disabled
              id="outlined-disabled"
              label="Email"
              defaultValue={ownerInfo.email}
            />

            <TextField
              disabled
              id="outlined-disabled"
              label="Location"
              defaultValue={ownerInfo.location}
            />

            <TextField
              disabled
              id="outlined-disabled"
              label="Phone Number"
              defaultValue={ownerInfo.phoneNumber}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

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

export default OwnersTable;
