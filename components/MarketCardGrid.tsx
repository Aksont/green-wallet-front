"use client";

import { Box, Grid, GridProps } from "@mui/material";
import MarketCard from "@/components/MarketCard";

const dummyStores = [
  {
    name: "Eco Threads",
    type: "Clothes",
    distance: 1.2,
    image: "/images/store-eco-threads.jpg",
    hasCoupon: true,
  },
  {
    name: "Green Spoon Café",
    type: "Café",
    distance: 2.5,
    image: "/images/store-green-spoon.jpg",
    hasCoupon: false,
  },
  {
    name: "Vintage Finds Market",
    type: "Hobby",
    distance: 3.7,
    image: "/images/store-vintage-finds.jpg",
    hasCoupon: false,
  },
  {
    name: "Local Bites Restaurant",
    type: "Restaurant",
    distance: 1.9,
    image: "/images/store-local-bites.jpg",
    hasCoupon: true,
  },
];

export default function MarketCardGrid() {
  return (
    <>
      <Grid container spacing={3}>
        {dummyStores.map((store, i) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={i}
            component="div"
            {...({} as GridProps)}
            width="100%" // ensures that the Card elemenets take the full width, regardless of their content
          >
            <MarketCard {...store} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ height: 40 }} />{" "}
      {/* adds padding space below content so that navbar would not be overlaying the last card */}
    </>
  );
}
