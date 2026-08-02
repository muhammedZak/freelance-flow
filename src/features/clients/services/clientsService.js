import axios from 'axios';

import apiClient from '@/api/apiClient';

import activitiesService from '../../activities/activitiesService';

const CLIENTS_ENDPOINT = '/clients';
const REGISTER_ENDPOINT = '/register';

const AUTH_SESSION_STORAGE_KEY = 'freelanceflow_auth_session';

const CLIENT_ROLE = 'client';
const FREELANCER_ROLE = 'freelancer';

const DEFAULT_CLIENT_STATUS = 'active';
const DEFAULT_REQUEST_TIMEOUT = 5000;

const TEMPORARY_PASSWORD_CHARACTERS =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/*
 * IMPORTANT:
 *
 * This Axios instance intentionally has NO interceptors.
 *
 * apiClient has a request interceptor that reads the token
 * from localStorage and assigns:
 *
 * Authorization: Bearer <stored token>
 *
 * That behavior is desirable for normal authenticated API
 * requests, but it is undesirable for this multi-request
 * transaction because we want to freeze the authenticated
 * freelancer credentials before POST /register happens.
 */
const isolatedApiClient = axios.create({
  baseURL: apiClient.defaults.baseURL,
  timeout: apiClient.defaults.timeout || DEFAULT_REQUEST_TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeId(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  const id = String(value).trim();

  if (!isNaN(id) && id !== '') {
    return Number(id);
  }

  return id || null;
}

function idsMatch(firstId, secondId) {
  const normalizedFirstId = normalizeId(firstId);

  const normalizedSecondId = normalizeId(secondId);

  if (!normalizedFirstId || !normalizedSecondId) {
    return false;
  }

  return normalizedFirstId === normalizedSecondId;
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

function decodeBase64Url(value) {
  if (typeof value !== 'string' || typeof globalThis.atob !== 'function') {
    return null;
  }

  try {
    const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');

    const paddedValue = normalizedValue.padEnd(
      Math.ceil(normalizedValue.length / 4) * 4,
      '=',
    );

    return globalThis.atob(paddedValue);
  } catch {
    return null;
  }
}

function decodeJwtPayload(accessToken) {
  if (typeof accessToken !== 'string') {
    return null;
  }

  const tokenParts = accessToken.split('.');

  if (tokenParts.length !== 3) {
    return null;
  }

  const decodedPayload = decodeBase64Url(tokenParts[1]);

  if (!decodedPayload) {
    return null;
  }

  try {
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

function decodeJwtSubject(accessToken) {
  const payload = decodeJwtPayload(accessToken);

  return normalizeId(payload?.sub);
}

function isJwtExpired(accessToken) {
  const payload = decodeJwtPayload(accessToken);

  if (!payload) {
    return false;
  }

  const expirationTime = Number(payload.exp);

  if (!Number.isFinite(expirationTime)) {
    return false;
  }

  const currentUnixTime = Math.floor(Date.now() / 1000);

  return currentUnixTime >= expirationTime;
}

function getActiveFreelancerAuthorization(activeFreelancerId) {
  const expectedFreelancerId = normalizeId(activeFreelancerId);

  if (!expectedFreelancerId) {
    throw new Error('An active freelancer ID is required to create a client.');
  }

  const session = readStoredAuthSession();

  if (!session) {
    throw new Error('No authenticated session was found. Please log in again.');
  }

  const sessionUser = session.user;

  if (!sessionUser || typeof sessionUser !== 'object') {
    throw new Error('The authenticated session does not contain a valid user.');
  }

  if (sessionUser.role !== FREELANCER_ROLE) {
    throw new Error(
      'Only an authenticated freelancer can create client accounts.',
    );
  }

  const sessionFreelancerId = normalizeId(sessionUser.id);

  if (!sessionFreelancerId) {
    throw new Error(
      'The authenticated freelancer session is missing a valid user ID.',
    );
  }

  if (!idsMatch(sessionFreelancerId, expectedFreelancerId)) {
    throw new Error(
      'The active freelancer ID does not match the authenticated session.',
    );
  }

  const accessToken = normalizeText(session.accessToken);

  if (!accessToken) {
    throw new Error(
      'The authenticated freelancer session is missing an access token. Please log in again.',
    );
  }

  const tokenSubject = decodeJwtSubject(accessToken);

  if (!tokenSubject) {
    throw new Error(
      'The authenticated freelancer access token is invalid. Please log in again.',
    );
  }

  if (!idsMatch(tokenSubject, expectedFreelancerId)) {
    throw new Error(
      'The freelancer access token does not belong to the active freelancer. Please log in again.',
    );
  }

  if (isJwtExpired(accessToken)) {
    throw new Error(
      'The freelancer session has expired. Please log in again before creating a client.',
    );
  }

  return {
    freelancerId: expectedFreelancerId,
    accessToken,
  };
}

function createAuthorizationHeaders(accessToken) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}

function createPublicRequestHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

function getHttpErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (
    typeof responseData?.message === 'string' &&
    responseData.message.trim()
  ) {
    return responseData.message.trim();
  }

  if (typeof responseData?.error === 'string' && responseData.error.trim()) {
    return responseData.error.trim();
  }

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData.trim();
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
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

  const status = normalizeText(clientData?.status) || DEFAULT_CLIENT_STATUS;

  const createdAt = normalizeText(clientData?.createdAt) || getToday();

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
    status,
    createdAt,
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

async function registerClientAccount(registrationPayload) {
  /*
   * This request intentionally carries NO bearer token.
   *
   * /register is a public authentication endpoint.
   *
   * More importantly, using isolatedApiClient prevents
   * apiClient's global interceptor from participating
   * in this account-creation transaction.
   */
  const response = await isolatedApiClient.post(
    REGISTER_ENDPOINT,
    registrationPayload,
    {
      headers: createPublicRequestHeaders(),
    },
  );

  return response.data ?? {};
}

async function createClientProfileAsFreelancer(
  clientPayload,
  freelancerAccessToken,
) {
  /*
   * The original freelancer token captured BEFORE
   * POST /register is explicitly forced onto this
   * request.
   *
   * isolatedApiClient has no interceptor, so nothing
   * can replace this Authorization value with the
   * JWT returned by /register.
   */
  const response = await isolatedApiClient.post(
    CLIENTS_ENDPOINT,
    clientPayload,
    {
      headers: createAuthorizationHeaders(freelancerAccessToken),
    },
  );

  return response.data;
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
  const { name, email, companyName, phone, address, status, createdAt } =
    validateClientCreationData(clientData);

  /*
   * Capture and validate the freelancer credentials
   * BEFORE creating the new client account.
   *
   * This prevents us from creating an orphaned client
   * user when the freelancer session is already
   * missing, invalid, mismatched, or expired.
   */
  const { freelancerId, accessToken: freelancerAccessToken } =
    getActiveFreelancerAuthorization(activeFreelancerId);

  const temporaryPassword =
    normalizeText(clientData?.temporaryPassword) || generateTemporaryPassword();

  const registrationPayload = {
    name,
    email,
    password: temporaryPassword,
    role: CLIENT_ROLE,
  };

  let registrationData;

  try {
    registrationData = await registerClientAccount(registrationPayload);
  } catch (error) {
    const errorMessage = getHttpErrorMessage(
      error,
      'Unable to create the client login account.',
    );

    throw new Error(errorMessage);
  }

  const userId = getRegisteredUserId(registrationData);

  const clientPayload = {
    userId,
    freelancerId,
    companyName,
    phone,
    address,
    status,
    createdAt,
  };

  let createdClient;

  try {
    createdClient = await createClientProfileAsFreelancer(
      clientPayload,
      freelancerAccessToken,
    );
  } catch (error) {
    const statusCode = error?.response?.status;

    const errorMessage = getHttpErrorMessage(
      error,
      'Unable to create the client profile.',
    );

    const statusMessage = statusCode ? `HTTP ${statusCode}. ` : '';

    throw new Error(
      `The client login account was created, but the client profile could not be created. Registered user ID: ${userId}. ${statusMessage}${errorMessage}`,
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
