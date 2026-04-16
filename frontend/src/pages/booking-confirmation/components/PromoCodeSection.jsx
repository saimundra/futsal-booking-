import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PromoCodeSection = ({ onApplyPromo, appliedPromo }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!promoCode?.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setIsApplying(true);
    setError('');

    setTimeout(() => {
      const validCodes = {
        'FUTSAL10': { discount: 10, type: 'percentage' },
        'NEWUSER20': { discount: 20, type: 'percentage' },
        'SAVE5': { discount: 5, type: 'fixed' }
      };

      const code = validCodes?.[promoCode?.toUpperCase()];
      
      if (code) {
        onApplyPromo({
          code: promoCode?.toUpperCase(),
          ...code
        });
        setPromoCode('');
      } else {
        setError('Invalid promo code. Please try again.');
      }
      
      setIsApplying(false);
    }, 1000);
  };

  const handleRemove = () => {
    onApplyPromo(null);
  };

  return (
    <div className="bg-card rounded-xl shadow-athletic p-4 md:p-6">
      <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground mb-4">
        Promo Code
      </h3>
      {appliedPromo ? (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center flex-shrink-0">
                <Icon name="Tag" size={20} color="white" />
              </div>
              <div>
                <p className="text-sm md:text-base font-medium text-foreground">
                  {appliedPromo?.code}
                </p>
                <p className="text-xs md:text-sm text-success">
                  {appliedPromo?.type === 'percentage'
                    ? `${appliedPromo?.discount}% discount applied`
                    : `$${appliedPromo?.discount?.toFixed(2)} discount applied`}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-athletic"
            >
              <Icon name="X" size={20} color="var(--color-destructive)" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e?.target?.value?.toUpperCase());
                  setError('');
                }}
                error={error}
              />
            </div>
            <Button
              variant="secondary"
              onClick={handleApply}
              loading={isApplying}
              disabled={!promoCode?.trim()}
              className="sm:w-auto"
            >
              Apply
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs md:text-sm text-muted-foreground mb-2">
              Available promo codes:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                FUTSAL10
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                NEWUSER20
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                SAVE5
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodeSection;