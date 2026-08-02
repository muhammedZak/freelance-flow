import { createSelector } from '@reduxjs/toolkit';

import { selectCurrentUser } from '@features/auth';

const EMPTY_CLIENTS = Object.freeze([]);
const EMPTY_USERS = Object.freeze([]);

const USER_ROLE = Object.freeze({
  FREELANCER: 'freelancer',
  CLIENT: 'client',
});

function normalizeId(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedId = String(value).trim();

  return normalizedId || null;
}

function idsMatch(firstId, secondId) {
  const normalizedFirstId = normalizeId(firstId);
  const normalizedSecondId = normalizeId(secondId);

  if (!normalizedFirstId || !normalizedSecondId) {
    return false;
  }

  return normalizedFirstId === normalizedSecondId;
}

function normalizeUserIdentity(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }

  const id = normalizeId(user.id);

  if (!id) {
    return null;
  }

  return {
    id,
    name: String(user.name ?? '').trim(),
    email: String(user.email ?? '')
      .trim()
      .toLowerCase(),
    role: String(user.role ?? '').trim(),
  };
}

function canUserAccessClientProfile(clientProfile, currentUser) {
  if (!clientProfile || !currentUser) {
    return false;
  }

  if (currentUser.role === USER_ROLE.FREELANCER) {
    return idsMatch(clientProfile.freelancerId, currentUser.id);
  }

  if (currentUser.role === USER_ROLE.CLIENT) {
    return idsMatch(clientProfile.userId, currentUser.id);
  }

  return false;
}

function hydrateClientProfile(clientProfile, usersById, currentUser) {
  if (!clientProfile) {
    return null;
  }

  const id = normalizeId(clientProfile.id);
  const userId = normalizeId(clientProfile.userId);
  const freelancerId = normalizeId(clientProfile.freelancerId);

  let userIdentity = null;

  if (userId) {
    userIdentity = usersById.get(userId) ?? null;
  }

  /*
   * The current authenticated client can always
   * hydrate their own identity from auth state,
   * even when a separate users directory has not
   * been loaded yet.
   */
  if (!userIdentity && userId && idsMatch(currentUser?.id, userId)) {
    userIdentity = normalizeUserIdentity(currentUser);
  }

  const companyName = String(clientProfile.companyName ?? '').trim();

  return {
    ...clientProfile,

    id,
    userId,
    freelancerId,

    name: userIdentity?.name ?? '',
    email: userIdentity?.email ?? '',

    companyName,

    /*
     * Presentation compatibility alias.
     *
     * Existing UI code currently reads
     * client.company in some places.
     *
     * This value is derived only.
     * It is never written back into Redux
     * state or db.json.
     */
    company: companyName,

    phone: String(clientProfile.phone ?? '').trim(),

    address: String(clientProfile.address ?? '').trim(),

    identityLoaded: Boolean(userIdentity),
  };
}

const selectClientsState = (state) => state.clients ?? {};

export const selectRawClientProfiles = (state) =>
  selectClientsState(state).clients ?? EMPTY_CLIENTS;

const selectRawSelectedClient = (state) =>
  selectClientsState(state).selectedClient ?? null;

/*
 * Sanitized user-directory contract.
 *
 * Preferred future structure:
 *
 * state.users.items = [
 *   {
 *     id,
 *     name,
 *     email,
 *     role
 *   }
 * ]
 *
 * The fallback to state.users.users allows
 * migration without coupling hydration to
 * one temporary slice property name.
 *
 * Passwords are intentionally ignored even
 * if a source object accidentally contains one.
 */
const selectUserDirectory = (state) => {
  if (Array.isArray(state.users?.items)) {
    return state.users.items;
  }

  if (Array.isArray(state.users?.users)) {
    return state.users.users;
  }

  return EMPTY_USERS;
};

const selectUsersById = createSelector([selectUserDirectory], (users) => {
  const usersById = new Map();

  for (const user of users) {
    const identity = normalizeUserIdentity(user);

    if (!identity) {
      continue;
    }

    usersById.set(identity.id, identity);
  }

  return usersById;
});

export const selectCurrentClientProfile = createSelector(
  [selectRawClientProfiles, selectCurrentUser],
  (clientProfiles, currentUser) => {
    if (!currentUser || currentUser.role !== USER_ROLE.CLIENT) {
      return null;
    }

    return (
      clientProfiles.find((clientProfile) =>
        idsMatch(clientProfile.userId, currentUser.id),
      ) ?? null
    );
  },
);

export const selectVisibleClientProfiles = createSelector(
  [selectRawClientProfiles, selectCurrentUser],
  (clientProfiles, currentUser) => {
    if (!currentUser) {
      return EMPTY_CLIENTS;
    }

    return clientProfiles.filter((clientProfile) =>
      canUserAccessClientProfile(clientProfile, currentUser),
    );
  },
);

export const selectHydratedClients = createSelector(
  [selectVisibleClientProfiles, selectUsersById, selectCurrentUser],
  (clientProfiles, usersById, currentUser) =>
    clientProfiles.map((clientProfile) =>
      hydrateClientProfile(clientProfile, usersById, currentUser),
    ),
);

/*
 * Public list selector.
 *
 * Presentational components receive hydrated,
 * tenant-safe client UI models.
 */
export const selectAllClients = selectHydratedClients;

export const selectSelectedClientProfile = createSelector(
  [selectRawSelectedClient, selectCurrentUser],
  (selectedClient, currentUser) => {
    if (!selectedClient || !currentUser) {
      return null;
    }

    return canUserAccessClientProfile(selectedClient, currentUser)
      ? selectedClient
      : null;
  },
);

export const selectSelectedClient = createSelector(
  [selectSelectedClientProfile, selectUsersById, selectCurrentUser],
  (selectedClient, usersById, currentUser) => {
    if (!selectedClient) {
      return null;
    }

    return hydrateClientProfile(selectedClient, usersById, currentUser);
  },
);

export const selectClientProfileById = (state, clientId) => {
  const visibleClientProfiles = selectVisibleClientProfiles(state);

  return (
    visibleClientProfiles.find((clientProfile) =>
      idsMatch(clientProfile.id, clientId),
    ) ?? null
  );
};

export const selectHydratedClientById = (state, clientId) => {
  const hydratedClients = selectHydratedClients(state);

  return (
    hydratedClients.find((client) => idsMatch(client.id, clientId)) ?? null
  );
};

export const selectClientsLoading = (state) =>
  Boolean(selectClientsState(state).loading);

export const selectClientsError = (state) =>
  selectClientsState(state).error ?? null;

export const selectClientsSuccessMessage = (state) =>
  selectClientsState(state).successMessage ?? '';
