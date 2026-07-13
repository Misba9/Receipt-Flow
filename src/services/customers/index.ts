export {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  customerKeys,
} from '@/services/customers/hooks'
export {
  useCustomerAutocompleteSearch,
  useExactCustomerDuplicate,
} from '@/services/customers/autocomplete'
export type {
  Customer,
  CustomerInput,
  CustomerSuggestion,
  CustomersListParams,
  CustomersListResult,
} from '@/services/customers/types'
export {
  searchCustomersAutocomplete,
  findExactCustomerDuplicate,
  customerToFormValues,
} from '@/services/customers/api'
