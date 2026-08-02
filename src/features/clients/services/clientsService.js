import apiClient from '@/api/apiClient';
import activitiesService from '../../activities/activitiesService';

const CLIENTS_ENDPOINT = '/clients';
const REGISTER_ENDPOINT = '/register';

const AUTH_SESSION_STORAGE_KEY = 'freelanceflow_auth_session';

const CLIENT_ROLE = 'client';
const FREELANCER_ROLE = 'freelancer';

const TEMPORARY_PASSWORD_CHARACTERS =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeId(value) {
  const id = normalizeText(value);

  return id || null;
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function generateTemporaryPassword() {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues) {
    throw new Error(
      'Secure password generation is not available in this environment.',
    );
  }

  const randomValues = new Uint32Array(16);

  cryptoApi.getRandomValues(randomValues);

  const randomPart = Array.from(
    randomValues,
    (value) =>
      TEMPORARY_PASSWORD_CHARACTERS[
        value % TEMPORARY_PASSWORD_CHARACTERS.length
      ],
  ).join('');

  return `Aa1!${randomPart}`;
}

function readStoredAuthSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    return null;
  }
}

function getStoredFreelancerId() {
  const session = readStoredAuthSession();
  const user = session?.user;

  if (!user || typeof user !== 'object') {
    return null;
  }

  if (user.role !== FREELANCER_ROLE) {
    return null;
  }

  return normalizeId(user.id);
}

function resolveFreelancerId(explicitFreelancerId) {
  const providedFreelancerId = normalizeId(explicitFreelancerId);

  if (providedFreelancerId) {
    return providedFreelancerId;
  }

  const storedFreelancerId = getStoredFreelancerId();

  if (storedFreelancerId) {
    return storedFreelancerId;
  }

  throw new Error('A logged-in freelancer is required to manage clients.');
}

function decodeJwtSubject(accessToken) {
  if (
    typeof accessToken !== 'string' ||
    typeof globalThis.atob !== 'function'
  ) {
    return null;
  }

  try {
    const tokenParts = accessToken.split('.');

    if (tokenParts.length !== 3) {
      return null;
    }

    const encodedPayload = tokenParts[1];

    const normalizedPayload = encodedPayload
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      '=',
    );

    const payload = JSON.parse(globalThis.atob(paddedPayload));

    return normalizeId(payload?.sub);
  } catch {
    return null;
  }
}

function getRegisteredUserId(registrationData) {
  const userIdFromResponse = normalizeId(registrationData?.user?.id);

  if (userIdFromResponse) {
    return userIdFromResponse;
  }

  const userIdFromToken = decodeJwtSubject(registrationData?.accessToken);

  if (userIdFromToken) {
    return userIdFromToken;
  }

  throw new Error(
    'The authentication server did not return the registered client user ID.',
  );
}

function validateClientCreationData(clientData) {
  const name = normalizeText(clientData?.name);
  const email = normalizeEmail(clientData?.email);
  const companyName = normalizeText(
    clientData?.companyName ?? clientData?.company,
  );

  if (!name) {
    throw new Error('Client name is required.');
  }

  if (!email) {
    throw new Error('Client email is required.');
  }

  if (!companyName) {
    throw new Error('Company name is required.');
  }

  return {
    name,
    email,
    companyName,
    phone: normalizeText(clientData?.phone),
    address: normalizeText(clientData?.address),
  };
}

function createBusinessFields(clientData) {
  return {
    companyName: normalizeText(clientData?.companyName ?? clientData?.company),
    phone: normalizeText(clientData?.phone),
    address: normalizeText(clientData?.address),
  };
}

function createBusinessPatch(clientData) {
  const patch = {};

  if (
    Object.prototype.hasOwnProperty.call(clientData, 'companyName') ||
    Object.prototype.hasOwnProperty.call(clientData, 'company')
  ) {
    patch.companyName = normalizeText(
      clientData.companyName ?? clientData.company,
    );
  }

  if (Object.prototype.hasOwnProperty.call(clientData, 'phone')) {
    patch.phone = normalizeText(clientData.phone);
  }

  if (Object.prototype.hasOwnProperty.call(clientData, 'address')) {
    patch.address = normalizeText(clientData.address);
  }

  return patch;
}

async function getClients(filters = {}) {
  const params = {};

  const freelancerId = normalizeId(filters.freelancerId);
  const userId = normalizeId(filters.userId);

  if (freelancerId) {
    params.freelancerId = freelancerId;
  }

  if (userId) {
    params.userId = userId;
  }

  const { data } = await apiClient.get(CLIENTS_ENDPOINT, {
    params,
  });

  return data;
}

async function getClientById(id) {
  const clientId = normalizeId(id);

  if (!clientId) {
    throw new Error('Client ID is required.');
  }

  const { data } = await apiClient.get(`${CLIENTS_ENDPOINT}/${clientId}`);

  return data;
}

async function createClient(clientData, activeFreelancerId = null) {
  const { name, email, companyName, phone, address } =
    validateClientCreationData(clientData);

  const freelancerId = resolveFreelancerId(activeFreelancerId);

  const temporaryPassword =
    normalizeText(clientData?.temporaryPassword) || generateTemporaryPassword();

  const registrationPayload = {
    name,
    email,
    password: temporaryPassword,
    role: CLIENT_ROLE,
  };

  const registrationResponse = await apiClient.post(
    REGISTER_ENDPOINT,
    registrationPayload,
  );

  const registrationData = registrationResponse.data ?? {};

  const userId = getRegisteredUserId(registrationData);

  const clientPayload = {
    userId,
    freelancerId,
    companyName,
    phone,
    address,
  };

  let createdClient;

  try {
    const response = await apiClient.post(CLIENTS_ENDPOINT, clientPayload);

    createdClient = response.data;
  } catch (error) {
    throw new Error(
      `The client login account was created, but the client profile could not be created. Registered user ID: ${userId}. ${error.message}`,
    );
  }

  await activitiesService.addActivity({
    message: `Client created: ${companyName}`,
    type: 'client',
    freelancerId,
    createdAt: getToday(),
  });

  return {
    ...createdClient,

    /*
     * accountSetup is response-only metadata.
     *
     * It is NOT sent to /clients and therefore is NOT stored
     * in db.json.
     *
     * Step 2 will decide how this one-time credential data is
     * handled by Redux without making it part of persistent
     * client state.
     */
    accountSetup: {
      userId,
      email,
      temporaryPassword,
    },
  };
}

async function updateClient(id, clientData) {
  const clientId = normalizeId(id);

  if (!clientId) {
    throw new Error('Client ID is required.');
  }

  const existingClient = await getClientById(clientId);

  const businessPatch = createBusinessPatch(clientData);

  if (Object.keys(businessPatch).length === 0) {
    return existingClient;
  }

  const { data } = await apiClient.patch(
    `${CLIENTS_ENDPOINT}/${clientId}`,
    businessPatch,
  );

  await activitiesService.addActivity({
    message: `Client updated: ${data.companyName}`,
    type: 'client',
    freelancerId: data.freelancerId,
    createdAt: getToday(),
  });

  return data;
}

async function deleteClient(id) {
  const clientId = normalizeId(id);

  if (!clientId) {
    throw new Error('Client ID is required.');
  }

  const client = await getClientById(clientId);

  await apiClient.delete(`${CLIENTS_ENDPOINT}/${clientId}`);

  await activitiesService.addActivity({
    message: `Client deleted: ${client.companyName}`,
    type: 'client',
    freelancerId: client.freelancerId,
    createdAt: getToday(),
  });

  return clientId;
}

const clientsService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

export default clientsService;
