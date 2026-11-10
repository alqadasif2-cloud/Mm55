import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';

export const OtpModal: React.FC = () => {
  const { otpModalOpen, setOtpModalOpen, activeAccount } = useTrading();
  const [code, setCode] = useState<string>('482 195');
  const [countdown, setCountdown] = useState<number>(24);

  useEffect(() => {
    if (!otpModalOpen) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Generate new 6 digit code
          const p1 = Math.floor(100 + Math.random() * 900);
          const p2 = Math.floor(100 + Math.random() * 900);
          setCode(`${p1} ${p2}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [otpModalOpen]);

  if (!otpModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-fadeIn"
      onClick={() => setOtpModalOpen(false)}
    >
      <div
        className="bg-[#1b1e24] border border-[#2e333d] rounded-2xl w-full max-w-sm overflow-hidden text-right shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-[#14161b] border-b border-[#262b34] flex items-center justify-between">
          <button
            onClick={() => setOtpModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#8e9aa8] hover:text-white"
          >
            ✕
          </button>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">مولد كلمات المرور (OTP)</h3>
            <span className="text-blue-400">🛡️</span>
          </div>
          <div className="w-8"></div>
        </div>

        <div className="p-5 text-center space-y-4">
          <p className="text-xs text-[#8e9aa8] leading-relaxed">
            استخدم رمز التحقق لمرة واحدة لتسجيل الدخول الآمن إلى خوادم Exness و MetaQuotes.
          </p>

          <div className="bg-[#101215] border border-[#272c36] p-4 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-xs text-[#707c8b] block mb-1">
              الحساب: {activeAccount.accountNumber} ({activeAccount.name})
            </span>
            <div className="text-3xl font-extrabold tracking-widest text-[#64b5f6] font-mono tabular-nums my-1">
              {code}
            </div>

            {/* Countdown bar */}
            <div className="w-48 bg-[#20252e] h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#3897f0] h-full transition-all duration-1000"
                style={{ width: `${(countdown / 30) * 100}%` }}
              ></div>
            </div>
            <span className="text-[11px] text-[#8e9aa8] mt-1 font-mono">
              يتجدد خلال {countdown} ثانية
            </span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(code.replace(' ', ''));
              alert('تم نسخ رمز التحقق إلى الحافظة');
            }}
            className="w-full py-2.5 bg-[#3897f0] hover:bg-[#2884dc] text-white font-bold rounded-xl text-xs transition-colors"
          >
            نسخ رمز التحقق
          </button>
        </div>
      </div>
    </div>
  );
};
