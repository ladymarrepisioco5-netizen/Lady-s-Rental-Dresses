import jsPDF from 'jspdf';
import { Booking } from '../types.ts';

export function generateReceiptPdf(booking: Booking, isVerifiedReceipt: boolean = false): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Background Header Bar (Deep Charcoal / Black Luxury)
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line (Rose Gold / Hot Pink)
  doc.setDrawColor(244, 114, 182); // Hot Pink / Blush
  doc.setLineWidth(1.2);
  doc.line(0, 42, pageWidth, 42);

  // Boutique Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text("LADY'S RENTAL", margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(212, 175, 55); // Champagne Gold
  doc.text('MAGICAL FAIRY GARDEN & HAUTE COUTURE DRESS ATELIER', margin, 24);

  doc.setTextColor(180, 180, 190);
  doc.setFontSize(8);
  doc.text('Bonifacio High Street, BGC, Taguig, Metro Manila | concierge@ladysrental.com | +63 (917) 842-5239', margin, 30);

  // Document Type Badge
  const isPaid = isVerifiedReceipt || booking.status === 'Payment Verified' || booking.status === 'Confirmed' || booking.status === 'Returned';
  const badgeText = isPaid ? 'OFFICIAL RENTAL RECEIPT — PAID' : 'BOOKING CONFIRMATION & PAYMENT PENDING';
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  if (isPaid) {
    doc.setFillColor(16, 185, 129); // Emerald Green
  } else {
    doc.setFillColor(234, 179, 8); // Amber
  }
  doc.setTextColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 72, 12, 72, 8, 2, 2, 'F');
  doc.text(badgeText, pageWidth - margin - 70, 17.5);

  // Booking & Receipt Reference Numbers
  let y = 52;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 35);

  const receiptNum = booking.receiptNumber || `LR-REC-2026-${booking.id.replace('LR-BK-', '')}`;
  doc.text(`Receipt #: ${receiptNum}`, margin, y);
  doc.text(`Booking Ref: ${booking.id}`, margin + 80, y);
  doc.text(`Date Issued: ${new Date(booking.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}`, margin + 140, y);

  // Divider
  y += 5;
  doc.setDrawColor(220, 220, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  // Two Column Details: Customer Information & Rental Event Details
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(244, 114, 182); // Brand Pink
  doc.text('CUSTOMER INFORMATION', margin, y);
  doc.text('RENTAL EVENT DETAILS', margin + 90, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 65);

  // Customer column
  doc.text(`Name: ${booking.customerName}`, margin, y);
  doc.text(`Email: ${booking.customerEmail}`, margin, y + 5);
  doc.text(`Contact: ${booking.customerPhone}`, margin, y + 10);
  const deliveryType = booking.deliveryOption === 'boutique_fitting_pickup' ? 'Boutique Showroom Pickup' : 'Courier Doorstep Delivery';
  doc.text(`Delivery Method: ${deliveryType}`, margin, y + 15);
  if (booking.deliveryAddress) {
    const splitAddr = doc.splitTextToSize(`Address: ${booking.deliveryAddress}${booking.cityMunicipality ? ', ' + booking.cityMunicipality : ''}`, 80);
    doc.text(splitAddr, margin, y + 20);
  }

  // Rental details column
  doc.text(`Dress Silhouette: ${booking.dressName}`, margin + 90, y);
  doc.text(`Inventory ID: ${booking.dressId}`, margin + 90, y + 5);
  doc.text(`Selected Size: ${booking.size}`, margin + 90, y + 10);
  doc.text(`Standard Rental Period: ${booking.durationDays || 3} Days`, margin + 90, y + 15);
  doc.text(`Start / Delivery Date: ${booking.startDate}`, margin + 90, y + 20);
  doc.text(`Scheduled Return Date: ${booking.endDate}`, margin + 90, y + 25);

  // Itemized Pricing Table
  y += 38;
  doc.setFillColor(245, 245, 248);
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 35);
  doc.text('ITEM DESCRIPTION', margin + 4, y + 4.8);
  doc.text('DURATION', margin + 85, y + 4.8);
  doc.text('UNIT (PHP)', margin + 115, y + 4.8);
  doc.text('AMOUNT (PHP)', pageWidth - margin - 26, y + 4.8);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 55);

  // Line 1: Dress Rental
  doc.text(`${booking.dressName} (Size ${booking.size})`, margin + 4, y + 5);
  doc.text(`${booking.durationDays || 3} Days`, margin + 85, y + 5);
  doc.text(`PHP ${(booking.rentalPrice || 0).toLocaleString()}`, margin + 115, y + 5);
  doc.text(`PHP ${(booking.rentalPrice || 0).toLocaleString()}`, pageWidth - margin - 26, y + 5);

  // Line 2: Security Deposit
  y += 7;
  doc.text('Refundable Security Guarantee Deposit', margin + 4, y + 5);
  doc.text('Refundable', margin + 85, y + 5);
  doc.text(`PHP ${(booking.depositAmount || 0).toLocaleString()}`, margin + 115, y + 5);
  doc.text(`PHP ${(booking.depositAmount || 0).toLocaleString()}`, pageWidth - margin - 26, y + 5);

  // Line 3: Sanitization & Care
  y += 7;
  doc.text('Eco-Friendly Sanitization, Steam Press & Care Coverage', margin + 4, y + 5);
  doc.text('Included', margin + 85, y + 5);
  doc.text('PHP 0.00', margin + 115, y + 5);
  doc.text('PHP 0.00', pageWidth - margin - 26, y + 5);

  // Line 4: Loyalty Reward / Voucher discount if any
  if (booking.discountAmount && booking.discountAmount > 0) {
    y += 7;
    doc.setTextColor(219, 39, 119); // Pink
    doc.text(`VIP Loyalty Privilege Applied (${booking.loyaltyRewardApplied || 'Milestone Voucher'})`, margin + 4, y + 5);
    doc.text('Discount', margin + 85, y + 5);
    doc.text(`-PHP ${booking.discountAmount.toLocaleString()}`, margin + 115, y + 5);
    doc.text(`-PHP ${booking.discountAmount.toLocaleString()}`, pageWidth - margin - 26, y + 5);
    doc.setTextColor(50, 50, 55);
  }

  // Subtotal & Total Box
  y += 10;
  doc.setDrawColor(220, 220, 225);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Total Invoice Amount:', margin + 110, y + 3);
  doc.text(`PHP ${(booking.totalAmount || 0).toLocaleString()}`, pageWidth - margin - 26, y + 3);

  y += 6;
  doc.text('Verified Payment Received:', margin + 110, y + 3);
  const paidAmt = booking.verifiedPaymentAmount || (isPaid ? booking.paymentAmount || booking.totalAmount : 0);
  doc.setTextColor(16, 185, 129);
  doc.text(`PHP ${paidAmt.toLocaleString()}`, pageWidth - margin - 26, y + 3);

  const balance = Math.max(0, (booking.totalAmount || 0) - paidAmt);
  y += 6;
  doc.setTextColor(30, 30, 35);
  doc.text('Remaining Balance Due:', margin + 110, y + 3);
  doc.text(`PHP ${balance.toLocaleString()}`, pageWidth - margin - 26, y + 3);

  // Payment Verification Box
  y += 12;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(244, 114, 182);
  doc.text('PAYMENT VERIFICATION AUDIT', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 65);
  doc.text(`Payment Method: ${booking.paymentMethod || 'GCash / Bank Transfer'}`, margin + 4, y + 10);
  doc.text(`Reference No: ${booking.paymentReference || 'Submitted in portal'}`, margin + 4, y + 15);
  doc.text(`Verification Status: ${booking.status}`, margin + 4, y + 20);

  doc.text(`Verified By: ${booking.paymentVerifiedBy || (isPaid ? 'Boutique Administrator' : 'Pending Verification')}`, margin + 85, y + 10);
  doc.text(`Verified Date: ${booking.paymentVerifiedAt ? new Date(booking.paymentVerifiedAt).toLocaleString('en-PH') : 'Under Administrator Inspection'}`, margin + 85, y + 15);
  doc.text(`Proof Screenshot: ${booking.paymentProofUrl ? 'Attached in atelier portal' : 'None provided'}`, margin + 85, y + 20);

  // Return & Care Policy
  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 35);
  doc.text('RENTAL TERMS & RETURN INSTRUCTIONS', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 90, 100);
  const termsText = [
    '1. Standard Rental Period: 3 Days (Day 1: Receipt/Delivery, Day 2: Event Day, Day 3: Scheduled Return).',
    '2. Cleaning: Complimentary professional sanitization and steaming is included. Do not wash or dry-clean dresses yourself.',
    '3. Return Procedure: Place the gown inside the provided protective garment satchel on the return date for courier handover.',
    '4. Refundable Deposit: Your security deposit is processed for release within 24-48 hours after sanitization inspection.',
    '5. VIP Loyalty Club: Completing this rental earns 1 heart stamp. Collect 5 for 50% OFF, and 10 for ONE FREE 3-DAY RENTAL.'
  ];
  let termY = y + 4.5;
  for (const term of termsText) {
    doc.text(term, margin, termY);
    termY += 4;
  }

  // Footer bar
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 285, pageWidth, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 200, 205);
  doc.text("Thank you for choosing Lady's Rental — Where Fairy Garden Whimsy Meets Luxury Fashion.", margin, 292);

  // Trigger download
  const cleanId = booking.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`LadysRental_Receipt_${cleanId}.pdf`);
}
