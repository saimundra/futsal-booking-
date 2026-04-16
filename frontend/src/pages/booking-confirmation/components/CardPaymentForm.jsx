import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CardPaymentForm = ({ onSubmit, isProcessing }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [errors, setErrors] = useState({});

  const monthOptions = [
    { value: '01', label: '01 - January' },
    { value: '02', label: '02 - February' },
    { value: '03', label: '03 - March' },
    { value: '04', label: '04 - April' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - June' },
    { value: '07', label: '07 - July' },
    { value: '08', label: '08 - August' },
    { value: '09', label: '09 - September' },
    { value: '10', label: '10 - October' },
    { value: '11', label: '11 - November' },
    { value: '12', label: '12 - December' }
  ];

  const yearOptions = Array.from({ length: 15 }, (_, i) => {
    const year = new Date()?.getFullYear() + i;
    return { value: year?.toString(), label: year?.toString() };
  });

  const formatCardNumber = (value) => {
    const cleaned = value?.replace(/\s/g, '');
    const formatted = cleaned?.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted?.substring(0, 19);
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e?.target?.value);
    setCardNumber(formatted);
    if (errors?.cardNumber) {
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleCvvChange = (e) => {
    const value = e?.target?.value?.replace(/\D/g, '')?.substring(0, 4);
    setCvv(value);
    if (errors?.cvv) {
      setErrors({ ...errors, cvv: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!cardNumber || cardNumber?.replace(/\s/g, '')?.length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!cardName || cardName?.trim()?.length < 3) {
      newErrors.cardName = 'Please enter the name on card';
    }

    if (!expiryMonth) {
      newErrors.expiryMonth = 'Please select expiry month';
    }

    if (!expiryYear) {
      newErrors.expiryYear = 'Please select expiry year';
    }

    if (!cvv || cvv?.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit({
        cardNumber: cardNumber?.replace(/\s/g, ''),
        cardName,
        expiryMonth,
        expiryYear,
        cvv,
        saveCard
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="bg-muted/50 rounded-lg p-3 md:p-4 flex items-start gap-3">
        <Icon name="Shield" size={20} color="var(--color-success)" className="flex-shrink-0 mt-1" />
        <div>
          <p className="text-sm md:text-base font-medium text-foreground mb-1">
            Secure Payment
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            Your payment information is encrypted and secure. We never store your full card details.
          </p>
        </div>
      </div>
      <Input
        label="Card Number"
        type="text"
        placeholder="1234 5678 9012 3456"
        value={cardNumber}
        onChange={handleCardNumberChange}
        error={errors?.cardNumber}
        required
        className="mb-4"
      />
      <Input
        label="Cardholder Name"
        type="text"
        placeholder="John Doe"
        value={cardName}
        onChange={(e) => {
          setCardName(e?.target?.value);
          if (errors?.cardName) {
            setErrors({ ...errors, cardName: '' });
          }
        }}
        error={errors?.cardName}
        required
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Expiry Month"
          options={monthOptions}
          value={expiryMonth}
          onChange={(value) => {
            setExpiryMonth(value);
            if (errors?.expiryMonth) {
              setErrors({ ...errors, expiryMonth: '' });
            }
          }}
          error={errors?.expiryMonth}
          placeholder="Month"
          required
        />

        <Select
          label="Expiry Year"
          options={yearOptions}
          value={expiryYear}
          onChange={(value) => {
            setExpiryYear(value);
            if (errors?.expiryYear) {
              setErrors({ ...errors, expiryYear: '' });
            }
          }}
          error={errors?.expiryYear}
          placeholder="Year"
          required
        />

        <Input
          label="CVV"
          type="text"
          placeholder="123"
          value={cvv}
          onChange={handleCvvChange}
          error={errors?.cvv}
          required
          description="3-4 digits on back"
        />
      </div>
      <Checkbox
        label="Save card for future bookings"
        description="Your card will be securely stored for faster checkout"
        checked={saveCard}
        onChange={(e) => setSaveCard(e?.target?.checked)}
        className="mt-4"
      />
      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground pt-2">
        <Icon name="Lock" size={16} color="var(--color-success)" />
        <span>SSL encrypted payment processing</span>
      </div>
    </form>
  );
};

export default CardPaymentForm;