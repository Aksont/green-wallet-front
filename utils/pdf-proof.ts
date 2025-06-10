import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import autoTable from "jspdf-autotable";
import { ProofOfCompensation } from "@/types/proof-of-compensation.interface";
import { Trip } from "@/components/TripCard";
import axios from "axios";

export async function generateTripPDF(
  proof: ProofOfCompensation
): Promise<void> {
  let trip: Trip;
  try {
    const res = await axios.get("http://localhost:3001/trips/" + proof.tripId);
    trip = res.data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return;
  }

  if (!trip) return;

  const doc = new jsPDF();

  // Trip Title
  doc.setFontSize(18);
  doc.text(trip.title, 14, 20);

  // Basic Trip Info
  doc.setFontSize(12);
  doc.text(`From: ${trip.from.name}, ${trip.from.country}`, 14, 30);
  doc.text(`To: ${trip.to.name}, ${trip.to.country}`, 14, 36);
  doc.text(`Dates: ${trip.startDate} – ${trip.endDate}`, 14, 42);
  doc.text(`Distance: ${trip.totalDistanceInKm.toFixed(1)} km`, 14, 48);
  doc.text(`CO₂ Emissions: ${trip.totalCo2emissionInKg.toFixed(2)} kg`, 14, 54);

  // Proof of Compensation
  doc.setFontSize(14);
  doc.text("Proof of Compensation", 14, 70);
  doc.setFontSize(12);
  doc.text(`Trees Donated: ${proof.trees}`, 14, 78);
  doc.text(`Volunteer Hours: ${proof.volunteerHours}`, 14, 84);
  doc.text(`Status: ${proof.status}`, 14, 90);
  if (proof.comment) {
    doc.text(`Comment: ${proof.comment}`, 14, 96);
  }

  // Compensation Details Table
  autoTable(doc, {
    startY: 105,
    head: [["Type", "CO₂ (kg)", "Trees/Hours", "Amount"]],
    body: [...proof.donationInfos, ...proof.volunteeringInfos].map((info) => {
      const type = info.donation ? "Donation" : "Volunteering";
      const co2 = info.compensatedCo2.toFixed(2);
      const qty = info.donation
        ? `${info.donation.trees} trees`
        : `${info.volunteering?.hours} hrs`;
      const amount = info.donation
        ? `${info.donation.totalPrice} ${info.donation.currency}`
        : "-";
      return [type, co2, qty, amount];
    }),
  });

  // QR Code Generation
  const tripUrl = `${window.location.origin}/trips/${trip.id}`;
  const qrDataUrl = await QRCode.toDataURL(tripUrl);

  // Insert QR code
  doc.addImage(qrDataUrl, "PNG", 150, 20, 40, 40);

  // Download the file
  doc.save(`Trip-${trip.title.replace(/\s+/g, "-")}.pdf`);
}
