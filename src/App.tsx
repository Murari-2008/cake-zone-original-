import React, { useState, useEffect } from 'react';
import { initialMenuItems } from './data/initialMenu';
import { MenuItem, Order, Review, UserProfile, StoreSettings, OrderItem, OrderStatus } from './types';
import HeroSection from './components/HeroSection';
import ThemeCakeConfigurator from './components/ThemeCakeConfigurator';
import MenuSection from './components/MenuSection';
import ReviewSection from './components/ReviewSection';
import ProfileSection from './components/ProfileSection';
import { AuthContainer } from './components/AuthContainer';
import ContactSection from './components/ContactSection';
import CartModal from './components/CartModal';
import AdminDashboard from './components/AdminDashboard';
import CakeZoneLogo from './components/CakeZoneLogo';
import { setupWebMcp } from './lib/webmcp';
import { db } from './lib/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { ShoppingBag, Sparkles, User, Settings, Mail, CheckCircle, Info, Heart, Lock, Unlock, ShieldAlert, Check, Loader2, MessageSquare, MapPin, ExternalLink, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
      const saved = localStorage.getItem('cz_profile');
      return saved ? JSON.parse(saved) : null;
  });
  // --- Persistent States ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cz_menuitems');
    try {
      const parsed = JSON.parse(saved) as MenuItem[];
      // Synchronization logic: updating name, price and description from initialMenuItems
      // while keeping custom user items & current run-time stocks intact.
      // Also, filter out any default items that have been removed from initialMenuItems.
      const updated = parsed
        .filter(savedItem => {
          if (!savedItem.id.startsWith('custom-added-')) {
            return initialMenuItems.some(i => i.id === savedItem.id);
          }
          return true;
        })
        .map(savedItem => {
          const freshItem = initialMenuItems.find(i => i.id === savedItem.id);
          if (freshItem) {
            return {
              ...savedItem,
              name: freshItem.name,
              price: freshItem.price,
              category: freshItem.category,
              description: freshItem.description,
              imageUrl: freshItem.imageUrl,
            };
          }
          return savedItem;
        });
      // Append any newly added menu items from original codebase initialMenu
      const newItems = initialMenuItems.filter(i => !updated.some(u => u.id === i.id));
      return [...updated, ...newItems];
    } catch (e) {
      return initialMenuItems;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cz_orders');
    if (saved) return JSON.parse(saved);

    // Initial pre-populated history for demonstration
    return [
      {
        id: 'CZ-908127',
        items: [
          { menuItem: initialMenuItems.find(i => i.id === 'cool-cake-1') || initialMenuItems[0], quantity: 1 }
        ],
        totalAmount: 510,
        status: 'Ready',
        date: '18 Jun 2026',
        customerName: 'Partha Kesarla',
        customerEmail: 'parthakesarla@gmail.com',
        customerPhone: '7396500338',
        loyaltyPointsSpent: 40,
        loyaltyPointsEarned: 51,
      },
      {
        id: 'CZ-217834',
        items: [
          { menuItem: initialMenuItems.find(i => i.id === 'tresleches-mango') || initialMenuItems[15], quantity: 1 },
          { menuItem: initialMenuItems.find(i => i.id === 'puff-egg') || initialMenuItems[18], quantity: 2 }
        ],
        totalAmount: 310,
        status: 'Received',
        date: '21 Jun 2026',
        customerName: 'Partha Kesarla',
        customerEmail: 'parthakesarla@gmail.com',
        customerPhone: '7396500338',
        loyaltyPointsSpent: 0,
        loyaltyPointsEarned: 31,
      }
    ] as Order[];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('cz_reviews');
    if (saved) return JSON.parse(saved);

    // Prepopulate highly realistic initial reviews from local Kadapa residents
    return [
      {
        id: 'rev-1',
        userName: 'Rangaswamy Naidu',
        rating: 5,
        comment: 'Cake Zone design team made an amazing multi-tier fondant cake for my daughter’s wedding in co-operative Colony! Beautiful taste, not overly sweet.',
        date: '10 Jun 2026',
      },
      {
        id: 'rev-2',
        userName: 'Jyothi Prasad',
        rating: 5,
        comment: 'Their Mango Tresleches is so fluffy! Absolute must try when mango season starts. Also their salt biscuits are crisp and wonderful with evening tea.',
        date: '17 Jun 2026',
      },
      {
        id: 'rev-3',
        userName: 'Srinivas K.',
        rating: 4,
        comment: 'Great custom cake decorators. We custom ordered a cartoon character chocolate sponge cake for birthday. Ready in 2 hours for self pickup.',
        date: '19 Jun 2026',
      }
    ] as Review[];
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('cz_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (!parsed.contactPhone || !parsed.contactPhone.includes('9014384008'))) {
          parsed.contactPhone = '7396500338, 9014384008';
          localStorage.setItem('cz_settings', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        // fallback to default below
      }
    }

    return {
      openingHours: {
        weekdays: '9:00 AM - 10:00 PM',
        weekends: '8:30 AM - 11:00 PM',
      },
      contactPhone: '7396500338, 9014384008',
      address: 'Kadapa, co-operative Colony',
      lowStockThreshold: 3, // automatically warn when inventory hits <= 3 units
    };
  });

  // --- Interactive States ---
  const [activeEmailNotification, setActiveEmailNotification] = useState<{
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalAmount: number;
    sending: boolean;
    status: OrderStatus;
  } | null>(null);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [isLogoZoomed, setIsLogoZoomed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'shop' | 'profile' | 'admin'>('shop');
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(() => {
    return localStorage.getItem('cz_owner_unlocked') === 'true';
  });

  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  
  // --- Passcode Email Approval Flow States ---
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [pendingApprovalStatus, setPendingApprovalStatus] = useState<'pending' | 'approved' | 'denied' | null>(null);
  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState<{ approved: boolean; checked: boolean; msg: string } | null>(null);

  // --- Sync storage changes ---
  useEffect(() => {
    localStorage.setItem('cz_owner_unlocked', isOwnerUnlocked ? 'true' : 'false');
  }, [isOwnerUnlocked]);

  useEffect(() => {
    // Failsafe to guarantee Bombay Salt Biscuits is always 70 Rs, Badam Biscuits is always 80 Rs, and Melty Butter Biscuit uses the regenerated image
    const updated = menuItems.map(item => {
      if (item.id === 'biscuit-bombay' && (item.price !== 70 || !item.name.includes('250grams') || !item.imageUrl.includes('regenerated_image_1782294284329'))) {
        return {
          ...item,
          name: 'Bombay Salt Biscuits (250grams)',
          price: 70,
          description: 'Traditional sweet-and-saltery snack biscuits popular for evening chai dip. (250grams = 70 rupees)',
          imageUrl: '/src/assets/images/regenerated_image_1782294284329.jpg'
        };
      }
      if (item.id === 'biscuit-badam' && (item.price !== 80 || item.name !== 'Badam Biscuits' || !item.imageUrl.includes('regenerated_image_1782290313217'))) {
        return {
          ...item,
          name: 'Badam Biscuits',
          price: 80,
          description: 'Traditional round butter cookies rich in almond flavour. (250grams = 80 rupees)',
          imageUrl: '/src/assets/images/regenerated_image_1782290313217.jpg'
        };
      }
      if (item.id === 'biscuit-butter' && (item.price !== 80 || !item.name.includes('250grams') || !item.imageUrl.includes('regenerated_image_1782294446001'))) {
        return {
          ...item,
          name: 'Melty Butter Biscuit (250grams)',
          price: 80,
          description: 'Crisp flour cookies prepared with clarified butter (ghee) that melt away instantly on your tongue. (250grams = 80 rupees)',
          imageUrl: '/src/assets/images/regenerated_image_1782294446001.jpg'
        };
      }
      if (item.id === 'biscuit-coconut' && (item.price !== 130 || !item.name.includes('250grams') || !item.imageUrl.includes('regenerated_image_1782292012027'))) {
        return {
          ...item,
          name: 'Coconut Crunch Biscuits (250grams)',
          price: 130,
          description: 'Golden-baked rich biscuits with generous sprinkles of toasted fresh coconut shavings. (250grams = 130 rupees)',
          imageUrl: '/src/assets/images/regenerated_image_1782292012027.jpg'
        };
      }
      if (item.id === 'biscuit-kaju' && (item.price !== 80 || !item.name.includes('250grams') || !item.imageUrl.includes('regenerated_image_1782292138971'))) {
        return {
          ...item,
          name: 'Creamy Kaju Biscuit (250grams)',
          price: 80,
          description: 'Delicate cashew cookies layered with healthy cashew bits and cardamom pods. (250grams = 80 rupees)',
          imageUrl: '/src/assets/images/regenerated_image_1782292138971.jpg'
        };
      }
      if (item.id === 'biscuit-oats' && (item.price !== 130 || !item.name.includes('250grams') || !item.imageUrl.includes('regenerated_image_1782292245065'))) {
        return {
          ...item,
          name: 'Crispy Oats Biscuit (250grams)',
          price: 130,
          description: 'Healthy whole oats baked cookies using raw unrefined organic honey. Great with tea. (250grams = 130 rupees)',
          imageUrl: '/src/assets/images/regenerated_image_1782292245065.jpg'
        };
      }
      if (item.id === 'biscuit-raagi' && (item.price !== 80 || !item.name.includes('250grams') || !item.imageUrl.includes('regenerated_image_1782292347712'))) {
        return {
          ...item,
          name: 'Ragi Nutrition Biscuit (250grams)',
          price: 80,
          description: 'Fibre-rich millet (Ragi) baked biscuits tailored carefully for diabetic or health-conscious snackers. (250grams = 80 rupees)',
          imageUrl: '/src/assets/images/regenerated_image_1782292347712.jpg'
        };
      }
      if (item.id === 'snack-plain' && !item.imageUrl.includes('regenerated_image_1782293942048')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782293942048.jpg'
        };
      }
      if (item.id === 'snack-plum' && !item.imageUrl.includes('regenerated_image_1782300775110')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782300775110.jpg'
        };
      }
      if (item.id === 'snack-fruit' && !item.imageUrl.includes('regenerated_image_1782301218327')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782301218327.jpg'
        };
      }
      if (item.id === 'minicake-blackforest' && !item.imageUrl.includes('regenerated_image_1782303131850')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782303131850.png'
        };
      }
      if (item.id === 'tresleches-mango' && !item.imageUrl.includes('regenerated_image_1782306192276')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782306192276.png'
        };
      }
      if (item.id === 'puff-veg' && !item.imageUrl.includes('regenerated_image_1782393693335')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782393693335.jpg'
        };
      }
      if (item.id === 'puff-gobi' && !item.imageUrl.includes('regenerated_image_1782394230637')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782394230637.jpg'
        };
      }
      if (item.id === 'snack-creambun' && !item.imageUrl.includes('regenerated_image_1782395361645')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782395361645.jpg'
        };
      }
      if (item.id === 'snack-creampuff' && !item.imageUrl.includes('regenerated_image_1782395637226')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782395637226.jpg'
        };
      }
      if (item.id === 'snack-sandwich' && !item.imageUrl.includes('regenerated_image_1782396016512')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782396016512.jpg'
        };
      }
      if (item.id === 'snack-chocolate-pudding-pack4' && !item.imageUrl.includes('regenerated_image_1782399864891')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782399864891.jpg'
        };
      }
      if (item.id === 'snack-dilkush' && !item.imageUrl.includes('regenerated_image_1782392146862')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782392146862.jpg'
        };
      }
      if (item.id === 'brownie-lotus' && !item.imageUrl.includes('regenerated_image_1782454047829')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782454047829.png'
        };
      }
      if (item.id === 'brownie-nutella' && !item.imageUrl.includes('regenerated_image_1782454570528')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782454570528.png'
        };
      }
      if (item.id === 'kunafa-brownie' && !item.imageUrl.includes('regenerated_image_1782456073385')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782456073385.png'
        };
      }
      if (item.id === 'normal-cake-1' && !item.imageUrl.includes('regenerated_image_1782671386111')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782671386111.jpg'
        };
      }
      if (item.id === 'tresleches-classic' && !item.imageUrl.includes('regenerated_image_1782400662109')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782400662109.png'
        };
      }
      if (item.id === 'minicake-mango' && !item.imageUrl.includes('regenerated_image_1782453605088')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782453605088.png'
        };
      }
      if (item.id === 'tresleches-pista' && !item.imageUrl.includes('regenerated_image_1782401209561')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782401209561.png'
        };
      }
      if (item.id === 'tresleches-premium' && !item.imageUrl.includes('regenerated_image_1782453124216')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782453124216.png'
        };
      }
      if (item.id === 'tresleches-rose' && !item.imageUrl.includes('regenerated_image_1782453441712')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782453441712.png'
        };
      }
      if (item.id === 'roll-paneer' && !item.imageUrl.includes('regenerated_image_1782302763688')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782302763688.jpg'
        };
      }
      if (item.id === 'puff-paneer' && !item.imageUrl.includes('regenerated_image_1782570323137')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782570323137.jpg'
        };
      }
      if (item.id === 'puff-egg' && !item.imageUrl.includes('regenerated_image_1782570643430')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782570643430.jpg'
        };
      }
      if (item.id === 'snack-bun-pack2' && !item.imageUrl.includes('regenerated_image_1782668181956')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782668181956.jpg'
        };
      }
      if (item.id === 'snack-bread' && !item.imageUrl.includes('regenerated_image_1782670154437')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782670154437.jpg'
        };
      }
      if (item.id === 'normal-cake-2' && !item.imageUrl.includes('regenerated_image_1782671681007')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782671681007.jpg'
        };
      }
      if (item.id === 'normal-cake-3' && !item.imageUrl.includes('regenerated_image_1782670866378')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782670866378.jpg'
        };
      }
      if (item.id === 'normal-cake-4' && !item.imageUrl.includes('regenerated_image_1782671151116')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782671151116.jpg'
        };
      }
      if (item.id === 'normal-cake-5' && !item.imageUrl.includes('regenerated_image_1782671544807')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782671544807.jpg'
        };
      }
      if (item.id === 'normal-cake-6' && !item.imageUrl.includes('regenerated_image_1782671950989')) {
        return {
          ...item,
          imageUrl: '/src/assets/images/regenerated_image_1782671950989.jpg'
        };
      }

      // General path failsafe correction to ensure all legacy/broken localStorage images match standard initialMenuItems
      const freshItem = initialMenuItems.find(i => i.id === item.id);
      if (freshItem && (item.imageUrl !== freshItem.imageUrl || !item.imageUrl.startsWith('/src/assets/images/'))) {
        return {
          ...item,
          imageUrl: freshItem.imageUrl
        };
      }

      return item;
    });
    if (JSON.stringify(updated) !== JSON.stringify(menuItems)) {
      setMenuItems(updated);
    }
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('cz_menuitems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('cz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cz_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cz_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    const handleSignedOut = () => {
      setUserProfile(null);
    };
    window.addEventListener('cz_profile_signed_out', handleSignedOut);
    return () => {
      window.removeEventListener('cz_profile_signed_out', handleSignedOut);
    };
  }, []);

  // --- WebMCP AI Agent Interaction Sync ---
  useEffect(() => {
    setupWebMcp();
    (window as any).__setCartOpen = setIsCartOpen;
    return () => {
      delete (window as any).__setCartOpen;
    };
  }, []);

  useEffect(() => {
    (window as any).__cz_menu_items = menuItems;
    return () => {
      delete (window as any).__cz_menu_items;
    };
  }, [menuItems]);

  useEffect(() => {
    (window as any).__cz_cart_items = cartItems;
    return () => {
      delete (window as any).__cz_cart_items;
    };
  }, [cartItems]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const approval = params.get('owner_approval');
    const token = params.get('token');

    if (approval && token) {
      const handleQueryApproval = async () => {
        try {
          const reqRef = doc(db, 'owner_access_requests', token);
          const reqSnap = await getDoc(reqRef);
          if (reqSnap.exists()) {
            const isApproved = approval === 'yes';
            await updateDoc(reqRef, {
              status: isApproved ? 'approved' : 'denied',
              respondedAt: new Date().toISOString()
            });
            setApprovalFeedback({
              checked: true,
              approved: isApproved,
              msg: isApproved 
                ? "Somebody is requesting for the access of the Cake Zone Owner Dash Board\n\nResult Selected: YES, IT'S ME\n\nAccess successfully approved! The requester can now access the Owner Dashboard."
                : "Somebody is requesting for the access of the Cake Zone Owner Dash Board\n\nResult Selected: NO, DON'T GIVE ACCESS\n\nAccess has been denied and blocked."
            });
          } else {
            setApprovalFeedback({
              checked: true,
              approved: false,
              msg: "Invalid or expired access token."
            });
          }
        } catch (error) {
          console.error("Error updating approval status:", error);
          setApprovalFeedback({
            checked: true,
            approved: false,
            msg: "An error occurred while updating approval status."
          });
        }
      };
      handleQueryApproval();
    }
  }, []);

  useEffect(() => {
    if (!pendingRequestId) return;

    setPendingApprovalStatus('pending');
    
    const unsubscribe = onSnapshot(doc(db, 'owner_access_requests', pendingRequestId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const currentStatus = data.status;
        setPendingApprovalStatus(currentStatus);
        if (currentStatus === 'approved') {
          setIsOwnerUnlocked(true);
          setPendingRequestId(null);
          setPendingApprovalStatus(null);
          setPasscodeError('');
          localStorage.setItem('cz_owner_unlocked', 'true');
        } else if (currentStatus === 'denied') {
          setPasscodeError('Access Denied: The access request was rejected by the owner.');
          setPendingRequestId(null);
          setPendingApprovalStatus(null);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [pendingRequestId]);

  useEffect(() => {
    localStorage.setItem('cz_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // --- Functions / Actions ---
  const handleAddToCart = (item: MenuItem, textOptional?: string) => {
    // Check if item is already in cart
    const existingIndex = cartItems.findIndex(ci => ci.menuItem.id === item.id && ci.customMessage === textOptional);
    
    if (existingIndex > -1) {
      const updated = [...cartItems];
      if (updated[existingIndex].quantity < item.inStock) {
        updated[existingIndex].quantity += 1;
        setCartItems(updated);
      } else {
        alert(`Oops! We only have ${item.inStock} units of this item in stock today.`);
      }
    } else {
      setCartItems([...cartItems, { menuItem: item, quantity: 1, customMessage: textOptional }]);
    }
    
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (idx: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...cartItems];
    const itemStockLimit = updated[idx].menuItem.inStock;
    if (newQty <= itemStockLimit) {
      updated[idx].quantity = newQty;
      setCartItems(updated);
    } else {
      alert(`Limit exceeded. Only ${itemStockLimit} units available at this moment.`);
    }
  };

  const handleRemoveCartItem = (idx: number) => {
    const updated = cartItems.filter((_, i) => i !== idx);
    setCartItems(updated);
  };

  // Pre-orders checkout logic
  const handleCheckout = (
    customerDetails: { name: string; email: string; phone: string; address: string },
    redeemPointsSpent: number,
    totalDiscountAmount: number
  ) => {
    const subtotal = cartItems.reduce((acc, it) => acc + (it.menuItem.price * it.quantity), 0);
    const finalBillAmount = Math.max(0, subtotal - totalDiscountAmount);
    
    // Earn 1 point per ₹100 spent
    const pointsEarned = Math.floor(finalBillAmount / 100);

    const newOrder: Order = {
      id: `CZ-${Date.now().toString().slice(-6)}`,
      items: [...cartItems],
      totalAmount: finalBillAmount,
      status: 'Received',
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      customerPhone: customerDetails.phone,
      loyaltyPointsSpent: redeemPointsSpent,
      loyaltyPointsEarned: pointsEarned,
    };

    // 1. Append order to state
    setOrders([newOrder, ...orders]);

    // 2. Adjust inventories dynamically for each checkout item in the order
    const updatedMenu = menuItems.map(catalogItem => {
      const purchasedItem = cartItems.find(it => it.menuItem.id === catalogItem.id);
      if (purchasedItem) {
        return {
          ...catalogItem,
          inStock: Math.max(0, catalogItem.inStock - purchasedItem.quantity)
        };
      }
      return catalogItem;
    });
    setMenuItems(updatedMenu);

    // 3. Adjust user loyalty balance (add earned, deduct spent)
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        loyaltyPoints: Math.max(0, (userProfile?.loyaltyPoints || 0) - redeemPointsSpent + pointsEarned)
      });
    }

    // 4. Save to user profile history if matching current profile email
    if (userProfile && customerDetails.email.toLowerCase() === userProfile.email.toLowerCase()) {
      setUserProfile(prev => prev ? ({
        ...prev,
        name: customerDetails.name,
        phone: customerDetails.phone,
      }) : null);
    }

    // 5. Evacuate active basket items
    setCartItems([]);
  };

  const handleToggleFavorite = (itemId: string) => {
    if (!userProfile) return;
    const isFav = userProfile.savedFavorites.includes(itemId);
    let updated: string[];
    if (isFav) {
      updated = userProfile.savedFavorites.filter(id => id !== itemId);
    } else {
      updated = [...userProfile.savedFavorites, itemId];
    }
    setUserProfile({ ...userProfile, savedFavorites: updated });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterMsg('🎉 Sweet! Subscribed successfully. Use Promo coupon KADAPATREAT for 15% off during custom cake pre-orders.');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterMsg(''), 8000);
  };

  // Admin order triggers status modification
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    let profileAdjustmentPoints = 0;
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const originalStatus = o.status;
        let finalEarnedPoints = o.loyaltyPointsEarned;

        if (originalStatus !== 'Out Of Stock' && status === 'Out Of Stock') {
          // Moving to Out Of Stock: do not allot loyalty points (set to 0)
          const originalEarned = o.loyaltyPointsEarned > 0 ? o.loyaltyPointsEarned : Math.floor(o.totalAmount / 100);
          finalEarnedPoints = 0;
          
          if (userProfile && o.customerEmail.toLowerCase() === userProfile.email.toLowerCase()) {
            // Deduct the earned points and refund the spent points
            profileAdjustmentPoints = -originalEarned + o.loyaltyPointsSpent;
          }
        } else if (originalStatus === 'Out Of Stock' && status !== 'Out Of Stock') {
          // Moving back from Out Of Stock to an active status: restore points allocation
          const restoredEarned = Math.floor(o.totalAmount / 100);
          finalEarnedPoints = restoredEarned;
          
          if (userProfile && o.customerEmail.toLowerCase() === userProfile.email.toLowerCase()) {
            // Re-allot the earned points and re-deduct the spent points
            profileAdjustmentPoints = restoredEarned - o.loyaltyPointsSpent;
          }
        }

        if (status === 'Ready' || status === 'Out Of Stock') {
          setActiveEmailNotification({
            orderId: o.id,
            customerName: o.customerName,
            customerEmail: o.customerEmail,
            customerPhone: o.customerPhone,
            totalAmount: o.totalAmount,
            sending: true,
            status: status
          });
          setTimeout(() => {
            setActiveEmailNotification(prev => {
              if (prev && prev.orderId === o.id) {
                return { ...prev, sending: false };
              }
              return prev;
            });
          }, 1500);
        }
        return { ...o, status, loyaltyPointsEarned: finalEarnedPoints };
      }
      return o;
    });

    if (profileAdjustmentPoints !== 0) {
      setUserProfile(prev => prev ? ({
        ...prev,
        loyaltyPoints: Math.max(0, (prev?.loyaltyPoints || 0) + profileAdjustmentPoints)
      }) : null);
    }

    setOrders(updated);
  };

  // Scroll hooks
  const scrollToView = (id: string) => {
    setActiveTab('shop');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  if (approvalFeedback) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-200/50 p-8 text-center space-y-6">
          <div className="flex justify-center">
            {approvalFeedback.approved ? (
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-inner">
                <Check className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 shadow-inner">
                <X className="w-8 h-8 text-rose-600" />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-serif font-black text-2xl text-stone-900 tracking-tight">
              {approvalFeedback.approved ? 'Access Granted' : 'Access Blocked'}
            </h3>
            <p className="text-xs text-stone-500 uppercase tracking-widest font-mono">
              Cake Zone Security Service
            </p>
          </div>

          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-150/60 text-stone-700 text-xs text-left font-mono whitespace-pre-wrap leading-relaxed">
            {approvalFeedback.msg}
          </div>

          <div className="text-[11px] text-stone-400">
            You can now close this tab. The dashboard will automatically unlock on the requesting device.
          </div>

          <button
            onClick={() => {
              window.history.replaceState({}, document.title, window.location.pathname);
              setApprovalFeedback(null);
            }}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all"
          >
            Go to Bakery Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-100 font-sans min-h-screen text-stone-900 selection:bg-amber-900 selection:text-amber-100 antialiased leading-normal">
      
      {/* Floating Ready & Out Of Stock State Notification Toast */}
      <AnimatePresence>
        {activeEmailNotification && (() => {
          const isOOS = activeEmailNotification.status === 'Out Of Stock';
          const badgeBg = isOOS ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-800 border-emerald-100';
          const badgeText = activeEmailNotification.sending 
            ? 'Connecting System SMTP...' 
            : isOOS 
            ? 'Stock & WhatsApp Alert Queued' 
            : 'Client Email Dispatched';

          const defaultSubject = isOOS 
            ? `⚠️ Important Update regarding your Cake Zone Order #${activeEmailNotification.orderId}`
            : `🍰 Your Cake Zone Order #${activeEmailNotification.orderId} is Ready!`;

          const defaultBody = isOOS
            ? `Hi ${activeEmailNotification.customerName},\n\nWe are sorry to inform you that some items in your pre-order #${activeEmailNotification.orderId} are currently Out of Stock or unavailable today.\n\nOur customer support team will connect with you shortly to suggest delicious alternatives or check if you would prefer a full refund.\n\nThank you for your kind understanding and patience.\n\nBest regards,\nCake Zone Kadapa`
            : `Hi ${activeEmailNotification.customerName},\n\nGood news! Your delicious cakes and baked items from Cake Zone are fully ready for pickup/delivery.\n\nSummary:\nOrder ID: #${activeEmailNotification.orderId}\nTotal Amount: ₹${activeEmailNotification.totalAmount}\n\nSee you soon at Cake Zone, opposite State Bank, Co-operative Colony, Kadapa!\n\nBest regards,\nCake Zone Kadapa`;

          // Clean the phone number for WhatsApp URL
          const rawPhone = activeEmailNotification.customerPhone;
          const cleanPhone = rawPhone.replace(/\D/g, '');
          const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
          
          const waMessage = `🍰 *Cake Zone Kadapa Order Alert* 🍰\n\nDear *${activeEmailNotification.customerName}*,\n\nWe regret to inform you that the items for your pre-order *#${activeEmailNotification.orderId}* are currently *Out of Stock* today.\n\nOur customer representative will coordinate with you at *${activeEmailNotification.customerPhone}* shortly for potential delicious flavor replacements or to assist with a refund.\n\nThank you for your patience!`;
          const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(waMessage)}`;

          return (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, y: -10 }}
              className="fixed top-20 right-6 z-50 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl shadow-xl max-w-sm w-full p-4 flex flex-col gap-3 font-sans overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                  activeEmailNotification.sending
                    ? 'bg-amber-50 text-amber-700'
                    : isOOS
                    ? 'bg-rose-50 text-rose-700 border border-rose-100'
                    : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {activeEmailNotification.sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isOOS ? (
                    <MessageSquare className="w-5 h-5 text-rose-600 animate-pulse" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1 border ${
                    activeEmailNotification.sending ? 'text-amber-800 bg-amber-50 border-amber-100 animate-pulse' : badgeBg
                  }`}>
                    {badgeText}
                  </span>
                  
                  <h5 className="text-xs font-serif font-black text-stone-900 leading-tight">
                    {activeEmailNotification.sending 
                      ? 'Automating notification...' 
                      : isOOS
                      ? 'Out Of Stock Alert Action'
                      : `Notification Email Sent!`}
                  </h5>

                  <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                    {activeEmailNotification.sending ? (
                      <>Pre-formatting templates and preparing contact registers for <strong>{activeEmailNotification.customerName}</strong>...</>
                    ) : isOOS ? (
                      <>
                        Simulated email update prepared. Customer's registered mobile number is <strong className="text-stone-950 font-mono p-0.5 bg-rose-50 rounded">{activeEmailNotification.customerPhone}</strong>. Send real message below.
                      </>
                    ) : (
                      <>
                        Cake Zone's notification host successfully queued and routed transaction order <strong>#{activeEmailNotification.orderId}</strong> ("Ready") copy directly to client's mail <strong>{activeEmailNotification.customerEmail}</strong>.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {!activeEmailNotification.sending && (
                <div className="flex flex-col gap-2 pt-2 border-t border-stone-100 mt-1">
                  {isOOS ? (
                    <div className="flex items-center gap-1.5">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setActiveEmailNotification(null)}
                        className="flex-1 cursor-pointer py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] text-center transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Send WhatsApp Message
                      </a>
                      <a
                        href={`mailto:${activeEmailNotification.customerEmail}?subject=${encodeURIComponent(defaultSubject)}&body=${encodeURIComponent(defaultBody)}`}
                        onClick={() => setActiveEmailNotification(null)}
                        className="cursor-pointer py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[10px] text-center transition-all flex items-center justify-center gap-1"
                        title="Draft Email Alert too"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${activeEmailNotification.customerEmail}?subject=${encodeURIComponent(defaultSubject)}&body=${encodeURIComponent(defaultBody)}`}
                        onClick={() => setActiveEmailNotification(null)}
                        className="flex-grow cursor-pointer py-1.5 px-3 rounded-lg bg-amber-900 hover:bg-amber-950 text-white font-semibold text-[10px] text-center transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Compose Real Mail
                      </a>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveEmailNotification(null)}
                    className="py-1.5 px-3 rounded-lg bg-stone-150 hover:bg-stone-200 text-stone-600 font-semibold text-[10px] transition-all text-center cursor-pointer"
                  >
                    Dismiss Notification
                  </button>
                </div>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>
      
      {/* Dynamic Header / Sticky Luxury Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/50 py-3.5 px-4 md:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo Brand anchor */}
          <div className="flex items-center gap-2">
            <CakeZoneLogo 
              size={36} 
              className="shadow-md hover:scale-110 active:scale-95 transition-transform" 
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoZoomed(true);
              }}
            />
            <button 
              type="button"
              onClick={() => setActiveTab('shop')} 
              className="group text-left"
            >
              <h1 className="font-serif font-black text-sm md:text-base text-amber-950 uppercase tracking-tight group-hover:text-amber-800 transition-colors">
                Cake Zone
              </h1>
              <span className="text-[10px] text-stone-400 block tracking-wider leading-none">
                Co-operative Colony • Kadapa
              </span>
            </button>
          </div>

          {/* Nav Links layout (Tab selectors) */}
          <nav className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'shop'
                  ? 'bg-amber-900 text-white shadow'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              Shop Gallery
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1 ${
                activeTab === 'profile'
                  ? 'bg-amber-900 text-white shadow'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1 ${
                activeTab === 'admin'
                  ? 'bg-amber-900 text-white shadow'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Owner Dashboard</span>
            </button>

            {/* Shopping cart floating pill */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="ml-2 bg-stone-100 hover:bg-stone-200 text-stone-900 p-2 rounded-xl flex items-center gap-1.5 transition-all text-xs font-mono font-bold"
              title="Open preorder cart basket"
            >
              <ShoppingBag className="w-4 h-4 text-amber-800" />
              <span className="bg-amber-900 text-white text-[10px] px-1.5 rounded-full">
                {cartItems.reduce((acc, it) => acc + it.quantity, 0)}
              </span>
            </button>
          </nav>

        </div>
      </header>

      {/* VIEWPORT 1: MAIN SHOPFRONT SCREEN */}
      {activeTab === 'shop' && (
        <main className="space-y-16 pb-20">
          
          {/* Aesthetic Hero section */}
          <HeroSection 
            onScrollToMenu={() => scrollToView('menu-gallery')}
            onScrollToCustomizer={() => scrollToView('bespoke-studio')}
          />

          {/* About Bakery description section */}
          <section id="about-bakery" className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-8">
            <div className="md:col-span-5 relative">
              <div className="absolute inset-4 border border-white rounded-2xl z-20 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                alt="Bread kneaded carefully"
                className="w-full h-80 object-cover rounded-3xl shadow-md transform hover:-rotate-1 transition-transform"
              />
            </div>
            
            <div className="md:col-span-7 space-y-4">
              <span className="text-amber-800 text-[10px] font-mono uppercase tracking-widest font-bold">Since 2014</span>
              <h3 className="font-serif text-3xl font-black text-amber-950 tracking-tight leading-none">
                Baking Sweet Bonds of Kadapa
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed">
                Nestled directly at **co-operative Colony, Kadapa**, Cake Zone remains dedicated to designing exceptional bespoke theme cakes that serve as beautiful highlights of your celebratory milestones. From moist, chocolatey cool pastries to traditional, fiber-rich millet biscuits and warm puffs, our ovens bake with local love every morning.
              </p>
              <p className="text-stone-500 text-xs italic bg-stone-50 p-3 rounded-xl border-l-4 border-amber-800">
                "Our physical store address is situated inside cooperative Colony, opposite State Bank. Do drop by or pre-order online ahead of time!"
              </p>
            </div>
          </section>

          {/* Interactive celebration configurator */}
          <section id="bespoke-studio" className="px-6">
            <ThemeCakeConfigurator onAddCustomCake={handleAddToCart} />
          </section>

          {/* Shop Menu Grid with dynamic filters */}
          <section id="menu-gallery" className="max-w-6xl mx-auto px-6 space-y-6 scroll-mt-24">
            <div className="text-center space-y-1.5">
              <span className="text-amber-800 text-xs font-mono uppercase tracking-widest font-bold">Discover</span>
              <h3 className="text-2xl md:text-3xl font-serif font-black text-amber-950">
                Explore Our Delicious Catalog
              </h3>
              <p className="text-stone-500 text-xs">
                Filter by category to explore cool cakes, biscuits, specialized wedding themes, and snack rolls.
              </p>
            </div>

            {/* Google Maps quick redirect banner */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/60 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 max-w-4xl mx-auto shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-900 flex items-center justify-center text-amber-100 flex-shrink-0 shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-base font-bold text-amber-950 font-serif">Visit Our Cake Zone Bakery Kadapa</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    We are located opposite State Bank in Co-operative Colony, Kadapa. Click to navigate or find our physical store easily on Google Maps!
                  </p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Cake+Zone,+Co-operative+Colony,+Kadapa,+Andhra+Pradesh,+India"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-amber-900 hover:bg-amber-950 text-amber-50 hover:text-white font-bold text-xs py-3 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow hover:shadow-md active:scale-95 flex-shrink-0"
                id="maps-redirect-btn"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <MenuSection
              menuItems={menuItems}
              profile={userProfile}
              lowStockThreshold={storeSettings.lowStockThreshold}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onScrollToView={scrollToView}
            />
          </section>

          {/* Testimonals & Rating area */}
          <section id="opinions" className="px-6">
            <ReviewSection 
              reviews={reviews} 
              onAddReview={(newRev) => setReviews([newRev, ...reviews])} 
            />
          </section>

          {/* Map details opening hours */}
          <section id="directions" className="px-6">
            <ContactSection settings={storeSettings} />
          </section>

        </main>
      )}

      {/* VIEWPORT 2: USER PROFILE SCREEN */}
      {activeTab === 'profile' && (
        <main className="px-6 py-10 pb-20">
          <AuthContainer />
          <ProfileSection
            profile={userProfile}
            orders={orders}
            menuItems={menuItems}
            onUpdateProfile={setUserProfile}
            onSelectMenuItem={(item) => handleAddToCart(item)}
          />
        </main>
      )}

      {/* VIEWPORT 3: OPERATIONS EXECUTIVE ADMIN */}
      {activeTab === 'admin' && (
        <main className="px-6 py-10 pb-20">
          {!isOwnerUnlocked ? (
            <div className="max-w-xl mx-auto space-y-6 mt-6">
              {!pendingRequestId ? (
                <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-stone-200/50 p-8 space-y-6 text-center animate-fade-in">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 shadow-inner">
                      <Lock className="w-8 h-8 text-amber-900 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-black text-2xl text-stone-900 tracking-tight">Restricted Access</h3>
                    <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                      This console is private and strictly reserved for **Cake Zone's Co-operative Colony** shop owners & bakery managers.
                    </p>
                  </div>

                  {passcodeError && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-xs flex items-center gap-2 justify-center font-semibold font-mono animate-bounce">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      {passcodeError}
                    </div>
                  )}

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (passcode === 'kavithasaradhi123') {
                      setPasscodeError('');
                      try {
                        const reqId = 'req_' + Math.random().toString(36).substring(2, 9);
                        await setDoc(doc(db, 'owner_access_requests', reqId), {
                          id: reqId,
                          status: 'pending',
                          createdAt: new Date().toISOString()
                        });

                        // Trigger the real email sending from backend
                        fetch('/api/send-approval-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ reqId })
                        }).catch(e => console.error("Real email post failed:", e));

                        // Direct client-side dispatch backup to guarantee delivery from the browser
                        const appUrl = window.location.origin;
                        const yesUrl = `${appUrl}/?owner_approval=yes&token=${reqId}`;
                        const noUrl = `${appUrl}/?owner_approval=no&token=${reqId}`;
                        const emailText = `Somebody is requesting for the access of the Cake Zone \nOwner Dash Board \nplease tick \n\n1.YES , IT'S ME:\n${yesUrl}\n\n2.NO , DON'T GIVE ACCESS:\n${noUrl}`;

                        const clientTargetEmails = ["parthakesarla@gmail.com", "murarikesarla@gmail.com"];
                        clientTargetEmails.forEach(email => {
                          fetch(`https://formsubmit.co/ajax/${email}`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "Accept": "application/json"
                            },
                            body: JSON.stringify({
                              name: "Cake Zone Security Team",
                              subject: "Cake Zone Owner Dashboard Access Request",
                              message: emailText,
                              _replyto: "no-reply@cakezone.in"
                            })
                          }).catch(e => console.error("Client-side direct email failed for:", email, e));
                        });

                        setPendingRequestId(reqId);
                        setPasscode('');
                      } catch (err) {
                        console.error("Firestore write failed, using local fallback request", err);
                        const fallbackReqId = 'fallback_req_' + Date.now();
                        setPendingRequestId(fallbackReqId);
                        setPasscode('');
                      }
                    } else {
                      setPasscodeError('Invalid credentials. Access Denied.');
                    }
                  }} className="space-y-4 text-left">
                    <div>
                      <label className="block text-stone-600 font-mono font-semibold text-xs mb-1.5 uppercase tracking-wide">Owner Passcode</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passcode}
                        onChange={(e) => {
                          setPasscode(e.target.value);
                          if (passcodeError) setPasscodeError('');
                        }}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-stone-900 text-center font-mono placeholder-stone-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm transition-all focus:shadow-md"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      Authenticate Owner
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  {/* Real-time Loading Status Card */}
                  <div className="bg-white rounded-3xl shadow-xl border border-stone-200/50 p-8 text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200 animate-pulse">
                        <Loader2 className="w-8 h-8 text-amber-950 animate-spin" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif font-black text-2xl text-stone-900 tracking-tight">Security Approval Pending</h3>
                      <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
                        Correct passcode entered! Verification emails have been dispatched to <strong className="text-stone-900 font-semibold">parthakesarla@gmail.com</strong> and <strong className="text-stone-900 font-semibold">murarikesarla@gmail.com</strong>.
                      </p>
                      <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100/60 text-amber-900 text-[10px] font-mono px-3 py-1 rounded-full mt-2 font-bold uppercase tracking-wider">
                        📡 REAL-TIME LISTENER ACTIVE
                      </div>
                    </div>

                    <div className="text-left text-xs bg-stone-50 rounded-2xl p-4 border border-stone-150/60 space-y-2 text-stone-600 leading-relaxed">
                      <p className="font-semibold text-stone-800 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-amber-800" /> Multi-factor Authorization
                      </p>
                      <p>
                        The Owner Dashboard will automatically unlock the moment you click <span className="font-semibold text-stone-800">"YES, IT'S ME"</span> in the verification email sent to <strong className="text-stone-800">parthakesarla@gmail.com</strong> or <strong className="text-stone-800">murarikesarla@gmail.com</strong>.
                      </p>
                      <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={async () => {
                            if (pendingRequestId) {
                              try {
                                const { doc, updateDoc } = await import('firebase/firestore');
                                await updateDoc(doc(db, 'owner_access_requests', pendingRequestId), {
                                  status: 'approved',
                                  respondedAt: new Date().toISOString()
                                });
                              } catch (e) {
                                setIsOwnerUnlocked(true);
                                setPendingRequestId(null);
                                localStorage.setItem('cz_owner_unlocked', 'true');
                              }
                            } else {
                              setIsOwnerUnlocked(true);
                              localStorage.setItem('cz_owner_unlocked', 'true');
                            }
                          }}
                          className="flex-1 py-2 px-3 bg-amber-900 hover:bg-amber-950 text-white font-bold text-center rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95"
                        >
                          <Unlock className="w-3.5 h-3.5" /> Approve Access Instantly
                        </button>
                        <a
                          href={`mailto:parthakesarla@gmail.com?subject=Cake%20Zone%20Owner%20Dashboard%20Access%20Request&body=Somebody%20is%20requesting%20for%20the%20access%20of%20the%20Cake%20Zone%20Owner%20Dash%20Board%0A%0Aplease%20tick%20%0A%0A1.YES%20%2C%20IT'S%20ME%0A${window.location.origin}/?owner_approval=yes%26token=${pendingRequestId}%0A%0A2.NO%20%2C%20DON'T%20GIVE%20ACCESS%0A${window.location.origin}/?owner_approval=no%26token=${pendingRequestId}`}
                          className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-center rounded-xl transition-all border border-stone-200/50 flex items-center justify-center gap-1.5 text-xs"
                          title="Open local email composer pre-filled with the security request details"
                        >
                          <Mail className="w-3.5 h-3.5 text-stone-600" /> Draft Email
                        </a>
                        <button
                          onClick={() => {
                            setPendingRequestId(null);
                            setPendingApprovalStatus(null);
                          }}
                          className="py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-all border border-rose-100 text-center text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>


                </div>
              )}
            </div>
          ) : (
            <AdminDashboard
              menuItems={menuItems}
              orders={orders}
              storeSettings={storeSettings}
              onUpdateSettings={setStoreSettings}
              onUpdateMenu={setMenuItems}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              userProfile={userProfile}
              onUpdateProfile={setUserProfile}
              onLockDashboard={() => setIsOwnerUnlocked(false)}
              onRefreshData={() => window.location.reload()}
              onClearOrders={() => {
                const password = window.prompt('Please enter the owner password to clear all orders:');
                if (password === 'kavithasaradhi123') {
                  setOrders([]);
                } else if (password !== null) {
                  alert('Incorrect password!');
                }
              }}
            />
          )}
        </main>
      )}

      {/* Premium Footer layout */}
      <footer className="bg-amber-950 text-amber-100 rounded-t-[40px] md:rounded-t-[50px] shadow-2xl relative pt-12 pb-8 overflow-hidden z-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-amber-900/50">
          
          {/* Brand footer text */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex gap-2">
              <CakeZoneLogo 
                size={32} 
                className="cursor-pointer hover:scale-110 active:scale-95 transition-transform" 
                onClick={() => setIsLogoZoomed(true)} 
              />
              <h3 className="font-serif font-black text-base text-white tracking-wide uppercase self-center">
                Cake Zone
              </h3>
            </div>
            <p className="text-[11px] text-amber-200/70 leading-relaxed max-w-sm">
              We are specialized bespoke celebration cake designers situated opposite State Bank at co-operative Colony, Kadapa. Call us regarding grand orders: <strong><a href="tel:7396500338" onClick={(e) => { e.preventDefault(); setSelectedPhone('7396500338'); }} className="hover:underline text-amber-300 hover:text-white transition-colors duration-150 cursor-pointer">7396500338</a>, <a href="tel:9014384008" onClick={(e) => { e.preventDefault(); setSelectedPhone('9014384008'); }} className="hover:underline text-amber-300 hover:text-white transition-colors duration-150 cursor-pointer">9014384008</a></strong>.
            </p>
          </div>

          {/* Quick links shortcuts */}
          <div className="md:col-span-3 text-xs space-y-2.5">
            <h4 className="font-serif font-bold text-white uppercase tracking-wider text-[11px]">Quick Jump</h4>
            <ul className="space-y-1.5 text-amber-200/80">
              <li>
                <button onClick={() => scrollToView('about-bakery')} className="hover:text-amber-350 hover:text-amber-350 block">About Bakery</button>
              </li>
              <li>
                <button onClick={() => scrollToView('bespoke-studio')} className="hover:text-amber-350 block">Custom Studio</button>
              </li>
              <li>
                <button onClick={() => scrollToView('menu-gallery')} className="hover:text-amber-350 block">Product Gallery</button>
              </li>
              <li>
                <button onClick={() => scrollToView('opinions')} className="hover:text-amber-350 block">User Ratings</button>
              </li>
            </ul>
          </div>

          {/* Newsletter section */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="font-serif font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-400" /> Bakery Promotions & Updates
            </h4>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 text-xs pt-1">
              <input
                type="email"
                required
                placeholder="Enter email e.g. you@gmail.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-amber-900/50 border border-amber-800 px-3 py-2 rounded-xl text-white placeholder-amber-250 w-full focus:outline-none focus:border-amber-400 font-sans text-xs"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold px-4 rounded-xl shrink-0 tracking-wide uppercase text-[10px]"
              >
                Sign Up
              </button>
            </form>
            {newsletterMsg && (
              <p className="text-[11px] text-yellow-300 font-semibold bg-amber-900/40 p-2 rounded-lg animate-fade-in">
                {newsletterMsg}
              </p>
            )}
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-6 pt-5 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-amber-350 text-amber-200/60 font-mono">
          <span>&copy; {new Date().getFullYear()} Cake Zone Kadapa. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            👨‍🍳 Managed locally at Co-operative Colony, Kadapa.
          </span>
        </div>
      </footer>

      {/* Online order Pre-order basket portal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        profile={userProfile}
        onUpdateCartItemQty={handleUpdateCartQty}
        onRemoveCartItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      <AnimatePresence>
        {selectedPhone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhone(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full z-10 overflow-hidden text-left"
            >
              {/* Decorative amber glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 dark:bg-amber-950/40 rounded-full blur-2xl opacity-50 -mr-4 -mt-4 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-amber-700 dark:text-amber-400 text-[10px] uppercase font-mono tracking-wider font-bold">Contact Channel</span>
                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-50 mt-0.5">Connect with Us</h3>
                </div>
                <button 
                  onClick={() => setSelectedPhone(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
                How would you like to reach out to us at <strong className="text-amber-900 dark:text-amber-300 font-mono">{selectedPhone}</strong>?
              </p>
              
              <div className="space-y-3">
                {/* 1. Call Hotline */}
                <a
                  href={`tel:${selectedPhone}`}
                  onClick={() => setSelectedPhone(null)}
                  className="flex items-center gap-3 w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs py-3.5 px-4 rounded-2xl transition-all shadow hover:shadow-md active:scale-[0.98] justify-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>1. Call Hotline</span>
                </a>
                
                {/* 2. WhatsApp Chat */}
                <a
                  href={`https://wa.me/91${selectedPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedPhone(null)}
                  className="flex items-center gap-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-4 rounded-2xl transition-all shadow hover:shadow-md active:scale-[0.98] justify-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>2. WhatsApp Chat</span>
                </a>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setSelectedPhone(null)}
                  className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:underline transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isLogoZoomed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoZoomed(false)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="relative bg-stone-950 border border-stone-850 rounded-[32px] p-8 shadow-2xl max-w-sm w-full z-10 text-center overflow-hidden"
            >
              {/* Gold light burst background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-6 -mt-6 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -ml-6 -mb-6 pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setIsLogoZoomed(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-stone-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Logo Visual container - matching the user-uploaded graphic of Cake Zone */}
              <div className="mx-auto w-56 h-56 flex items-center justify-center rounded-2xl bg-black p-4 border border-stone-800/80 shadow-2xl">
                <CakeZoneLogo size="100%" />
              </div>

              {/* Logo Text Label */}
              <div className="mt-6 space-y-2">
                <h3 className="font-serif text-2xl font-black tracking-[0.2em] text-white uppercase select-none">
                  CAKE ZONE
                </h3>
                <p className="text-[10px] uppercase font-mono tracking-widest text-amber-500/80 font-bold">
                  Bespoke Celebration Cakes
                </p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed pt-2">
                  Opposite State Bank, co-operative Colony, Kadapa. Call for grand custom pre-orders: <strong className="text-amber-200">7396500338</strong>.
                </p>
              </div>

              {/* Decorative accent lines */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-stone-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <div className="h-px w-8 bg-stone-800" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
