'use server';

import { cookies } from 'next/headers';

const DISCLAIMER_COOKIE_NAME = 'beta-disclaimer-acknowledged';

export async function setDisclaimerAcknowledged() {
  const cookieStore = await cookies();

  cookieStore.set(DISCLAIMER_COOKIE_NAME, 'true', {
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
}

export async function hasDisclaimerBeenAcknowledged(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(DISCLAIMER_COOKIE_NAME);
}