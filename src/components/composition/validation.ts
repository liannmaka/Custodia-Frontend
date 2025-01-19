import { ref } from "vue";
import { type FormField } from "../../types/global";

export function useValidation(
  formFields: FormField[],
  formData: Record<string, any>
) {
  const errors = ref<Record<string, string | null>>({});

  formFields.forEach((field) => {
    errors.value[field.model] = null;
  });

  const validateField = (field: FormField, value: any) => {
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

  const validateAll = (): boolean => {
    let isValid = true;

    formFields.forEach((field) => {
      const error = validateField(field, formData[field.model]);
      errors.value[field.model] = error;
      if (error) {
        isValid = false;
      }
    });

    return isValid;
  };

  return {
    errors,
    validateField,
    validateAll,
  };
}
