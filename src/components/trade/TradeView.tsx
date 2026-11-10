import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Position } from '../../types/mt5';

export const TradeView: React.FC = () => {
  const {
    activeAccount,
    positions,
    totalProfit,
    equity,
    margin,
    freeMargin,
    marginLevel,
    closePosition,
    modifyPosition,
    openOrderModal,
    setActiveTab,
    setSelectedSymbol,
    setIsDrawerOpen
  } = useTrading();

  const [expandedPosId, setExpandedPosId] = useState<string | null>(null);
  const [modifyingPos, setModifyingPos] = useState<Position | null>(null);
  const [newSl, setNewSl] = useState<string>('');
  const [newTp, setNewTp] = useState<string>('');
  const [sortBy, setSortBy] = useState<'time' | 'profit' | 'symbol'>('time');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [showCashierModal, setShowCashierModal] = useState<boolean>(false);

  const handleOpenModify = (pos: Position) => {
    setModifyingPos(pos);
    setNewSl(pos.sl ? String(pos.sl) : '');
    setNewTp(pos.tp ? String(pos.tp) : '');
  };

  const handleSaveModify = () => {
    if (!modifyingPos) return;
    modifyPosition(
      modifyingPos.id,
      newSl ? parseFloat(newSl) : undefined,
      newTp ? parseFloat(newTp) : undefined
    );
    setModifyingPos(null);
  };

  const handleSortToggle = () => {
    setSortAsc(!sortAsc);
  };

  const accountPositions = positions.filter(
    (p) => !p.accountId || p.accountId === activeAccount.id
  );

  const sortedPositions = [...accountPositions].sort((a, b) => {
    if (sortBy === 'profit') {
      return sortAsc ? a.profit - b.profit : b.profit - a.profit;
    }
    if (sortBy === 'symbol') {
      return sortAsc ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
    }
    return sortAsc ? a.ticket - b.ticket : b.ticket - a.ticket;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#000000] text-white overflow-hidden select-none">
      {/* 1. Header (Matching Screenshot_20261110131254_b40a6616.jpg) */}
      <header className="h-14 px-3 flex items-center justify-between border-b border-[#141517] bg-[#000000] shrink-0 z-20">
        {/* Right side: Hamburger and Title "التداول" */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="القائمة"
            className="w-10 h-10 flex items-center justify-center text-white active:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-6 h-6">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-wide text-white">التداول</h1>
        </div>

        {/* Left side 3 icons: Card, Sort Arrows, New Order (+) */}
        <div className="flex items-center gap-1.5 text-white">
          {/* Credit Card / Cashier icon */}
          <button
            onClick={() => setShowCashierModal(true)}
            aria-label="العمليات المالية"
            title="الإيداع والسحب"
            className="w-9 h-9 flex items-center justify-center active:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </button>

          {/* Double Vertical Arrows (Sort) */}
          <button
            onClick={handleSortToggle}
            aria-label="ترتيب الصفقات"
            title="فرز وتصنيف"
            className="w-9 h-9 flex items-center justify-center active:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
              <path d="M7 20V4M7 4L3 8M7 4L11 8" />
              <path d="M17 4V20M17 20L13 16M17 20L21 16" />
            </svg>
          </button>

          {/* New Order Button: Box with Plus (+) */}
          <button
            onClick={() => openOrderModal()}
            aria-label="فتح أمر جديد"
            title="أمر تداول جديد"
            className="w-9 h-9 flex items-center justify-center active:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. Authentic MT5 Dotted Financial Rows (Matching Screenshot_20261110131254_b40a6616.jpg) */}
      <div className="px-4 py-3 bg-[#000000] border-b border-[#141517] space-y-1.5 shrink-0">
        {/* Row 1: رصيد الحساب: */}
        <div className="flex items-baseline justify-between text-[13px]">
          <span className="font-normal text-white shrink-0">رصيد الحساب:</span>
          <div className="flex-1 mx-2 border-b border-dotted border-[#404652] self-center"></div>
          <span className="font-bold tabular-nums text-white shrink-0">
            {activeAccount.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        </div>

        {/* Row 2: قيمة رأس المال: */}
        <div className="flex items-baseline justify-between text-[13px]">
          <span className="font-normal text-white shrink-0">قيمة رأس المال:</span>
          <div className="flex-1 mx-2 border-b border-dotted border-[#404652] self-center"></div>
          <span className="font-bold tabular-nums text-white shrink-0">
            {equity.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        </div>

        {/* Row 3: الهامش المتاح: */}
        <div className="flex items-baseline justify-between text-[13px]">
          <span className="font-normal text-white shrink-0">الهامش المتاح:</span>
          <div className="flex-1 mx-2 border-b border-dotted border-[#404652] self-center"></div>
          <span className="font-bold tabular-nums text-white shrink-0">
            {freeMargin.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        </div>

        {/* Dynamic Margin rows if open positions exist */}
        {positions.length > 0 && (
          <>
            <div className="flex items-baseline justify-between text-[13px]">
              <span className="font-normal text-white shrink-0">الهامش:</span>
              <div className="flex-1 mx-2 border-b border-dotted border-[#404652] self-center"></div>
              <span className="font-bold tabular-nums text-white shrink-0">
                {margin.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-[13px]">
              <span className="font-normal text-white shrink-0">مستوى الهامش (%):</span>
              <div className="flex-1 mx-2 border-b border-dotted border-[#404652] self-center"></div>
              <span className="font-bold tabular-nums text-white shrink-0">
                {marginLevel > 0 ? `${marginLevel.toFixed(2)}%` : '—'}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-[13px] pt-1">
              <span className="font-normal text-[#8e9aa8] shrink-0">الربح العائم:</span>
              <div className="flex-1 mx-2 border-b border-dotted border-[#404652] self-center"></div>
              <span
                className={`font-bold tabular-nums shrink-0 ${
                  totalProfit >= 0 ? 'text-[#2196f3]' : 'text-[#ef5350]'
                }`}
              >
                {totalProfit >= 0 ? `+${totalProfit.toFixed(2)}` : totalProfit.toFixed(2)} USD
              </span>
            </div>
          </>
        )}
      </div>

      {/* 3. Open Positions List Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#14161a] bg-[#000000] scrollbar-thin">
        {sortedPositions.length === 0 ? (
          /* Pure clean canvas when no open positions, matching Screenshot_20261110131254_b40a6616.jpg */
          <div className="h-full w-full bg-[#000000]"></div>
        ) : (
          sortedPositions.map((pos) => {
            const isExpanded = expandedPosId === pos.id;

            return (
              <div
                key={pos.id}
                onClick={() => setExpandedPosId(isExpanded ? null : pos.id)}
                className="p-3.5 hover:bg-[#121418] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  {/* Right side: Symbol, Type, Lot, Prices */}
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-white tracking-wide">
                        {pos.symbol}
                      </span>
                      <span
                        className={`text-[12px] font-bold uppercase ${
                          pos.type === 'buy' ? 'text-[#2196f3]' : 'text-[#ef5350]'
                        }`}
                      >
                        {pos.type} {pos.lots.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xs text-[#8e9aa8] mt-1 tabular-nums" dir="ltr">
                      <span>{pos.openPrice.toFixed(2)}</span>
                      <span className="mx-1 text-[#5a6572]">→</span>
                      <span className="text-[#c5d0dc]">{pos.currentPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Left side: Profit in Blue or Red */}
                  <div className="text-left" dir="ltr">
                    <span
                      className={`text-base font-extrabold tabular-nums tracking-tight ${
                        pos.profit >= 0 ? 'text-[#2196f3]' : 'text-[#ef5350]'
                      }`}
                    >
                      {pos.profit >= 0 ? `+${pos.profit.toFixed(2)}` : pos.profit.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#8e9aa8] block">USD</span>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div
                    className="mt-3 pt-3 border-t border-[#1c1f24] space-y-2 text-xs text-[#8e9aa8] animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-2 gap-2 text-[11px] tabular-nums bg-[#0e1013] p-2.5 rounded-xl border border-[#1b1e24]">
                      <div>
                        <span>S/L (وقف الخسارة): </span>
                        <strong className="text-white">{pos.sl || 'غير محدد'}</strong>
                      </div>
                      <div>
                        <span>T/P (أخذ الربح): </span>
                        <strong className="text-white">{pos.tp || 'غير محدد'}</strong>
                      </div>
                      <div>
                        <span>التذكرة (Ticket): </span>
                        <strong className="text-white">#{pos.ticket}</strong>
                      </div>
                      <div>
                        <span>المبادلة (Swap): </span>
                        <strong className="text-white">{pos.swap.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span>العمولة: </span>
                        <strong className="text-white">{pos.commission.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span>الوقت: </span>
                        <strong className="text-white">{pos.openTime.split(' ')[1] || pos.openTime}</strong>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => closePosition(pos.id)}
                        className="py-2 px-2 bg-[#d32f2f] hover:bg-[#c62828] text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                      >
                        <span>إغلاق المركز</span>
                      </button>

                      <button
                        onClick={() => handleOpenModify(pos)}
                        className="py-2 px-2 bg-[#1f242d] hover:bg-[#282f3b] text-[#2196f3] font-bold rounded-lg text-xs border border-[#2d3542] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>تعديل S/L T/P</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSymbol(pos.symbol);
                          setActiveTab('chart');
                        }}
                        className="py-2 px-2 bg-[#1f242d] hover:bg-[#282f3b] text-white font-bold rounded-lg text-xs border border-[#2d3542] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>الرسم البياني</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Cashier / Deposit Quick Modal */}
      {showCashierModal && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setShowCashierModal(false)}
        >
          <div
            className="bg-[#1f2125] border border-[#2e3238] rounded-2xl w-full max-w-sm p-5 space-y-4 text-right shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#2e3238]">
              <h3 className="font-bold text-white text-base">العمليات المالية المباشرة</h3>
              <span className="text-xl">💳</span>
            </div>
            <p className="text-xs text-[#8e9aa8] leading-relaxed">
              الحساب الحالي: <strong className="text-white">{activeAccount.name} ({activeAccount.accountNumber})</strong>
              <br />
              الرصيد المتاح: <strong className="text-[#2196f3]">{activeAccount.balance.toFixed(2)} USD</strong>
            </p>
            <div className="bg-[#15171a] p-3 rounded-xl border border-[#282b30] text-xs text-[#8e9aa8] space-y-1">
              <div>• إيداع فوري عبر البطاقات البنكية والعملات الرقمية USDT</div>
              <div>• سحب مباشر بنفس طريقة الإيداع بدون عمولات إضافية</div>
              <div>• مزامنة آلية للسجل المالي والمحفظة</div>
            </div>
            <button
              onClick={() => setShowCashierModal(false)}
              className="w-full py-2.5 bg-[#3897f0] hover:bg-[#2884dc] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              تم
            </button>
          </div>
        </div>
      )}

      {/* Modify Position Modal */}
      {modifyingPos && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setModifyingPos(null)}
        >
          <div
            className="bg-[#1f2125] border border-[#2e3238] rounded-2xl w-full max-w-sm p-5 space-y-4 text-right shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#2e3238]">
              <h3 className="font-bold text-white text-base">
                تعديل الأمر #{modifyingPos.ticket} ({modifyingPos.symbol})
              </h3>
              <span className="text-xs uppercase font-extrabold text-[#2196f3]">
                {modifyingPos.type} {modifyingPos.lots}
              </span>
            </div>

            <div>
              <label className="text-xs text-[#8e9aa8] block mb-1">وقف الخسارة (Stop Loss):</label>
              <input
                type="number"
                step="0.01"
                placeholder="أدخل سعر وقف الخسارة"
                value={newSl}
                onChange={(e) => setNewSl(e.target.value)}
                className="w-full bg-[#121417] border border-[#2e3238] rounded-xl px-3 py-2 text-white text-sm font-bold outline-none tabular-nums"
              />
            </div>

            <div>
              <label className="text-xs text-[#8e9aa8] block mb-1">أخذ الربح (Take Profit):</label>
              <input
                type="number"
                step="0.01"
                placeholder="أدخل سعر أخذ الربح"
                value={newTp}
                onChange={(e) => setNewTp(e.target.value)}
                className="w-full bg-[#121417] border border-[#2e3238] rounded-xl px-3 py-2 text-white text-sm font-bold outline-none tabular-nums"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveModify}
                className="flex-1 py-2.5 bg-[#3897f0] hover:bg-[#2884dc] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                تطبيق التعديل
              </button>
              <button
                onClick={() => setModifyingPos(null)}
                className="px-4 py-2.5 bg-[#282b30] hover:bg-[#34383f] text-[#8e9aa8] font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
