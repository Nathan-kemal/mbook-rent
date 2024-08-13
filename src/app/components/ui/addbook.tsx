import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { actionAddBook } from "@/app/actions/db";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const addBookSchema = z.object({
  bookName: z.string().min(1, {
    message: "Book Name must be at least 1 characters long",
  }),

  author: z
    .string()
    .min(1, { message: "Author must be at least 1 characters long" }),

  category: z.enum(["Fiction", "Self Help", "Business"], {
    required_error: "Category is required",
  }),
});

export default function AddBook({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const queryClient = useQueryClient();
  const session = useSession();
  const { register, handleSubmit, formState, reset, setValue, watch } = useForm<
    z.infer<typeof addBookSchema>
  >({
    resolver: zodResolver(addBookSchema),
  });
  const { errors } = formState;

  const selectedValue = watch("category");

  async function onSubmit(values: z.infer<typeof addBookSchema>) {
    const response = await actionAddBook(session.data?.user.id, values);

    if (response) {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      reset();
    }
  }

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              alignSelf: "center",
            }}
          >
            Add Book
          </DialogTitle>
          <DialogContent
            sx={{
              width: "25rem",
            }}
          >
            <DialogContentText id="alert-dialog-description">
              <Box
                sx={{
                  width: "100",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  {...register("bookName")}
                  error={!!errors.bookName}
                  id="outlined-basic"
                  label="Book Name"
                  variant="outlined"
                  helperText={errors.bookName?.message}
                />
                <TextField
                  {...register("author")}
                  error={!!errors.author}
                  id="outlined-basic"
                  label="Author Name"
                  variant="outlined"
                  helperText={errors.author?.message}
                />

                <FormControl sx={{}}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Select Category
                  </InputLabel>
                  <Select
                    error={!!errors.category}
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    label="Select Category"
                    defaultValue="none"
                    value={selectedValue}
                    {...(register("category"),
                    {
                      onChange: (e) =>
                        setValue("category", e.target.value, {
                          shouldValidate: true,
                        }),
                    })}
                  >
                    <MenuItem value={"none"}></MenuItem>
                    <MenuItem value={"Fiction"}>Fiction</MenuItem>
                    <MenuItem value={"Self Help"}>Self Help</MenuItem>
                    <MenuItem value={"Business"}>Business</MenuItem>
                  </Select>

                  {errors.category && (
                    <FormHelperText error>
                      {errors.category.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              sx={{
                width: "100%",
              }}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
