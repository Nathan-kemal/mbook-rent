"use client";
import React, { useState } from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  SnackbarOrigin,
  TextField,
} from "@mui/material";
import { signIn } from "next-auth/react";
import PropagateAnimation from "@/app/components/animation/animation";

import { useRouter } from "next/navigation";
import { actionCheckStatus } from "@/app/actions/db";
import Image from "next/image";

const signInSchema = z.object({
  email: z
    .string()
    .email({
      message: "Enter Valid Email",
    })
    .min(1),

  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters long" }),
});

export default function SignIn() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading(true);

    const checkStatus = await actionCheckStatus(values?.email);
    if (checkStatus.status == 200) {
      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
      });

      if (signInResponse?.ok) {
        setLoading(false);
      }
    }
    setLoading(false);

    setErrorMsg(checkStatus.message);
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
        {loading ? (
          <PropagateAnimation loading={loading} color="#134B70" />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "",
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
              <p className="text-red-600">{errorMsg}</p>
              <h1>Book Rent</h1>
              <h1>Signup into Book Rent</h1>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                }}
              >
                <FormControl
                  sx={{
                    display: "flex",

                    gap: 2,
                    width: "100%",
                  }}
                >
                  <TextField
                    {...register("email")}
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    error={!!errors.email}
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
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ width: "100%" }}
                  >
                    SignIn
                  </Button>
                </FormControl>
              </Box>
            </form>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Rember Me"
              />
            </FormGroup>
            <div className=" self-center">
              <span>
                Dont Have Account{" "}
                <Link className="text-blue-500" href="/auth/sign-up">
                  Sign-Up
                </Link>
              </span>
              <span></span>
            </div>
          </Box>
        )}
      </Container>
    </Box>
  );
}
