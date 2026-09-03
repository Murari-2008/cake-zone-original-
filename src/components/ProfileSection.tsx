import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Award, Heart, ScrollText, CheckCircle2, ChevronRight, RefreshCw, BadgePercent, ShieldCheck, Download } from 'lucide-react';
import { UserProfile, Order, MenuItem } from '../types';
import { auth, onAuthStateChanged } from '../lib/firebase';

interface ProfileSectionProps {
  profile: UserProfile | null;
  orders: Order[];
  menuItems: MenuItem[];
  onUpdateProfile: (updated: UserProfile) => void;
  onSelectMenuItem: (item: MenuItem) => void;
}

export default function ProfileSection({ profile, orders, menuItems, onUpdateProfile, onSelectMenuItem }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDownloadBill = (order: Order) => {
    const subtotal = order.items.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
    const pointsDiscount = order.loyaltyPointsSpent || 0;
    const totalAmount = order.totalAmount;

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
    ctx.fillText(order.id, 180, 335);
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText(order.date, 180, 360);
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
    ctx.fillText(order.customerName || 'Valued Customer', 510, 335);
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText(order.customerPhone || 'N/A', 510, 360);
    ctx.fillText(order.customerEmail || 'N/A', 510, 385);

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
    
    order.items.forEach((item, index) => {
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
    ctx.fillText(`₹${subtotal}`, rightColX, currentY);
    currentY += 26;

    if (pointsDiscount > 0) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#78716C';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText('Loyalty Points Redeemed:', 320, currentY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#991B1B';
      ctx.fillText(`-₹${pointsDiscount}`, rightColX, currentY);
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
    ctx.fillText(`₹${totalAmount}`, rightColX, currentY + 5);
    currentY += 46;

    // Money Paid in Advance (50% Deposit)
    const advancePaid = Math.round(totalAmount / 2);
    const balanceDue = totalAmount - advancePaid;

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
    ctx.fillText(`STATUS: ${order.status.toUpperCase()}`, 400, currentY + 48);

    // 5. Trigger download of png
    const dataUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = `CakeZone_Bill_${order.id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatar, setAvatar] = useState(profile?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
  const [loyaltyPoints, setLoyaltyPoints] = useState(profile?.loyaltyPoints || 0);
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(null);
  const [authenticatedPhoneNumber, setAuthenticatedPhoneNumber] = useState<string | null>(null);
  const [authenticatedName, setAuthenticatedName] = useState<string | null>(null);
  const [authenticatedPhotoURL, setAuthenticatedPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticatedEmail(user?.email || null);
      setAuthenticatedPhoneNumber(user?.phoneNumber || null);
      setAuthenticatedName(user?.displayName || null);
      setAuthenticatedPhotoURL(user?.photoURL || null);
      
      if (user) {
        if (user.displayName) setName(prev => prev || user.displayName || '');
        if (user.email) setEmail(prev => prev || user.email || '');
        if (user.phoneNumber) setPhone(prev => prev || user.phoneNumber || '');
        if (user.photoURL) setAvatar(prev => {
          if (prev === 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80') {
            return user.photoURL || prev;
          }
          return prev;
        });
      }
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!isEditing) {
      if (profile) {
        setName(profile.name || authenticatedName || '');
        setEmail(profile.email || authenticatedEmail || '');
        setPhone(profile.phone || authenticatedPhoneNumber || '');
        setAvatar(profile.profilePic || authenticatedPhotoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
        setLoyaltyPoints(profile.loyaltyPoints);
      } else {
        setName(authenticatedName || '');
        setEmail(authenticatedEmail || '');
        setPhone(authenticatedPhoneNumber || '');
        setAvatar(authenticatedPhotoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
        setLoyaltyPoints(0);
      }
    }
  }, [profile, isEditing, authenticatedName, authenticatedEmail, authenticatedPhoneNumber, authenticatedPhotoURL]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentProfile = profile || {
      name: name || authenticatedName || 'Guest',
      email: email || authenticatedEmail || '',
      phone: phone || authenticatedPhoneNumber || '',
      profilePic: avatar || authenticatedPhotoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      loyaltyPoints: 0,
      savedFavorites: []
    };
    onUpdateProfile({
      ...currentProfile,
      name,
      email,
      phone,
      profilePic: avatar,
      loyaltyPoints: Number(loyaltyPoints) || 0,
    });
    setTimeout(() => setIsEditing(false), 100);
  };

  const handleRefresh = () => {
    setName('');
    setPhone('');
  };

  // Determine loyalty level
  const points = profile?.loyaltyPoints || 0;
  let tier = 'Horizon';
  let tierColor = 'text-stone-700 bg-stone-50 border-stone-200';
  let tierProgress = Math.min((points / 100) * 100, 100);
  let nextTier = 'Zenith (100 pts)';

  if (points >= 300) {
    tier = 'Apex';
    tierColor = 'text-purple-700 bg-purple-50 border-purple-200';
    tierProgress = 100;
    nextTier = 'Highest Tier Achieved!';
  } else if (points >= 100) {
    tier = 'Zenith';
    tierColor = 'text-amber-700 bg-amber-50 border-amber-200';
    tierProgress = Math.min(((points - 100) / 200) * 100, 100);
    nextTier = 'Apex (300 pts)';
  }

  // Generate personalized recommendations based on past order history categories
  const orderedCategories = new Set<string>();
  orders.forEach(order => {
    order.items.forEach(it => {
      orderedCategories.add(it.menuItem.category);
    });
  });

  const recommendationList: MenuItem[] = [];
  if (orderedCategories.size === 0) {
    // Recommend top pastries and cakes
    const fallbackIds = ['cool-cake-1', 'cheesecake-mango', 'kunafa-pista'];
    menuItems.forEach(item => {
      if (fallbackIds.includes(item.id)) recommendationList.push(item);
    });
  } else {
    // Recommend items in the similar category but not yet ordered
    menuItems.forEach(item => {
      if (orderedCategories.has(item.category) && recommendationList.length < 3) {
        // checks if user has bought this specific item
        const alreadyOrdered = orders.some(o => o.items.some(it => it.menuItem.id === item.id));
        if (!alreadyOrdered) {
          recommendationList.push(item);
        }
      }
    });
    // Add backup if list is brief
    if (recommendationList.length < 3) {
      menuItems.forEach(item => {
        if (!recommendationList.includes(item) && recommendationList.length < 3) {
          recommendationList.push(item);
        }
      });
    }
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-4">
      
      {/* Left Profile details block */}
      <div className="lg:col-span-4 bg-white border border-stone-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <img 
              src={avatar} 
              alt={profile?.name || 'User'} 
              className="w-24 h-24 rounded-full object-cover border-4 border-amber-950/10 shadow-sm"
            />
            <button 
              onClick={() => {
                const url = prompt("Paste any crop picture URL or press Cancel to retain default:", avatar);
                if (url) setAvatar(url);
              }}
              className="absolute -bottom-1 -right-1 bg-amber-900 hover:bg-amber-950 text-white rounded-full p-1.5 shadow-md active:scale-90 transition-all"
              title="Change Avatar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">{profile?.name || name || authenticatedName || 'Guest'}</h3>
        </div>

        {/* Profile Attributes form */}
        <div className="pt-4 border-t border-stone-100">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-mono font-semibold mb-1">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-mono font-semibold mb-1">Email for confirmations</label>
                <input 
                  type="email" 
                  value={email || authenticatedEmail || ''} 
                  readOnly={!!authenticatedEmail}
                  className={`w-full border border-stone-200 px-3 py-1.5 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm ${authenticatedEmail ? 'bg-stone-50 text-stone-500' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="block text-stone-600 font-mono font-semibold mb-1">Mobile Contact</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-mono font-semibold mb-1">Loyalty Club Points (Balance)</label>
                <div className="w-full bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg text-stone-900 text-sm font-mono">
                  {loyaltyPoints}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 py-1.5 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleRefresh}
                  className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 py-1.5 rounded-lg font-medium transition-all"
                >
                  Refresh
                </button>
                <button 
                  type="submit" 
                  className="w-1/3 bg-amber-900 hover:bg-amber-950 text-white py-1.5 rounded-lg font-medium transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-stone-500">
                <span className="font-mono">Email Address</span>
                <span className="text-stone-900 font-medium truncate max-w-[200px]">{authenticatedEmail || profile?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span className="font-mono">Phone Contact</span>
                <span className="text-stone-900 font-medium">{phone || profile?.phone || authenticatedPhoneNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span className="font-mono">Preferred Shop Location</span>
                <span className="text-stone-900 font-medium">Kadapa, Colony</span>
              </div>

              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 py-2 rounded-xl text-center font-medium transition-all mt-6"
              >
                Modify Personal Details
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Right Column details list */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Personalized Recommendations */}
        <div className="bg-amber-50/40 border border-amber-100/40 rounded-3xl p-6">
          <span className="text-amber-800 text-[10px] font-mono uppercase tracking-widest font-bold">Bespoke Recipes</span>
          <h4 className="font-serif text-lg font-bold text-amber-950 mt-0.5">Recommended Just For You</h4>
          <p className="text-stone-500 text-xs mb-4">
            AI-driven recommendations paired precisely with your local order preference trends:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendationList.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelectMenuItem(item)}
                className="bg-white border border-stone-100 rounded-2xl p-3 hover:border-amber-500 shadow-sm transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <img src={item.imageUrl} alt={item.name} className="w-full h-24 object-cover rounded-xl mb-3" />
                <div>
                  <h5 className="font-serif font-bold text-xs text-stone-900 truncate hover:text-amber-800 transition-all">{item.name}</h5>
                  <span className="text-[10px] text-stone-400 block tracking-normal mt-0.5 truncate">{item.category}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-stone-50">
                  <span className="text-xs font-bold text-stone-900">₹{item.price}</span>
                  <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">Select</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite items list */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-1.5">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" /> Saved Favourites ({profile?.savedFavorites?.length || 0})
          </h4>
          
          {(profile?.savedFavorites?.length || 0) === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-6 text-center text-xs text-stone-500 font-sans">
              No items liked yet. Tap the heart symbol on our products gallery to save items here!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems
                .filter(item => profile?.savedFavorites?.includes(item.id))
                .map(item => (
                  <div 
                    key={item.id}
                    onClick={() => onSelectMenuItem(item)}
                    className="flex gap-3 bg-white border border-stone-100 rounded-xl p-3 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex flex-col justify-between truncate">
                      <div>
                        <h5 className="font-bold text-xs text-stone-900 truncate">{item.name}</h5>
                        <p className="text-[10px] text-stone-400 truncate">{item.category}</p>
                      </div>
                      <span className="text-xs font-extrabold text-amber-900">₹{item.price}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-1.5">
            <ScrollText className="w-5 h-5 text-amber-900" /> Pre-order Transaction History ({orders.length})
          </h4>

          {orders.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-6 text-center text-xs text-stone-500 font-sans">
              No previous orders found. Pre-order some dessert cool cakes to see your history update!
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="bg-white border border-stone-100 rounded-2xl p-5 hover:shadow-sm transition-all">
                  <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-2 pb-3 border-b border-stone-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400 font-mono">ORDER ID:</span>
                        <span className="text-stone-900 font-mono text-xs font-bold">{o.id}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono block mt-0.5">{o.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-stone-900 bg-stone-50 px-2 py-1 rounded">
                        Total paid: ₹{o.totalAmount}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded-full font-bold ${
                        o.status === 'Ready' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : o.status === 'Out Of Stock'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-850 border border-amber-200 animate-pulse'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>

                  {/* Purchased items listing inside this order */}
                  <div className="pt-3 space-y-2">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-stone-700">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-stone-900 shrink-0">{it.quantity}x</span>
                          <span className="truncate">{it.menuItem.name}</span>
                          {it.customMessage && (
                            <span className="bg-amber-50 border border-amber-100 text-[9px] text-amber-900 px-1.5 py-0.5 rounded font-serif italic max-w-[120px] truncate">
                              "{it.customMessage}"
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-stone-500 shrink-0">₹{it.menuItem.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Loyalty notification */}
                  <div className="mt-4 pt-3 border-t border-stone-50 text-[10px] text-stone-400 font-mono flex justify-between items-center flex-wrap gap-2">
                    <span>Generated Confirmed Order Email notification sent.</span>
                    <button
                      type="button"
                      onClick={() => handleDownloadBill(o)}
                      className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/60 px-3 py-1.5 rounded-xl text-[10px] font-bold font-sans transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Bill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
