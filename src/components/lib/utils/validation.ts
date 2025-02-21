import { ref } from "vue";
import { type FormField } from "../../../types/global";

export const useValidation = (
  formFields: FormField[],
  formData: Record<string, any>
) => {
  const errors = ref<Record<string, string | null>>({});
  const touched = ref<Record<string, boolean>>({});

  formFields.forEach((field) => {
    errors.value[field.model] = null;
    touched.value[field.model] = false;
  });

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && !value) {
      return `${field.label} is required.`;
    }
    if (field.minLength && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters.`;
    }
    if (
      field.pattern &&
      typeof value === "string" &&
      !field.pattern.test(value)
    ) {
      return `${field.label} is not valid.`;
    }
    return null;
  };

  const validateOnInput = (model: string, value: any): void => {
    const field = formFields.find((f) => f.model === model);
    if (field) {
      errors.value[model] = validateField(field, value);
      touched.value[model] = true;
    }
  };

  const validateOnSubmit = (): boolean => {
    let isValid = true;
    formFields.forEach((field) => {
      const error = validateField(field, formData[field.model]);
      errors.value[field.model] = error;
      touched.value[field.model] = true;
      if (error) isValid = false;
    });
    return isValid;
  };

  return {
    errors,
    validateOnInput,
    validateOnSubmit,
  };
};
