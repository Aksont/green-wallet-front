"use client";

import { useEffect, useState } from "react";
import Grid, { GridProps } from "@mui/material/Grid";
import ExploreCard, { ExploreCardProps } from "@/components/ExploreCard";
import ExploreDetailModal from "@/components/ExploreDetailModal";
import { Box } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function ExploreCardGrid() {
  const [cards, setCards] = useState<ExploreCardProps[]>([]);
  const [selected, setSelected] = useState<ExploreCardProps | null>(null);

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    if (projectId) {
      for (const card of cards) {
        if ("id" in card && card.id === projectId) {
          setSelected(card);
          return;
        }
      }
    }
  }, [projectId, cards]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/projects`
        ); // Replace with your real backend URL
        setCards(res.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        {cards.map((card, i) => (
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
            <ExploreCard {...card} onClick={() => setSelected(card)} />
          </Grid>
        ))}
      </Grid>
      <ExploreDetailModal card={selected} onClose={() => setSelected(null)} />
      <Box sx={{ height: 40 }} />{" "}
      {/* adds padding space below content so that navbar would not be overlaying the last card */}
    </>
  );
}
