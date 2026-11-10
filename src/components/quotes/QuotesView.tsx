import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { SymbolQuote } from '../../types/mt5';

export const QuotesView: React.FC = () => {
  const {
    quotes,
    selectedSymbol,
    setSelectedSymbol,
    setActiveTab,
    openOrderModal,
    setIsDrawerOpen
  } = useTrading();

  const [isAdvanced, setIsAdvanced] = useState<boolean>(true);
  const [selectedQuoteForMenu, setSelectedQuoteForMenu] = useState<SymbolQuote | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'forex' | 'metals' | 'commodities' | 'crypto' | 'indices'>('all');
  const [showAddSymbolNotice, setShowAddSymbolNotice] = useState<boolean>(false);

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || q.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // MT5 Pipette formatter: splits price into: base, big 2 pips, and superscript pipette
  const formatMT5Price = (price: number, digits: number) => {
    const str = price.toFixed(digits);
    if (digits >= 4) {
      // e.g. 1.08425 -> prefix '1.08', big '42', super '5'
      const len = str.length;
      const prefix = str.slice(0, len - 3);
      const bigDigits = str.slice(len - 3, len - 1);
      const superDigit = str.slice(len - 1);
      return { prefix, bigDigits, superDigit };
    } else if (digits === 3) {
      // e.g. 154.215 -> '154.', '21', '5'
      const len = str.length;
      const prefix = str.slice(0, len - 3);
      const bigDigits = str.slice(len - 3, len - 1);
      const superDigit = str.slice(len - 1);
      return { prefix, bigDigits, superDigit };
    } else if (digits === 2) {
      // e.g. 2384.45 -> '238', '4.', '45' or '2384.', '4', '5'
      const parts = str.split('.');
      return { prefix: parts[0] + '.', bigDigits: parts[1] || '00', superDigit: '' };
    } else {
      return { prefix: str, bigDigits: '', superDigit: '' };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#000000] text-white overflow-hidden select-none">
      {/* Header */}
      <header className="h-14 px-3.5 flex items-center justify-between border-b border-[#181818] bg-[#000000]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="القائمة"
            className="w-10 h-10 flex items-center justify-center text-white active:bg-white/10 rounded-full"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-6 h-6">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-wide">طلبات الأسعار</h1>
        </div>

        {/* Action icons: Edit pencil, Add plus */}
        <div className="flex items-center gap-1 text-[#d8dfe6]">
          <button
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#1f2125] text-[#64b5f6] border border-[#2e3238] transition-colors"
          >
            {isAdvanced ? 'المتقدم' : 'البسيط'}
          </button>
          <button
            onClick={() => {
              setShowAddSymbolNotice(true);
              setTimeout(() => setShowAddSymbolNotice(false), 3000);
            }}
            aria-label="إضافة رمز"
            className="w-9 h-9 flex items-center justify-center active:bg-white/10 rounded-full text-[#64b5f6]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {showAddSymbolNotice && (
        <div className="bg-[#1a2332] text-[#64b5f6] border-b border-[#24354a] px-4 py-2 text-xs flex items-center justify-between animate-fadeIn">
          <span>تمت إضافة جميع رموز التداول الأساسية: الذهب، الفضة، النفط USOIL، العملات والبيتكوين.</span>
          <button onClick={() => setShowAddSymbolNotice(false)} className="text-white">✕</button>
        </div>
      )}

      {/* Category Filter bar */}
      <div className="flex items-center gap-2 px-3.5 py-2 overflow-x-auto bg-[#0a0c0e] border-b border-[#141517] scrollbar-none">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'commodities', label: 'النفط والسلع (USOIL)' },
          { id: 'metals', label: 'المعادن (Gold)' },
          { id: 'forex', label: 'العملات (Forex)' },
          { id: 'crypto', label: 'العملات المشفرة' },
          { id: 'indices', label: 'المؤشرات' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#3897f0] text-white shadow-sm'
                : 'bg-[#1a1c20] text-[#8e9aa8] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Table Column Headers (in Advanced mode) */}
      {isAdvanced && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#101215] text-[11px] font-semibold text-[#8e9aa8] border-b border-[#1a1c20]">
          <span className="w-1/3 text-right">الرمز / الاسبريد</span>
          <div className="w-2/3 flex justify-between pr-2">
            <span className="text-right">سعر الطلب (Ask)</span>
            <span className="text-left">سعر العرض (Bid)</span>
          </div>
        </div>
      )}

      {/* Quotes List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#16181b]">
        {filteredQuotes.map((q) => {
          const bidFmt = formatMT5Price(q.bid, q.digits);
          const askFmt = formatMT5Price(q.ask, q.digits);
          const isSelected = selectedSymbol === q.symbol;

          return (
            <div
              key={q.symbol}
              onClick={() => setSelectedQuoteForMenu(q)}
              className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#15171b] active:bg-[#1c1f24] ${
                isSelected ? 'bg-[#15171b]/60' : ''
              }`}
            >
              {/* Left Column (Symbol, Spread, Time, High/Low) */}
              <div className="flex flex-col items-start w-1/3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[15px] font-bold text-white tracking-tight">
                    {q.symbol}
                  </span>
                  {q.source && (
                    <span className="text-[9px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-1.5 py-0.2 rounded font-mono font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                      {q.source}
                    </span>
                  )}
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3897f0]"></span>
                  )}
                </div>

                {isAdvanced ? (
                  <div className="text-[11px] text-[#8e9aa8] flex flex-col mt-0.5 tabular-nums">
                    <span>{q.time}</span>
                    <span className="text-[#a0aab5]">الاسبريد: {q.spread}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#8e9aa8] truncate max-w-[110px]">
                    {q.name}
                  </span>
                )}
              </div>

              {/* Middle and Right: Bid and Ask with MT5 Large Pips typography */}
              <div className="w-2/3 flex items-center justify-between pl-1">
                {/* Ask Price (Red/Up/Down Flash) */}
                <div
                  className={`text-right px-2 py-1 rounded transition-colors tabular-nums ${
                    q.tickDirection === 'up'
                      ? 'text-[#64b5f6]'
                      : q.tickDirection === 'down'
                      ? 'text-[#e57373]'
                      : 'text-white'
                  }`}
                >
                  <div className="flex items-baseline justify-end leading-none">
                    <span className="text-[13px] font-medium text-[#c0cad6]">
                      {askFmt.prefix}
                    </span>
                    <span className="text-[18px] font-extrabold text-white">
                      {askFmt.bigDigits}
                    </span>
                    {askFmt.superDigit && (
                      <span className="text-[11px] font-bold -top-1.5 relative text-[#c0cad6]">
                        {askFmt.superDigit}
                      </span>
                    )}
                  </div>
                  {isAdvanced && (
                    <div className="text-[10px] text-[#8e9aa8] mt-1 text-right">
                      أعلى: {q.high.toFixed(q.digits)}
                    </div>
                  )}
                </div>

                {/* Bid Price */}
                <div
                  className={`text-left px-2 py-1 rounded transition-colors tabular-nums ${
                    q.tickDirection === 'up'
                      ? 'text-[#64b5f6]'
                      : q.tickDirection === 'down'
                      ? 'text-[#e57373]'
                      : 'text-white'
                  }`}
                >
                  <div className="flex items-baseline justify-start leading-none">
                    <span className="text-[13px] font-medium text-[#c0cad6]">
                      {bidFmt.prefix}
                    </span>
                    <span className="text-[18px] font-extrabold text-white">
                      {bidFmt.bigDigits}
                    </span>
                    {bidFmt.superDigit && (
                      <span className="text-[11px] font-bold -top-1.5 relative text-[#c0cad6]">
                        {bidFmt.superDigit}
                      </span>
                    )}
                  </div>
                  {isAdvanced && (
                    <div className="text-[10px] text-[#8e9aa8] mt-1 text-left">
                      أدنى: {q.low.toFixed(q.digits)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MT5 Bottom Action Sheet when clicking a symbol */}
      {selectedQuoteForMenu && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedQuoteForMenu(null)}
        >
          <div
            className="bg-[#1f2125] border-t border-[#2e3238] rounded-t-3xl w-full max-w-md p-5 pb-8 space-y-2 select-none shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-10 h-1 bg-[#3a3e47] rounded-full mx-auto mb-3"></div>

            {/* Symbol Title */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2e3238]">
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {selectedQuoteForMenu.symbol}
                </h3>
                <p className="text-xs text-[#8e9aa8]">{selectedQuoteForMenu.name}</p>
              </div>
              <div className="text-left tabular-nums">
                <span className="text-sm font-bold text-[#64b5f6]">
                  {selectedQuoteForMenu.ask.toFixed(selectedQuoteForMenu.digits)}
                </span>
                <span className="text-xs text-[#8e9aa8] block">
                  الاسبريد: {selectedQuoteForMenu.spread}
                </span>
              </div>
            </div>

            {/* Action buttons matching MT5 Android */}
            <div className="pt-2 space-y-1">
              <button
                onClick={() => {
                  setSelectedSymbol(selectedQuoteForMenu.symbol);
                  openOrderModal(selectedQuoteForMenu.symbol);
                  setSelectedQuoteForMenu(null);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 active:bg-[#3897f0]/20 transition-colors text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#3897f0]/20 text-[#3897f0] flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-white block">صفقة جديدة</span>
                    <span className="text-xs text-[#8e9aa8]">فتح أمر شراء أو بيع فوري</span>
                  </div>
                </div>
                <span className="text-[#8e9aa8]">›</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSymbol(selectedQuoteForMenu.symbol);
                  setActiveTab('chart');
                  setSelectedQuoteForMenu(null);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 active:bg-[#3897f0]/20 transition-colors text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#00c853]/20 text-[#00c853] flex items-center justify-center font-bold">
                    📈
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-white block">فتح الرسم البياني</span>
                    <span className="text-xs text-[#8e9aa8]">عرض الشارت التجريبي التفاعلي</span>
                  </div>
                </div>
                <span className="text-[#8e9aa8]">›</span>
              </button>

              <button
                onClick={() => {
                  alert(`خصائص الرمز ${selectedQuoteForMenu.symbol}:\n- دقة السعر: ${selectedQuoteForMenu.digits} منازل\n- الاسبريد: عائم (${selectedQuoteForMenu.spread} نقطة)\n- الحد الأدنى للعقد: 0.01\n- الرافعة المالية: 1:2000`);
                  setSelectedQuoteForMenu(null);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 transition-colors text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ff9800]/20 text-[#ff9800] flex items-center justify-center font-bold">
                    ℹ️
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-white block">خصائص الرمز</span>
                    <span className="text-xs text-[#8e9aa8]">مواصفات العقد وساعات التداول</span>
                  </div>
                </div>
                <span className="text-[#8e9aa8]">›</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
