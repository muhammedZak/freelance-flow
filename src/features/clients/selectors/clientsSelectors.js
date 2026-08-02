import { createSelector } from '@reduxjs/toolkit';

import { selectCurrentUser } from '@features/auth';

const EMPTY_CLIENTS = Object.freeze([]);
const EMPTY_USERS = Object.freeze([]);

const USER_ROLE = Object.freeze({
  FREELANCER: 'freelancer',
  CLIENT: 'client',
});

/*
 * Normalizes database reference IDs into a canonical form.
 *
 * Examples:
 *
 * 1       -> 1
 * "1"     -> 1
 * " 1 "   -> 1
 * "001"   -> 1
 * 25      -> 25
 * "25"    -> 25
 *
 * "abc"       -> "abc"
 * "Wgqe-x5"   -> "Wgqe-x5"
 *
 * null        -> null
 * undefined   -> null
 * ""          -> null
 *
 * This allows json-server numeric IDs and string
 * foreign-key references to compare correctly while
 * still supporting alphanumeric IDs.
 */
function normalizeId(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const normalizedValue = String(value).trim();

  if (!normalizedValue) {
    return null;
  }

  /*
   * Only treat normal decimal numeric strings as numbers.
   *
   * This intentionally avoids converting unusual strings
   * such as:
   *
   * "0x10"
   * "Infinity"
   * "NaN"
   *
   * into numeric IDs.
   */
  const isNumericString = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(
    normalizedValue,
  );

  if (isNumericString) {
    const numericValue = Number(normalizedValue);

    if (Number.isFinite(numericValue)) {
      return numericValue;
    }
  }

  return normalizedValue;
}

function idsMatch(firstId, secondId) {
  const normalizedFirstId = normalizeId(firstId);
  const normalizedSecondId = normalizeId(secondId);

  if (normalizedFirstId === null || normalizedSecondId === null) {
    return false;
  }

  return normalizedFirstId === normalizedSecondId;
}

function normalizeUserIdentity(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }

  const id = normalizeId(user.id);

  if (id === null) {
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

  /*
   * Unknown roles fail closed.
   */
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

  if (userId !== null) {
    userIdentity = usersById.get(userId) ?? null;
  }

  if (!userIdentity && userId !== null && idsMatch(currentUser?.id, userId)) {
    userIdentity = normalizeUserIdentity(currentUser);
  }

  const companyName = String(
    clientProfile.companyName ?? clientProfile.company ?? '',
  ).trim();

  const status =
    String(clientProfile.status ?? '')
      .trim()
      .toLowerCase() || 'active';

  const createdAt = String(clientProfile.createdAt ?? '').trim();

  return {
    ...clientProfile,

    id,
    userId,
    freelancerId,

    name: userIdentity?.name ?? '',
    email: userIdentity?.email ?? '',

    companyName,
    company: companyName,

    phone: String(clientProfile.phone ?? '').trim(),

    address: String(clientProfile.address ?? '').trim(),

    status,
    createdAt,

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
 * Preferred structure:
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
 * Temporary compatibility structure:
 *
 * state.users.users = [...]
 *
 * Passwords are deliberately excluded from
 * normalizeUserIdentity(), even if the source
 * user objects happen to contain them.
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

/*
 * Builds:
 *
 * Map<normalizedUserId, sanitizedUserIdentity>
 *
 * Example:
 *
 * users:
 * [
 *   {
 *     id: 2,
 *     name: "Client User",
 *     email: "client@example.com"
 *   }
 * ]
 *
 * becomes:
 *
 * Map {
 *   2 => {
 *     id: 2,
 *     name: "Client User",
 *     email: "client@example.com"
 *   }
 * }
 *
 * Therefore a client profile containing:
 *
 * userId: "2"
 *
 * can still resolve the same identity because
 * normalizeId("2") returns Number 2.
 */
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
    clientProfiles
      .map((clientProfile) =>
        hydrateClientProfile(clientProfile, usersById, currentUser),
      )
      .filter(Boolean),
);

/*
 * Public Clients list selector.
 *
 * Components such as ClientsPage should consume
 * this selector instead of reading:
 *
 * state.clients.clients
 *
 * directly.
 *
 * Returned UI model:
 *
 * {
 *   id,
 *   userId,
 *   freelancerId,
 *   name,
 *   email,
 *   companyName,
 *   company,
 *   phone,
 *   address,
 *   identityLoaded
 * }
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
