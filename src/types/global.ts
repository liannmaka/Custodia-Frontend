import { type Component } from "vue";
import type { Customer } from "../components/ui/AddCustomer.vue";

export interface CustomerDetails {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  state: string;
  status: boolean;
  details: string;
}

export interface FormField {
  id: number;
  model: keyof Customer;
  label: string;
  type: "text" | "email" | "tel" | "checkbox" | "select";
  placeholder?: string;
  required: boolean;
  icon?: Component;
  placement?: "start" | "end";
  variant: "primary" | "search";
  minLength?: number;
  options?: string[];
  pattern?: RegExp;
  maxLength?: number;
  customValidationMessage?: string;
  renderSeparately?: boolean;
}
