<template>
  <div class="bg-white px-5 lg:px-10 py-4">
    <div class="pt-6 rounded-lg">
      <h2 class="text-xl font-bold">
        {{ customerId ? "Edit" : "Add" }} Customer
      </h2>
      <form @submit.prevent="saveCustomer()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div v-for="field in formFields" :key="field.label">
            <div
              v-if="
                ['first_name', 'last_name', 'email', 'phone_number'].includes(
                  field.model
                )
              "
            >
              <Input
                :label="field.label"
                :type="field.type"
                :placeholder="field.placeholder"
                :required="field.required"
                :icon="field.icon"
                :variant="field.variant"
                :placement="
                  field.placement === 'start' ? field.placement : undefined
                "
                :value="String(customer[field.model])"
                @input="(event: any) => handleInputChange(field.model, event.target.value)"
              />
              <p
                v-if="!field.renderSeparately && errors[field.model]"
                class="text-red-500 text-xs mt-1"
              >
                {{ errors[field.model] }}
              </p>
            </div>
            <div v-if="field.model === 'state'">
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
            <div v-if="field.model === 'status'">
              <label
                for="status"
                class="block text-sm font-medium text-gray-700"
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
                <label for="status" class="ml-2 block text-sm text-gray-900">{{
                  customer.status ? "Active" : "Inactive"
                }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2 col-span-2">
          <label
            for="customer-details"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Customer Details</label
          >
          <div ref="editor" class="w-full min-h-32"></div>
        </div>
        <div
          class="mt-12 lg:mt-16 mb-2 lg:mb-4 flex items-center space-x-4 lg:space-x-5"
        >
          <button class="bg-secondary text-black/75" @click="cancel">
            Cancel
          </button>
          <button
            class="bg-primary text-white disabled:text-gray-100 disabled:cursor-not-allowed"
            type="submit"
            :disabled="Object.values(errors).some((error) => error !== null)"
          >
            {{ customerId ? "Save" : "Create" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import Quill from "quill";
import { Input } from "../global";
import { EmailIcon, PhoneIcon, PersonIcon } from "../icons";
import { useCustomerStore } from "../../store/customers";
import type { CustomerDetails, FormField } from "../../types/global";
import { useValidation } from "../composition/validation";
import router from "../../router";

export type Customer = typeof customer;

const customerId = ref<string>("");
const editor = ref<HTMLDivElement | null>(null);
const customer = reactive<CustomerDetails>({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  state: "",
  status: true,
  details: "",
});

const route = useRoute();
const customerStore = useCustomerStore();

const emit = defineEmits(["customer-saved", "close-customer"]);

onMounted(() => {
  const id = route.params.id as string;
  let customerDetails = customerStore.getCustomerById(id);

  if (editor.value) {
    const quill = new Quill(editor.value, {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          [{ align: "" }, { align: "center" }, { align: "right" }],
        ],
      },
    });

    quill.root.innerHTML = customer.details;

    quill.on("text-change", () => {
      customer.details = quill.root.innerHTML;
    });

    if (customerDetails)
      quill.clipboard.dangerouslyPasteHTML(customerDetails.details);
  }

  if (customerDetails) {
    customerId.value = customerDetails?.id ?? "";
    customer.first_name = customerDetails.first_name;
    customer.last_name = customerDetails.last_name;
    customer.email = customerDetails.email;
    customer.phone_number = customerDetails.phone_number;
    customer.state = customerDetails.state;
    customerDetails.status === "Inactive" ? (customer.status = false) : true;
  }
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

const { errors, validateOnInput, validateOnSubmit } = useValidation(
  formFields,
  customer
);

const saveCustomer = () => {
  if (validateOnSubmit()) {
    if (customer.status) {
      customer.status = "Active";
    } else {
      customer.status = "Inactive";
    }

    if (customerId.value) {
      customerStore.updateCustomer(customerId.value, customer);
    } else {
      customerStore.addCustomer(customer);
    }

    router.push("/customers");
  }
};

const cancel = () => {
  router.push("/customers");
};

const handleInputChange = (field: keyof Customer, value: string | boolean) => {
  if (field === "status") {
    customer.status = value as boolean;
  } else {
    customer[field] = value as string;
  }
  validateOnInput(field, value);
};
</script>

<style scoped>
button {
  @apply p-3 w-full max-w-36 flex items-center justify-center rounded-md font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all ease-in-out duration-100;
}
</style>
