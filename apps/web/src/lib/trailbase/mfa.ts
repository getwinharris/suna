const BASE = process.env.NEXT_PUBLIC_TRAILBASE_URL || 'http://localhost:4000';

async function trailbaseFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Trailbase MFA error: ${res.status}`);
  }
  return res.json();
}

export const trailbaseMFAService = {
  async enrollPhoneNumber(data: { friendly_name: string; phone_number: string }) {
    return trailbaseFetch('/api/auth/v1/factors', {
      method: 'POST',
      body: JSON.stringify({ friendly_name: data.friendly_name, factor_type: 'phone', phone: data.phone_number }),
    });
  },

  async createChallenge(data: { factor_id: string }) {
    return trailbaseFetch(`/api/auth/v1/factors/${data.factor_id}/challenge`, {
      method: 'POST',
    });
  },

  async verifyChallenge(data: { factor_id: string; challenge_id: string; code: string }) {
    return trailbaseFetch(`/api/auth/v1/factors/${data.factor_id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ challenge_id: data.challenge_id, code: data.code }),
    });
  },

  async challengeAndVerify(data: { factor_id: string; code: string }) {
    const challenge = await this.createChallenge({ factor_id: data.factor_id });
    return this.verifyChallenge({ factor_id: data.factor_id, challenge_id: challenge.id, code: data.code });
  },

  async resendSMS(factorId: string) {
    return trailbaseFetch(`/api/auth/v1/factors/${factorId}/challenge`, {
      method: 'POST',
    });
  },

  async listFactors() {
    return trailbaseFetch('/api/auth/v1/factors');
  },

  async unenrollFactor(factorId: string) {
    return trailbaseFetch(`/api/auth/v1/factors/${factorId}`, {
      method: 'DELETE',
    });
  },

  async getAAL() {
    return trailbaseFetch('/api/auth/v1/user');
  },
};
