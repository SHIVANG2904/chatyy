import { supabase } from '../lib/supabase';

export type AuthError = {
  message: string;
  isError: true;
};

export type AuthSuccess = {
  isError: false;
};

export type AuthResult = AuthError | AuthSuccess;

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        message: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password. Please try again.'
          : error.message,
        isError: true,
      };
    }

    return { isError: false };
  } catch (error) {
    return {
      message: 'An unexpected error occurred. Please try again.',
      isError: true,
    };
  }
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        message: error.message,
        isError: true,
      };
    }

    return { isError: false };
  } catch (error) {
    return {
      message: 'An unexpected error occurred. Please try again.',
      isError: true,
    };
  }
}