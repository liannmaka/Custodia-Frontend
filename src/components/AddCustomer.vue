<template>
  <div class="bg-white px-10 py-4">
    <h2 class="text-xl font-bold">Add Customer</h2>
    <form @submit.prevent="saveCustomer()">
      <div class="grid grid-cols-2 gap-4 pt-4">
        <Input
          v-for="field in formFields"
          :key="field.id"
          :label="field.label"
          :type="field.type"
          :placeholder="field.placeholder"
          :required="field.required"
          :icon="field.icon"
          :variant="field.variant"
          :placement="field.placement === 'start' ? field.placement : undefined"
          :value="customer[field.model]"
          @input="(event: any) => handleInputChange(field.model, event.target.value)"
        />
        <div>
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
        </div>
        <div>
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
            class="block text-sm font-medium text-gray-700"
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
          class="bg-primary text-white" type="submit"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, type Component } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Input from "./global/Input.vue";
import EmailIcon from "./icons/EmailIcon.vue";
import PhoneIcon from "./icons/PhoneIcon.vue";
import PersonIcon from "./icons/PersonIcon.vue";
import { useCustomerStore } from "../store/customers";
import { type CustomerDetails } from "../types/global";

export interface FormField {
  id: number;
  model: keyof Customer;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  icon: Component;
  placement?: "start" | "end";
  variant: "primary" | "search";
}

type Customer = typeof customer;

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
  },
  {
    id: 4,
    model: "phone_number",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter your phone number",
    required: false,
    icon: PhoneIcon,
    placement: "start",
    variant: "primary",
  },
];

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
  addCustomer(customer);
  console.log('custmr-dets', customer)
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