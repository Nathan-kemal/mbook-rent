"use client";
import { TextField, Autocomplete, Box, Button } from "@mui/material";
import { FileList } from "@types/react-dom";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  actionUploadBook,
  actiongetBooks,
  uploadImage,
} from "@/app/actions/db";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CancelIcon from "@mui/icons-material/Cancel";
import { uplodBookSchema } from "@/schemas/schema";
import { Typography } from "@mui/material";
import React from "react";
import AddBook from "@/app/components/ui/addbook";
import { useSession } from "next-auth/react";
import { Book } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import SuccessDialog from "@/app/components/ui/scuess-dialog";
import PropagateAnimation from "@/app/components/animation/animation";

const UploadBook = () => {
  const [openAddDialog, setAddDialogOpen] = useState(false);
  const [openSuccessDialog, setSuccessDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const session = useSession();
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const userId = session.data?.user.id;

  const form = useForm<z.infer<typeof uplodBookSchema>>({
    resolver: zodResolver(uplodBookSchema),
    defaultValues: {},
  });

  const { handleSubmit, register, formState, watch, reset } = form;
  const { errors } = formState;
  const watchedFile = watch("file");

  const handleBookSelect = (
    event: React.SyntheticEvent,
    value: { lable: string; value: Book }
  ) => {
    setSelectedBookId(value?.value.id);
  };

  const handleImageSelector = () => {
    const fileInput = document.getElementById("cover");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };
  const handleSuccessDialogClose = () => {
    setSuccessDialog(false);
  };

  const fetchBooks = async () => {
    const response = await actiongetBooks(userId);
    const books = response?.books;

    if (books) {
      const options = books.map((option): { label: string; value: Book } => ({
        label: `${option.bookName} by ${option.author}`,
        value: option,
      }));
      return options || [];
    }
    return [];
  };

  const { data } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  async function onSubmit(values: z.infer<typeof uplodBookSchema>) {
    setLoading(true);
    const formData = new FormData();

    if (watchedFile && watchedFile.length > 0) {
      const files = watchedFile;

      Array.from(files).forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await uploadImage(formData);

      if (!response?.data) {
        setLoading(false);
      }

      if (response?.data) {
        const uploadbook = await actionUploadBook({
          userId: userId,
          cover: response?.data?.url,
          bookId: selectedBookId,
          quantity: values.quantity,
          rent: values.price,
        });

        if (uploadbook?.status == 500) {
          setLoading(false);
        }

        reset();
        setSuccessDialog(true);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (watchedFile && watchedFile.length > 0) {
      const file = watchedFile[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [watchedFile]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Upload New Book
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",

          alignItems: "center",
          gap: 2,
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={data || []}
          sx={{ width: 300 }}
          onChange={handleBookSelect}
          renderInput={(params) => (
            <TextField {...params} label="Serarch Book By Name or Author" />
          )}
          PaperComponent={(props) => (
            <Box
              {...props}
              sx={{ backgroundColor: "white" }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {props.children}
              <Box
                sx={{
                  p: 1,
                  position: "sticky",
                  bottom: 0,
                }}
              ></Box>
              <Button
                variant="outlined"
                onClick={handleAddDialogOpen}
                fullWidth
              >
                Add
              </Button>
            </Box>
          )}
        />
        <AddBook open={openAddDialog} handleClose={handleAddDialogClose} />

        {loading ? (
          <PropagateAnimation loading={loading} color="#FF4C4C" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                gap: 4,
              }}
            >
              <TextField
                {...register("quantity")}
                label="Book Quantity"
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
              />

              <TextField
                {...register("price")}
                label="Rent Price for 2 week "
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                mt={2}
                border={2}
                borderColor={` ${errors.file ? "red" : "#ccc"}`}
                p={2.5}
                textAlign="center"
                sx={{
                  borderStyle: "dashed",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {selectedImage && (
                  <div style={{ marginTop: "20px" }}>
                    <CancelIcon
                      sx={{
                        color: "#00ABFF",
                      }}
                    />
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className=" w-24 h-24 object-contain"
                    />
                  </div>
                )}

                <Box
                  sx={{
                    display: "flex",
                    gap: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={handleImageSelector}
                >
                  <input
                    id="cover"
                    style={{
                      display: "none",
                    }}
                    type="file"
                    {...register("file")}
                  />

                  <UploadFileIcon
                    sx={{
                      color: "#00ABFF",
                    }}
                  />
                  <p className="text-[#00ABFF]"> Upload Book Cover</p>
                </Box>
              </Box>
              {errors.file?.message}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: 500,
                }}
              >
                Submit
              </Button>
            </Box>
          </form>
        )}
        <SuccessDialog
          open={openSuccessDialog}
          handleClose={handleSuccessDialogClose}
        />
      </Box>
    </Box>
  );
};

export default UploadBook;
