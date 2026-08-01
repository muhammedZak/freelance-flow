import { useCallback, useEffect, useState } from 'react';

import {
  INITIAL_TASK_FORM_VALUES,
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
} from '../tasks.constants';
import { validateTaskForm } from '../tasksValidation';

function createInitialFormValues() {
  return {
    ...INITIAL_TASK_FORM_VALUES,
  };
}

function mapTaskToFormValues(task) {
  if (!task) {
    return createInitialFormValues();
  }

  const normalizedStatus = TASK_STATUS_VALUES.includes(task.status)
    ? task.status
    : INITIAL_TASK_FORM_VALUES.status;

  const normalizedPriority = TASK_PRIORITY_VALUES.includes(task.priority)
    ? task.priority
    : INITIAL_TASK_FORM_VALUES.priority;

  return {
    title: typeof task.title === 'string' ? task.title : '',

    description: typeof task.description === 'string' ? task.description : '',

    status: normalizedStatus,

    priority: normalizedPriority,

    dueDate: typeof task.dueDate === 'string' ? task.dueDate : '',
  };
}

function prepareTaskFormData(formData) {
  return {
    ...formData,
    title: formData.title.trim(),
    description: formData.description.trim(),
  };
}

function useTaskForm({ task, loading, onSubmit }) {
  const [formData, setFormData] = useState(() => mapTaskToFormValues(task));

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(mapTaskToFormValues(task));

    setErrors({});
  }, [task]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[name];

      return nextErrors;
    });
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (loading) {
        return;
      }

      const validationErrors = validateTaskForm(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        return;
      }

      setErrors({});

      const preparedFormData = prepareTaskFormData(formData);

      await onSubmit(preparedFormData);
    },
    [formData, loading, onSubmit],
  );

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
  };
}

export default useTaskForm;
