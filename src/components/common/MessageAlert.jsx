function getAlertClasses(type) {
  if (type === 'success') {
    return {
      container:
        'border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10',
      title: 'text-green-800 dark:text-green-300',
      message: 'text-green-700 dark:text-green-300/80',
    };
  }

  if (type === 'error') {
    return {
      container:
        'border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10',
      title: 'text-red-800 dark:text-red-300',
      message: 'text-red-700 dark:text-red-300/80',
    };
  }

  if (type === 'warning') {
    return {
      container:
        'border-yellow-200 bg-yellow-50 dark:border-yellow-500/30 dark:bg-yellow-500/10',
      title: 'text-yellow-800 dark:text-yellow-300',
      message: 'text-yellow-700 dark:text-yellow-300/80',
    };
  }

  return {
    container:
      'border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10',
    title: 'text-blue-800 dark:text-blue-300',
    message: 'text-blue-700 dark:text-blue-300/80',
  };
}

function getDefaultTitle(type) {
  if (type === 'success') {
    return 'Success';
  }

  if (type === 'error') {
    return 'Unable to complete the request';
  }

  if (type === 'warning') {
    return 'Please check';
  }

  return 'Information';
}

function MessageAlert({ message, type = 'info', title = '' }) {
  if (!message) {
    return null;
  }

  const alertClasses = getAlertClasses(type);
  const alertTitle = title || getDefaultTitle(type);

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border p-4 ${alertClasses.container}`}>
      <p className={`font-semibold ${alertClasses.title}`}>{alertTitle}</p>

      <p className={`mt-1 text-sm leading-6 ${alertClasses.message}`}>
        {message}
      </p>
    </div>
  );
}

export default MessageAlert;
