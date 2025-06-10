import { Box, Button, Chip, Typography, useTheme } from "@mui/material";

interface ExploreCardProps {
  title: string;
  type: string;
  cause: string;
  distance: number;
  participation: string;
  tags: string[];
  image: string;
  onClick: () => void;
}

export default function ExploreCard({
  title,
  type,
  cause,
  distance,
  participation,
  tags,
  image,
  onClick,
}: ExploreCardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        height: "100%",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: "100%",
          height: 160,
          objectFit: "cover",
          borderRadius: 1,
          mb: 2,
        }}
      />

      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Type: {type}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Cause: {cause}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Distance: {distance} km
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Participation: {participation}
      </Typography>

      <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {tags.slice(0, 5).map((tag) => (
          <Chip key={tag} label={`#${tag}`} size="small" />
        ))}
      </Box>

      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onClick}>
        View
      </Button>
    </Box>
  );
}
