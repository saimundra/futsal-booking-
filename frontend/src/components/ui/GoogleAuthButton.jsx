import React, { useEffect, useRef } from 'react';

const GoogleAuthButton = ({ onCredential, buttonText = 'continue_with' }) => {
  const buttonRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response?.credential) {
          onCredential(response.credential);
        }
      },
    });

    buttonRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: buttonText,
      shape: 'pill',
      width: 320,
    });
  }, [clientId, onCredential, buttonText]);

  if (!clientId) {
    return (
      <p className="text-xs text-center text-muted-foreground">
        Google login is not available. Set `VITE_GOOGLE_CLIENT_ID` in frontend env.
      </p>
    );
  }

  return <div className="flex justify-center" ref={buttonRef} />;
};

export default GoogleAuthButton;
