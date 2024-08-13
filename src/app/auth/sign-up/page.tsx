"use client";
import React, { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Snackbar,
  SnackbarCloseReason,
  TextField,
} from "@mui/material";
import { signUpUser } from "@/app/actions/db";

const formSchema = z
  .object({
    firstname: z.string().min(1, {
      message: "At Least 1 Characters",
    }),

    lastname: z.string().min(1, {
      message: "At Least 1 Characters",
    }),

    email: z
      .string()
      .email({
        message: "Enter Valid Email",
      })
      .min(1),

    password: z
      .string()
      .min(6, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
    location: z.string().min(1, {
      message: "Location must contain at least 1 character",
    }),
    phoneNumber: z
      .string()
      .min(10, { message: "Phone Number must contain at least 10 character" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Set the path of the error to the confirmPassword field
  });

const SignUp = () => {
  const router = useRouter();
  const handleSignUp = () => {};
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      phoneNumber: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { confirmPassword, ...userData } = values;
    const user = await signUpUser(userData);

    console.log(user);
    if (user?.status == 200) {
      router.push("/");
    } else if (user?.status == 400) {
      setErrorMessage(user.message);
    }
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          bgcolor: "#171B36",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          height={200}
          width={200}
          style={{ objectFit: "cover" }}
          src="/images/book.png"
          alt="Image Not found"
        />
      </Box>

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ width: 500 }}>
            <Snackbar
              anchorOrigin={{ horizontal: "center", vertical: "top" }}
              open={open}
              autoHideDuration={5000}
              onClose={handleClose}
              message="Error Createing Account"
            />
          </Box>
          <div className="">
            <h1>Book Rent</h1>
            <h1>Signup into Book Rent</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <FormControl
                sx={{
                  display: "flex",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <TextField
                    sx={{
                      width: "100%",
                    }}
                    {...register("firstname")}
                    error={!!errors.firstname}
                    id="outlined-basic"
                    label="First Name"
                    variant="outlined"
                    helperText={errors.firstname?.message}
                  />

                  <TextField
                    sx={{
                      width: "100%",
                    }}
                    {...register("lastname")}
                    error={!!errors.lastname}
                    id="outlined-basic"
                    label="Last Name"
                    variant="outlined"
                    helperText={errors.lastname?.message}
                  />
                </Box>
                <TextField
                  {...register("email")}
                  error={!!errors.password}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  helperText={errors.email?.message}
                />
                <TextField
                  {...register("password")}
                  error={!!errors.password}
                  type="password"
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  helperText={errors.password?.message}
                />

                <TextField
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  id="outlined-basic"
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  helperText={errors.confirmPassword?.message}
                />

                <TextField
                  {...register("location")}
                  error={!!errors.location}
                  id="outlined-basic"
                  label="Location"
                  variant="outlined"
                  helperText={errors.location?.message}
                />

                <TextField
                  {...register("phoneNumber")}
                  error={!!errors.phoneNumber}
                  id="outlined-basic"
                  label="Phone Number"
                  variant="outlined"
                  helperText={errors.phoneNumber?.message}
                />
              </FormControl>
            </Box>

            <Button type="submit" variant="contained" sx={{ width: "100%" }}>
              SignUp
            </Button>
          </form>

          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="I Have Accecpted Terms And Condition"
            />
          </FormGroup>
          <div className=" self-center">
            <span>
              Already Have Account{" "}
              <Link className="text-blue-500" href="/auth/sign-in">
                Sign-In
              </Link>
            </span>
            <span></span>
          </div>
        </Container>
      </Container>
    </Box>
  );
};

export default SignUp;
