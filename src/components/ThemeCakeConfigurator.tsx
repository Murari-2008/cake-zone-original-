import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, CheckCircle, PenTool, Upload, Trash2, FileText, Image as ImageIcon, X } from 'lucide-react';
import { MenuItem } from '../types';

interface ThemeCakeConfiguratorProps {
  onAddCustomCake: (customItem: MenuItem, details: any) => void;
}

export default function ThemeCakeConfigurator({ onAddCustomCake }: ThemeCakeConfiguratorProps) {
  const [cakeType, setCakeType] = useState('Normal');
  const [flavour, setFlavour] = useState('Vanilla');
  const [weight, setWeight] = useState('0.5 kg');
  const [cakeShape, setCakeShape] = useState<'Round' | 'Rectangle' | 'Heart'>('Round');
  const [isDinosaur, setIsDinosaur] = useState(false);
  const [isAnimal, setIsAnimal] = useState(false);
  const [isTeddyBear, setIsTeddyBear] = useState(false);
  const [isLion, setIsLion] = useState(false);
  const [isTomJerry, setIsTomJerry] = useState(false);
  const [isBossBaby, setIsBossBaby] = useState(false);
  const [color, setColor] = useState('#fef08a'); // default Royal Cream Gold
  const [message, setMessage] = useState('Happy Birthday!');
  const [topping, setTopping] = useState<string | null>(null);
  const [photoPrint, setPhotoPrint] = useState<'Yes' | 'No'>('No');
  const [photoPrintImage, setPhotoPrintImage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [promptSelectFlavorAndWeight, setPromptSelectFlavorAndWeight] = useState(false);
  const [selectedPhotoModelName, setSelectedPhotoModelName] = useState<string | null>(null);
  const [showNoPhotoWarning, setShowNoPhotoWarning] = useState(false);

  useEffect(() => {
    const handlePreorderDinosaurCake = (e: Event) => {
      const customEvent = e as CustomEvent<{ item: MenuItem }>;
      if (customEvent.detail && customEvent.detail.item) {
        setIsDinosaur(true);
        setIsAnimal(false);
        setCakeType('Pastry(CoolCake)');
        setFlavour('Vanilla Pastry');
        setCakeShape('Round');
        setWeight('2.0 kg');
        
        // Scroll to the "Curate Ur Perfect Cake" section
        const titleElement = document.getElementById('customize-title');
        if (titleElement) {
          titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    const handlePreorderAnimalCake = (e: Event) => {
      const customEvent = e as CustomEvent<{ item: MenuItem }>;
      if (customEvent.detail && customEvent.detail.item) {
        setIsDinosaur(false);
        setIsAnimal(true);
        setIsTeddyBear(false);
        setCakeType('Pastry(CoolCake)');
        setFlavour('Vanilla Pastry');
        setCakeShape('Round');
        setWeight('2.0 kg');
        setTopping(null);
        setPhotoPrint('No');
        
        // Scroll to the "Curate Ur Perfect Cake" section
        const titleElement = document.getElementById('customize-title');
        if (titleElement) {
          titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    const handlePreorderTeddyBearCake = (e: Event) => {
      const customEvent = e as CustomEvent<{ item: MenuItem }>;
      if (customEvent.detail && customEvent.detail.item) {
        setIsDinosaur(false);
        setIsAnimal(false);
        setIsTeddyBear(true);
        setIsLion(false);
        setCakeType('Pastry(CoolCake)');
        setFlavour('Vanilla Pastry');
        setCakeShape('Round');
        setWeight('2.0 kg');
        setTopping(null);
        setPhotoPrint('No');
        
        // Scroll to the "Curate Ur Perfect Cake" section
        const titleElement = document.getElementById('customize-title');
        if (titleElement) {
          titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    const handlePreorderLionCake = (e: Event) => {
      const customEvent = e as CustomEvent<{ item: MenuItem }>;
      if (customEvent.detail && customEvent.detail.item) {
        setIsDinosaur(false);
        setIsAnimal(false);
        setIsTeddyBear(false);
        setIsLion(true);
        setIsTomJerry(false);
        setCakeType('Pastry(CoolCake)');
        setFlavour('Vanilla Pastry');
        setCakeShape('Round');
        setWeight('2.0 kg');
        setTopping(null);
        setPhotoPrint('No');
        
        // Scroll to the "Curate Ur Perfect Cake" section
        const titleElement = document.getElementById('customize-title');
        if (titleElement) {
          titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    const handlePreorderTomJerryCake = (e: Event) => {
      const customEvent = e as CustomEvent<{ item: MenuItem }>;
      if (customEvent.detail && customEvent.detail.item) {
        setIsDinosaur(false);
        setIsAnimal(false);
        setIsTeddyBear(false);
        setIsLion(false);
        setIsTomJerry(true);
        setIsBossBaby(false);
        setCakeType('Pastry(CoolCake)');
        setFlavour('Vanilla Pastry');
        setCakeShape('Round');
        setWeight('2.0 kg');
        setTopping(null);
        setPhotoPrint('No');
        
        // Scroll to the "Curate Ur Perfect Cake" section
        const titleElement = document.getElementById('customize-title');
        if (titleElement) {
          titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    const handlePreorderBossBabyCake = (e: Event) => {
      const customEvent = e as CustomEvent<{ item: MenuItem }>;
      if (customEvent.detail && customEvent.detail.item) {
        setIsDinosaur(false);
        setIsAnimal(false);
        setIsTeddyBear(false);
        setIsLion(false);
        setIsTomJerry(false);
        setIsBossBaby(true);
        setCakeType('Pastry(CoolCake)');
        setFlavour('Vanilla Pastry');
        setCakeShape('Round');
        setWeight('2.0 kg');
        setTopping(null);
        setPhotoPrint('No');
        
        // Scroll to the "Curate Ur Perfect Cake" section
        const titleElement = document.getElementById('customize-title');
        if (titleElement) {
          titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    window.addEventListener('preorder-dinosaur-cake', handlePreorderDinosaurCake);
    window.addEventListener('preorder-animal-cake', handlePreorderAnimalCake);
    window.addEventListener('preorder-teddybear-cake', handlePreorderTeddyBearCake);
    window.addEventListener('preorder-lion-cake', handlePreorderLionCake);
    window.addEventListener('preorder-tomjerry-cake', handlePreorderTomJerryCake);
    window.addEventListener('preorder-bossbaby-cake', handlePreorderBossBabyCake);
    return () => {
      window.removeEventListener('preorder-dinosaur-cake', handlePreorderDinosaurCake);
      window.removeEventListener('preorder-animal-cake', handlePreorderAnimalCake);
      window.removeEventListener('preorder-teddybear-cake', handlePreorderTeddyBearCake);
      window.removeEventListener('preorder-lion-cake', handlePreorderLionCake);
      window.removeEventListener('preorder-tomjerry-cake', handlePreorderTomJerryCake);
      window.removeEventListener('preorder-bossbaby-cake', handlePreorderBossBabyCake);
    };
  }, []);

  // Listen for PhotoPrint model selection from the PhotoPrint Cakes section
  useEffect(() => {
    const handleModelSelected = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; imageUrl: string }>;
      if (customEvent.detail) {
        setPhotoPrint('Yes');
        setPhotoPrintImage(customEvent.detail.imageUrl);
        setSelectedPhotoModelName(customEvent.detail.name);
        setPromptSelectFlavorAndWeight(true);
        
        // Ensure weight is compatible with photoprint ('Yes' photoprint round/rectangle needs at least 1.0 kg)
        if (weight === '0.5 kg' || weight === 'above 600 grams') {
          setWeight('1.0 kg');
        }

        // Scroll back to the "Curate Ur Perfect Cake" section
        const titleElement = document.getElementById('customize-title');
        if (titleElement) {
          titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    window.addEventListener('photoprint-model-selected', handleModelSelected);
    return () => {
      window.removeEventListener('photoprint-model-selected', handleModelSelected);
    };
  }, [weight]);

  // Automatically reset selected weight depending on selected shape and photoprint
  useEffect(() => {
    const isSpiderman1 = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('spiderman1');
    const isSpiderman = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('spiderman') && !isSpiderman1;
    const isVijay = photoPrint === 'Yes' && (
      selectedPhotoModelName?.toLowerCase().includes('vijay') ||
      selectedPhotoModelName?.toLowerCase().includes('deverakonda') ||
      selectedPhotoModelName?.toLowerCase().includes('devarakonda')
    );
    const isIronman = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('ironman');
    const isMotuPatlu = photoPrint === 'Yes' && (
      selectedPhotoModelName?.toLowerCase().includes('motu') ||
      selectedPhotoModelName?.toLowerCase().includes('patlu')
    );
    const isSofia = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('sofia');

    if (isSpiderman) {
      if (cakeType !== 'Normal') {
        setCakeType('Normal');
        setFlavour('Vanilla Cake'); // default for Normal
      }
      if (cakeShape !== 'Round') {
        setCakeShape('Round');
      }
      if (weight !== '1.0 kg' && weight !== '1.5 kg' && weight !== '0.5 kg') {
        setWeight('1.0 kg');
      }
      if (topping !== null) {
        setTopping(null);
      }
    } else if (isSpiderman1) {
      if (cakeType !== 'Pastry(CoolCake)') {
        setCakeType('Pastry(CoolCake)');
        setFlavour('Vanilla Pastry'); // default for Pastry
      }
      if (cakeShape !== 'Rectangle') {
        setCakeShape('Rectangle');
      }
      if (weight !== '2.0 kg' && weight !== '3.0 kg') {
        setWeight('2.0 kg');
      }
      if (topping !== null) {
        setTopping(null);
      }
    } else if (isVijay) {
      if (cakeType !== 'Normal') {
        setCakeType('Normal');
        setFlavour('Vanilla Cake'); // default for Normal
      }
      if (cakeShape !== 'Round') {
        setCakeShape('Round');
      }
      if (weight !== '1.0 kg' && weight !== '1.5 kg') {
        setWeight('1.0 kg');
      }
      if (topping !== null) {
        setTopping(null);
      }
    } else if (isIronman) {
      if (cakeType !== 'Pastry(CoolCake)') {
        setCakeType('Pastry(CoolCake)');
        setFlavour('Vanilla Pastry'); // default for Pastry
      }
      if (cakeShape !== 'Round') {
        setCakeShape('Round');
      }
      if (weight !== '1.0 kg' && weight !== '1.5 kg') {
        setWeight('1.0 kg');
      }
    } else if (isMotuPatlu) {
      if (cakeType !== 'Normal') {
        setCakeType('Normal');
        setFlavour('Vanilla Cake'); // default for Normal
      }
      if (cakeShape !== 'Rectangle') {
        setCakeShape('Rectangle');
      }
      if (weight !== '2.0 kg' && weight !== '3.0 kg') {
        setWeight('2.0 kg');
      }
      if (topping !== null) {
        setTopping(null);
      }
    } else if (isSofia) {
      if (cakeType !== 'Normal') {
        setCakeType('Normal');
        setFlavour('Vanilla Cake'); // default for Normal
      }
      if (cakeShape !== 'Rectangle') {
        setCakeShape('Rectangle');
      }
      if (weight !== '2.0 kg' && weight !== '3.0 kg') {
        setWeight('2.0 kg');
      }
      if (topping !== null) {
        setTopping(null);
      }
    } else if (flavour === 'Dinosaur') {
      if (cakeType !== 'Pastry(CoolCake)') {
        setCakeType('Pastry(CoolCake)');
      }
      if (cakeShape !== 'Round') {
        setCakeShape('Round');
      }
      if (!['2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(weight)) {
        setWeight('2.0 kg');
      }
      if (topping !== null) {
        setTopping(null);
      }
    } else if (flavour === 'Vanilla') {
      if (cakeType !== 'Normal') {
        setCakeType('Normal');
      }
      if (cakeShape !== 'Round') {
        setCakeShape('Round');
      }
      if (weight !== '1.0 kg' && weight !== '1.5 kg' && weight !== '0.5 kg') {
        setWeight('0.5 kg');
      }
      if (topping !== null) {
        setTopping(null);
      }
    } else if (flavour === 'Pineapple' && photoPrint === 'Yes') {
      if (cakeType !== 'Normal') {
        setCakeType('Normal');
      }
      if (cakeShape !== 'Round') {
        setCakeShape('Round');
      }
      if (weight !== '1.0 kg' && weight !== '1.5 kg' && weight !== '0.5 kg') {
        setWeight('0.5 kg');
      }
      if (topping !== null) {
        setTopping(null);
      }
    } else if (flavour === 'Strawberry') {
      if (cakeType !== 'Normal') {
        setCakeType('Normal');
      }
      if (cakeShape !== 'Round') {
        setCakeShape('Round');
      }
      if (weight !== '1.0 kg' && weight !== '1.5 kg' && weight !== '0.5 kg') {
        setWeight('0.5 kg');
      }
      if (topping !== null) {
        setTopping(null);
      }
    } else {
      if (cakeShape === 'Round' && photoPrint === 'No') {
        if (weight === '4.0 kg' || weight === '5.0 kg') {
          setWeight('3.0 kg');
        }
      } else if (cakeShape === 'Round' && photoPrint === 'Yes') {
        if (weight === '0.5 kg' || weight === 'above 600 grams') {
          setWeight('1.0 kg');
        }
      } else if (cakeShape === 'Rectangle' && photoPrint === 'Yes') {
        if (weight === '0.5 kg' || weight === 'above 600 grams') {
          setWeight('1.0 kg');
        }
      } else if (cakeShape === 'Heart' && photoPrint === 'No') {
        if (!['1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg'].includes(weight)) {
          setWeight('1.0 kg');
        }
      } else if (cakeShape === 'Heart' && photoPrint === 'Yes') {
        if (!['1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(weight)) {
          setWeight('1.0 kg');
        }
      }
    }
  }, [cakeShape, photoPrint, weight, selectedPhotoModelName, cakeType, topping, flavour]);
  
  // Custom uploaded reference image and spec requirements states
  const [refImage, setRefImage] = useState<string | null>(null);
  const [customRequirements, setCustomRequirements] = useState('');
  const [useUploadedImageInPreview, setUseUploadedImageInPreview] = useState(false);

  // Popover / prompt overlay states for contact details
  const [showAskModal, setShowAskModal] = useState(false);
  const [askName, setAskName] = useState(() => {
    try {
      const saved = localStorage.getItem('cz_profile');
      if (saved) return JSON.parse(saved).name || '';
    } catch { }
    return '';
  });
  const [askWhatsApp, setAskWhatsApp] = useState(() => {
    try {
      const saved = localStorage.getItem('cz_profile');
      if (saved) return JSON.parse(saved).phone || '';
    } catch { }
    return '';
  });
  const [askMail, setAskMail] = useState(() => {
    try {
      const saved = localStorage.getItem('cz_profile');
      if (saved) return JSON.parse(saved).email || '';
    } catch { }
    return '';
  });

  const [redeemCode, setRedeemCode] = useState('');
  const [redeemOption, setRedeemOption] = useState<'none' | 'redeem'>('none');
  const [userLoyaltyPoints, setUserLoyaltyPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('cz_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.loyaltyPoints === 'number') {
          return parsed.loyaltyPoints;
        }
      }
    } catch { }
    return 120; // default template pre-load
  });

  const normalFlavours = [
    'Vanilla',
    'Pineapple',
    'Strawberry',
    'Butterscotch',
    'Chocolate',
    'Honey Flavour'
  ];

  const pastryFlavours = [
    'Vanilla Pastry',
    'Pineapple Pastry',
    'Strawberry Pastry',
    'Butterscotch Pastry',
    'Honey Almond Pastry',
    'Blueberry Pastry',
    'Blackcurrent Pastry',
    'Redvelvet Pastry',
    'Mango Cake (Only Seasonal )',
    'Black Forest Pastry',
    'Chocolate Pastry',
    'Chacochips Pastry',
    'Choconuts Cake Pastry',
    'Dry Fruit Cake Pastry',
    'Dinosaur'
  ];

  const activeFlavours = isTomJerry || isBossBaby || isLion || isTeddyBear || isAnimal
    ? ['Vanilla Pastry', 'Pineapple Pastry', 'Strawberry Pastry', 'Butterscotch Pastry', 'Chocolate Pastry']
    : (isDinosaur
      ? ['Vanilla Pastry', 'Pineapple Pastry', 'Strawberry Pastry', 'Butterscotch Pastry', 'Chocolate Pastry']
      : (cakeType === 'Normal' ? normalFlavours : pastryFlavours));
  const toppings = ['Candied Cherries & Gold Dust', 'Oreo Cookie Chunks', 'Salted Pistachio Crumbs', 'Mixed Fresh Berries', 'Deco Royal Fondant Roses'];
  
  // Updated weights array to include the newly requested 4.0 kg and 5.0 kg variations and handle Pastry vs Normal
  const getWeights = (cakeType, flavour, isDinosaur, isAnimal, isTeddyBear, isLion, isTomJerry, isBossBaby) => {
    if (isBossBaby || isTomJerry || isLion || isTeddyBear || isAnimal) return [
        { label: '2.0 kg', display: '2.0 kg', price: 3000 },
        { label: '3.0 kg', display: '3.0 kg', price: 4500 },
        { label: '4.0 kg', display: '4.0 kg', price: 6000 },
        { label: '5.0 kg', display: '5.0 kg', price: 7500 },
      ];
    if (isDinosaur) return [
        { label: '2.0 kg (Grand Celebration)', display: '2.0 kg', price: 3000 },
        { label: '3.0 kg (Royal Feast)', display: '3.0 kg', price: 4500 },
        { label: '4.0 kg (Spectacular)', display: '4.0 kg', price: 6000 },
        { label: '5.0 kg (Grand Wedding/Event)', display: '5.0 kg', price: 7500 },
      ];
    if (cakeType === 'Pastry(CoolCake)') {
      if (flavour === 'Vanilla Pastry' || flavour === 'Pineapple Pastry' || flavour === 'Strawberry Pastry') return [
        { label: 'above 600 grams', display: 'above 600 grams', price: 430 },
        { label: '1.0 kg (Standard)', display: '1.0 kg', price: 680 },
        { label: '1.5 kg (Party)', display: '1.5 kg', price: 1005 },
        { label: '2.0 kg (Grand Celebration)', display: '2.0 kg', price: 1330 },
        { label: '3.0 kg (Royal Feast)', display: '3.0 kg', price: 1980 },
        { label: '4.0 kg (Spectacular)', display: '4.0 kg', price: 2630 },
        { label: '5.0 kg (Grand Wedding/Event)', display: '5.0 kg', price: 3280 },
      ];
      return [
        { label: 'above 600 grams', display: 'above 600 grams', price: 600 },
        { label: '1.0 kg (Standard)', display: '1.0 kg', price: 1100 },
        { label: '1.5 kg (Party)', display: '1.5 kg', price: 1600 },
        { label: '2.0 kg (Grand Celebration)', display: '2.0 kg', price: 2100 },
        { label: '3.0 kg (Royal Feast)', display: '3.0 kg', price: 3100 },
        { label: '4.0 kg (Spectacular)', display: '4.0 kg', price: 4100 },
        { label: '5.0 kg (Grand Wedding/Event)', display: '5.0 kg', price: 5100 },
      ];
    }
    if (flavour === 'Vanilla' || flavour === 'Pineapple' || flavour === 'Strawberry') return [
      { label: '500 grams (Personal)', display: '0.5 kg', price: 270 },
      { label: '1.0 kg (Standard)', display: '1.0 kg', price: 430 },
      { label: '1.5 kg (Party)', display: '1.5 kg', price: 645 },
      { label: '2.0 kg (Grand Celebration)', display: '2.0 kg', price: 860 },
      { label: '3.0 kg (Royal Feast)', display: '3.0 kg', price: 1290 },
      { label: '4.0 kg (Spectacular)', display: '4.0 kg', price: 1720 },
      { label: '5.0 kg (Grand Wedding/Event)', display: '5.0 kg', price: 2150 },
    ];
    if (flavour === 'Butterscotch' || flavour === 'Chocolate') return [
      { label: '500 grams (Personal)', display: '0.5 kg', price: 300 },
      { label: '1.0 kg (Standard)', display: '1.0 kg', price: 490 },
      { label: '1.5 kg (Party)', display: '1.5 kg', price: 735 },
      { label: '2.0 kg (Grand Celebration)', display: '2.0 kg', price: 980 },
      { label: '3.0 kg (Royal Feast)', display: '3.0 kg', price: 1470 },
      { label: '4.0 kg (Spectacular)', display: '4.0 kg', price: 1960 },
      { label: '5.0 kg (Grand Wedding/Event)', display: '5.0 kg', price: 2450 },
    ];
    if (flavour === 'Honey Flavour') return [
      { label: '500 grams (Personal)', display: '0.5 kg', price: 0, isNotAvailable: true },
      { label: '1.0 kg (Standard)', display: '1.0 kg', price: 500 },
      { label: '1.5 kg (Party)', display: '1.5 kg', price: 750 },
      { label: '2.0 kg (Grand Celebration)', display: '2.0 kg', price: 1000 },
      { label: '3.0 kg (Royal Feast)', display: '3.0 kg', price: 1500 },
      { label: '4.0 kg (Spectacular)', display: '4.0 kg', price: 2000 },
      { label: '5.0 kg (Grand Wedding/Event)', display: '5.0 kg', price: 2500 },
    ];
    return [
      { label: '0.5 kg (Personal)', display: '0.5 kg', price: 600 },
      { label: '1.0 kg (Standard)', display: '1.0 kg', price: 1100 },
      { label: '1.5 kg (Party)', display: '1.5 kg', price: 1600 },
      { label: '2.0 kg (Grand Celebration)', display: '2.0 kg', price: 2100 },
      { label: '3.0 kg (Royal Feast)', display: '3.0 kg', price: 3100 },
      { label: '4.0 kg (Spectacular)', display: '4.0 kg', price: 4100 },
      { label: '5.0 kg (Grand Wedding/Event)', display: '5.0 kg', price: 5100 },
    ];
  };

  const weights = getWeights(cakeType, flavour, isDinosaur, isAnimal, isTeddyBear, isLion, isTomJerry, isBossBaby);


  const baseDisplayedWeights = (cakeShape === 'Round' && photoPrint === 'No')
    ? weights.filter(w => ['0.5 kg', 'above 600 grams', '1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : (cakeShape === 'Round' && photoPrint === 'Yes')
    ? weights.filter(w => ['1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : (cakeShape === 'Rectangle' && photoPrint === 'No')
    ? weights.filter(w => ['0.5 kg', 'above 600 grams', '1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : (cakeShape === 'Rectangle' && photoPrint === 'Yes')
    ? weights.filter(w => ['1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : (cakeShape === 'Heart' && photoPrint === 'No')
    ? weights.filter(w => ['1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : (cakeShape === 'Heart' && photoPrint === 'Yes')
    ? weights.filter(w => ['1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : weights;

  const isSpiderman1Active = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('spiderman1');
  const isSpidermanActive = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('spiderman') && !isSpiderman1Active;
  const isVijayActive = photoPrint === 'Yes' && (
    selectedPhotoModelName?.toLowerCase().includes('vijay') ||
    selectedPhotoModelName?.toLowerCase().includes('deverakonda') ||
    selectedPhotoModelName?.toLowerCase().includes('devarakonda')
  );
  const isIronmanActive = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('ironman');
  const isMotuPatluActive = photoPrint === 'Yes' && (
    selectedPhotoModelName?.toLowerCase().includes('motu') ||
    selectedPhotoModelName?.toLowerCase().includes('patlu')
  );
  const isSofiaActive = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('sofia');

  const isVanillaCakeActive = flavour === 'Vanilla';
  const isPineapplePhotoPrintActive = flavour === 'Pineapple' && photoPrint === 'Yes';
  const isStrawberryCakeActive = flavour === 'Strawberry';

  const displayedWeights = isVanillaCakeActive
    ? weights.filter(w => ['0.5 kg', '1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : isPineapplePhotoPrintActive
    ? weights.filter(w => ['0.5 kg', '1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : isStrawberryCakeActive
    ? weights.filter(w => ['0.5 kg', '1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : isSpidermanActive 
    ? weights.filter(w => ['0.5 kg', '1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : isSpiderman1Active
    ? weights.filter(w => ['2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : isVijayActive
    ? weights.filter(w => ['1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : isIronmanActive
    ? weights.filter(w => ['1.0 kg', '1.5 kg', '2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : isMotuPatluActive
    ? weights.filter(w => ['2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : isSofiaActive
    ? weights.filter(w => ['2.0 kg', '3.0 kg', '4.0 kg', '5.0 kg'].includes(w.display))
    : baseDisplayedWeights;

  const currentWeightObj = weights.find(w => w.display === weight) || weights.find(w => w.label.startsWith(weight.split(' ')[0])) || weights[0];
  const isBelow1kg = weight === '0.5 kg' || weight === 'above 600 grams';
  const photoPrintPrice = isBelow1kg ? 200 : 300;
  const shapePrice = cakeShape === 'Heart' ? 50 : 0;
  const totalPrice = currentWeightObj.price + (topping ? 100 : 0) + (photoPrint === 'Yes' ? photoPrintPrice : 0) + shapePrice;

  // Check code discount
  let redeemDiscount = 0;
  let codeValidationResult = '';
  const trimmedCode = redeemCode.trim().toUpperCase();
  if (trimmedCode) {
    if (trimmedCode === 'KADAPATREAT') {
      redeemDiscount = Math.floor(totalPrice * 0.15);
      codeValidationResult = 'KADAPATREAT applied! -15% off total (₹' + redeemDiscount + ' discount)';
    } else if (trimmedCode === 'CAKEZONE10') {
      redeemDiscount = Math.floor(totalPrice * 0.10);
      codeValidationResult = 'CAKEZONE10 applied! -10% off total (₹' + redeemDiscount + ' discount)';
    } else if (trimmedCode === 'WELCOME50') {
      redeemDiscount = Math.min(50, totalPrice);
      codeValidationResult = 'WELCOME50 applied! Flat ₹50 off (₹' + redeemDiscount + ' discount)';
    } else {
      codeValidationResult = 'Invalid discount code...';
    }
  }

  // Calculate maximum redeemable points
  const priceAfterCode = Math.max(0, totalPrice - redeemDiscount);
  const maxPossiblePointsToRedeem = Math.min(userLoyaltyPoints, priceAfterCode);

  const appliedLoyaltyPoints = redeemOption === 'redeem' ? maxPossiblePointsToRedeem : 0;
  const loyaltyDiscount = appliedLoyaltyPoints; // ₹1 per point

  const grandPrice = Math.max(0, priceAfterCode - loyaltyDiscount);
  const pointsAwarded = Math.floor(grandPrice / 100);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgData = reader.result as string;
        setRefImage(imgData);
        setPhotoPrintImage(imgData); // Sync with PhotoPrintImage!
        setUseUploadedImageInPreview(true); // Automatically toggle preview to uploaded reference
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreBookClick = () => {
    if (photoPrint === 'Yes' && !refImage) {
      setShowNoPhotoWarning(true);
    } else {
      setShowAskModal(true);
    }
  };

  const handleConfirmDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAskModal(false);

    // Save to local storage for automatic prefill in Cart / Checkout
    try {
      const saved = localStorage.getItem('cz_profile');
      let profile = saved ? JSON.parse(saved) : {};
      if (!profile) profile = {};
      profile.name = askName;
      profile.phone = askWhatsApp;
      profile.email = askMail;
      
      // Update local storage loyalty points
      const finalPoints = Math.max(0, userLoyaltyPoints - appliedLoyaltyPoints + pointsAwarded);
      profile.loyaltyPoints = finalPoints;
      setUserLoyaltyPoints(finalPoints);
      
      localStorage.setItem('cz_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('storage'));
    } catch { }

    const customCakeItem: MenuItem = {
      id: `custom-theme-${Date.now()}`,
      name: `Customized Cake [${flavour}]`,
      category: 'Theme Cakes',
      price: totalPrice,
      description: `Bespoke ${weight} ${cakeShape} ${cakeType} design with ${flavour} flavour. PhotoPrint: ${photoPrint}${photoPrint === 'Yes' && photoPrintImage ? ' (Photo Loaded)' : ''}. Topped with ${topping || "None"}. Frosting hex: ${color}. Requirements: ${customRequirements || "None"}`,
      imageUrl: photoPrintImage || refImage || 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=600&q=80',
      inStock: 99,
    };

    // Include the requested details in the customDetailsText
    const customDetailsText = `Type: ${cakeType} | PhotoPrint(Edible) -- status: ${photoPrint}${photoPrint === 'Yes' && photoPrintImage ? ' [Edible Photo Attached]' : ''} | Batter Flavour: ${flavour} | Cake Shape: ${cakeShape} | Cake Weight: ${weight} | Icing Text Message: "${message}" | Upload Reference Image: ${refImage ? 'Yes (Reference Image Attached)' : 'None'} | Description For Custom Cake: ${customRequirements || 'None'} | Royal Garnish: ${topping || 'None'}` +  
      ` | Preorder Client: ${askName} | WhatsApp: ${askWhatsApp} | Mail: ${askMail}` +
      (trimmedCode ? ` | Code: ${trimmedCode} (-₹${redeemDiscount})` : '') +
      (appliedLoyaltyPoints > 0 ? ` | Points Redeemed: ${appliedLoyaltyPoints} pts (-₹${appliedLoyaltyPoints})` : '') +
      ` | Loyalty Earned: +${pointsAwarded} pts`;

    onAddCustomCake(customCakeItem, customDetailsText);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  useEffect(() => {
    (window as any).__configureThemeCake = (opts: {
      flavour?: string;
      shape?: 'Round' | 'Rectangle' | 'Heart';
      weight?: string;
      photoPrint?: 'Yes' | 'No';
      icingText?: string;
      cakeType?: 'Normal' | 'Eggless';
      topping?: string | null;
    }) => {
      if (opts.flavour !== undefined) setFlavour(opts.flavour);
      if (opts.shape !== undefined) setCakeShape(opts.shape);
      if (opts.weight !== undefined) setWeight(opts.weight);
      if (opts.photoPrint !== undefined) setPhotoPrint(opts.photoPrint);
      if (opts.icingText !== undefined) setMessage(opts.icingText);
      if (opts.cakeType !== undefined) setCakeType(opts.cakeType);
      if (opts.topping !== undefined) setTopping(opts.topping);
      return { success: true, message: "Theme cake successfully configured!" };
    };

    (window as any).__addCustomCakeToCart = (name: string, whatsapp: string, email: string, loyaltyOption: 'none' | 'redeem') => {
      setAskName(name);
      setAskWhatsApp(whatsapp);
      setAskMail(email);
      setRedeemOption(loyaltyOption);
      
      const finalPoints = Math.max(0, userLoyaltyPoints - appliedLoyaltyPoints + pointsAwarded);
      try {
        const saved = localStorage.getItem('cz_profile') || '{}';
        const profile = JSON.parse(saved);
        profile.name = name;
        profile.phone = whatsapp;
        profile.email = email;
        profile.loyaltyPoints = finalPoints;
        localStorage.setItem('cz_profile', JSON.stringify(profile));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {}

      const customCakeItem: MenuItem = {
        id: `custom-theme-${Date.now()}`,
        name: `Customized Cake [${flavour}]`,
        category: 'Theme Cakes',
        price: totalPrice,
        description: `Bespoke ${weight} ${cakeShape} ${cakeType} design with ${flavour} flavour. PhotoPrint: ${photoPrint}${photoPrint === 'Yes' && photoPrintImage ? ' (Photo Loaded)' : ''}. Topped with ${topping || "None"}. Frosting hex: ${color}. Requirements: ${customRequirements || "None"}`,
        imageUrl: photoPrintImage || refImage || 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=600&q=80',
        inStock: 99,
      };

      const customDetailsText = `Type: ${cakeType} | PhotoPrint(Edible) -- status: ${photoPrint}${photoPrint === 'Yes' && photoPrintImage ? ' [Edible Photo Attached]' : ''} | Batter Flavour: ${flavour} | Cake Shape: ${cakeShape} | Cake Weight: ${weight} | Icing Text Message: "${message}" | Upload Reference Image: ${refImage ? 'Yes (Reference Image Attached)' : 'None'} | Description For Custom Cake: ${customRequirements || 'None'} | Royal Garnish: ${topping || 'None'}` +  
        ` | Preorder Client: ${name} | WhatsApp: ${whatsapp} | Mail: ${email}` +
        (loyaltyOption === 'redeem' ? ` | Points Redeemed: ${appliedLoyaltyPoints} pts (-₹${appliedLoyaltyPoints})` : '') +
        ` | Loyalty Earned: +${pointsAwarded} pts`;

      onAddCustomCake(customCakeItem, customDetailsText);
      return { success: true, price: totalPrice, msg: "Customized cake added to cart!" };
    };

    return () => {
      delete (window as any).__configureThemeCake;
      delete (window as any).__addCustomCakeToCart;
    };
  }, [
    setFlavour, setCakeShape, setWeight, setPhotoPrint, setMessage, setCakeType, setTopping,
    setAskName, setAskWhatsApp, setAskMail, setRedeemOption, 
    flavour, cakeShape, cakeType, weight, topping, color, customRequirements, 
    photoPrint, photoPrintImage, refImage, message, totalPrice, userLoyaltyPoints, 
    appliedLoyaltyPoints, pointsAwarded, onAddCustomCake
  ]);

  const getFrostingColor = () => {
    if (isDinosaur) return '#10b981'; // Emerald Green
    if (isAnimal) return '#a7f3d0'; // Soft Mint
    if (isTeddyBear) return '#d97706'; // Soft Caramel Brown
    if (isLion) return '#f59e0b'; // Lion Yellow/Orange
    if (isTomJerry) return '#fef08a'; // Cheese Yellow
    if (isBossBaby) return '#bae6fd'; // Sky Blue
    
    const fLower = flavour.toLowerCase();
    if (fLower.includes('chocolate') || fLower.includes('chaco') || fLower.includes('choco')) return '#3d2516';
    if (fLower.includes('strawberry')) return '#ffd1dc';
    if (fLower.includes('pineapple')) return '#fff4a3';
    if (fLower.includes('butterscotch')) return '#ebaa5c';
    if (fLower.includes('blueberry')) return '#4c2882';
    if (fLower.includes('blackcurrent')) return '#321a38';
    if (fLower.includes('redvelvet')) return '#8a1f26';
    if (fLower.includes('mango')) return '#ffc04c';
    if (fLower.includes('black forest')) return '#23120b';
    if (fLower.includes('honey')) return '#f59e0b';
    return '#fffdf5'; // default buttercream white
  };

  return (
    <div id="cake-configurator" className="bg-amber-50/70 border border-amber-100 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
      <div className="w-full">
        
        {/* Title block */}
        <div className="flex justify-between items-start mb-6 border-b border-amber-100 pb-4">
          <div>
            <span className="text-amber-700 text-xs font-mono tracking-widest uppercase font-bold">Interactive Creator</span>
            <h3 id="customize-title" className="text-2xl md:text-3xl font-serif text-amber-950 font-bold tracking-tight mt-1">
              Curate Ur Perfect Cake
            </h3>
            <p className="text-stone-600 text-sm mt-1">
              Craft a cake precisely matches your grand visual theme, baked fresh on order.
            </p>
          </div>
          <button
            onClick={() => {
              setCakeType('Normal');
              setFlavour('Vanilla');
              setWeight('0.5 kg');
              setCakeShape('Round');
              setIsDinosaur(false);
              setIsAnimal(false);
              setIsTeddyBear(false);
              setIsLion(false);
              setIsTomJerry(false);
              setIsBossBaby(false);
              setColor('#fef08a');
              setMessage('Happy Birthday!');
              setTopping(null);
              setPhotoPrint('No');
              setPromptSelectFlavorAndWeight(false);
              setUseUploadedImageInPreview(false);
            }}
            className="text-xs bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full hover:bg-amber-200 transition-colors font-semibold"
          >
            Refresh
          </button>
        </div>

        {/* Step-by-Step Customizer */}
        <div className="space-y-4">
            
            {/* Customiser Controls */}
            <div className="space-y-4 text-sm mt-3">
              {promptSelectFlavorAndWeight && (
                <div className="bg-amber-100 border-2 border-amber-500 rounded-2xl p-4 text-amber-950 flex flex-col gap-2 shadow-md animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-800 animate-spin-slow" />
                      <span className="font-serif font-black text-sm">Please finalize your PhotoPrint Cake!</span>
                    </div>
                    <button 
                      onClick={() => setPromptSelectFlavorAndWeight(false)}
                      className="text-amber-800 hover:text-amber-950 p-1 bg-amber-200/50 rounded-full transition-all"
                      aria-label="Dismiss helper"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">
                    You have selected the <strong className="font-bold">{selectedPhotoModelName || 'PhotoPrint Model'}</strong> as your edible photo! 
                    Please scroll down to select your preferred <strong className="font-bold underline decoration-wavy decoration-amber-600">BATTER FLAVOUR</strong> and <strong className="font-bold underline decoration-wavy decoration-amber-600">CAKE WEIGHT</strong> to perfect your curated cake.
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-amber-950 text-white font-bold font-mono px-2 py-0.5 rounded-full uppercase animate-pulse">
                      Action Required
                    </span>
                  </div>
                </div>
              )}

              {/* Type Select */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  Type
                </label>
                <div className="flex gap-4">
                  {['Normal', 'Pastry(CoolCake)'].map((t) => {
                    const isSelected = cakeType === t;
                    const isSpiderman1 = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('spiderman1');
                    const isSpiderman = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('spiderman') && !isSpiderman1;
                    const isVijay = photoPrint === 'Yes' && (
                      selectedPhotoModelName?.toLowerCase().includes('vijay') ||
                      selectedPhotoModelName?.toLowerCase().includes('deverakonda') ||
                      selectedPhotoModelName?.toLowerCase().includes('devarakonda')
                    );
                    const isIronman = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('ironman');
                    const isMotuPatlu = photoPrint === 'Yes' && (
                      selectedPhotoModelName?.toLowerCase().includes('motu') ||
                      selectedPhotoModelName?.toLowerCase().includes('patlu')
                    );
                    const isSofia = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('sofia');
                    const isVanillaCakeLocked = flavour === 'Vanilla';
                    const isPineapplePhotoPrintLocked = flavour === 'Pineapple' && photoPrint === 'Yes';
                    const isStrawberryCakeLocked = flavour === 'Strawberry';
                    const isDisabled = isDinosaur || isAnimal || isTeddyBear || isLion || isTomJerry || isBossBaby || ((isSpiderman || isVijay || isMotuPatlu || isSofia || isVanillaCakeLocked || isPineapplePhotoPrintLocked || isStrawberryCakeLocked) && t !== 'Normal' && t !== 'Pastry(CoolCake)') || ((isIronman || isSpiderman1) && t !== 'Pastry(CoolCake)');
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setCakeType(t);
                          setFlavour(t === 'Normal' ? 'Vanilla' : 'Vanilla Pastry');
                          if (t === 'Normal') {
                            setWeight('0.5 kg');
                          } else {
                            setWeight('above 600 grams');
                          }
                        }}
                        className={`flex-1 py-2 px-4 rounded-xl text-center border text-sm font-medium transition-all ${
                          isSelected
                            ? 'border-amber-700 bg-amber-900 text-white shadow-sm font-semibold'
                            : isDisabled
                            ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-50'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-amber-500 hover:bg-stone-50'
                        }`}
                      >
                        {t} {isDisabled && (
                          <span className="text-[10px] block text-stone-400 font-sans font-normal">
                            ({isVanillaCakeLocked ? 'Locked for Vanilla' : isPineapplePhotoPrintLocked ? 'Locked for Pineapple' : isStrawberryCakeLocked ? 'Locked for Strawberry' : `Locked for ${isSpiderman ? 'Spiderman' : isSpiderman1 ? 'Spiderman1' : isVijay ? 'Vijay Deverakonda' : isIronman ? 'IRONMAN' : isMotuPatlu ? 'Motu-Patlu' : 'Princess Sofia'}`})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PhotoPrint(Edible) Option */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 font-mono flex items-center flex-wrap gap-1.5">
                  <span 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('select-photoprint-cakes'));
                    }}
                    className="flex items-center gap-1 cursor-pointer text-amber-800 hover:text-amber-950 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 decoration-dashed hover:underline underline-offset-2"
                    title="Click to view our PhotoPrint Cakes catalog"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-700" /> PhotoPrint(Edible)
                  </span>
                  <span className="text-[10px] text-amber-700 font-bold normal-case font-sans">(₹200 extra for below 1kg, ₹300 extra for above 1kg)</span>
                </label>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((opt) => {
                    const isSelected = photoPrint === opt;
                    const isDisabled = isDinosaur || isAnimal || isTeddyBear || isLion || isTomJerry || isBossBaby;
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setPhotoPrint(opt as 'Yes' | 'No');
                          if (opt === 'No') {
                            setPhotoPrintImage(null);
                          } else {
                            window.dispatchEvent(new CustomEvent('select-photoprint-cakes'));
                          }
                        }}
                        className={`flex-1 py-2 px-4 rounded-xl text-center border text-sm font-medium transition-all ${
                          isSelected
                            ? 'border-amber-700 bg-amber-900 text-white shadow-sm font-semibold'
                            : isDisabled
                            ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-50'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-amber-500 hover:bg-stone-50'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>


              </div>

              {/* Flavour Select */}
              <div className={`transition-all duration-300 p-2 rounded-2xl ${promptSelectFlavorAndWeight ? 'ring-2 ring-amber-500 bg-amber-500/5 shadow-sm' : ''}`}>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  Batter Flavour
                </label>
                <select
                  value={flavour}
                  onChange={(e) => {
                    const nextFlavour = e.target.value;
                    setFlavour(nextFlavour);
                    setPromptSelectFlavorAndWeight(false);
                    if (cakeType === 'Pastry(CoolCake)' && (nextFlavour === 'Blueberry Pastry' || nextFlavour === 'Blackcurrent Pastry' || nextFlavour === 'Mango Cake (Only Seasonal )' || nextFlavour === 'Dry Fruit Cake Pastry') && weight === 'above 600 grams') {
                      setWeight('1.0 kg');
                    }
                    if (cakeType === 'Normal' && nextFlavour === 'Honey Flavour' && weight === '0.5 kg') {
                      setWeight('1.0 kg');
                    }
                  }}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                >
                  {activeFlavours.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Cake Shape Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  Cake Shape
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Round', label: 'Round' },
                    { id: 'Rectangle', label: 'Rectangle' },
                    { id: 'Heart', label: 'Heart', extra: '₹50 extra' }
                  ].map((opt) => {
                    const isSelected = cakeShape === opt.id;
                    const isSpiderman1 = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('spiderman1');
                    const isSpiderman = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('spiderman') && !isSpiderman1;
                    const isVijay = photoPrint === 'Yes' && (
                      selectedPhotoModelName?.toLowerCase().includes('vijay') ||
                      selectedPhotoModelName?.toLowerCase().includes('deverakonda') ||
                      selectedPhotoModelName?.toLowerCase().includes('devarakonda')
                    );
                    const isIronman = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('ironman');
                    const isMotuPatlu = photoPrint === 'Yes' && (
                      selectedPhotoModelName?.toLowerCase().includes('motu') ||
                      selectedPhotoModelName?.toLowerCase().includes('patlu')
                    );
                    const isSofia = photoPrint === 'Yes' && selectedPhotoModelName?.toLowerCase().includes('sofia');
                    const isVanillaCakeLocked = flavour === 'Vanilla';
                    const isPineapplePhotoPrintLocked = flavour === 'Pineapple' && photoPrint === 'Yes';
                    const isStrawberryCakeLocked = flavour === 'Strawberry';
                    const isDisabled = isDinosaur || ((isAnimal || isTeddyBear || isLion || isTomJerry || isBossBaby) && opt.id !== 'Round') || (isVanillaCakeLocked && (opt.id !== 'Round' && opt.id !== 'Rectangle' && opt.id !== 'Heart')) || ((isSpiderman || isVijay || isIronman || isPineapplePhotoPrintLocked || isStrawberryCakeLocked || flavour === 'Dinosaur') && opt.id !== 'Round' && opt.id !== 'Rectangle' && opt.id !== 'Heart') || ((isMotuPatlu || isSofia || isSpiderman1) && opt.id !== 'Rectangle' && opt.id !== 'Heart');
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setCakeShape(opt.id as 'Round' | 'Rectangle' | 'Heart')}
                        className={`py-1.5 px-1.5 rounded-xl text-center border text-[11px] transition-all flex flex-col justify-center items-center h-14 ${
                          isSelected
                            ? 'border-amber-700 bg-amber-900 text-white font-medium shadow-sm'
                            : isDisabled
                            ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-50'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-amber-500'
                        }`}
                      >
                        <div className="font-extrabold text-[10px] leading-tight text-center">{opt.label}</div>
                        {opt.extra && !isDisabled && (
                          <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-amber-200' : 'text-amber-700'}`}>
                            {opt.extra}
                          </div>
                        )}
                        {isDisabled && (
                          <div className="text-[9px] mt-0.5 text-stone-400 font-sans">
                            {isVanillaCakeLocked ? 'Vanilla exclusive' : isPineapplePhotoPrintLocked ? 'Pineapple exclusive' : isStrawberryCakeLocked ? 'Strawberry exclusive' : 'Locked'}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight Options */}
              <div className={`transition-all duration-300 p-2 rounded-2xl ${promptSelectFlavorAndWeight ? 'ring-2 ring-amber-500 bg-amber-500/5 shadow-sm' : ''}`}>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 font-mono flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    Cake Weight / Portion Size
                    {cakeType === 'Pastry(CoolCake)' && (
                      <span className="text-[10px] font-sans font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md animate-pulse">
                        minimum weight 600 grams
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-sans font-normal text-stone-500">Estimates dynamic cost updates</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {displayedWeights.map((w) => {
                    const isSelected = weight === w.display;
                    const isNotAvailable = (w as any).isNotAvailable;
                    return (
                      <button
                        key={w.label}
                        type="button"
                        disabled={isNotAvailable}
                        onClick={() => {
                          if (!isNotAvailable) {
                            setWeight(w.display);
                            setPromptSelectFlavorAndWeight(false);
                          }
                        }}
                        className={`py-1.5 px-1.5 rounded-xl text-center border text-[11px] transition-all flex flex-col justify-center items-center h-14 ${
                          isNotAvailable
                            ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-amber-700 bg-amber-900 text-white font-medium shadow-sm'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-amber-500'
                        }`}
                      >
                        <div className="font-extrabold text-[10px] leading-tight text-center">{w.display}</div>
                        <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-amber-150' : 'text-stone-500'}`}>
                          {isNotAvailable ? 'not available' : `₹${w.price}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Piping Text Message */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1 font-mono flex items-center gap-1">
                  <PenTool className="w-3.5 h-3.5 text-stone-500" /> Icing Text Message (Max 28 characters)
                </label>
                <input
                  type="text"
                  maxLength={28}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Happy 25th Rohit!"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              {/* Conditional Uploader Area */}
              {photoPrint === 'Yes' ? (
                /* Unified Image Uploader: Upload Your Image for the Cake */
                <div className="pt-3 border-t border-amber-100/50">
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-800" /> Upload Your Image for the Cake
                  </label>
                  
                  {!refImage ? (
                    <div className="relative border-2 border-dashed border-amber-200/60 rounded-xl p-5 bg-white hover:bg-amber-50/20 text-center transition-all cursor-pointer group flex flex-col justify-center items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="cake-design-image-input"
                      />
                      <Upload className="w-6 h-6 text-amber-700 mb-1.5 group-hover:scale-110 transition-transform animate-pulse" />
                      <p className="text-xs text-stone-700 font-bold leading-tight">Drag or click to upload your custom image / photo</p>
                      <p className="text-[10px] text-stone-400 mt-1">This will be used as the design template or printed on your cake (JPG, PNG up to 5MB)</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl p-3 relative shadow-xs">
                      <img src={refImage} alt="Cake Preview" className="w-16 h-16 object-cover rounded-lg border border-stone-100 shadow-xs" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-emerald-800 font-extrabold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Image Loaded Successfully!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRefImage(null);
                          setPhotoPrintImage(null);
                          setUseUploadedImageInPreview(false);
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-600 flex items-center transition-colors absolute top-2 right-2 bg-stone-50 rounded-full hover:bg-stone-100"
                        title="Remove image file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Two column container: Upload Reference Image & Description Area */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-amber-100/50">
                  {/* Reference Image Uploader */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-800" /> Upload Reference Image <span className="text-[10px] text-stone-400 normal-case ml-1 font-sans font-normal">(optional)</span>
                    </label>
                    
                    {!refImage ? (
                      <div className="relative border-2 border-dashed border-amber-200/60 rounded-xl p-4 bg-white hover:bg-amber-50/20 text-center transition-all cursor-pointer group h-[100px] flex flex-col justify-center items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="ref-image-input"
                        />
                        <Upload className="w-5 h-5 text-amber-700 mb-1 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] text-stone-700 font-semibold leading-tight">Drag reference image here</p>
                        <p className="text-[9px] text-stone-400 mt-0.5">JPG / PNG up to 5MB</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 bg-white border border-amber-100 rounded-xl p-2 relative h-[100px]">
                        <img src={refImage} alt="Reference Preview" className="w-14 h-14 object-cover rounded-lg border border-stone-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-emerald-800 font-extrabold flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Loaded!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setRefImage(null);
                            setUseUploadedImageInPreview(false);
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 flex items-center transition-colors absolute top-1 right-1"
                          title="Remove image file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description for custom cake */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-amber-800" /> Description for Custom Cake <span className="text-[10px] text-stone-400 normal-case ml-1 font-sans font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={customRequirements}
                      onChange={(e) => setCustomRequirements(e.target.value)}
                      placeholder="Describe custom toppers, tier colors, themes, allergens or flavor preferences..."
                      rows={3}
                      maxLength={250}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs leading-normal resize-none placeholder-stone-400 h-[68px]"
                    />
                    <div className="text-right text-[9px] text-stone-400 font-mono -mt-1">
                      {customRequirements.length}/250 chars
                    </div>
                  </div>
                </div>
              )}

              {/* Premium Toppings select */}
              {!(isSpidermanActive || isSpiderman1Active || isVijayActive || isMotuPatluActive || isSofiaActive || isAnimal || isTeddyBear || isLion || isTomJerry || isBossBaby) && !isPineapplePhotoPrintActive && flavour !== 'Strawberry' && flavour !== 'Dinosaur' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                    Royal Garnish / Topping Accent (+₹100)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {toppings.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTopping(topping === t ? null : t)}
                        className={`border p-1.5 rounded-xl text-left text-[11px] leading-tight transition-all h-10 flex items-center ${
                          topping === t
                            ? 'border-amber-700 bg-amber-100 text-amber-950 font-medium'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-amber-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          {/* Pricing & Order CTA */}
          <div className="mt-5 pt-3.5 border-t border-amber-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-stone-500 font-mono">Dynamic Estimate</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-serif font-bold text-amber-950">₹{totalPrice}</span>
                <span className="text-xs text-stone-500">Premium Bake Service included</span>
              </div>
            </div>

            <button
              onClick={handlePreBookClick}
              disabled={isAdded}
              className={`py-3 px-6 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all ${
                isAdded 
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-amber-900 hover:bg-amber-950 text-white hover:shadow-lg active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircle className="w-5 h-5 text-white animate-bounce" /> Added to Pre-orders!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 text-amber-200" /> Pre-order Dynamic Cake
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Contact Details Dialog / Prompt Modal */}
      <AnimatePresence>
        {showAskModal && (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-stone-100 relative text-left max-h-[92vh] overflow-y-auto scrollbar-thin"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-900" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-serif text-base font-black text-amber-950">Confirm Contact & Pricing Details</h4>
                  <p className="text-[11px] text-stone-500 mt-1">Please enter details and choose discount options to customize your preorder pricing.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmDetails} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1">
                    1. Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={askName}
                    onChange={(e) => setAskName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-amber-700 focus:bg-white px-3.5 py-2 rounded-xl text-stone-900 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1">
                    2. WhatsApp Number(for order details):
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10,12}"
                    placeholder="e.g. 7396500338"
                    value={askWhatsApp}
                    onChange={(e) => setAskWhatsApp(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-amber-700 focus:bg-white px-3.5 py-2 rounded-xl text-stone-900 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1">
                    3. Mail(for order details):
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. parthakesarla@gmail.com"
                    value={askMail}
                    onChange={(e) => setAskMail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-amber-700 focus:bg-white px-3.5 py-2 rounded-xl text-stone-900 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="border-t border-dashed border-stone-200/60 pt-3">
                  <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1 flex justify-between items-center">
                    <span>4. loyalty points awarded for this order:</span>
                    <span className="text-amber-800 font-extrabold font-mono text-[11px] bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md">+{pointsAwarded} pts</span>
                  </label>
                  <p className="text-[10px] text-stone-500 leading-normal">
                    You'll earn 1 loyalty point per ₹100 spent based on the dynamic Grand Price upon checkout completion.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1">
                    5. Redeem Code:
                  </label>
                  <input
                    type="text"
                    placeholder="Try 'KADAPATREAT' for 15% off bespoke orders"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-amber-700 focus:bg-white px-3.5 py-2 rounded-xl text-stone-900 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all placeholder:text-stone-400"
                  />
                  {redeemCode.trim() !== '' && (
                    <p className={`text-[10px] mt-1 font-mono font-bold ${
                      redeemDiscount > 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {codeValidationResult}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-stone-500 mb-1.5">
                    6. Select Loyalty Points Discount Option:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRedeemOption('none')}
                      className={`border p-2.5 rounded-xl text-left transition-all ${
                        redeemOption === 'none'
                          ? 'border-amber-800 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <div className="text-[9px] uppercase font-mono font-extrabold text-stone-400">Option A</div>
                      <div className="text-xs mt-0.5 font-bold">Keep Balance</div>
                      <div className="text-[9px] text-stone-500 mt-0.5">Redeem: 0 pts (-₹0)</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setRedeemOption('redeem')}
                      disabled={maxPossiblePointsToRedeem <= 0}
                      className={`border p-2.5 rounded-xl text-left transition-all ${
                        maxPossiblePointsToRedeem <= 0 ? 'opacity-50 cursor-not-allowed bg-stone-50' : ''
                      } ${
                        redeemOption === 'redeem'
                          ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <div className="text-[9px] uppercase font-mono font-extrabold text-stone-400">Option B</div>
                      <div className="text-xs mt-0.5 font-bold">Redeem Points</div>
                      <div className="text-[9px] text-emerald-800 mt-0.5 font-bold">
                        Apply Max: {maxPossiblePointsToRedeem} pts (-₹{maxPossiblePointsToRedeem})
                      </div>
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-stone-400 mt-1 font-mono">
                    <span>Your Loyalty Balance: <strong>{userLoyaltyPoints} pts</strong></span>
                    {maxPossiblePointsToRedeem > 0 && redeemOption === 'redeem' && (
                      <span className="text-emerald-700 font-bold">Applied: -₹{maxPossiblePointsToRedeem}</span>
                    )}
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-500">7. Grand Price:</span>
                    <span className="text-xl font-serif font-black text-amber-950">₹{grandPrice}</span>
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 mt-1.5 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Original dynamic estimate:</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    {redeemDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Redeem Code Coupon:</span>
                        <span>-₹{redeemDiscount}</span>
                      </div>
                    )}
                    {appliedLoyaltyPoints > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Loyalty Points Discount:</span>
                        <span>-₹{appliedLoyaltyPoints}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAskModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-xs text-center transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs text-center transition-all cursor-pointer shadow-sm"
                  >
                    Confirm & Pre-order
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PhotoPrint Default Photo Warning Confirmation Modal */}
      <AnimatePresence>
        {showNoPhotoWarning && (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-stone-100 relative text-left"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-600 animate-pulse" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-700" />
                  <h4 className="font-serif text-base font-black text-amber-950">Photo Upload Notice</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNoPhotoWarning(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-stone-700 leading-relaxed font-sans font-medium">
                  You've not uploaded any photo for the cake , so the default photo shown will be taken for your cake ,
                </p>
                <p className="text-xs text-stone-500 leading-normal">
                  If you want to print a personalized photo, click Cancel and upload your photo using the "Upload Your Image for the Cake" section. Otherwise, click Okay to proceed with the default image.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNoPhotoWarning(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-xs text-center transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNoPhotoWarning(false);
                      setShowAskModal(true);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs text-center transition-all cursor-pointer shadow-sm"
                  >
                    Okay
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
