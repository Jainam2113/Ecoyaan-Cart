"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  ShoppingCart, Search, Star, Plus, Minus, X,
  ArrowRight, LayoutGrid, List, Trash2, Leaf,
  ShieldCheck, Truck, SlidersHorizontal, Sparkles,
} from "lucide-react";
import { ALL_PRODUCTS, CATEGORIES, type Product } from "@/lib/products";
import { useCheckout } from "@/context/CheckoutContext";
import type { CartItem } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type SortKey  = "popular" | "rating" | "price_asc" | "price_desc";

// ─── Quantity Stepper ─────────────────────────────────────────────────────────
function Stepper({
  product, qty, onAdd, onInc, onDec, size = "md",
}: {
  product: Product; qty: number;
  onAdd: (id: number) => void;
  onInc: (p: Product) => void;
  onDec: (id: number) => void;
  size?: "sm" | "md";
}) {
  const sm = size === "sm";
  if (qty === 0) {
    return (
      <button onClick={() => onAdd(product.product_id)}
        className={cn(
          "w-full flex items-center justify-center gap-1.5 font-semibold rounded-xl transition-all active:scale-95",
          "bg-[#1a472a] text-white hover:bg-[#145222] shadow-sm",
          sm ? "py-1.5 text-xs" : "py-2.5 text-sm"
        )}>
        <Plus className={sm ? "w-3 h-3" : "w-4 h-4"} /> Add to Cart
      </button>
    );
  }
  return (
    <div className={cn("flex items-center justify-between bg-[#1a472a] rounded-xl overflow-hidden w-full", sm ? "h-8" : "h-10")}>
      <button onClick={() => onDec(product.product_id)} aria-label="Decrease"
        className="flex-1 h-full flex items-center justify-center text-white hover:bg-[#145222] active:bg-[#0e3a18] transition-colors">
        <Minus className={sm ? "w-3 h-3" : "w-4 h-4"} />
      </button>
      <span className={cn("text-white font-bold select-none min-w-[2rem] text-center tabular-nums", sm ? "text-xs" : "text-sm")}>
        {qty}
      </span>
      <button onClick={() => onInc(product)} disabled={qty >= product.max_quantity} aria-label="Increase"
        className="flex-1 h-full flex items-center justify-center text-white hover:bg-[#145222] active:bg-[#0e3a18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <Plus className={sm ? "w-3 h-3" : "w-4 h-4"} />
      </button>
    </div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────
function GridCard({ product, qty, onAdd, onInc, onDec, delay }: {
  product: Product; qty: number; delay: number;
  onAdd: (id: number) => void;
  onInc: (p: Product) => void;
  onDec: (id: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const isSelected = qty > 0;
  const discount = Math.round(((product.original_price - product.product_price) / product.original_price) * 100);

  return (
    <div
      className={cn(
        "group bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 animate-slide-up border",
        isSelected
          ? "border-[#1a472a] shadow-[0_0_0_2px_rgba(26,71,42,0.15),0_8px_24px_rgba(26,71,42,0.10)]"
          : "border-gray-100 shadow-card hover:shadow-card-lg hover:border-gray-200 hover:-translate-y-0.5"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {!loaded && <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />}
        <Image
          src={product.image} alt={product.product_name}
          fill className={cn("object-cover transition-all duration-500 group-hover:scale-105", loaded ? "opacity-100" : "opacity-0")}
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          onLoad={() => setLoaded(true)} unoptimized
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className={cn(
              "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm",
              product.badge === "Best Seller" ? "bg-amber-400 text-amber-900" :
              product.badge === "Top Rated"   ? "bg-blue-500 text-white" :
              product.badge === "New"         ? "bg-emerald-500 text-white" :
              product.badge === "Premium"     ? "bg-gray-900 text-white" :
              product.badge === "Unique Gift" ? "bg-rose-500 text-white" :
              "bg-[#1a472a] text-white"
            )}>
              {product.badge === "Best Seller" && "⭐ "}
              {product.badge === "Top Rated"   && "🏆 "}
              {product.badge === "New"         && "✨ "}
              {product.badge === "Premium"     && "💎 "}
              {product.badge === "Unique Gift" && "🎁 "}
              {product.badge === "Handmade"    && "🤲 "}
              {product.badge === "Eco Pick"    && "🌿 "}
              {product.badge}
            </span>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full shadow">
            -{discount}%
          </span>
        )}
        {isSelected && (
          <div className="absolute bottom-3 left-3 w-7 h-7 bg-[#1a472a] rounded-full flex items-center justify-center shadow animate-bounce-soft">
            <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <span className="text-[10px] font-semibold text-[#52796f] uppercase tracking-widest">{product.category}</span>
        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 -mt-1">{product.product_name}</p>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={cn("w-3 h-3", i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200")} />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">{formatCurrency(product.product_price)}</span>
          <span className="text-xs text-gray-400 line-through">{formatCurrency(product.original_price)}</span>
        </div>
        {product.max_quantity <= 5 && (
          <p className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-lg">
            ⚠️ Only {product.max_quantity} left!
          </p>
        )}
        <div className="mt-auto">
          <Stepper product={product} qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} />
        </div>
      </div>
    </div>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────
function ListRow({ product, qty, onAdd, onInc, onDec, delay }: {
  product: Product; qty: number; delay: number;
  onAdd: (id: number) => void;
  onInc: (p: Product) => void;
  onDec: (id: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const isSelected = qty > 0;
  const discount = Math.round(((product.original_price - product.product_price) / product.original_price) * 100);

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden flex items-stretch transition-all duration-300 animate-slide-up border",
        isSelected
          ? "border-[#1a472a] shadow-[0_0_0_2px_rgba(26,71,42,0.12),0_4px_16px_rgba(26,71,42,0.08)]"
          : "border-gray-100 shadow-card hover:shadow-card-md hover:border-gray-200"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative w-28 sm:w-36 shrink-0 bg-gray-50 overflow-hidden">
        {!loaded && <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />}
        <Image src={product.image} alt={product.product_name} fill
          className={cn("object-cover transition-all duration-500 group-hover:scale-105", loaded ? "opacity-100" : "opacity-0")}
          sizes="144px" onLoad={() => setLoaded(true)} unoptimized />
        {isSelected && (
          <div className="absolute inset-0 bg-[#1a472a]/10 flex items-center justify-center">
            <div className="w-7 h-7 bg-[#1a472a] rounded-full flex items-center justify-center shadow">
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-4 px-4 py-4">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-[#52796f] uppercase tracking-widest">{product.category}</span>
            {product.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{product.badge}</span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1">{product.product_name}</p>
          <p className="text-xs text-gray-500 line-clamp-1 hidden sm:block">{product.description}</p>
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={cn("w-3 h-3", i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200")} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2.5 min-w-[120px]">
          <div className="text-right">
            <p className="font-bold text-gray-900">{formatCurrency(product.product_price)}</p>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-xs text-gray-400 line-through">{formatCurrency(product.original_price)}</span>
              {discount > 0 && <span className="text-[10px] font-bold text-red-500">-{discount}%</span>}
            </div>
          </div>
          <div className="w-32">
            <Stepper product={product} qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const { setCart, goToStep } = useCheckout();
  const [viewMode,  setViewMode]  = useState<ViewMode>("grid");
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("All");
  const [sortBy,    setSortBy]    = useState<SortKey>("popular");
  const [drawer,    setDrawer]    = useState(false);
  const [selections, setSelections] = useState<Map<number, number>>(new Map());

  // ── Derived state ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_PRODUCTS
      .filter(p => {
        const matchQ   = !q || p.product_name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some(t => t.includes(q));
        const matchCat = category === "All" || p.category === category;
        return matchQ && matchCat;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc")  return a.product_price - b.product_price;
        if (sortBy === "price_desc") return b.product_price - a.product_price;
        if (sortBy === "rating")     return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [search, category, sortBy]);

  const cartItems = useMemo(() => {
    const items: { product: Product; qty: number }[] = [];
    selections.forEach((qty, pid) => {
      const p = ALL_PRODUCTS.find(x => x.product_id === pid);
      if (p && qty > 0) items.push({ product: p, qty });
    });
    return items;
  }, [selections]);

  const totalItems   = useMemo(() => cartItems.reduce((a, x) => a + x.qty, 0), [cartItems]);
  const subtotal     = useMemo(() => cartItems.reduce((a, x) => a + x.product.product_price * x.qty, 0), [cartItems]);
  const shippingFee  = subtotal >= 500 ? 0 : subtotal > 0 ? 50 : 0;
  const grandTotal   = subtotal + shippingFee;

  // ── Handlers ──
  const setQty  = useCallback((id: number, qty: number) =>
    setSelections(prev => { const m = new Map(prev); qty <= 0 ? m.delete(id) : m.set(id, qty); return m; }), []);
  const onAdd   = useCallback((id: number) => setQty(id, 1), [setQty]);
  const onInc   = useCallback((p: Product) => setQty(p.product_id, Math.min((selections.get(p.product_id) ?? 0) + 1, p.max_quantity)), [selections, setQty]);
  const onDec   = useCallback((id: number) => setQty(id, (selections.get(id) ?? 0) - 1), [selections, setQty]);
  const onRemove = useCallback((id: number) => setQty(id, 0), [setQty]);
  const onClear  = useCallback(() => setSelections(new Map()), []);

  function handleCheckout() {
    if (!cartItems.length) return;
    const items: CartItem[] = cartItems.map(x => ({
      product_id:    x.product.product_id,
      product_name:  x.product.product_name,
      product_price: x.product.product_price,
      quantity:      x.qty,
      image:         x.product.image,
    }));
    setCart({ cartItems: items, shipping_fee: shippingFee, discount_applied: 0 });
    if (typeof window !== "undefined") window.location.href = "/checkout";
  }

  const catEmoji: Record<string, string> = { All: "🌿", Kitchen: "🍃", "Personal Care": "✨", Lifestyle: "☀️", Stationery: "📝" };

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* ════ HEADER ════ */}
      <header className="sticky top-0 z-40 border-b border-gray-100"
        style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#1a472a] flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-[#1a472a] text-base leading-none">Ecoyaan</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">Sustainable Shop</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search eco products…" aria-label="Search products"
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/30 focus:border-[#1a472a]/40 focus:bg-white transition-all placeholder:text-gray-400"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Cart */}
          <button onClick={() => setDrawer(true)} aria-label={`Open cart, ${totalItems} items`}
            className="relative flex items-center gap-2 bg-[#1a472a] text-white px-4 py-2.5 rounded-2xl text-sm font-semibold hover:bg-[#145222] active:scale-95 transition-all shadow-brand shrink-0">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:block">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow animate-bounce-soft">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ════ HERO ════ */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1a472a 0%,#2d6a4f 50%,#52796f 100%)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#84a98c,transparent)", transform: "translate(30%,-30%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <Sparkles className="w-3 h-3" /> Certified Sustainable Products
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Shop Eco-Friendly<br className="hidden sm:block" />
            <span className="text-green-300"> Products</span>
          </h1>
          <p className="text-green-200 mt-2 text-sm sm:text-base max-w-lg">
            {ALL_PRODUCTS.length} handpicked sustainable products · Free shipping above ₹500
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { icon: <Leaf className="w-3.5 h-3.5" />, label: "100% Eco Certified" },
              { icon: <Truck className="w-3.5 h-3.5" />, label: "Carbon Neutral Delivery" },
              { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Secure Checkout" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-1.5 text-xs text-green-100 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ FILTER BAR ════ */}
      <div className="bg-white border-b border-gray-100 sticky top-[61px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto flex-1 pb-0.5 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 border",
                  category === cat
                    ? "bg-[#1a472a] text-white border-[#1a472a] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}>
                {catEmoji[cat]} {cat}
                {cat !== "All" && (
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    category === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500")}>
                    {ALL_PRODUCTS.filter(p => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
              className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a472a]/30 cursor-pointer">
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>

          <div className="flex items-center bg-gray-100 rounded-xl p-0.5 shrink-0" role="group" aria-label="View mode">
            <button onClick={() => setViewMode("grid")} aria-pressed={viewMode === "grid"} title="Grid view"
              className={cn("p-2 rounded-lg transition-all duration-200", viewMode === "grid" ? "bg-white text-[#1a472a] shadow-sm" : "text-gray-400 hover:text-gray-600")}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} aria-pressed={viewMode === "list"} title="List view"
              className={cn("p-2 rounded-lg transition-all duration-200", viewMode === "list" ? "bg-white text-[#1a472a] shadow-sm" : "text-gray-400 hover:text-gray-600")}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ════ PRODUCTS ════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-36">
        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
            {category !== "All" && <span className="text-[#1a472a] font-medium"> in {category}</span>}
          </p>
          {(search || category !== "All") && (
            <button onClick={() => { setSearch(""); setCategory("All"); }}
              className="text-xs text-[#1a472a] hover:underline font-semibold flex items-center gap-1">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-card">
            <Search className="w-10 h-10 text-gray-300 mb-4" />
            <p className="font-semibold text-gray-700 text-lg">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter.</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }}
              className="mt-5 bg-[#1a472a] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-[#145222] transition-colors">
              Show all products
            </button>
          </div>
        )}

        {/* Grid */}
        {viewMode === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((p, i) => (
              <GridCard key={p.product_id} product={p} qty={selections.get(p.product_id) ?? 0}
                onAdd={onAdd} onInc={onInc} onDec={onDec} delay={(i % 8) * 50} />
            ))}
          </div>
        )}

        {/* List */}
        {viewMode === "list" && filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((p, i) => (
              <ListRow key={p.product_id} product={p} qty={selections.get(p.product_id) ?? 0}
                onAdd={onAdd} onInc={onInc} onDec={onDec} delay={(i % 10) * 40} />
            ))}
          </div>
        )}
      </main>

      {/* ════ STICKY BOTTOM BAR ════ */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40"
          style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", boxShadow: "0 -4px 24px rgba(0,0,0,0.10)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-[#1a472a]/10 rounded-xl flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5 text-[#1a472a]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                  <span className="font-normal text-gray-400"> · </span>
                  <span className="text-[#1a472a]">{formatCurrency(subtotal)}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {subtotal < 500
                    ? <span className="text-orange-500">Add <strong>{formatCurrency(500 - subtotal)}</strong> for free shipping</span>
                    : <span className="text-[#1a472a] font-medium">🎉 Free shipping unlocked!</span>
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setDrawer(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-[#1a472a] text-[#1a472a] text-sm font-semibold hover:bg-[#1a472a]/5 transition-colors">
                <ShoppingCart className="w-4 h-4" /> View Cart
              </button>
              <button onClick={handleCheckout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1a472a] text-white text-sm font-bold hover:bg-[#145222] active:scale-[0.98] transition-all shadow-brand">
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ CART DRAWER ════ */}
      {drawer && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" onClick={() => setDrawer(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[400px] bg-white z-50 flex flex-col animate-slide-right"
            style={{ boxShadow: "-8px 0 48px rgba(0,0,0,0.15)" }}>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1a472a]/10 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-[#1a472a]" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Your Cart</h2>
                  <p className="text-xs text-gray-400">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {cartItems.length > 0 && (
                  <button onClick={onClear}
                    className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-red-50 transition-all">
                    <Trash2 className="w-3 h-3" /> Clear all
                  </button>
                )}
                <button onClick={() => setDrawer(false)} aria-label="Close cart"
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors ml-1">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Free shipping progress */}
            {subtotal > 0 && subtotal < 500 && (
              <div className="px-5 py-3 bg-orange-50 border-b border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-orange-700 font-medium">
                    Add <span className="font-bold">{formatCurrency(500 - subtotal)}</span> for free shipping
                  </p>
                  <span className="text-xs font-bold text-orange-600">{Math.round((subtotal / 500) * 100)}%</span>
                </div>
                <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%`, background: "linear-gradient(90deg,#f97316,#fb923c)" }} />
                </div>
              </div>
            )}
            {subtotal >= 500 && (
              <div className="px-5 py-2.5 bg-[#1a472a]/5 border-b border-[#1a472a]/10">
                <p className="text-xs text-[#1a472a] font-bold text-center">🎉 Free shipping unlocked!</p>
              </div>
            )}

            {/* Empty */}
            {cartItems.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-9 h-9 text-gray-300" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add some eco-friendly products!</p>
                </div>
                <button onClick={() => setDrawer(false)}
                  className="bg-[#1a472a] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-[#145222] transition-colors">
                  Browse Products
                </button>
              </div>
            )}

            {/* Items */}
            {cartItems.length > 0 && (
              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {cartItems.map(({ product, qty }) => (
                  <div key={product.product_id} className="flex gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                      <Image src={product.image} alt={product.product_name} fill className="object-cover" sizes="64px" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">{product.product_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(product.product_price)} each</p>
                      <p className="text-sm font-bold text-[#1a472a] mt-0.5">{formatCurrency(product.product_price * qty)}</p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                          <button onClick={() => onDec(product.product_id)} aria-label="Decrease"
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-sm font-bold text-gray-900 text-center select-none tabular-nums">{qty}</span>
                          <button onClick={() => onInc(product)} disabled={qty >= product.max_quantity} aria-label="Increase"
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button onClick={() => onRemove(product.product_id)} aria-label="Remove"
                          className="ml-auto w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/50 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? "text-[#1a472a] font-semibold" : "font-medium"}>
                      {shippingFee === 0 ? "FREE 🎉" : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-lg pt-2.5 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#1a472a]">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
                <button onClick={() => { setDrawer(false); handleCheckout(); }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#1a472a] text-white font-bold hover:bg-[#145222] active:scale-[0.98] transition-all shadow-brand text-sm">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3 h-3" /> Secure checkout · Carbon neutral delivery
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
