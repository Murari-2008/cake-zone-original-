import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Settings, PlusCircle, LayoutDashboard, Coffee, Clock, AlertTriangle, IndianRupee, ShoppingCart, BarChart3, TrendingUp, RefreshCw, Layers, Award, Gift, Lock, Mail, Eye, X, Copy, Check, Send, MessageSquare } from 'lucide-react';
import { MenuItem, Order, StoreSettings, OrderStatus, UserProfile } from '../types';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  orders: Order[];
  storeSettings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  onUpdateMenu: (items: MenuItem[]) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile | null) => void;
  onLockDashboard: () => void;
  onRefreshData: () => void;
  onClearOrders: () => void;
}

export default function AdminDashboard({
  menuItems,
  orders,
  storeSettings,
  onUpdateSettings,
  onUpdateMenu,
  onUpdateOrderStatus,
  userProfile,
  onUpdateProfile,
  onLockDashboard,
  onRefreshData,
  onClearOrders,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'settings' | 'loyalty'>('analytics');

  // Local settings form
  const [weekdays, setWeekdays] = useState(storeSettings.openingHours.weekdays);
  const [weekends, setWeekends] = useState(storeSettings.openingHours.weekends);
  const [phone, setPhone] = useState(storeSettings.contactPhone);
  const [address, setAddress] = useState(storeSettings.address);
  const [stockThreshold, setStockThreshold] = useState(storeSettings.lowStockThreshold);

  // New Menu Item form
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(300);
  const [newItemCategory, setNewItemCategory] = useState<any>('Cool Cakes');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemImg, setNewItemImg] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80');
  const [newItemStock, setNewItemStock] = useState(15);
  const [formSuccess, setFormSuccess] = useState('');

  // Email Preview state variables
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [selectedPreviewOrderId, setSelectedPreviewOrderId] = useState<string>('mock-default');
  const [previewEmailStatus, setPreviewEmailStatus] = useState<OrderStatus>('Received');
  const [previewTestSent, setPreviewTestSent] = useState(false);
  const [copiedTemplateText, setCopiedTemplateText] = useState(false);

  // Message Preview state variables
  const [isMsgPreviewOpen, setIsMsgPreviewOpen] = useState(false);
  const [previewMsgStatus, setPreviewMsgStatus] = useState<OrderStatus>('Received');
  const [msgTestSent, setMsgTestSent] = useState(false);
  const [copiedMsgText, setCopiedMsgText] = useState(false);

  // Fallback demo order for previewing if the shop is empty
  const previewFallbackOrder: Order = {
    id: 'CZ-892104',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@domain.in',
    customerPhone: '9848032910',
    date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
    totalAmount: 1450,
    status: 'Received',
    loyaltyPointsEarned: 145,
    loyaltyPointsSpent: 0,
    items: [
      {
        menuItem: {
          id: 'mock-p1',
          name: 'Belgian Chocolate Truffle Cake',
          price: 950,
          category: 'Cool Cakes',
          description: 'A rich multilayered dark chocolate sponge cake enveloped in imported cocoa, fresh double cream, and Belgian couverture chocolate shavings.',
          imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
          inStock: 10,
        },
        quantity: 1,
        selectedSize: '1 kg',
        customMessage: 'Happy Birthday Mom!'
      },
      {
        menuItem: {
          id: 'mock-p2',
          name: 'Classic Potato Puffs',
          price: 250,
          category: 'Puffs',
          description: 'Flaky baked golden pastry filled with spiced roasted potatoes.',
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80',
          inStock: 30,
        },
        quantity: 2,
      }
    ]
  };

  // Handle settings save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const password = window.prompt('Please enter the owner password to save shop parameters:');
    if (password === 'kavithasaradhi123') {
      onUpdateSettings({
        openingHours: { weekdays, weekends },
        contactPhone: phone,
        address,
        lowStockThreshold: stockThreshold,
      });
      alert('Cake Zone business preferences updated successfully!');
    } else if (password !== null) {
      alert('Incorrect password!');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...userProfile, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const addedItem: MenuItem = {
      id: `custom-added-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      price: Number(newItemPrice),
      description: newItemDesc.trim() || 'Freshly prepared bespoke local creation matching Cake Zone standard.',
      imageUrl: newItemImg,
      inStock: Number(newItemStock),
    };

    onUpdateMenu([addedItem, ...menuItems]);
    setNewItemName('');
    setNewItemPrice(300);
    setNewItemDesc('');
    setFormSuccess(`Successfully added product: "${addedItem.name}" to the active catalog!`);
    setTimeout(() => setFormSuccess(''), 3000);
  };

  // Adjust numeric stock directly inside list
  const handleStockAdjust = (id: string, amount: number) => {
    const updated = menuItems.map(item => {
      if (item.id === id) {
        return { ...item, inStock: Math.max(0, item.inStock + amount) };
      }
      return item;
    });
    onUpdateMenu(updated);
  };

  // Adjust single product price
  const handlePriceAdjust = (id: string, newPrice: number) => {
    const updated = menuItems.map(item => {
      if (item.id === id) {
        return { ...item, price: Math.max(1, newPrice) };
      }
      return item;
    });
    onUpdateMenu(updated);
  };

  // Analytics derivations (Data cleared by request)
  const grossRevenue = 0;
  const activeBakes = 0;
  const lowStockItems = menuItems.filter(item => item.inStock <= storeSettings.lowStockThreshold);

  // Group revenue by category for dashboard analytics - data cleared
  const salesByCategory: { [key: string]: number } = {};

  // Setup basic fallback values if zero active orders exist
  const categoriesList = ['Cool Cakes', 'Normal Cakes', 'Special Items', 'Biscuits', 'Puffs'];
  const categoriesAmounts = categoriesList.map(cat => 0);
  const maxAmount = Math.max(...categoriesAmounts, 100);

  return (
    <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm max-w-6xl mx-auto space-y-6">
      
      {/* Top Banner & Tab Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-100 pb-5 gap-4">
        <div>
          <span className="text-amber-800 text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" /> Cake Zone Command
          </span>
          <h2 id="admin-dashboard-title" className="text-2xl font-serif font-black text-amber-950 mt-1">
            Store Owner Control Station
          </h2>
          <p className="text-stone-500 text-xs mt-0.5">
            Monitor analytics trends, process active queue bakes, manage stock levels, and customize shop hours.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto self-stretch md:self-auto">
          {/* Email Preview button */}
          <button
            onClick={() => {
              setIsEmailPreviewOpen(true);
              setPreviewTestSent(false);
              setCopiedTemplateText(false);
            }}
            className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-200/60 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all justify-center w-full md:w-auto"
            title="Preview customer order confirmation email template"
          >
            <Mail className="w-3.5 h-3.5 text-amber-800" /> Preview Confirmation Email
          </button>

          {/* Message Preview button */}
          <button
            onClick={() => {
              setIsMsgPreviewOpen(true);
              setMsgTestSent(false);
              setCopiedMsgText(false);
            }}
            className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-200/60 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all justify-center w-full md:w-auto"
            title="Preview customer order confirmation text message"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-800" /> Preview Confirmational message
          </button>

          {/* Secure Lock button */}
          <button
            onClick={onLockDashboard}
            className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-200/60 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all justify-center w-full md:w-auto"
            title="Lock owner session right now"
          >
            <Lock className="w-3.5 h-3.5" /> Lock Console
          </button>
        </div>
      </div>

      {/* Admin tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-semibold custom-scrollbar">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-amber-900 text-white'
              : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
          }`}
        >
          📈 Live Sales Analytics
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-amber-900 text-white'
              : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
          }`}
        >
          🍰 Order Queue ({orders.length})
          {activeBakes > 0 && <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-amber-900 text-white'
              : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
          }`}
        >
          🍪 Catalog & Stock
          {lowStockItems.length > 0 && (
            <span className="bg-red-100 text-red-800 text-[9px] px-1.5 rounded-full font-mono">
              {lowStockItems.length} alert
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-amber-900 text-white'
              : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
          }`}
        >
          ⚙️ Shop Settings
        </button>
        <button
          onClick={() => setActiveTab('loyalty')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'loyalty'
              ? 'bg-amber-900 text-white'
              : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
          }`}
        >
          🎁 Patron Loyalty
        </button>
      </div>

      {/* TAB WINDOW 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex justify-end">
             <button
                onClick={onRefreshData}
                className="flex items-center gap-1.5 text-xs text-amber-900 font-bold hover:text-amber-700 transition-colors bg-white px-3 py-1.5 rounded-lg border border-stone-200"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
              </button>
          </div>
          {/* Key metrics blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-stone-50 border border-stone-100 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider font-semibold">Total Gross Turnover</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-serif font-black text-stone-900">₹{grossRevenue}</span>
                  <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +18.4%</span>
                </div>
              </div>
              <div className="bg-amber-955/5 p-3 rounded-xl text-amber-900">
                <IndianRupee className="w-5 h-5 text-amber-800" />
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-100 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider font-semibold">Active Baking Queue</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-serif font-black text-stone-900">{activeBakes} bakes</span>
                  <span className="text-stone-400 text-[10px] font-mono">In-progress</span>
                </div>
              </div>
              <div className="bg-stone-200/50 p-3 rounded-xl text-stone-700">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-100 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider font-semibold">Critical Stock Warnings</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-serif font-black text-stone-900">{lowStockItems.length} items</span>
                  <span className="text-red-700 text-[10px] font-bold">Needs restock</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${lowStockItems.length > 0 ? 'bg-red-50 text-red-700' : 'bg-stone-200/50 text-stone-500'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Interactive Custom SVG bar charts representing live sales data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Sales Volume chart container */}
            <div className="bg-stone-50/50 border border-stone-100 rounded-3xl p-5 space-y-4">
              <h4 className="font-serif font-black text-stone-800 text-sm flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-amber-800" /> Revenue Stream by Category Today
              </h4>
              <p className="text-stone-400 text-[11px] leading-tight">
                Live categorical analysis updating with every simulated transaction checkout.
              </p>

              <div className="space-y-3 pt-2">
                {categoriesList.map((cat, idx) => {
                  const amount = categoriesAmounts[idx];
                  const percentage = Math.min((amount / maxAmount) * 100, 100);
                  return (
                    <div key={cat} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-stone-750">
                        <span className="font-medium">{cat}</span>
                        <span className="font-mono text-stone-900 font-bold">₹{amount}</span>
                      </div>
                      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-amber-900 rounded-full" 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular items distribution */}
            <div className="bg-stone-50/50 border border-stone-100 rounded-3xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-black text-stone-800 text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-800" /> High-frequency Inventory Alerts
                </h4>
                <p className="text-stone-400 text-[11px] leading-tight mb-4">
                  Low-stock items below the set threshold ({storeSettings.lowStockThreshold} units).
                </p>

                {lowStockItems.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs italic">
                    Great! All inventory levels are above safety threshold.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                    {lowStockItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-xl border border-stone-100">
                        <div className="truncate pr-4">
                          <span className="font-bold text-stone-900 block truncate text-xs">{item.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono uppercase">{item.category}</span>
                        </div>
                        <span className="bg-red-50 border border-red-100 text-red-800 font-mono font-bold text-[10px] px-2.5 py-1 rounded-lg tracking-normal shrink-0">
                          Qty: {item.inStock} units
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Threshold warning description box */}
              <div className="bg-amber-50/40 rounded-xl p-3 text-[11px] text-amber-950 font-sans leading-relaxed mt-4">
                <strong>Alert Mechanism:</strong> Low bounds automatically lock items or tag with warning flags in the public gallery.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB WINDOW 2: ORDER QUEUE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-serif font-bold text-stone-900 text-sm">Active Customer Pre-orders ({orders.length})</h4>
            {orders.length > 0 && (
              <button
                onClick={onClearOrders}
                className="text-xs text-rose-700 font-bold hover:text-rose-900 transition-colors bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100"
              >
                Clear All Orders
              </button>
            )}
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs italic">
              No orders received yet today. Fire up the simulated customer order above to fill the queue!
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-stone-50 border border-stone-200/50 rounded-2xl p-5 hover:border-stone-300/40 transition-all">
                  <div className="flex flex-wrap md:flex-nowrap justify-between items-start pb-3 border-b border-stone-200/50 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-mono">ORDER ID:</span>
                        <strong className="text-stone-900 font-mono text-xs font-black">{o.id}</strong>
                      </div>
                      <div className="text-[11px] text-stone-500 block mt-0.5 font-sans">
                        Patron: <strong>{o.customerName}</strong> • {o.customerPhone} • {o.customerEmail}
                      </div>
                    </div>

                    {/* Operational stepper status toggler */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-stone-500 pr-1">QUEUE TASK:</span>
                      <select
                        value={o.status}
                        onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className={`font-semibold text-xs py-1 px-2.5 rounded-lg border focus:outline-none focus:ring-1 cursor-pointer transition-all ${
                          o.status === 'Out Of Stock'
                            ? 'bg-rose-50 border-rose-200 text-rose-700 focus:ring-rose-500'
                            : o.status === 'Ready'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-850 focus:ring-emerald-500'
                            : 'bg-white border-stone-200 text-stone-900 focus:ring-amber-500'
                        }`}
                      >
                        <option value="Received">Received</option>
                        <option value="Ready">Ready</option>
                        <option value="Out Of Stock">Out Of Stock</option>
                      </select>
                    </div>
                  </div>

                  {/* Order items inside */}
                  <div className="pt-3 space-y-1.5 text-xs text-stone-750">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2 border border-stone-100 rounded-xl">
                        <span className="font-semibold text-stone-900">{it.quantity}x {it.menuItem.name}</span>
                        <span className="font-mono text-stone-500 font-bold">₹{it.menuItem.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Loyalty tracking logs */}
                  <div className="mt-3.5 pt-3 border-t border-stone-200/50 text-[10px] text-stone-400 font-mono flex justify-between items-center">
                    <span>Delivery Address: {o.items[0]?.selectedSize || 'Store Pickup'}</span>
                    <span className={`font-semibold px-2 py-0.5 rounded ${
                      o.status === 'Out Of Stock'
                        ? 'text-rose-700 bg-rose-50 border border-rose-100'
                        : 'text-emerald-700 bg-emerald-50'
                    }`}>
                      {o.status === 'Out Of Stock' ? 'Voided: 0 pts' : `Allocated: ${o.loyaltyPointsEarned} pts`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB WINDOW 3: CATALOG & STOCK */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Add product expandable section */}
          <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100/50">
            <h4 className="font-serif font-black text-amber-950 text-sm flex items-center gap-2">
              <PlusCircle className="w-4.5 h-4.5 text-amber-850" /> Append New Item to Public Menu
            </h4>
            <p className="text-stone-400 text-[11px] mb-4">
              Instantly expand your shop catalog without reloading the server. Values persist locally.
            </p>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs font-semibold text-stone-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    placeholder="e.g., Kadapa Special Kaju Roll"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Initial Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Bakery Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm"
                  >
                    <option value="Cool Cakes">Cool Cakes</option>
                    <option value="Normal Cakes">Normal Cakes</option>
                    <option value="Special Items">Special Items</option>
                    <option value="Theme Cakes">Theme Cakes</option>
                    <option value="PhotoPrint Cakes">PhotoPrint Cakes</option>
                    <option value="Puffs">Puffs</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Biscuits">Biscuits</option>
                    <option value="Special Snacks">Special Snacks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Detailed Description</label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="Describe flavor ingredients, allergens, or baking textures..."
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    min={0}
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Product Image URL</label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newItemImg}
                    onChange={(e) => setNewItemImg(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm"
                  />
                </div>
                <div className="flex items-end">
                    <button type="button" className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-1.5 rounded-lg text-xs uppercase">
                        Select from Gallery
                    </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 flex-wrap gap-2">
                <div className="h-4">
                  {formSuccess && <span className="text-emerald-700 text-xs font-bold">{formSuccess}</span>}
                </div>
                <button
                  type="submit"
                  className="bg-amber-900 hover:bg-amber-950 text-white font-bold py-2 px-6 rounded-xl text-xs tracking-wider uppercase ml-auto"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>

          {/* Quick list table to change prices & restock */}
          <div className="space-y-4">
            <h4 className="font-serif font-black text-stone-900 text-sm">Product Catalogue List ({menuItems.length})</h4>
            
            <div className="border border-stone-100 rounded-2xl overflow-hidden max-h-[350px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase font-mono text-[9px] tracking-wider">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price (₹)</th>
                    <th className="p-3 text-center">In Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-semibold text-stone-900 truncate max-w-[170px]" title={item.name}>
                        {item.name}
                      </td>
                      <td className="p-3 text-stone-400 font-mono text-[10px]">{item.category}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handlePriceAdjust(item.id, Number(e.target.value))}
                          className="w-18 bg-white border border-stone-200 px-2 py-0.5 rounded text-xs font-bold text-stone-900 focus:outline-none"
                        />
                      </td>
                      <td className="p-3 flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStockAdjust(item.id, -1)}
                          className="w-5 h-5 bg-stone-200 text-stone-700 font-bold justify-center items-center flex rounded active:bg-stone-300"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-stone-900">{item.inStock}</span>
                        <button
                          onClick={() => handleStockAdjust(item.id, 5)}
                          className="w-5 h-5 bg-stone-200 text-stone-700 font-bold justify-center items-center flex rounded active:bg-stone-300"
                          title="Restock +5"
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB WINDOW 4: SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-semibold text-stone-700">
          <h4 className="font-serif font-black text-stone-900 text-sm">Store Settings & Timings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Weekday Opening Timings</label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={weekdays}
                  onChange={(e) => setWeekdays(e.target.value)}
                  className="w-full bg-white border border-stone-200 pl-9 pr-3 py-1.5 rounded-lg text-sm text-stone-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Weekend Opening Timings</label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={weekends}
                  onChange={(e) => setWeekends(e.target.value)}
                  className="w-full bg-white border border-stone-200 pl-9 pr-3 py-1.5 rounded-lg text-sm text-stone-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Alert stock threshold limit</label>
              <input
                type="number"
                required
                min={0}
                value={stockThreshold}
                onChange={(e) => setStockThreshold(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm text-stone-900"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Official phone number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Official Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm text-stone-900"
            />
          </div>

          <div className="flex pt-4 justify-end border-t border-stone-100">
            <button
              type="submit"
              className="bg-amber-905 bg-amber-900 hover:bg-amber-950 text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider uppercase shadow-sm"
            >
              SAVE
            </button>
          </div>

        </form>
      )}

      {/* TAB WINDOW 5: PATRON LOYALTY */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h4 className="font-serif font-black text-stone-900 text-sm flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-800" /> Customer Loyalty Points Registry
            </h4>
            <p className="text-stone-500 text-xs mt-0.5">
              Securely view, manually adjust, and credit points to loyalty club members. These points are now invisible to customers and managed strictly by the store owner.
            </p>
          </div>

          {userProfile ? (
            <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100/50 space-y-4">
              <h5 className="font-serif font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-800" /> Active Patron Profile (Live)
              </h5>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-stone-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <img 
                      src={userProfile.profilePic || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + userProfile.name} 
                      alt={userProfile.name} 
                      className="w-16 h-16 rounded-full object-cover border border-stone-200 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-900 block text-sm">{userProfile.name}</span>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 text-[10px] text-amber-900 font-bold hover:underline text-left"
                    >
                      Change Photo
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono uppercase block mb-0.5">CURRENT COOKIE CLIENT</span>
                    <span className="text-xs text-stone-500 font-mono">{userProfile.email} • {userProfile.phone}</span>
                    
                    {/* Milestone badge */}
                    <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full border font-semibold mt-2 ${
                      (userProfile?.loyaltyPoints || 0) >= 300
                        ? 'text-purple-700 bg-purple-50 border-purple-200'
                        : (userProfile?.loyaltyPoints || 0) >= 100
                        ? 'text-amber-700 bg-amber-50 border-amber-250'
                        : 'text-stone-700 bg-stone-50 border-stone-200'
                    }`}>
                      🏆 {(userProfile?.loyaltyPoints || 0) >= 300 ? 'Apex' : (userProfile?.loyaltyPoints || 0) >= 100 ? 'Zenith' : 'Horizon'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2.5 w-full sm:w-auto">
                  <div className="sm:text-right">
                    <span className="text-[10px] text-stone-400 font-mono uppercase block">POINTS BALANCE</span>
                    <span className="text-2xl font-mono font-bold text-amber-900">{userProfile?.loyaltyPoints || 0} pts</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">

                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100/50 text-center">
              <span className="text-stone-500 text-xs">No customer currently logged in to track live loyalty points.</span>
            </div>
          )}

          {/* Registry list with simulated other customer balances */}
          <div className="space-y-3">
            <h5 className="font-serif font-black text-stone-800 text-xs">All Registered Patrons Registry (Kadapa Town members)</h5>
            
            <div className="bg-white border border-stone-100 rounded-2xl divide-y divide-stone-100 overflow-hidden text-xs">
              <div className="flex justify-between items-center p-3 text-[10px] font-mono text-stone-400 bg-stone-50 uppercase tracking-wider">
                <span>Customer Name / Contact info</span>
                <span className="text-right">Loyalty status & points</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- EMAIL PREVIEW MODAL --- */}
      {isEmailPreviewOpen && (() => {
        const previewOrder = selectedPreviewOrderId === 'mock-default' 
          ? previewFallbackOrder 
          : (orders.find(o => o.id === selectedPreviewOrderId) || previewFallbackOrder);

        // Compute tailored subjects and messages for different statuses
        const statusSubjects: Record<OrderStatus, string> = {
          Received: `🍰 Order Confirmed! We are preparing your sweets - Cake Zone #${previewOrder.id}`,
          Ready: `🔥 Order Ready! Your order is ready for pickup/delivery - Cake Zone #${previewOrder.id}`,
          'Out Of Stock': `⚠️ Order Status Update: Out Of Stock - Cake Zone #${previewOrder.id}`
        };

        const statusBodies: Record<OrderStatus, string> = {
          Received: `Your order has been safely registered at our Bakery Colony kitchen! Our dedicated confectioners have already checked the recipe instructions and queued up your fresh batch. We will handle every layer with precision and care.`,
          Ready: `Good news! Your delicious cakes and baked items are fully ready. Every layer is carefully finished and packaged to perfection. Thank you for pre-ordering with Cake Zone opposite State Bank, Co-operative Colony, Kadapa!`,
          'Out Of Stock': `Important update: We are sorry, but some or all of the items in your pre-order are currently Out Of Stock or unavailable today. Our customer support team will reach out directly to check if you would like an alternative flavor, a full refund, or an alternate delivery date. Thank you for your kind patience and support.`
        };

        const currentSubject = statusSubjects[previewEmailStatus];
        const currentBodyText = statusBodies[previewEmailStatus];

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-stone-50 rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-5xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
              
              {/* LEFT: CONTROLS SIDEBAR */}
              <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-6 flex flex-col justify-between overflow-y-auto text-xs shrink-0 select-none">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="font-serif font-black text-amber-950 text-base">Email Verifier</h3>
                      <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">Transactional Inspector</p>
                    </div>
                    <button 
                      onClick={() => setIsEmailPreviewOpen(false)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1. SELECT ORDER TO USE FOR RENDERING */}
                  <div className="space-y-1.5">
                    <label className="font-mono font-bold text-[10px] uppercase text-stone-500 tracking-wider block">Source Order Data</label>
                    <select
                      value={selectedPreviewOrderId}
                      onChange={(e) => {
                        setSelectedPreviewOrderId(e.target.value);
                        setPreviewTestSent(false);
                        setCopiedTemplateText(false);
                      }}
                      className="w-full bg-stone-50 border border-stone-200/80 px-3 py-2 rounded-xl text-stone-800 font-medium font-sans focus:outline-none focus:ring-1 focus:ring-amber-900"
                    >
                      <option value="mock-default">🍰 Premium Demo (Fallback)</option>
                      {orders.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.id} ({o.customerName})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-stone-400">Loads actual items, prices, and special messages from the registry.</p>
                  </div>

                  {/* 2. SWITCH TEMPLATE TYPES */}
                  <div className="space-y-1.5">
                    <label className="font-mono font-bold text-[10px] uppercase text-stone-500 tracking-wider block">Bake Order Lifecycle State</label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl">
                      {(['Received', 'Ready', 'Out Of Stock'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setPreviewEmailStatus(st);
                            setPreviewTestSent(false);
                            setCopiedTemplateText(false);
                          }}
                          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all ${
                            previewEmailStatus === st
                              ? 'bg-amber-900 text-white shadow-sm'
                              : 'text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {st === 'Received' ? '🛎️ Received' : st === 'Ready' ? '🎉 Ready' : '⚠️ No Stock'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. SIMULATED LIVE CUSTOMER LABELS (NON-MUTATING) */}
                  <div className="space-y-3 bg-stone-50 rounded-xl p-3 border border-stone-100">
                    <span className="font-mono font-bold text-[9px] uppercase text-amber-900 tracking-wider block">Dynamic Recipients</span>
                    <div className="space-y-1">
                      <span className="text-[10px] block text-stone-500 font-mono">Recipient Name:</span>
                      <input 
                        type="text" 
                        value={previewOrder.customerName}
                        disabled
                        className="w-full bg-stone-200/50 cursor-not-allowed border border-stone-200 px-2 py-1 rounded-lg text-stone-600 font-mono text-[11px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] block text-stone-500 font-mono">Mail DeliverTo:</span>
                      <input 
                        type="text" 
                        value={previewOrder.customerEmail}
                        disabled
                        className="w-full bg-stone-200/50 cursor-not-allowed border border-stone-200 px-2 py-1 rounded-lg text-stone-600 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-6 border-t border-stone-100 pt-4">
                  {/* COPIED ALERTS */}
                  {previewTestSent && (
                    <div className="bg-green-50 border border-green-100 text-green-700 p-2.5 rounded-xl text-[10px] font-medium flex items-center gap-1.5 animate-bounce">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      Test email dispatched! Verified via local mock SMTP loop.
                    </div>
                  )}

                  {copiedTemplateText && (
                    <div className="bg-amber-50 border border-amber-100 text-amber-900 p-2.5 rounded-xl text-[10px] font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      HTML content template exported to clipboard!
                    </div>
                  )}

                  {/* TEST ACTIONS */}
                  <button
                    onClick={() => {
                      setPreviewTestSent(true);
                      setTimeout(() => setPreviewTestSent(false), 4000);
                    }}
                    className="w-full py-2 bg-amber-900 hover:bg-amber-950 text-white font-bold tracking-wide rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3 h-3" /> Send Test Mail (Mock)
                  </button>

                  <button
                    onClick={() => {
                      const mockHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head><title>${currentSubject}</title></head>
                    <body style="font-family: Arial, sans-serif; background-color: #fcfbf9; padding: 20px;">
                      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <h2>${currentSubject}</h2>
                        <p>Hi ${previewOrder.customerName},</p>
                        <p>${currentBodyText}</p>
                        <h3>Order Amount: ₹${previewOrder.totalAmount}</h3>
                      </div>
                    </body>
                    </html>
                    `;
                      navigator.clipboard.writeText(mockHtml.trim());
                      setCopiedTemplateText(true);
                      setTimeout(() => setCopiedTemplateText(false), 3000);
                    }}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-bold tracking-wide rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3 h-3" /> Export Clean HTML
                  </button>
                </div>
              </div>

              {/* RIGHT: EMAIL BODY VISUAL PREVIEW SCREEN */}
              <div className="flex-1 bg-stone-100 p-4 sm:p-6 flex flex-col overflow-y-auto">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                  </div>
                  <div className="bg-white/80 border border-stone-200 text-stone-400 text-[10px] font-mono flex-1 px-4 py-1 rounded-full text-center tracking-wider max-w-sm truncate self-center mx-auto shadow-inner">
                    https://mail.cakezone.cooperative/inbox
                  </div>
                </div>

                {/* EMAIL INBOX HEADERS */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-3 mb-4 select-text">
                  <div className="flex flex-col gap-1 text-[11px] text-stone-500 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-400 font-mono w-12 text-right">From:</span>
                      <span className="text-stone-800 font-semibold font-mono">
                        Cake Zone Co-operative Colony <span className="text-stone-400 font-normal">&lt;orders@cakezone.in&gt;</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-400 font-mono w-12 text-right">To:</span>
                      <span className="text-stone-800 font-medium font-mono">
                        {previewOrder.customerName} <span className="text-stone-400 font-normal">&lt;{previewOrder.customerEmail}&gt;</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-2 pt-1">
                      <span className="font-bold text-stone-400 font-mono w-12 text-right">Subject:</span>
                      <span className="text-amber-900 font-bold font-sans text-xs">
                        {currentSubject}
                      </span>
                    </div>
                  </div>

                  {/* LIVE EMAIL INNER CANVAS SENSORY WORK */}
                  <div className="bg-[#FAF8F5] rounded-xl p-4 sm:p-8 border border-amber-900/10 max-w-2xl mx-auto text-stone-800 text-xs tracking-normal leading-relaxed">
                    
                    {/* Header Seal */}
                    <div className="text-center pb-6 border-b border-stone-200/50">
                      <div className="w-12 h-12 bg-amber-900 text-amber-50 rounded-full mx-auto flex items-center justify-center font-serif text-lg font-black shadow-md border-2 border-white mb-2">
                        🍰
                      </div>
                      <span className="text-xs font-serif font-black tracking-widest text-amber-950 block uppercase">
                        CAKE ZONE
                      </span>
                      <span className="text-[9px] text-amber-800 tracking-widest font-mono font-semibold block uppercase mt-0.5">
                        Co-operative Colony Bakery
                      </span>
                    </div>

                    {/* Email Intro Segment */}
                    <div className="py-6 space-y-4">
                      <p className="font-bold text-stone-900 text-sm">Hi {previewOrder.customerName},</p>
                      
                      <p className="text-stone-600 leading-relaxed text-xs">
                        {currentBodyText}
                      </p>

                      <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50 space-y-2">
                        <div className="flex items-center justify-between text-stone-500 font-mono text-[10px]">
                          <span>Reference ID: #{previewOrder.id}</span>
                          <span>Bilt Date: {previewOrder.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-stone-500 text-[10px]">Current Status:</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-900 text-white font-extrabold tracking-wider font-mono">
                            {previewEmailStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TABLE: ORDERED BAKE ITEMS */}
                    <div className="space-y-2">
                      <h4 className="font-mono font-black text-[10px] text-stone-400 uppercase tracking-wider pb-1 border-b border-stone-200/50">Itemized Bake Order Summary</h4>
                      <div className="divide-y divide-stone-200/40">
                        {previewOrder.items.map((item, idx) => (
                          <div key={idx} className="py-3 flex gap-3 text-xs">

                            <div className="flex-1 min-w-0 pr-2">
                              <span className="font-bold text-stone-900 block truncate">{item.menuItem.name}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                {item.selectedSize && (
                                  <span className="text-[10px] text-stone-500 font-mono">Size: {item.selectedSize}</span>
                                )}
                                <span className="text-[10px] text-stone-400 font-mono">Qty: {item.quantity}</span>
                              </div>
                              {item.customMessage && (
                                <p className="text-[10px] text-rose-800 italic bg-rose-50/50 py-1 px-2 rounded-md border border-rose-100 mt-1.5 font-mono">
                                  ✍️ Banner message: "{item.customMessage}"
                                </p>
                              )}
                            </div>
                            <div className="text-right font-mono font-bold text-stone-900 self-center">
                              ₹{(item.menuItem.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DYNAMIC SUM AND COST BREAKDOWN */}
                    <div className="mt-4 pt-4 border-t border-stone-200/50 space-y-1.5 text-right text-xs">
                      <div className="flex justify-between font-mono text-stone-500">
                        <span>Items Subtotal:</span>
                        <span>₹{previewOrder.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-mono text-stone-500">
                        <span>Colony Hand-Bake Support Fee:</span>
                        <span className="text-emerald-700 font-semibold uppercase">Free</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-200/30">
                        <span>Grand Total Collected:</span>
                        <span className="font-mono text-amber-950">₹{previewOrder.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* USER LOYALTY CARDS */}
                    <div className="mt-6 pt-4 border-t border-stone-200/50 grid grid-cols-2 gap-3 text-[11px]">
                      <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 shadow-inner">
                        <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block">Loyalty Points Earned</span>
                        <span className="text-amber-900 font-bold font-mono text-sm mt-1 inline-block">+{previewOrder.loyaltyPointsEarned || Math.floor(previewOrder.totalAmount / 100)} pts</span>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 shadow-inner">
                        <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block">Redemption Offset</span>
                        <span className="text-stone-500 font-mono text-xs mt-1 inline-block">₹{previewOrder.loyaltyPointsSpent ? `-${previewOrder.loyaltyPointsSpent} off` : '0 applied'}</span>
                      </div>
                    </div>

                    {/* DYNAMIC SHOP INFORMATION BASED ON REAL SETTINGS */}
                    <div className="mt-8 pt-6 border-t border-dashed border-stone-200 space-y-4 text-[10px] text-stone-500 font-sans">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="font-bold text-stone-700 uppercase tracking-wide block mb-1">Bakery Hours</span>
                          <span className="block font-mono">Weekdays: {storeSettings.openingHours.weekdays}</span>
                          <span className="block font-mono">Weekends: {storeSettings.openingHours.weekends}</span>
                        </div>
                        <div>
                          <span className="font-bold text-stone-700 uppercase tracking-wide block mb-1">Pick/Deliver Physical Port</span>
                          <span className="block text-stone-600 font-mono leading-relaxed truncate" title={storeSettings.address}>{storeSettings.address}</span>
                          <span className="block font-bold text-stone-800 font-mono mt-0.5">📞 {storeSettings.contactPhone}</span>
                        </div>
                      </div>

                      <div className="text-center pt-4 border-t border-stone-200/20 space-y-1 select-none">
                        <p className="text-[10px] text-stone-400 italic">
                          "Fusing premium ingredients and community warmth since 2012."
                        </p>
                        <p className="text-[9px] text-stone-400">
                          Cake Zone Co-operative Colony, Kadapa District, Andhra Pradesh, India.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* --- CONFIRMATIONAL MESSAGE PREVIEW MODAL --- */}
      {isMsgPreviewOpen && (() => {
        const previewOrder = selectedPreviewOrderId === 'mock-default' 
          ? previewFallbackOrder 
          : (orders.find(o => o.id === selectedPreviewOrderId) || previewFallbackOrder);

        const statusMessages: Record<OrderStatus, string> = {
          Received: `🍰 Cake Zone Confirmation!\n\nHello ${previewOrder.customerName}, we have received your order #${previewOrder.id} for ₹${previewOrder.totalAmount.toLocaleString('en-IN')}.\n\nOur confectioners are preparing your fresh cake! We'll notify you once it's ready for collection at opposite State Bank, Co-operative Colony, Kadapa. Thank you!`,
          Ready: `🎉 Cake Zone Order Ready!\n\nHi ${previewOrder.customerName}, your delicious cake order #${previewOrder.id} is fully baked and decorated to perfection!\n\nPlease collect it at opposite State Bank, Co-operative Colony, Kadapa.\n\nNeed assistance? Call us: ${storeSettings.contactPhone}. See you soon!`,
          'Out Of Stock': `⚠️ Cake Zone Update:\n\nHello ${previewOrder.customerName}, unfortunately, order #${previewOrder.id} has some items that are currently out of stock.\n\nOur customer support team will contact you shortly to check if you want an alternative flavor, refund, or alternate date. Thank you for your patience.`
        };

        const currentMsgText = statusMessages[previewMsgStatus];

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-stone-50 rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[75vh]">
              
              {/* LEFT: CONTROLS SIDEBAR */}
              <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-6 flex flex-col justify-between overflow-y-auto text-xs shrink-0 select-none">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="font-serif font-black text-amber-950 text-base">Message Verifier</h3>
                      <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">SMS / WhatsApp Inspector</p>
                    </div>
                    <button 
                      onClick={() => setIsMsgPreviewOpen(false)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1. SELECT ORDER TO USE FOR RENDERING */}
                  <div className="space-y-1.5">
                    <label className="font-mono font-bold text-[10px] uppercase text-stone-500 tracking-wider block">Source Order Data</label>
                    <select
                      value={selectedPreviewOrderId}
                      onChange={(e) => {
                        setSelectedPreviewOrderId(e.target.value);
                        setMsgTestSent(false);
                        setCopiedMsgText(false);
                      }}
                      className="w-full bg-stone-50 border border-stone-200/80 px-3 py-2 rounded-xl text-stone-800 font-medium font-sans focus:outline-none focus:ring-1 focus:ring-amber-900"
                    >
                      <option value="mock-default">🍰 Premium Demo (Fallback)</option>
                      {orders.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.id} ({o.customerName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. SWITCH TEMPLATE TYPES */}
                  <div className="space-y-1.5">
                    <label className="font-mono font-bold text-[10px] uppercase text-stone-500 tracking-wider block">Bake Order Lifecycle State</label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl">
                      {(['Received', 'Ready', 'Out Of Stock'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setPreviewMsgStatus(st);
                            setMsgTestSent(false);
                            setCopiedMsgText(false);
                          }}
                          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all ${
                            previewMsgStatus === st
                              ? 'bg-amber-900 text-white shadow-sm'
                              : 'text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {st === 'Received' ? '🛎️ Received' : st === 'Ready' ? '🎉 Ready' : '⚠️ No Stock'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. SIMULATED RECIPIENT */}
                  <div className="space-y-3 bg-stone-50 rounded-xl p-3 border border-stone-100">
                    <span className="font-mono font-bold text-[9px] uppercase text-amber-900 tracking-wider block">Delivery Destination</span>
                    <div className="space-y-1">
                      <span className="text-[10px] block text-stone-500 font-mono">Customer Name:</span>
                      <span className="font-sans font-bold text-stone-900 text-xs block">{previewOrder.customerName}</span>
                    </div>
                    <div className="space-y-1 pt-1.5 border-t border-stone-150">
                      <span className="text-[10px] block text-stone-500 font-mono">Phone Number:</span>
                      <span className="font-mono font-semibold text-stone-700 block">{previewOrder.customerPhone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-6 border-t border-stone-100 pt-4">
                  {msgTestSent && (
                    <div className="bg-green-50 border border-green-100 text-green-700 p-2.5 rounded-xl text-[10px] font-medium flex items-center gap-1.5 animate-bounce">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      Test SMS dispatched to {previewOrder.customerPhone || 'client'} (Simulated)
                    </div>
                  )}

                  {copiedMsgText && (
                    <div className="bg-amber-50 border border-amber-100 text-amber-900 p-2.5 rounded-xl text-[10px] font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      Message text copied to clipboard!
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setMsgTestSent(true);
                      setTimeout(() => setMsgTestSent(false), 4000);
                    }}
                    className="w-full py-2 bg-amber-900 hover:bg-amber-950 text-white font-bold tracking-wide rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3 h-3" /> Dispatch Test SMS
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentMsgText);
                      setCopiedMsgText(true);
                      setTimeout(() => setCopiedMsgText(false), 3000);
                    }}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-bold tracking-wide rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3 h-3" /> Copy Message Text
                  </button>
                </div>
              </div>

              {/* RIGHT: SMARTPHONE SMS INTERFACE */}
              <div className="flex-1 bg-stone-100 p-4 sm:p-6 flex items-center justify-center overflow-y-auto">
                {/* Smartphone Device Frame */}
                <div className="w-[320px] h-[480px] bg-stone-900 rounded-[36px] shadow-2xl border-4 border-stone-800 p-3 relative flex flex-col overflow-hidden select-text">
                  
                  {/* Notch / Speaker */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-4 bg-stone-900 rounded-b-xl z-20 flex justify-center items-start">
                    <span className="w-10 h-1 bg-stone-800 rounded-full mt-1 inline-block" />
                  </div>

                  {/* Screen Outer */}
                  <div className="flex-1 bg-stone-50 rounded-[28px] overflow-hidden flex flex-col relative pt-5">
                    
                    {/* Phone Status Bar */}
                    <div className="h-6 px-4 flex justify-between items-center text-[9px] text-stone-600 font-mono select-none bg-stone-50 shrink-0 border-b border-stone-100">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span>📶</span>
                        <span>🔋 100%</span>
                      </div>
                    </div>

                    {/* Chat Header */}
                    <div className="bg-white px-3 py-2 border-b border-stone-150 flex items-center gap-2 select-none shrink-0">
                      <div className="w-8 h-8 rounded-full bg-amber-900 text-amber-50 flex items-center justify-center text-xs font-serif font-black shadow-inner">
                        🍰
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[11px] text-stone-900 block truncate leading-tight">Cake Zone Notifications</span>
                          <span className="text-[10px] text-blue-500">✔️</span>
                        </div>
                        <span className="text-[8px] text-stone-400 block font-mono">Verified sender</span>
                      </div>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col justify-end bg-[#ECE5DD] relative">
                      {/* Ambient chat date bubble */}
                      <div className="self-center bg-stone-200/80 backdrop-blur-sm text-stone-600 text-[8px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider select-none">
                        Today
                      </div>

                      {/* Chat bubble */}
                      <div className="self-start max-w-[85%] bg-white text-stone-800 rounded-2xl rounded-tl-none p-3 shadow-sm border border-stone-200/50 relative text-[10px] leading-relaxed whitespace-pre-wrap">
                        {currentMsgText}
                        <span className="text-[8px] text-stone-400 block text-right mt-1 font-mono">9:41 AM</span>
                      </div>
                    </div>

                    {/* Chat Input simulator */}
                    <div className="bg-white p-2 border-t border-stone-150 flex items-center gap-1.5 select-none shrink-0">
                      <div className="bg-stone-100 flex-1 px-3 py-1.5 rounded-full text-[9px] text-stone-400 font-sans">
                        Text message is transactional (read-only)
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
