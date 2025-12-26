import { supabase } from '@/lib/supabase';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SubscriptionResult {
  success: boolean;
  message: string;
}

/**
 * Subscribe a user to the newsletter
 * @param email - User's email address
 * @returns Promise with success status and message
 */
export async function subscribeToNewsletter(email: string): Promise<SubscriptionResult> {
  try {
    // Validate email format
    if (!email || !EMAIL_REGEX.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('email, confirmed')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing subscriber:', checkError);
      return {
        success: false,
        message: 'An error occurred. Please try again later.',
      };
    }

    if (existingSubscriber) {
      if (existingSubscriber.confirmed) {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.',
        };
      } else {
        return {
          success: false,
          message: 'Please check your email to confirm your subscription.',
        };
      }
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID();
    const unsubscribeToken = crypto.randomUUID();

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: normalizedEmail,
        confirmed: false,
        confirmation_token: confirmationToken,
        unsubscribe_token: unsubscribeToken,
      });

    if (insertError) {
      console.error('Error inserting subscriber:', insertError);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.',
      };
    }

    // Send welcome email via Supabase Edge Function
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'send-newsletter-email',
        {
          body: {
            email: normalizedEmail,
            confirmationToken,
            unsubscribeToken,
          },
        }
      );

      if (functionError) {
        console.error('Error calling Edge Function:', functionError);
        // Don't fail the subscription if email fails
      } else {
        console.log('Welcome email sent successfully:', functionData);
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return {
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
    };
  } catch (error) {
    console.error('Unexpected error in subscribeToNewsletter:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}
