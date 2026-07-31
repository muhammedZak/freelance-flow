export function getApiErrorMessage(
  error,
  fallbackMessage = 'Something went wrong.',
) {
  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  const responseData = error?.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (
    responseData &&
    typeof responseData.message === 'string' &&
    responseData.message.trim()
  ) {
    return responseData.message;
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export default getApiErrorMessage;
