import { useState, useCallback } from "react";

interface ValidationRules {
  [key: string]: (value: any) => string | undefined;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialState: T,
  validationRules: ValidationRules
) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (validationRules[name]) {
        const error = validationRules[name](value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validationRules]
  );

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key](formData[key]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validationRules]);

  return { formData, errors, handleChange, validateForm, setFormData };
};
