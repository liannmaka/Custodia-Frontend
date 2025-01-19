<template>
  <div class="bg-white px-10 py-4">
    <h2 class="text-xl font-bold">Add Customer</h2>
    <form @submit.prevent="saveCustomer()">
      <div class="grid grid-cols-2 gap-4 pt-4">
        <div v-for="field in formFields">
          <Input
            v-if="!field.renderSeparately"
            :key="field.id"
            :label="field.label"
            :type="field.type"
            :placeholder="field.placeholder"
            :required="field.required"
            :icon="field.icon"
            :variant="field.variant"
            :placement="
              field.placement === 'start' ? field.placement : undefined
            "
            :value="customer[field.model]"
            @input="(event: any) => handleInputChange(field.model, event.target.value)"
          />
          <p
            v-if="!field.renderSeparately && errors[field.model]"
            class="text-red-500 text-xs mt-1"
          >
            {{ errors[field.model] }}
          </p>
        </div>

        <div v-if="formFields.find((field) => field.model === 'state')">
          <label for="state" class="block text-sm font-medium text-gray-700"
            >State</label
          >
          <select
            v-model="customer.state"
            id="state"
            @change="handleInputChange('state', customer.state)"
            class="mt-1 w-full bg-secondary py-3 px-3 text-xs lg:text-sm rounded-md border-[1.5px] border-[#ccc] focus:ring-[#ccc] focus:ring-2 outline-none"
          >
            <option disabled value="">Select State</option>
            <option v-for="state in states" :key="state" :value="state">
              {{ state }}
            </option>
          </select>
          <p v-if="errors.state" class="text-red-500 text-xs mt-1">
            {{ errors.state }}
          </p>
        </div>

        <div v-if="formFields.find((field) => field.model === 'state')">
          <label for="status" class="block text-sm font-medium text-gray-700"
            >Status</label
          >
          <div class="flex items-center mt-1">
            <input
              id="status"
              type="checkbox"
              v-model="customer.status"
              @change="handleInputChange('status', customer.status)"
              class="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <label for="status" class="ml-2 block text-sm text-gray-900"
              >Active</label
            >
          </div>
        </div>
        <div class="col-span-2">
          <label
            for="customer-details"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Customer Details</label
          >
          <div ref="editor" id="customer-details" class="quill-editor"></div>
        </div>
      </div>
      <div class="mt-24 flex items-center space-x-4 lg:space-x-5">
        <button
          class="bg-secondary text-black/75"
          @click="$emit('close-customer')"
        >
          Cancel
        </button>
        <button
          class="bg-primary text-white disabled:text-gray-100 disabled:cursor-not-allowed"
          type="submit"
          :disabled="!validateAll()"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Input from "./global/Input.vue";
import EmailIcon from "./icons/EmailIcon.vue";
import PhoneIcon from "./icons/PhoneIcon.vue";
import PersonIcon from "./icons/PersonIcon.vue";
import { useCustomerStore } from "../store/customers";
import type { CustomerDetails, FormField } from "../types/global";
import { useValidation } from "./composition/validation";

export type Customer = typeof customer;

const { addCustomer } = useCustomerStore();

const customer = reactive<CustomerDetails>({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  state: "",
  status: true,
  details: "",
});

const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const formFields: FormField[] = [
  {
    id: 1,
    model: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    required: true,
    icon: PersonIcon,
    placement: "start",
    variant: "primary",
    minLength: 2,
  },
  {
    id: 2,
    model: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    required: true,
    icon: PersonIcon,
    placement: "start",
    variant: "primary",
    minLength: 2,
  },
  {
    id: 3,
    model: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    required: true,
    icon: EmailIcon,
    placement: "start",
    variant: "primary",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  {
    id: 4,
    model: "phone_number",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter your phone number",
    required: true,
    icon: PhoneIcon,
    placement: "start",
    variant: "primary",
  },
  {
    id: 5,
    model: "state",
    label: "State",
    type: "select",
    required: true,
    options: states,
    variant: "primary",
    renderSeparately: true,
  },
  {
    id: 6,
    model: "status",
    label: "Status",
    type: "checkbox",
    required: false,
    variant: "primary",
    renderSeparately: true,
  },
];
const { errors, validateAll } = useValidation(formFields, customer);
const editorContent = ref("");
const editor = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (editor.value) {
    const quill = new Quill(editor.value, {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
      },
    });

    quill.root.innerHTML = editorContent.value;

    quill.on("text-change", () => {
      customer.details = quill.root.innerHTML;
    });
  }
});

const saveCustomer = () => {
  const isValid = validateAll();
  if (!isValid) {
    return;
  }
  addCustomer(customer);
  console.log("custmr-dets", customer);
};

const handleInputChange = (field: keyof Customer, value: string | boolean) => {
  if (field === "status") {
    customer.status = value as boolean;
  } else {
    customer[field] = value as string;
  }
};
</script>

<style scoped>
button {
  @apply p-3 w-full max-w-36 flex items-center justify-center rounded-md font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all ease-in-out duration-100;
}
</style>
