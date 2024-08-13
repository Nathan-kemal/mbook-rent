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
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { keepPreviousData, useQuery } from "@tanstack/react-query"; //note: this is TanStack React Query V5
import { actionDeleteOwnerBook, actionGetUploadedBook } from "@/app/actions/db";
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

const OwnerDashboardTable = () => {
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

  const [deleteBookId, setDeleteBookId] = useState("");
  const [OpenConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [snack, setSnack] = useState(false);
  const role = session?.user?.role;
  const id = session?.user?.id;
  const ability = useMemo(() => defineAbilityFor({ role, id }), [role, id]);

  const handleClose = () => {
    setSnack(false);
    setOpenConfirmDialog(false);
    setDeleteBookId("");
  };

  const handleDeleteBook = async (bookId: string) => {
    const response = await actionDeleteOwnerBook(bookId);
    if (response?.status == 201) {
      refetch();
      setSnack(true);
      setOpenConfirmDialog(false);
    }
  };
  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<OwnerResponse>({
    queryKey: [
      "table-data",
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
        role: role,
        id: id,
      };

      const response = actionGetUploadedBook(params);

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
          <Typography>{cell.row.original?.book.bookNo}</Typography>
        ),

        size: 20,
      },

      ...(ability.can("view", "Book")
        ? [
            {
              id: "bookName",
              header: "Book Name",
              Cell: ({ cell }) => (
                <Typography>{cell.row.original?.book?.bookName}</Typography>
              ),

              size: 20,
            },
          ]
        : []),

      ...(ability.can("view", "Owner")
        ? [
            {
              id: "owner",
              header: "Owner",
              Cell: ({ cell }) => (
                <Typography>
                  {cell.row.original?.User.firstName}{" "}
                  {cell.row.original?.User.lastName}
                </Typography>
              ),
              size: 20,
            },
          ]
        : []),
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) =>
          cell.row.original.approved === "APPROVED" ? (
            <Stack direction="row" gap={1}>
              <Box
                sx={{
                  bgcolor: "blue",
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="caption">
                {cell.row.original.status}
              </Typography>
            </Stack>
          ) : (
            <Stack direction="row" gap={1}>
              <Box
                sx={{
                  bgcolor: "red",
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="caption">Waitting APPROVAL</Typography>
            </Stack>
          ),
        size: 20,
      },

      {
        accessorKey: "rent",
        header: "Price",
        size: 20,
      },
      ...(ability.can("manage", "Book")
        ? [
            {
              id: "action",
              header: "Action",
              Cell: ({ cell }) => (
                <Typography>
                  <Button>
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenConfirmDialog(true);
                      setDeleteBookId(cell.row.original.id);
                    }}
                  >
                    <DeleteIcon color="error" />
                  </Button>
                </Typography>
              ),
              size: 20,
            },
          ]
        : []),
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
      <Dialog open={OpenConfirmDialog} onClose={handleClose}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent
          sx={{
            width: "10rem",
          }}
        ></DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteBook(deleteBookId)}>Delete</Button>
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

export default OwnerDashboardTable;
