import React, { useEffect } from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { SplashScreen1 } from './components/intro/SplashScreen1';
import { SplashScreen2 } from './components/intro/SplashScreen2';
import { IntroCardsScreen } from './components/intro/IntroCardsScreen';
import { Header } from './components/layout/Header';
import { MainMenuHome } from './components/pages/MainMenuHome';
import { CreateAccountPage } from './components/pages/CreateAccountPage';
import { BalanceInquiryPage } from './components/pages/BalanceInquiryPage';
import { ListAccountsPage } from './components/pages/ListAccountsPage';
import { DepositPage } from './components/pages/DepositPage';
import { WithdrawPage } from './components/pages/WithdrawPage';
import { TransferPage } from './components/pages/TransferPage';
import { TransactionHistoryPage } from './components/pages/TransactionHistoryPage';
import { ExitScreen } from './components/pages/ExitScreen';
import { Shield, Sparkles, Landmark } from 'lucide-react';
import { getHello } from './api';



const AppContent: React.FC = () => {
  const { activeScreen, setScreen } = useBanking();

  useEffect(() => {
    getHello().then(msg => {
      console.log("Backend says:", msg);
    });
  }, []);

  // Intro & Exit Screens (Full-screen layouts without standard header)
  if (activeScreen === 'splash-1') {
    return <SplashScreen1 />;
  }

  if (activeScreen === 'splash-2') {
    return <SplashScreen2 />;
  }

  if (activeScreen === 'intro-cards') {
    return <IntroCardsScreen />;
  }

  if (activeScreen === 'exit') {
    return <ExitScreen />;
  }

  // Main Application Shell
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 flex flex-col selection:bg-indigo-600 selection:text-white font-sans antialiased">
      {/* Sticky Main Header */}
      <Header />

      {/* Main Feature Screen Content */}
      <main className="flex-1 w-full pb-16">
        {activeScreen === 'main-menu' && <MainMenuHome />}
        {activeScreen === 'create-account' && <CreateAccountPage />}
        {activeScreen === 'balance-inquiry' && <BalanceInquiryPage />}
        {activeScreen === 'list-accounts' && <ListAccountsPage />}
        {activeScreen === 'deposit' && <DepositPage />}
        {activeScreen === 'withdraw' && <WithdrawPage />}
        {activeScreen === 'transfer' && <TransferPage />}
        {activeScreen === 'transaction-history' && <TransactionHistoryPage />}
      </main>

      {/* App Footer */}
      <footer className="w-full border-t border-slate-800 bg-[#111827]/70 backdrop-blur-sm py-5 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shadow-md shadow-indigo-500/20">
              NB
            </div>
            <span className="font-bold text-white uppercase tracking-wider text-xs">Nexus Banking Application</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Professional Polish Edition</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" /> ISO-20022 Verified Ledger
            </span>
            <button
              onClick={() => setScreen('splash-1')}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Intro Showcase
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <AppContent />
    </BankingProvider>
  );
}
