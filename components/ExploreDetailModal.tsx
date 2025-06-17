"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Chip,
  Button,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Card {
  title: string;
  type: string;
  cause: string;
  distance: number;
  participation: string;
  tags: string[];
  image: string;
  description?: string;
}

export default function ExploreDetailModal({
  card,
  onClose,
}: {
  card: Card | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!card} onClose={onClose} maxWidth="sm" fullWidth>
      {card && (
        <>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {card.title}
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              maxHeight: "65vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              component="img"
              src={card.image}
              alt={card.title}
              sx={{ width: "100%", borderRadius: 2, mb: 2 }}
            />

            <Typography variant="body1" gutterBottom>
              <strong>Type:</strong> {card.type}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Cause:</strong> {card.cause}
            </Typography>
            {/* <Typography variant="body1" gutterBottom>
              <strong>Distance:</strong> {card.distance} km
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Participation:</strong> {card.participation}
            </Typography> */}

            {card.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {card.description}
              </Typography>
            )}

            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {card.tags.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" />
              ))}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button variant="contained" fullWidth>
              Join Now
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
