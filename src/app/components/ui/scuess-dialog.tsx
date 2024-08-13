import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import Image from "next/image";
export default function SuccessDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          width: "30rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image width={70} height={70} alt="happy" src="/images/laughing.png" />

        <Typography variant="h6">Congrats</Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "12px", color: "#6482AD" }}
        >
          You have uploaded the book successfully. wait untile we aproved it
        </Typography>

        <DialogContentText id="alert-dialog-description"></DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          mr: "auto",
          ml: "auto",
        }}
      >
        <Button
          onClick={handleClose}
          variant="contained"
          type="submit"
          sx={{
            alignSelf: "center",
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
