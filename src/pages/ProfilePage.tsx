import React from 'react';
import { ProfileForm } from '../components/profile/ProfileForm';
import { PreferencesForm } from '../components/profile/PreferencesForm';

export function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileForm />
      <PreferencesForm />
    </div>
  );
}