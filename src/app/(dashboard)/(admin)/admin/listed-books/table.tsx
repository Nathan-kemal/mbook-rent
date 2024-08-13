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
  IconButton,
  Snackbar,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { keepPreviousData, useQuery } from "@tanstack/react-query"; //note: this is TanStack React Query V5
import {
  actionApproveListedBook,
  actionGetAllBooks,
  actionUpdateBookStatus,
} from "@/app/actions/db";

interface User {
  firstName: string;
  lastName: string;
}

interface Book {
  id: string;
  author: string;
  bookName: string;
  category: string;
  userId: string;
  bookNo: string;
  status: string;
  User: User;
}

interface BooksResponse {
  data: Book[];
  meta: {
    totalRowCount: number;
  };
}

const BooksTable = () => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [snack, setSnack] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleSwitchChange = async (
    id: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const switch_staus = event.target.checked ? "ACTIVE" : "DISABLE";
      const statusUpdate = await actionUpdateBookStatus(id, switch_staus);
      if (statusUpdate?.status == 201) {
        refetch();
      }
    } catch (error) {}
  };

  const handleApproveButton = async (userId: string) => {
    const response = await actionApproveListedBook(userId);
    if (response?.status == 201) {
      // Update the data state (triggers re-render)
      refetch();
      setSnack(true);
    }
  };

  const handleClose = () => {
    setSnack(false);
  };

  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<BooksResponse>({
    queryKey: [
      "table-data",
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

      const response = actionGetAllBooks(params);

      return response;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    //column definitions...
    () => [
      {
        author: "author",
        header: "Author",
        Cell: ({ cell }) => (
          <Typography variant="caption">
            {cell.row.original?.book.author}
          </Typography>
        ),
      },

      {
        id: "owner",
        header: "Owner",
        Cell: ({ cell }) => (
          <Typography>
            {cell.row.original.User?.firstName}{" "}
            {cell.row.original.User?.lastName}
          </Typography>
        ),
      },
      {
        id: "category",
        header: "Category",
        Cell: ({ cell }) => (
          <Typography variant="caption">
            {cell.row.original?.book.category}
          </Typography>
        ),
      },
      {
        id: "bookName",
        header: "Book Name",
        Cell: ({ cell }) => (
          <Typography variant="caption">
            {cell.row.original?.book?.bookName}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Typography variant="caption">
            {cell.row.original.status}
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
          </Typography>
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
                  ? "#E2DAD6"
                  : "#00ABFF",
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

  // return( <Box>
  //    {/* <Snackbar
  //       anchorOrigin={{ vertical: "top", horizontal: "center" }}
  //       open={snack}
  //       onClose={handleClose}
  //       message="Sccuess"
  //     /> */}
  // <MaterialReactTable table={table} />;
  // </Box>_);

  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack}
        onClose={handleClose}
        message="Sccuess"
      />
      <MaterialReactTable table={table} />;
    </Box>
  );
};

export default BooksTable;
