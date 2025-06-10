"use client";

import { CompensationSuggestions } from "@/types/compensation-suggestions.interface";
import {
  Challenge,
  DonationProject,
  Project,
  VolunteerProject,
} from "@/types/project.interface";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Slider,
} from "@mui/material";
import { useState } from "react";
import { CompensationInfo } from "@/types/proof-of-compensation.interface";
import axios from "axios";

interface CompensationSuggestionsModalProps {
  open: boolean;
  onClose: () => void;
  suggestions: CompensationSuggestions;
  onCompensate: (
    type: "DONATION" | "VOLUNTEER",
    projectId: string,
    value: number
  ) => void;
  tripTotalCo2: number;
  tripId: string;
}

export default function CompensationSuggestionsModal({
  open,
  onClose,
  suggestions,
  onCompensate,
  tripTotalCo2,
  tripId,
}: CompensationSuggestionsModalProps) {
  const [tab, setTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalType, setModalType] = useState<"DONATION" | "VOLUNTEER" | null>(
    null
  );
  const [sliderValue, setSliderValue] = useState(1);

  const [confirmationData, setConfirmationData] =
    useState<CompensationInfo | null>(null);
  const [showFinalModal, setShowFinalModal] = useState(false);

  const handleOpenConfirmModal = (
    project: Project,
    type: "DONATION" | "VOLUNTEER"
  ) => {
    if (type === "DONATION") {
      setSliderValue(suggestions.trees);
    } else {
      setSliderValue(suggestions.volunteerHours);
    }
    setSelectedProject(project);
    setModalType(type);
  };

  //   const handleConfirm = () => {
  //     console.log(selectedProject);
  //     console.log(sliderValue);
  //     if (selectedProject && modalType) {
  //       onCompensate(modalType, selectedProject.id, sliderValue);
  //       setSelectedProject(null);
  //       setModalType(null);
  //       onClose();
  //     }
  //   };

  const handleConfirm = async () => {
    console.log(selectedProject);
    console.log(sliderValue);
    if (selectedProject && modalType) {
      console.log({
        projectId: selectedProject.id,
        tripId: tripId,
        amount: sliderValue,
      });
      try {
        const res = await axios.post<CompensationInfo>(
          `http://localhost:3001/compensation/donate`,
          {
            userId: localStorage.getItem("userId"),
            projectId: selectedProject.id,
            tripId: tripId,
            amount: sliderValue,
          }
        );

        setConfirmationData(res.data);
        setShowFinalModal(true);

        // Cleanup modal state
        setSelectedProject(null);
        setModalType(null);
        onClose(); // close the confirm modal
      } catch (error) {
        console.error("Failed to confirm compensation:", error);
      }
    }
  };

  const tabs = ["Donation", "Volunteer", "Challenge"];

  const renderProject = (
    project: Project,
    type: "DONATION" | "VOLUNTEER" | "CHALLENGE"
  ) => (
    <Box
      key={project.id}
      p={2}
      border={"1px solid #ccc"}
      borderRadius={2}
      mb={2}
    >
      <Typography variant="h6">{project.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {project.description}
      </Typography>
      <Typography variant="body2">📍 {project.country}</Typography>
      <Typography variant="body2">🎯 Cause: {project.cause}</Typography>
      <Box mt={1}>
        {type === "DONATION" && (
          <>
            <Typography variant="body2">
              💰 {(project as DonationProject).unitPrice}{" "}
              {(project as DonationProject).currency} per tree
            </Typography>
            <Box sx={{ height: 10 }} />{" "}
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                onClick={() => handleOpenConfirmModal(project, "DONATION")}
              >
                Compensate
              </Button>
            </Box>
          </>
        )}
        {type === "VOLUNTEER" && (
          <>
            <Typography variant="body2">
              🕒 Join Type: {(project as VolunteerProject).joinType}
            </Typography>
            <Box sx={{ height: 10 }} />{" "}
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                onClick={() => handleOpenConfirmModal(project, "VOLUNTEER")}
              >
                Compensate
              </Button>
            </Box>
          </>
        )}
        {type === "CHALLENGE" && (
          <Typography variant="body2">
            🏆 Reward: {(project as Challenge).reward || "None"}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Suggestions for Compensation</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Your trip resulted in a total of{" "}
              <strong>{tripTotalCo2.toFixed(2)} kg</strong> of CO₂ emissions.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              To fully compensate, you can either:
            </Typography>
            <Typography variant="body1" sx={{ ml: 2, mb: 1 }}>
              🌳 Donate <strong>{suggestions.trees}</strong> trees
            </Typography>
            <Typography variant="body1" sx={{ ml: 2 }}>
              🤝 Volunteer for <strong>{suggestions.volunteerHours}</strong>{" "}
              hours
            </Typography>
          </Box>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            {tabs.map((label, i) => (
              <Tab key={i} label={label} />
            ))}
          </Tabs>
          <Box mt={2}>
            {tab === 0 &&
              suggestions.donationProjects.map((p) =>
                renderProject(p, "DONATION")
              )}
            {tab === 1 &&
              suggestions.volunteerProjects.map((p) =>
                renderProject(p, "VOLUNTEER")
              )}
            {tab === 2 &&
              suggestions.challenges.map((p) => renderProject(p, "CHALLENGE"))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Modal */}
      <Dialog open={!!selectedProject} onClose={() => setSelectedProject(null)}>
        <DialogTitle>Confirm Compensation</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You are about to compensate via:{" "}
            <strong>{selectedProject?.title}</strong>
          </Typography>
          <Typography gutterBottom>
            {modalType === "DONATION"
              ? `🌳 Trees: ${sliderValue} — Total: ${
                  sliderValue * (selectedProject as DonationProject).unitPrice
                } ${(selectedProject as DonationProject).currency}`
              : `⏱️ Hours: ${sliderValue}`}
          </Typography>
          <Slider
            value={sliderValue}
            onChange={(e, val) => setSliderValue(val as number)}
            min={1}
            max={20}
            marks
            valueLabelDisplay="auto"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedProject(null);
              setModalType(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Final Modal Component */}
      <Dialog open={showFinalModal} onClose={() => setShowFinalModal(false)}>
        <DialogTitle>Compensation Successful</DialogTitle>
        <DialogContent>
          {confirmationData && (
            <Box>
              {confirmationData.donation && (
                <>
                  <Typography>
                    🌳 Trees Donated: {confirmationData.donation.trees} for a
                    total of {confirmationData.donation.totalPrice}{" "}
                    {confirmationData.donation.currency}
                  </Typography>
                </>
              )}
              {confirmationData.volunteering && (
                <>
                  <Typography>
                    🤝 Volunteering Hours: {confirmationData.volunteering.hours}
                  </Typography>
                </>
              )}
              <Typography>
                🔄 CO₂ Compensated: {confirmationData.compensatedCo2.toFixed(2)}{" "}
                kg
              </Typography>
              <Typography sx={{ mt: 1 }}>
                💨 Remaining CO₂ to Compensate:{" "}
                {confirmationData.remainingCo2Compensation.toFixed(2)} kg
              </Typography>

              {confirmationData.remainingCo2Compensation === 0 && (
                <Typography
                  fontWeight={600}
                  color="success.main"
                  sx={{ mt: 2 }}
                >
                  🎉 Congratulations! You have fully compensated your trip!
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowFinalModal(false);
              setConfirmationData(null);

              if (
                confirmationData &&
                confirmationData.remainingCo2Compensation === 0
              ) {
                window.location.href = `/trips/${tripId}`; // Full browser reload because isCompensated icon (in TripCard) did not want to change otherwise (need to refresh)
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
