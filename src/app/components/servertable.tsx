import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table";
import { IconButton, Switch, Tooltip, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query"; //note: this is TanStack React Query V5

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

const label = { inputProps: { "aria-label": "Size switch demo" } };
const Example = () => {
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //consider storing this code in a custom hook (i.e useFetchUsers)
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
      const fetchURL = new URL(
        "dashboard",
        process.env.NODE_ENV === "production"
          ? "https://www.material-react-table.com"
          : "http://localhost:3000"
      );

      const params = {
        start: `${pagination.pageIndex * pagination.pageSize}`,
        size: `${pagination.pageSize}`,
        filters: JSON.stringify(columnFilters ?? []),
        globalFilter: globalFilter ?? "",
        sorting: JSON.stringify(sorting ?? []),
      };

      console.log("first", params);
      const response = actionGetAllBooks(params);

      // const response = await fetch(fetchURL.href);
      // const json = (await response.json()) as BooksResponse;
      return response;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    //column definitions...
    () => [
      {
        accessorKey: "author",
        header: "Author",
      },

      {
        id: "owner",
        header: "Owner",
        Cell: ({ cell }) => (
          <Typography>
            {cell.row.original.User.firstName} {cell.row.original.User.lastName}
          </Typography>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "bookName",
        header: "Book Name",
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

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { actionGetAllBooks } from "../actions/db";
const ExampleWithReactQueryProvider = () => (
  //App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Example />
    </LocalizationProvider>
  </QueryClientProvider>
);

export default ExampleWithReactQueryProvider;
