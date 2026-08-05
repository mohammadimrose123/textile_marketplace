import { useState } from "react";

export function useForm({ defaultValues = {}, validate } = {}) {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const register = (name, rules = {}) => {
    return {
      name,
      value: values[name] ?? "",
      onChange: (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        handleChange(name, val);
      },
      onBlur: () => {
        if (rules.required && !values[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: { message: typeof rules.required === "string" ? rules.required : "This field is required" },
          }));
        }
      },
    };
  };

  const setValue = (name, value) => {
    handleChange(name, value);
  };

  const watch = (name) => {
    return values[name];
  };

  const validateForm = (rulesMap) => {
    const newErrors = {};

    if (validate) {
      const customErrs = validate(values);
      if (customErrs && Object.keys(customErrs).length > 0) {
        Object.assign(newErrors, customErrs);
      }
    }

    if (rulesMap) {
      Object.keys(rulesMap).forEach((field) => {
        const rule = rulesMap[field];
        const val = values[field];

        if (rule.required && (!val || val.toString().trim() === "")) {
          newErrors[field] = { message: typeof rule.required === "string" ? rule.required : "Required" };
        } else if (rule.pattern && val && !rule.pattern.value.test(val)) {
          newErrors[field] = { message: rule.pattern.message || "Invalid format" };
        } else if (rule.minLength && val && val.length < rule.minLength.value) {
          newErrors[field] = { message: rule.minLength.message || `Minimum ${rule.minLength.value} characters` };
        } else if (rule.validate && typeof rule.validate === "function") {
          const res = rule.validate(val, values);
          if (res !== true && res) {
            newErrors[field] = { message: typeof res === "string" ? res : "Invalid value" };
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (onSubmit, rulesMap) => async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm(rulesMap);
    if (isValid) {
      try {
        await onSubmit(values);
      } catch (err) {
        console.error("Form submission error:", err);
      }
    }
    setIsSubmitting(false);
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    values,
    errors,
    setErrors,
    isSubmitting,
  };
}
