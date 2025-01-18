<template>
  <div class="bg-white px-10 py-4">
    <h2 class="text-xl font-bold">Add Customer</h2>
    <form @submit.prevent="saveCustomer">
      <div class="grid grid-cols-2 gap-4 pt-4">
        <!-- Input Fields -->
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
          @change="handleInputChange(field.model, $event)"
        />
        <!--  @onChange="(value: any) => handleInputChange(field.model, value)" -->

        <!-- State Dropdown -->
        <div>
          <label for="state" class="block text-sm font-medium text-gray-700">State</label>
          <select
            v-model="customer.state"
            id="state"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
           @change="handleInputChange('state', customer.state)"
          >
            <option disabled value="">Select State</option>
            <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
          </select>
        </div>

        <!-- Checkbox for Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <div class="flex items-center mt-1">
            <input
              id="status"
              type="checkbox"
              v-model="customer.status"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="status" class="ml-2 block text-sm text-gray-900">Active</label>
          </div>
        </div>

        <!-- Quill Editor -->
        <div class="col-span-2">
          <label for="customer-details" class="block text-sm font-medium text-gray-700">Customer Details</label>
          <div ref="editor" id="customer-details" class="quill-editor"></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-6 pb-3">
        <button class="bg-secondary px-3 py-2 mr-3 w-20 rounded-md" @click="$emit('close-customer')">Cancel</button>
        <button class="bg-primary px-3 py-2 w-20 rounded-md" type="submit">Save</button>
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

const { addCustomer } = useCustomerStore();

// Customer data
// const customer = ref({
//   firstName: "",
//   lastName: "",
//   email: "",
//   phone: "",
//   state: "",
//   status: false,
//   details: "",
// });

const customer = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  state: '',
  status: false,
  details: ''
});

// Available states
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
  "Zamfara"
];

// Form fields configuration
const formFields = [
  {
    id: 1,
    model: "firstName",
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
    model: "lastName",
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
    model: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter your phone number",
    required: false,
    icon: PhoneIcon,
    placement: "start",
    variant: "primary",
  },
];

// Quill editor
const editorContent = ref("");
const editor = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (editor.value) {
    const quill = new Quill(editor.value, {
      theme: "snow",
      modules: {
        toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"]],
      },
    });

    quill.root.innerHTML = editorContent.value;

    quill.on("text-change", () => {
      customer.value.details = quill.root.innerHTML;
    });
  }
});

// Save customer
const saveCustomer = () => {
  addCustomer(customer.value);
  resetCustomerForm();
};

// Reset form
// const resetCustomerForm = () => {
//   customer.value = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     state: "",
//     status: false,
//     details: "",
//   };
// };

// Handle input change
// const handleInputChange = (field: string, value: string | boolean) => {
//   customer.value[field] = value;
//   console.log('f', field)
//   console.log('v', value)
// };

// const handleInputChange = (field: string, value: string | boolean) => {
//   console.log('Field:', field);
//   console.log('New Value:', value);
//   customer[field] = value; // Update the corresponding field in the reactive customer object
// }

const handleInputChange = (field: keyof typeof customer, value: string | boolean) => {
  console.log('Field:', field);
  console.log('New Value:', value);
  customer[field] = value; // Safely update the corresponding field in the reactive customer object
};

// const handleInputChange = (field, value) => {
//   console.log(`Field: ${field}, New Value: ${value}`);
//   // Handle the input change logic here
// };
</script>

<style>
.quill-editor {
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}
</style>
