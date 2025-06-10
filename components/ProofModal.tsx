import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  Link,
} from "@mui/material";
import { ProofOfCompensation } from "@/types/proof-of-compensation.interface";
import { useMemo } from "react";
import Carousel from "react-material-ui-carousel";
import { Swiper, SwiperSlide } from "swiper/react"; // ✅ React-compatible
import { Navigation, A11y } from "swiper/modules"; // Optional modules
import { generateTripPDF } from "@/utils/pdf-proof";

interface ProofModalProps {
  open: boolean;
  onClose: () => void;
  proof: ProofOfCompensation;
  userProfileImgUrl: string;
  tripName: string;
}

export default function ProofModal({
  open,
  onClose,
  proof,
  userProfileImgUrl,
  tripName,
}: ProofModalProps) {
  // if (!proof) return;

  const totalCo2 = useMemo(() => {
    const all = [...proof.donationInfos, ...proof.volunteeringInfos];
    return all.reduce((sum, item) => sum + item.compensatedCo2, 0);
  }, [proof]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Box flex={1}>
            <Typography variant="h6" fontWeight={600}>
              Proof of Travel Compensation
            </Typography>
          </Box>
          <Avatar src={userProfileImgUrl} sx={{ width: 48, height: 48 }} />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          🌍 Total CO₂ Compensated: {totalCo2.toFixed(2)} kg
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          🌳 Trees Donated: <strong>{proof.trees}</strong>
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          🤝 Volunteer Hours: <strong>{proof.volunteerHours}</strong>
        </Typography>

        <Swiper
          modules={[Navigation, A11y]}
          navigation
          loop={false}
          spaceBetween={16}
          slidesPerView={1}
          style={{ padding: "1rem 0" }}
        >
          {[...proof.donationInfos, ...proof.volunteeringInfos].map(
            (info, index) => (
              <SwiperSlide key={index}>
                <Box p={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {info.donation && "Donation Compensation"}
                    {info.volunteering && "Volunteering Compensation"}
                  </Typography>
                  <Typography>
                    🔄 CO₂ Compensated: {info.compensatedCo2.toFixed(2)} kg
                  </Typography>
                  {info.donation?.trees && (
                    <Typography>
                      🌳 Trees: {info.donation.trees} (Total:{" "}
                      {info.donation.totalPrice} {info.donation.currency})
                    </Typography>
                  )}
                  {info.volunteering?.hours && (
                    <Typography>⏱️ Hours: {info.volunteering.hours}</Typography>
                  )}
                  {info.projectId && (
                    <Typography sx={{ mt: 1 }}>
                      🔗{" "}
                      <Link
                        href={`/explore?projectId=${info.projectId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                      </Link>
                    </Typography>
                  )}
                </Box>
              </SwiperSlide>
            )
          )}
        </Swiper>

        {proof.comment && (
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            💬 {proof.comment}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="primary">
          Status: {proof.status}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => generateTripPDF(proof)}>Download PDF</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
