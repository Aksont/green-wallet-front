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
  let userName: string;
  let tokenId: number;
  const contractAddress = "0x57B88F893e7c879FE32d784325bDe6eaB71De08C";

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/trips/` + proof.tripId
    );
    trip = res.data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return;
  }

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/trips/user-name/` + trip.id
    );
    userName = res.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return;
  }

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/compensation/token/` + trip.id
    );
    tokenId = res.data;
  } catch (error) {
    console.error("Failed to token id:", error);
    return;
  }

  if (!trip) return;

  const doc = new jsPDF();

  // Trip Title
  doc.setFontSize(18);
  doc.text(trip.title, 14, 20);

  const formatDate = (dateStr: Date) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const start = formatDate(trip.startDate);
  const end = formatDate(trip.endDate);

  // Basic Trip Info
  doc.setFontSize(12);
  doc.text(`From: ${trip.from.name}, ${trip.from.country}`, 14, 30);
  doc.text(`To: ${trip.to.name}, ${trip.to.country}`, 14, 36);
  doc.text(`Dates: ${start} - ${end}`, 14, 42);
  doc.text(`Distance: ${trip.totalDistanceInKm.toFixed(1)} km`, 14, 48);
  doc.text(`CO2 Emissions: ${trip.totalCo2emissionInKg.toFixed(2)} kg`, 14, 54);

  // Blockchain Info
  doc.text(`Blockchain Token ID: ${tokenId}`, 14, 66);
  doc.text(`Ethereum Contract: ${contractAddress}`, 14, 72);
  doc.text(`Blockchain Network: Ethereum Sepolia Testnet`, 14, 78);
  doc.text("View Proof as NFT:", 14, 84);

  // QR Code for Etherscan
  const etherscanUrl = `https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId}`;
  const qrEtherscanUrl = await QRCode.toDataURL(etherscanUrl);
  doc.addImage(qrEtherscanUrl, "PNG", 30, 86, 30, 30);

  // // Proof of Compensation
  // doc.setFontSize(14);
  // doc.text(`${userName}'s Proof of Compensation`, 14, 70);
  // doc.setFontSize(12);
  // doc.text(`Trees Donated: ${proof.trees}`, 14, 78);
  // doc.text(`Volunteer Hours: ${proof.volunteerHours}`, 14, 84);
  // doc.text(`Status: ${proof.status}`, 14, 90);
  // if (proof.comment) {
  //   doc.text(`Comment: ${proof.comment}`, 14, 96);
  // }

  // Proof of Compensation
  doc.setFontSize(14);
  doc.text(`${userName}'s Proof of Compensation`, 14, 122);
  doc.setFontSize(12);
  doc.text(`Trees Donated: ${proof.trees}`, 14, 128);
  doc.text(`Volunteer Hours: ${proof.volunteerHours}`, 14, 134);
  doc.text(`Status: ${proof.status}`, 14, 140);
  if (proof.comment) {
    doc.text(`Comment: ${proof.comment}`, 14, 146);
  }

  // Compensation Details Table
  autoTable(doc, {
    startY: 152,
    head: [["Type", "CO2 (kg)", "Trees/Hours", "Price"]],
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
