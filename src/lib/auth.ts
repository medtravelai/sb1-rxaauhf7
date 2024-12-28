import { supabase } from './supabase';
import { User } from '../types';

export async function signUp(email: string, password: string, username: string, fullName: string) {
  // First check if user exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  if (existingUser) {
    throw new Error('Este nombre de usuario ya está en uso');
  }

  // Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
      },
    },
  });

  if (authError) {
    if (authError.message.includes('Email already registered')) {
      throw new Error('Este correo electrónico ya está registrado');
    }
    throw authError;
  }

  if (!authData.user) {
    throw new Error('Error al crear el usuario');
  }

  // Create profile immediately
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      username,
      full_name: fullName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    console.error('Profile creation error:', profileError);
    // Try to delete the auth user if profile creation fails
    try {
      await supabase.auth.admin.deleteUser(authData.user.id);
    } catch (deleteError) {
      console.error('Failed to cleanup auth user after profile creation failed:', deleteError);
    }
    throw new Error('Error al crear el perfil');
  }

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Correo electrónico o contraseña incorrectos');
    }
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
}