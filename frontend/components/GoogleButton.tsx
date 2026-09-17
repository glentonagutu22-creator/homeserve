"use client";

import { useEffect, useRef } from "react";

interface GoogleButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: {
              credential: string;
            }) => void;
          }) => void;

          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
              shape?: string;
            }
          ) => void;
        };
      };
    };
  }
}

/**
 * Google Identity Services is a global singleton.
 *
 * Keep track of the client ID that has already been initialized
 * so React remounts do not initialize GSI repeatedly.
 */
let initializedClientId: string | null = null;

export default function GoogleButton({
  onSuccess,
  onError,
}: GoogleButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error(
        "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured"
      );

      onErrorRef.current?.();
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const initializeGoogle = () => {
      if (cancelled) {
        return;
      }

      if (!buttonRef.current) {
        return;
      }

      if (!window.google) {
        attempts++;

        if (attempts < 50) {
          timeoutId = setTimeout(
            initializeGoogle,
            200
          );
        } else {
          console.error(
            "Google Identity Services failed to load"
          );

          onErrorRef.current?.();
        }

        return;
      }

      /*
       * Only initialize Google Identity Services once
       * for this client ID.
       */
      if (initializedClientId !== clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            onSuccessRef.current(
              response.credential
            );
          },
        });

        initializedClientId = clientId;
      }

      if (cancelled || !buttonRef.current) {
        return;
      }

      buttonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: "outline",
          size: "large",
          width: 320,
          text: "continue_with",
          shape: "rectangular",
        }
      );
    };

    initializeGoogle();

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div
      ref={buttonRef}
      className="flex min-h-10 justify-center"
    />
  );
}