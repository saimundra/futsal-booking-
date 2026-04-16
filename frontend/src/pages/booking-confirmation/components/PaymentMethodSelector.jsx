import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }) => {
  const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: 'CreditCard',
    description: 'Visa, Mastercard, American Express',
    logos: [
    {
      src: "https://img.rocket.new/generatedImages/rocket_gen_img_1ecbca32c-1764671386040.png",
      alt: 'Visa credit card logo with blue and white branding on payment interface'
    },
    {
      src: "https://img.rocket.new/generatedImages/rocket_gen_img_19df0b8cc-1766496825015.png",
      alt: 'Mastercard logo with red and orange overlapping circles on white background'
    }]

  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'Wallet',
    description: 'Fast and secure payment',
    logos: [
    {
      src: "https://img.rocket.new/generatedImages/rocket_gen_img_15678e513-1766478565886.png",
      alt: 'PayPal logo with blue text and distinctive P icon on payment screen'
    }]

  },
  {
    id: 'apple',
    name: 'Apple Pay',
    icon: 'Smartphone',
    description: 'Pay with your Apple device',
    logos: [
    {
      src: "https://images.unsplash.com/photo-1649734924649-b559375080b0",
      alt: 'Apple Pay logo with black Apple icon and Pay text on white surface'
    }]

  },
  {
    id: 'google',
    name: 'Google Pay',
    icon: 'Smartphone',
    description: 'Quick checkout with Google',
    logos: [
    {
      src: "https://img.rocket.new/generatedImages/rocket_gen_img_1095ffdaf-1764796173618.png",
      alt: 'Google Pay logo with colorful G icon and Pay text on mobile device'
    }]

  }];


  return (
    <div className="space-y-3 md:space-y-4">
      <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
        Select Payment Method
      </h3>
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {paymentMethods?.map((method) =>
        <button
          key={method?.id}
          onClick={() => onMethodChange(method?.id)}
          className={`w-full p-4 md:p-5 lg:p-6 rounded-xl border-2 transition-athletic text-left ${
          selectedMethod === method?.id ?
          'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`
          }>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
              selectedMethod === method?.id ? 'bg-primary' : 'bg-muted'}`
              }>
                  <Icon
                  name={method?.icon}
                  size={20}
                  color={selectedMethod === method?.id ? 'white' : 'var(--color-foreground)'} />

                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base lg:text-lg font-medium text-foreground mb-1">
                    {method?.name}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {method?.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                {method?.logos?.map((logo, index) =>
              <div key={index} className="w-10 h-6 md:w-12 md:h-8 rounded overflow-hidden">
                    <Image
                  src={logo?.src}
                  alt={logo?.alt}
                  className="w-full h-full object-contain" />

                  </div>
              )}

                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedMethod === method?.id ?
              'border-primary bg-primary' : 'border-border'}`
              }>
                  {selectedMethod === method?.id &&
                <Icon name="Check" size={14} color="white" />
                }
                </div>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>);

};

export default PaymentMethodSelector;