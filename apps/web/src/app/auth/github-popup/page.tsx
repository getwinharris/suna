'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/trailbase/client';
import { BapxLoader } from '@/components/ui/bapx-loader';

interface AuthMessage {
  type: 'github-auth-success' | 'github-auth-error';
  message?: string;
  returnUrl?: string;
}

export default function GitHubOAuthPopup() {
  const [status, setStatus] = useState<'loading' | 'processing' | 'error'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const trailbase = createClient();

    // Get return URL from sessionStorage (set by parent component)
    const returnUrl =
      sessionStorage.getItem('github-returnUrl') || '/dashboard';

    const postMessage = (message: AuthMessage) => {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(message, window.location.origin);
        }
      } catch (err) {
        console.error('Failed to post message to opener:', err);
      }
    };

    const handleSuccess = () => {
      setStatus('processing');
      postMessage({
        type: 'github-auth-success',
        returnUrl,
      });

      // Close popup after short delay
      setTimeout(() => {
        window.close();
      }, 500);
    };

    const handleError = (message: string) => {
      setStatus('error');
      setErrorMessage(message);
      postMessage({
        type: 'github-auth-error',
        message,
      });

      // Close popup after delay to show error
      setTimeout(() => {
        window.close();
      }, 2000);
    };

    const handleOAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hasError = urlParams.has('error');

        // Handle OAuth errors
        if (hasError) {
          const error = urlParams.get('error');
          const errorDescription = urlParams.get('error_description');
          throw new Error(errorDescription || error || 'GitHub OAuth error');
        }

        // Trailbase OAuth is typically handled via redirect or specialized endpoints.
        // For now, we assume the user is redirected back here after successful auth
        // and the session is already established in the browser.
        
        const user = await trailbase.auth.getUser();
        if (user) {
          handleSuccess();
        } else {
          // If no user yet, wait a bit and try again (one retry)
          setTimeout(async () => {
            const userRetry = await trailbase.auth.getUser();
            if (userRetry) {
              handleSuccess();
            } else {
              handleError('Authentication failed. Please try again.');
            }
          }, 2000);
        }
      } catch (err: any) {
        console.error('OAuth processing error:', err);
        handleError(err.message || 'Failed to process authentication');
      }
    };

    handleOAuth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
      {status === 'loading' || status === 'processing' ? (
        <>
          <BapxLoader size="lg" className="mb-4" />
          <h1 className="text-xl font-semibold mb-2">
            {status === 'loading' ? 'Connecting to GitHub...' : 'Finishing setup...'}
          </h1>
          <p className="text-muted-foreground">
            This window will close automatically.
          </p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4 mx-auto text-destructive text-2xl font-bold">
            !
          </div>
          <h1 className="text-xl font-semibold mb-2 text-destructive">Authentication Error</h1>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
            {errorMessage || 'An unexpected error occurred during sign in.'}
          </p>
          <button 
            onClick={() => window.close()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            Close Window
          </button>
        </>
      )}
    </div>
  );
}
