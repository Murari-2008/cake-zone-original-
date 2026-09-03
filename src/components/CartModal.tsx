import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, Calendar, CreditCard, ShieldCheck, Mail, CheckCircle, Tag, BadgePercent, Download, Sparkles, Smartphone, Landmark, ArrowLeft, ExternalLink } from 'lucide-react';
import { OrderItem, UserProfile } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  profile: UserProfile | null;
  onUpdateCartItemQty: (index: number, newQty: number) => void;
  onRemoveCartItem: (index: number) => void;
  onCheckout: (customerDetails: { name: string; email: string; phone: string; address: string }, redeemPoints: number, discountAmount: number) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  profile,
  onUpdateCartItemQty,
  onRemoveCartItem,
  onCheckout,
}: CartModalProps) {
  // Checkout stages: 'cart' -> 'checkout' -> 'payment' -> 'success'
  const [stage, setStage] = useState<'cart' | 'checkout' | 'payment' | 'success'>('cart');
  
  // Checkout details form state
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState('Store Pickup (Co-operative Colony Shop)');
  const [pickupTime, setPickupTime] = useState('Today - Within 2 Hours');

  // Loyalty redeem state
  const [redeemPoints, setRedeemPoints] = useState(false);

  // Promo coupon code
  const [coupon, setCoupon] = useState('');
  const [activeCouponDiscount, setActiveCouponDiscount] = useState(0); // 0.1 for 10%
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Credit Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(profile?.name || '');
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [agentCheckoutStatus, setAgentCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Razorpay states
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayStage, setRazorpayStage] = useState<'options' | 'upi' | 'card' | 'netbanking' | 'processing' | 'success'>('options');
  const [razorpayUpi, setRazorpayUpi] = useState('success@razorpay');
  const [razorpayCardNo, setRazorpayCardNo] = useState('');
  const [razorpayCardExp, setRazorpayCardExp] = useState('');
  const [razorpayCardCvv, setRazorpayCardCvv] = useState('');
  const [razorpayBank, setRazorpayBank] = useState('HDFC Bank');

  // Success states to preserve cart values after checkout clears cartItems
  const [successItems, setSuccessItems] = useState<OrderItem[]>([]);
  const [successSubtotal, setSuccessSubtotal] = useState(0);
  const [successCouponDiscountSum, setSuccessCouponDiscountSum] = useState(0);
  const [successLoyaltyDiscountSum, setSuccessLoyaltyDiscountSum] = useState(0);
  const [successTotalAmount, setSuccessTotalAmount] = useState(0);
  const [successRedeemedPoints, setSuccessRedeemedPoints] = useState(0);

  // Auto-fill client contact info from any custom cake message in the cart
  React.useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      cartItems.forEach(item => {
        if (item.customMessage) {
          const nameMatch = item.customMessage.match(/Preorder Client:\s*([^|]+)/i);
          const phoneMatch = item.customMessage.match(/WhatsApp:\s*([^|]+)/i);
          const mailMatch = item.customMessage.match(/Mail:\s*([^|]+)/i);
          if (nameMatch && nameMatch[1].trim()) setName(nameMatch[1].trim());
          if (phoneMatch && phoneMatch[1].trim()) setPhone(phoneMatch[1].trim());
          if (mailMatch && mailMatch[1].trim()) setEmail(mailMatch[1].trim());
        }
      });
    }
  }, [isOpen, cartItems]);

  // Email Notification simulator state
  const [emailNotificationSent, setEmailNotificationSent] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Calculators
  const subtotal = cartItems.reduce((acc, it) => acc + (it.menuItem.price * it.quantity), 0);
  
  // Parse custom cake discounts if present in cartItems
  let customLoyaltyPoints = 0;
  let customCouponDiscount = 0;
  cartItems.forEach(item => {
    if (item.customMessage) {
      const ptsMatch = item.customMessage.match(/Points Redeemed:\s*(\d+)/i);
      if (ptsMatch) {
        customLoyaltyPoints += parseInt(ptsMatch[1], 10) * item.quantity;
      }
      const codeMatch = item.customMessage.match(/Code:\s*[A-Z0-9]+\s*\(-₹(\d+)\)/i);
      if (codeMatch) {
        customCouponDiscount += parseInt(codeMatch[1], 10) * item.quantity;
      }
    }
  });

  const couponDiscountSum = customCouponDiscount > 0 ? customCouponDiscount : Math.floor(subtotal * activeCouponDiscount);
  
  // Loyalty discount sum
  const pointsToRedeem = customLoyaltyPoints > 0 ? customLoyaltyPoints : (redeemPoints ? Math.min(profile?.loyaltyPoints || 0, subtotal - couponDiscountSum) : 0);
  const loyaltyDiscountSum = customLoyaltyPoints > 0 ? customLoyaltyPoints : (pointsToRedeem * 1); // 1 Rs per point

  const totalAmount = Math.max(0, subtotal - couponDiscountSum - loyaltyDiscountSum);
  const totalEarnedPoints = Math.floor(totalAmount / 100);

  // Apply code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'KADAPATREAT') {
      setActiveCouponDiscount(0.15); // 15% discount code!
      setCouponSuccess('15% Promo Coupon Applied: KADAPATREAT');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try subscribing to newsletter for KADAPATREAT promo.');
      setCouponSuccess('');
    }
  };

  const handleDownloadBill = () => {
    const finalOrderId = confirmedOrderId || `CZ-${Date.now().toString().slice(-6)}`;
    const dateStr = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsToRender = stage === 'success' && successItems.length > 0 ? successItems : cartItems;
    const finalSubtotal = stage === 'success' && successItems.length > 0 ? successSubtotal : subtotal;
    const finalCouponDiscount = stage === 'success' && successItems.length > 0 ? successCouponDiscountSum : couponDiscountSum;
    const finalLoyaltyDiscount = stage === 'success' && successItems.length > 0 ? successLoyaltyDiscountSum : loyaltyDiscountSum;
    const finalTotalAmount = stage === 'success' && successItems.length > 0 ? successTotalAmount : totalAmount;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1150;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable high quality text rendering
    ctx.textBaseline = 'top';

    // 1. Background
    ctx.fillStyle = '#FDFBF7';
    ctx.fillRect(0, 0, 800, 1150);

    // 2. Outer border with gold touch
    ctx.strokeStyle = '#D9A05B';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 760, 1110);
    
    ctx.strokeStyle = '#3E2723';
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, 748, 1098);

    // Ornament corner designs
    const drawCorner = (x: number, y: number, xDir: number, yDir: number) => {
      ctx.fillStyle = '#D9A05B';
      ctx.fillRect(x, y, xDir * 35, yDir * 6);
      ctx.fillRect(x, y, xDir * 6, yDir * 35);
    };
    drawCorner(26, 26, 1, 1);
    drawCorner(774, 26, -1, 1);
    drawCorner(26, 1124, 1, -1);
    drawCorner(774, 1124, -1, -1);

    // Header Content
    ctx.textAlign = 'center';
    
    // Logo Icon badge
    ctx.beginPath();
    ctx.arc(400, 85, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#3E2723';
    ctx.fill();
    
    ctx.fillStyle = '#FDFBF7';
    ctx.font = 'bold 32px serif';
    ctx.fillText('🍰', 374, 66);

    // Store Name
    ctx.fillStyle = '#3E2723';
    ctx.font = 'bold 36px Times New Roman, Georgia, serif';
    ctx.fillText('CAKE ZONE KADAPA', 400, 135);

    // Subtitle Address
    ctx.fillStyle = '#78716C';
    ctx.font = '16px Arial, Helvetica, sans-serif';
    ctx.fillText('Opposite State Bank, Co-operative Colony, Kadapa', 400, 180);
    ctx.fillText('Phone: 7396500338 | 9014384008', 400, 202);

    // Divider
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 235);
    ctx.lineTo(750, 235);
    ctx.stroke();

    // RECEIPT Title banner
    ctx.fillStyle = '#F5EBE0';
    ctx.fillRect(280, 250, 240, 36);
    ctx.strokeStyle = '#D9A05B';
    ctx.lineWidth = 1;
    ctx.strokeRect(280, 250, 240, 36);
    
    ctx.fillStyle = '#3E2723';
    ctx.font = 'bold 15px Arial, Helvetica, sans-serif';
    ctx.fillText('PRE-ORDER RECEIPT', 400, 260);

    // Metadata Details
    ctx.textAlign = 'left';
    ctx.fillStyle = '#44403C';
    ctx.font = 'bold 14px Arial, Helvetica, sans-serif';
    
    // Left column metadata
    ctx.fillText('ORDER DETAILS:', 60, 310);
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#57534E';
    ctx.fillText('Order ID:', 60, 335);
    ctx.fillText('Date & Time:', 60, 360);
    ctx.fillText('Pickup Location:', 60, 385);

    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(finalOrderId, 180, 335);
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText(dateStr, 180, 360);
    ctx.fillText('Opposite State Bank, Kadapa', 180, 385);

    // Right column metadata
    ctx.fillStyle = '#44403C';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText('CUSTOMER DETAILS:', 440, 310);
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#57534E';
    ctx.fillText('Name:', 440, 335);
    ctx.fillText('Phone:', 440, 360);
    ctx.fillText('Email:', 440, 385);

    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText(name || 'Valued Customer', 510, 335);
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText(phone || 'N/A', 510, 360);
    ctx.fillText(email || 'N/A', 510, 385);

    // Divider
    ctx.strokeStyle = '#D9A05B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 420);
    ctx.lineTo(750, 420);
    ctx.stroke();

    // Table Headers
    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText('#   ITEM DESCRIPTION', 60, 435);
    ctx.textAlign = 'right';
    ctx.fillText('QTY', 560, 435);
    ctx.fillText('UNIT PRICE', 660, 435);
    ctx.fillText('TOTAL', 740, 435);

    // Underline table header
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 455);
    ctx.lineTo(750, 455);
    ctx.stroke();

    // Render items
    let currentY = 470;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1C1917';
    
    itemsToRender.forEach((item, index) => {
      // Index and Name
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.fillText(`${index + 1}.  ${item.menuItem.name}`, 60, currentY);
      
      // Qty & Prices
      ctx.textAlign = 'right';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText(item.quantity.toString(), 560, currentY);
      ctx.fillText(`₹${item.menuItem.price}`, 660, currentY);
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.fillText(`₹${item.menuItem.price * item.quantity}`, 740, currentY);

      currentY += 22;

      // Wrap and render description if present
      if (item.menuItem.description) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#6B5F55';
        ctx.font = '11px Arial, sans-serif';
        
        const descWords = item.menuItem.description.split(' ');
        let currentDescLine = '   Desc: ';
        const descLines: string[] = [];
        
        for (let w = 0; w < descWords.length; w++) {
          const testLine = currentDescLine + (currentDescLine === '   Desc: ' ? '' : ' ') + descWords[w];
          if (ctx.measureText(testLine).width < 660) {
            currentDescLine = testLine;
          } else {
            descLines.push(currentDescLine);
            currentDescLine = '         ' + descWords[w];
          }
        }
        if (currentDescLine) {
          descLines.push(currentDescLine);
        }
        
        descLines.forEach((ld) => {
          ctx.fillText(ld, 60, currentY);
          currentY += 16;
        });
      }

      // Wrap and render custom message / curated specifications if present
      if (item.customMessage) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#B45309';
        ctx.font = 'italic 11px Arial, sans-serif';
        
        const parts = item.customMessage.split(' | ');
        let currentSpecLine = '   Specs: ';
        const specLines: string[] = [];
        
        parts.forEach((p) => {
          const specText = p.trim();
          if (!specText) return;
          const testLine = currentSpecLine + (currentSpecLine === '   Specs: ' ? '' : ' • ') + specText;
          if (ctx.measureText(testLine).width < 660) {
            currentSpecLine = testLine;
          } else {
            specLines.push(currentSpecLine);
            currentSpecLine = '          • ' + specText;
          }
        });
        if (currentSpecLine) {
          specLines.push(currentSpecLine);
        }
        
        specLines.forEach((ld) => {
          ctx.fillText(ld, 60, currentY);
          currentY += 16;
        });
      }

      currentY += 6;
    });

    // Spacer or divider before totals
    currentY = Math.max(currentY, 630);
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, currentY);
    ctx.lineTo(750, currentY);
    ctx.stroke();
    currentY += 20;

    // Totals Block
    const rightColX = 740;
    
    // Cake Amount (Base item amount before loyalty discounts)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#57534E';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText('Cake Amount (Base Total):', 320, currentY);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText(`₹${finalSubtotal}`, rightColX, currentY);
    currentY += 26;

    if (finalLoyaltyDiscount > 0) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#78716C';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText('Loyalty Points Redeemed:', 320, currentY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#991B1B';
      ctx.fillText(`-₹${finalLoyaltyDiscount}`, rightColX, currentY);
      currentY += 26;
    }

    if (finalCouponDiscount > 0) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#78716C';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText('Coupon Discount:', 320, currentY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#991B1B';
      ctx.fillText(`-₹${finalCouponDiscount}`, rightColX, currentY);
      currentY += 26;
    }

    // Grand Total Box
    ctx.fillStyle = '#FDF6E2';
    ctx.fillRect(300, currentY - 6, 460, 38);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.strokeRect(300, currentY - 6, 460, 38);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.fillText('GRAND TOTAL:', 320, currentY + 5);
    ctx.textAlign = 'right';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`₹${finalTotalAmount}`, rightColX, currentY + 5);
    currentY += 46;

    // Money Paid in Advance (50% Deposit)
    const advancePaid = Math.round(finalTotalAmount / 2);
    const balanceDue = finalTotalAmount - advancePaid;

    ctx.fillStyle = '#ECFDF5';
    ctx.fillRect(300, currentY - 6, 460, 34);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1;
    ctx.strokeRect(300, currentY - 6, 460, 34);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText('Money Paid in Advance (50% Deposit):', 320, currentY + 4);
    ctx.textAlign = 'right';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`₹${advancePaid}`, rightColX, currentY + 4);
    currentY += 40;

    // Balance Due
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(300, currentY - 6, 460, 34);
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(300, currentY - 6, 460, 34);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText('Balance Due at Store Pickup:', 320, currentY + 4);
    ctx.textAlign = 'right';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`₹${balanceDue}`, rightColX, currentY + 4);
    currentY += 56;

    // Footer lines
    ctx.textAlign = 'center';
    ctx.fillStyle = '#78716C';
    ctx.font = 'italic 13px Times New Roman, Georgia, serif';
    ctx.fillText('Thank you for choosing Cake Zone Kadapa!', 400, currentY);
    ctx.fillText('Your grand celebration deserves the finest bespoke cakes.', 400, currentY + 20);
    
    // Tiny system confirmation
    ctx.fillStyle = '#A8A29E';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('TRANSACTION SECURED • SENT TO OWNER', 400, currentY + 48);

    // 5. Trigger download of png
    const dataUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = `CakeZone_Bill_${finalOrderId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleProceedCheckout = () => {
    setCheckoutError('');
    const genId = 'CZ-' + Date.now().toString().slice(-6);
    setConfirmedOrderId(genId);

    // Capture success states
    setSuccessItems([...cartItems]);
    setSuccessSubtotal(subtotal);
    setSuccessCouponDiscountSum(couponDiscountSum);
    setSuccessLoyaltyDiscountSum(loyaltyDiscountSum);
    setSuccessTotalAmount(totalAmount);
    setSuccessRedeemedPoints(pointsToRedeem);

    setStage('success');
    
    // Simulate confirmation notification
    setEmailNotificationSent(true);
    setTimeout(() => setEmailNotificationSent(false), 6000);

    const customerName = name && name.trim() ? name : (profile?.name || 'Valued Customer');
    const customerEmail = email && email.trim() ? email : (profile?.email || 'customer@example.com');
    const customerPhone = phone && phone.trim() ? phone : (profile?.phone || '7396500338');

    onCheckout(
      { name: customerName, email: customerEmail, phone: customerPhone, address },
      pointsToRedeem,
      couponDiscountSum + loyaltyDiscountSum
    );
  };

  // Unified payment completion routine
  const finalizeOrderPayment = (forcedTotal?: number, forcedLoyalty?: number) => {
    const genId = 'CZ-' + Date.now().toString().slice(-6);
    setConfirmedOrderId(genId);

    const activeTotal = typeof forcedTotal === 'number' ? forcedTotal : totalAmount;
    const activeLoyalty = typeof forcedLoyalty === 'number' ? forcedLoyalty : loyaltyDiscountSum;

    // Capture success states
    setSuccessItems([...cartItems]);
    setSuccessSubtotal(subtotal);
    setSuccessCouponDiscountSum(couponDiscountSum);
    setSuccessLoyaltyDiscountSum(activeLoyalty);
    setSuccessTotalAmount(activeTotal);
    setSuccessRedeemedPoints(pointsToRedeem);

    setStage('success');
    
    // Simulate confirmation email pushing immediately
    setEmailNotificationSent(true);
    setTimeout(() => setEmailNotificationSent(false), 6000);

    const customerName = name && name.trim() ? name : (profile?.name || 'Valued Customer');
    const customerEmail = email && email.trim() ? email : (profile?.email || 'customer@example.com');
    const customerPhone = phone && phone.trim() ? phone : (profile?.phone || '7396500338');

    onCheckout(
      { name: customerName, email: customerEmail, phone: customerPhone, address },
      pointsToRedeem,
      couponDiscountSum + activeLoyalty
    );

    // Trigger our dual success/download animations automatically!
    setAgentCheckoutStatus('success');
    setTimeout(() => {
      setAgentCheckoutStatus('idle');
      // Auto-trigger invoice download after success animations resolve
      setTimeout(() => {
        const btn = document.getElementById('btn-download-bill');
        if (btn) {
          btn.click();
        } else {
          handleDownloadBill();
        }
      }, 300);
    }, 1600);
  };

  // Card payment trigger (opens the Razorpay widget instead of direct checkout)
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 16) {
      setPaymentError('Kindly enter a valid 16-digit credit card number.');
      return;
    }
    if (cardExpiry.length < 4 || !cardExpiry.includes('/')) {
      setPaymentError('Enter correct expiry format (MM/YY).');
      return;
    }
    if (cardCvv.length < 3) {
      setPaymentError('Secure CVV must be 3 digits.');
      return;
    }
    setPaymentError('');
    
    // Launch Razorpay with Card method pre-filled!
    setRazorpayCardNo(cardNumber);
    setRazorpayCardExp(cardExpiry);
    setRazorpayCardCvv(cardCvv);
    setRazorpayStage('card');
    setShowRazorpay(true);
  };

  useEffect(() => {
    (window as any).__triggerCheckout = async (opts: {
      name: string;
      email: string;
      phone: string;
      address: string;
      redeemPoints: boolean;
    }) => {
      setName(opts.name);
      setEmail(opts.email);
      setPhone(opts.phone);
      setAddress(opts.address);
      setRedeemPoints(opts.redeemPoints);

      const parsedLoyalty = opts.redeemPoints ? Math.min(profile?.loyaltyPoints || 0, subtotal - couponDiscountSum) : 0;
      const finalTotal = Math.max(0, subtotal - couponDiscountSum - parsedLoyalty);

      // Open Razorpay Popup
      setShowRazorpay(true);
      setRazorpayStage('options');

      // Step 1: Auto-select UPI option
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRazorpayStage('upi');

      // Step 2: Auto-submit success@razorpay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRazorpayStage('processing');

      // Step 3: Razorpay Test Success Confirmation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setRazorpayStage('success');

      // Step 4: Hide Razorpay and finalize order details
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setShowRazorpay(false);

      finalizeOrderPayment(finalTotal, parsedLoyalty);

      return {
        success: true,
        message: "Order checked out successfully! Downloading bill."
      };
    };

    return () => {
      delete (window as any).__triggerCheckout;
    };
  }, [
    setName, setEmail, setPhone, setAddress, setRedeemPoints,
    subtotal, couponDiscountSum, cartItems, profile, onCheckout, handleDownloadBill
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      
      {/* Dynamic Push Email Notification Toast floating on top right */}
      <AnimatePresence>
        {emailNotificationSent && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-6 right-6 bg-amber-950 text-amber-50 border border-amber-800 p-4 rounded-2xl shadow-2xl max-w-sm z-[99] flex gap-3.5 items-start"
          >
            <div className="bg-amber-800 p-2 rounded-xl text-amber-100">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif font-bold text-xs">Automated Mail Triggered</h5>
              <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                Pre-order confirmation receipt copy dispatched successfully to <strong className="text-white">{email}</strong>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col justify-between overflow-hidden shadow-2xl border border-stone-100 relative">
        
        {/* WebMCP order status overlay animation */}
        <AnimatePresence>
          {agentCheckoutStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-50/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center"
            >
              {agentCheckoutStatus === 'processing' ? (
                <div className="space-y-6">
                  {/* Rotating Cake/Baking loader animation */}
                  <div className="relative w-24 h-24 mx-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-amber-900/10 border-t-amber-900"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-amber-800 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-black text-amber-950">Processing Order...</h3>
                    <p className="text-stone-500 text-sm max-w-md mx-auto">
                      Securing custom cake specifications, verifying available stock ingredients, and authorizing premium loyalty points...
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-amber-900/60 font-mono text-[10px] tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 bg-amber-900 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-amber-900 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-amber-900 rounded-full animate-bounce delay-200" />
                    <span>Agent Automated Ingestion</span>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-lg">
                    <CheckCircle className="w-12 h-12 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-3xl font-black text-stone-900">Success!</h3>
                    <p className="text-emerald-700 font-semibold text-sm max-w-sm mx-auto">
                      All systems green! Generating your premium invoice bill and initiating automated download...
                    </p>
                  </div>
                  <div className="inline-block bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100">
                    CZ-{confirmedOrderId || 'RECEIPT'}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Simulated Razorpay Test Mode checkout popup */}
        <AnimatePresence>
          {showRazorpay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs z-[45] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-2xl w-full max-w-[380px] overflow-hidden shadow-2xl border border-stone-100 flex flex-col font-sans"
              >
                {/* Razorpay Brand Header */}
                <div className="bg-[#1c2536] text-white px-5 py-4 flex flex-col relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] tracking-wider uppercase font-extrabold text-blue-400 font-mono">
                      Razorpay <span className="bg-amber-500 text-slate-950 font-sans text-[8px] px-1 py-0.5 rounded ml-1 font-bold">TEST MODE</span>
                    </span>
                    <button 
                      onClick={() => setShowRazorpay(false)} 
                      className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-baseline mt-2">
                    <div>
                      <h4 className="font-bold text-sm text-stone-100 leading-tight">Cake Zone Kadapa</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5 font-mono">Pre-order Checkout</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 font-mono block">Amount to pay</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Razorpay Body Options */}
                <div className="p-5 flex-1 overflow-y-auto max-h-[380px] space-y-4">
                  
                  {razorpayStage === 'options' && (
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider font-mono">Preferred Payment Methods</p>
                      
                      <button
                        onClick={() => setRazorpayStage('upi')}
                        className="w-full flex items-center justify-between p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200/60 rounded-xl transition-all active:scale-[0.99] text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-100">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-stone-800">UPI (GPay, PhonePe, Paytm)</span>
                            <span className="block text-[10px] text-stone-400">Pay instantly using success@razorpay</span>
                          </div>
                        </div>
                        <span className="text-stone-400 text-xs">➔</span>
                      </button>

                      <button
                        onClick={() => setRazorpayStage('card')}
                        className="w-full flex items-center justify-between p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200/60 rounded-xl transition-all active:scale-[0.99] text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-50 text-purple-600 p-2 rounded-lg group-hover:bg-purple-100">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-stone-800">Credit / Debit Cards</span>
                            <span className="block text-[10px] text-stone-400">Visa, MasterCard, RuPay, Maestro</span>
                          </div>
                        </div>
                        <span className="text-stone-400 text-xs">➔</span>
                      </button>

                      <button
                        onClick={() => setRazorpayStage('netbanking')}
                        className="w-full flex items-center justify-between p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200/60 rounded-xl transition-all active:scale-[0.99] text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-100">
                            <Landmark className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-stone-800">Netbanking</span>
                            <span className="block text-[10px] text-stone-400">All Indian major banks supported</span>
                          </div>
                        </div>
                        <span className="text-stone-400 text-xs">➔</span>
                      </button>
                    </div>
                  )}

                  {razorpayStage === 'upi' && (
                    <div className="space-y-4">
                      <button 
                        onClick={() => setRazorpayStage('options')}
                        className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to options
                      </button>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono uppercase font-bold text-stone-500">Enter UPI ID / VPA</label>
                        <input
                          type="text"
                          value={razorpayUpi}
                          onChange={(e) => setRazorpayUpi(e.target.value)}
                          placeholder="e.g. success@razorpay"
                          className="w-full bg-white border border-stone-200 px-3 py-2 rounded-lg text-sm text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-[10px] text-stone-400 leading-normal font-sans">
                          Use <strong className="text-emerald-600 font-mono">success@razorpay</strong> to simulate a guaranteed successful UPI transaction flow.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setRazorpayStage('processing');
                          setTimeout(() => {
                            setRazorpayStage('success');
                            setTimeout(() => {
                              setShowRazorpay(false);
                              finalizeOrderPayment();
                            }, 1500);
                          }, 1400);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow cursor-pointer uppercase tracking-wider"
                      >
                        Pay ₹{totalAmount}
                      </button>
                    </div>
                  )}

                  {razorpayStage === 'card' && (
                    <div className="space-y-4">
                      <button 
                        onClick={() => setRazorpayStage('options')}
                        className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to options
                      </button>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-0.5">Card Number</label>
                          <input
                            type="text"
                            maxLength={16}
                            value={razorpayCardNo || cardNumber}
                            onChange={(e) => setRazorpayCardNo(e.target.value.replace(/\D/g, ''))}
                            placeholder="4321 8765 9012 3456"
                            className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs text-stone-900 font-mono focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-0.5">Expiry</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={razorpayCardExp || cardExpiry}
                              onChange={(e) => setRazorpayCardExp(e.target.value)}
                              placeholder="12/28"
                              className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs text-stone-900 font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-0.5">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={razorpayCardCvv || cardCvv}
                              onChange={(e) => setRazorpayCardCvv(e.target.value.replace(/\D/g, ''))}
                              placeholder="999"
                              className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs text-stone-900 font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-stone-400 leading-normal">
                          Test Mode simulates instant bank payment authorization securely.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setRazorpayStage('processing');
                          setTimeout(() => {
                            setRazorpayStage('success');
                            setTimeout(() => {
                              setShowRazorpay(false);
                              finalizeOrderPayment();
                            }, 1500);
                          }, 1400);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow cursor-pointer uppercase tracking-wider"
                      >
                        Pay ₹{totalAmount}
                      </button>
                    </div>
                  )}

                  {razorpayStage === 'netbanking' && (
                    <div className="space-y-4">
                      <button 
                        onClick={() => setRazorpayStage('options')}
                        className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to options
                      </button>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono uppercase font-bold text-stone-500">Select Bank</label>
                        <select
                          value={razorpayBank}
                          onChange={(e) => setRazorpayBank(e.target.value)}
                          className="w-full bg-white border border-stone-200 px-3 py-2 rounded-lg text-xs text-stone-900 focus:outline-none"
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        </select>
                        <p className="text-[10px] text-stone-400 leading-normal">
                          Simulates bank portal authorization inside a secure external web view.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setRazorpayStage('processing');
                          setTimeout(() => {
                            setRazorpayStage('success');
                            setTimeout(() => {
                              setShowRazorpay(false);
                              finalizeOrderPayment();
                            }, 1500);
                          }, 1400);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow cursor-pointer uppercase tracking-wider"
                      >
                        Pay ₹{totalAmount}
                      </button>
                    </div>
                  )}

                  {razorpayStage === 'processing' && (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-stone-800">Processing payment...</p>
                        <p className="text-[10px] text-stone-400 max-w-xs mx-auto leading-normal">
                          Do not close this window or hit back. Contacting card issuer bank gateway securely...
                        </p>
                      </div>
                    </div>
                  )}

                  {razorpayStage === 'success' && (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-wider font-mono">Test Payment Successful!</p>
                        <p className="text-[10px] text-emerald-600 font-bold max-w-xs mx-auto">
                          Razorpay Reference Token Authenticated
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Razorpay Footer */}
                <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[9px] text-stone-400">
                  <span className="font-mono">Secured by Razorpay API</span>
                  <span className="flex items-center gap-0.5">
                    PCI-DSS Compliance <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-stone-50 flex justify-between items-center bg-stone-50/50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-900" />
            <h3 className="font-serif text-lg font-extrabold text-amber-950">
              {stage === 'cart' && 'Your Sweet Order Basket'}
              {stage === 'checkout' && 'Pre-order Contact Information'}
              {stage === 'payment' && 'Secure Pre-order Payment Gateway'}
              {stage === 'success' && 'Pre-order Confirmed! 🎉'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core content scrolling block */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* STAGE 1: CART VIEW */}
          {stage === 'cart' && (
            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <p className="text-stone-500 text-sm font-sans">Your order basket is empty. Choose delicious treats from our catalogue first!</p>
                  <button onClick={onClose} className="bg-amber-900 text-white font-medium text-xs px-4 py-2 rounded-xl">
                    Explore Cake Zone Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 border-b border-stone-50 pb-4 items-center justify-between">
                      <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs text-stone-900 truncate">{item.menuItem.name}</h4>
                        <span className="text-[10px] text-amber-900 font-mono tracking-wider">{item.menuItem.category}</span>
                        {item.customMessage && (
                          <p className="text-[10px] text-stone-500 italic font-serif">
                            Icing: "{item.customMessage}"
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-stone-100 rounded-lg px-2 py-1">
                        <button
                          onClick={() => onUpdateCartItemQty(idx, item.quantity - 1)}
                          className="font-bold text-xs px-1 text-stone-500 hover:text-stone-900"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateCartItemQty(idx, item.quantity + 1)}
                          className="font-bold text-xs px-1 text-stone-500 hover:text-stone-900 text-stone-900"
                          disabled={item.quantity >= item.menuItem.inStock}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total pricing / Delete */}
                      <div className="text-right shrink-0">
                        <p className="text-xs font-mono text-stone-900 font-bold">₹{item.menuItem.price * item.quantity}</p>
                        <button onClick={() => onRemoveCartItem(idx)} className="text-[10px] text-stone-400 hover:text-red-600 font-medium inline-flex items-center gap-0.5 mt-0.5">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}


                </div>
              )}
            </div>
          )}

          {/* STAGE 2: CONTACT INFORMATION */}
          {stage === 'checkout' && (
            <div className="space-y-4 text-xs font-medium text-stone-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-stone-900 text-sm focus:ring-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1">Confirmation Email (Automatic Receipt sent here)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-stone-900 text-sm focus:ring-1 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1">Phone Number (Required for confirmation call)</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-stone-900 text-sm focus:ring-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1">Pickup Mode</label>
                <select
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-stone-900 text-sm focus:ring-1 focus:outline-none"
                >
                  <option value="Store Pickup (Co-operative Colony Shop)">Pickup at Co-operative Colony, Kadapa shop</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1">Desired Pre-order Pick-up Date & Time</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder="e.g., Tomorrow at 4:30 PM (or specify time)"
                    className="w-full bg-white border border-stone-200 pl-10 pr-4 py-2 rounded-xl text-stone-900 text-sm focus:ring-1 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone-400 font-mono mt-1">
                  We require minimum 1-2 hours of baking time for fresh cool cakes.
                </p>
              </div>

              {checkoutError && (
                <p className="text-red-500 font-bold font-mono text-[10px] mt-2 bg-red-50 border border-red-200 p-2.5 rounded-xl">
                  ⚠️ {checkoutError}
                </p>
              )}
            </div>
          )}

          {/* STAGE 3: CREDENTIALS PAYMENT TRANSACTION */}
          {stage === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs font-semibold text-stone-700">
              
              <div className="bg-amber-900 text-amber-50 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-mono uppercase opacity-75">Payable pre-order total</p>
                  <span className="text-2xl font-serif font-black">₹{totalAmount}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-amber-800 text-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Secure checkout
                  </span>
                  <div className="text-[10px] mt-1 text-emerald-300 font-semibold flex items-center gap-1 font-sans justify-end">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PCI-DSS Shield Encrypted
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                
                {/* Razorpay instant checkout shortcut banner */}
                <div className="bg-blue-50/60 hover:bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-800 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-black text-blue-900 font-sans">Razorpay Instant Gateway</p>
                      <p className="text-[10px] text-stone-500 font-normal">Skip card fields & pay instantly with UPI or Netbanking</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRazorpayStage('options');
                      setShowRazorpay(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    Open Gateway
                  </button>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-4 text-stone-400 text-[10px] font-mono font-bold uppercase">Or pay via Credit Card</span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase opacity-75 mb-1 text-stone-500">Credit Card 16 Digit Number</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3.5 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      maxLength={16}
                      required
                      placeholder="4321 8765 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-stone-200 pl-10 pr-4 py-2 rounded-xl text-sm font-mono text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase opacity-75 mb-1 text-stone-500">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      maxLength={5}
                      required
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-sm font-mono text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase opacity-75 mb-1 text-stone-500">CVV Security Code (3 Digits)</label>
                    <input
                      type="password"
                      maxLength={3}
                      required
                      placeholder="999"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-sm font-mono text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase opacity-75 mb-1 text-stone-500">Cardholder Full Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-sm text-stone-900"
                  />
                </div>
              </div>

              {paymentError && (
                <p className="text-red-600 text-xs font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  ⚠️ {paymentError}
                </p>
              )}

              {isProcessing && (
                <div className="text-center py-2 text-stone-500 text-xs font-semibold animate-pulse flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-900 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-amber-900 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-amber-900 rounded-full animate-bounce delay-150" />
                  <span>Authorizing simulated card with high-security bank verification...</span>
                </div>
              )}
            </form>
          )}

          {/* STAGE 4: TRANSACTION SUCCESS GREETINGS */}
          {stage === 'success' && (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-bounce" id="success-tick-mark">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="max-w-md mx-auto px-4">
                <h4 className="font-serif font-black text-stone-900 text-lg mb-1">Thank you, {name}!</h4>
                <p className="text-emerald-700 font-bold text-sm leading-relaxed" id="success-confirmation-message">
                  Your Order Is Sent To The Owner , Please wait for confirmation mail or whatsapp message
                </p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 max-w-sm mx-auto text-left text-xs text-stone-700 space-y-2 border border-stone-100/80">
                <div className="flex justify-between">
                  <span className="text-stone-400">Order reference:</span>
                  <span className="font-mono text-stone-900 font-bold">{confirmedOrderId || `CZ-${Date.now().toString().slice(-6)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Pickup Location:</span>
                  <span className="font-bold text-stone-900">Co-operative Colony, Kadapa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Delivery Address Estimator:</span>
                  <span className="font-semibold text-stone-900">{address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Confirmation status:</span>
                  <span className="text-emerald-700 font-bold font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">SENT TO OWNER</span>
                </div>
              </div>

              {/* DOWNLOAD BILL SECTION */}
              <div className="max-w-sm mx-auto px-4 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadBill}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-download-bill"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  Download Bill (Receipt)
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Footer with pricing summary details & flow buttons */}
        {cartItems.length > 0 && stage !== 'success' && (
          <div className="px-6 py-4.5 border-t border-stone-50 bg-stone-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Live Pricing Breakdown */}
            <div className="text-xs">
              <div className="flex gap-4 text-stone-500">
                <span>Subtotal: ₹{subtotal}</span>
                {loyaltyDiscountSum > 0 && <span className="text-emerald-700">Loyalty: -₹{loyaltyDiscountSum}</span>}
                {couponDiscountSum > 0 && <span className="text-amber-800">Coupon: -₹{couponDiscountSum}</span>}
              </div>
              <div className="text-base text-stone-900 font-serif font-black flex items-center gap-1 mt-0.5">
                <span>To Pay: ₹{totalAmount}</span>
              </div>
            </div>

            {/* Stepper buttons */}
            <div className="flex gap-2">
              {stage === 'cart' && (
                <button
                  type="button"
                  onClick={() => setStage('checkout')}
                  className="bg-amber-900 hover:bg-amber-950 text-white font-semibold py-2 px-5 rounded-xl text-xs shadow-sm hover:shadow active:scale-95 transition-all text-center"
                >
                  Proceed to Details
                </button>
              )}

              {stage === 'checkout' && (
                <>
                  <button
                    type="button"
                    onClick={() => setStage('cart')}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold py-2 px-4 rounded-xl text-xs transition-all"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedCheckout}
                    className="bg-amber-900 hover:bg-amber-950 text-white font-semibold py-2 px-5 rounded-xl text-xs shadow-sm"
                  >
                    Proceed
                  </button>
                </>
              )}

              {stage === 'payment' && (
                <>
                  <button
                    type="button"
                    onClick={() => setStage('checkout')}
                    disabled={isProcessing}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold py-2 px-4 rounded-xl text-xs transition-all"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-xl text-xs shadow-sm"
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${totalAmount}`}
                  </button>
                </>
              )}
            </div>

          </div>
        )}

        {/* Done button on success */}
        {stage === 'success' && (
          <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end">
            <button
              onClick={() => {
                onClose();
                setStage('cart');
                setConfirmedOrderId('');
              }}
              className="bg-amber-900 hover:bg-amber-950 text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider uppercase"
            >
              Close Basket
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
