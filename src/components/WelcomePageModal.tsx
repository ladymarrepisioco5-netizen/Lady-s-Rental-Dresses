import React from 'react';
import { EnchantedWelcomePage } from './welcome/EnchantedWelcomePage.tsx';

interface WelcomePageModalProps {
  onEnterBoutique: (categoryFilter?: 'all' | 'short' | 'long' | 'featured') => void;
  onOpenAuth?: () => void;
}

export const WelcomePageModal: React.FC<WelcomePageModalProps> = ({
  onEnterBoutique,
  onOpenAuth
}) => {
  return (
    <EnchantedWelcomePage
      onEnterBoutique={onEnterBoutique}
      onOpenAuth={onOpenAuth}
    />
  );
};
