import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createBill,
  createInvoice,
  deleteInvoice,
  fetchCustomerOptions,
  fetchInvoice,
  fetchInvoiceDefaults,
  fetchInvoices,
  updateInvoice,
} from '@/services/invoices/api'
import type {
  CreateBillInput,
  InvoiceInput,
  InvoicesListParams,
} from '@/services/invoices/types'
import { customerKeys } from '@/services/customers/hooks'
import {
  companyStatsKeys,
  dashboardKeys,
} from '@/services/dashboard/hooks'
import { useAuth } from '@/hooks/useAuth'

export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (params: InvoicesListParams) => [...invoiceKeys.lists(), params] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
  defaults: () => [...invoiceKeys.all, 'defaults'] as const,
  customers: () => [...invoiceKeys.all, 'customers'] as const,
}

function invalidateInvoiceQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: invoiceKeys.all }),
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
    queryClient.invalidateQueries({ queryKey: companyStatsKeys.all }),
  ])
}

export function useInvoices(params: InvoicesListParams) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: invoiceKeys.list(params),
    queryFn: () => fetchInvoices(params),
    enabled: isAuthenticated && !authLoading,
    placeholderData: (previous) => previous,
  })
}

export function useInvoice(id: string | undefined) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: invoiceKeys.detail(id ?? ''),
    queryFn: () => fetchInvoice(id!),
    enabled: Boolean(id) && isAuthenticated && !authLoading,
  })
}

export function useInvoiceDefaults(enabled = true) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: invoiceKeys.defaults(),
    queryFn: fetchInvoiceDefaults,
    enabled: enabled && isAuthenticated && !authLoading,
  })
}

export function useInvoiceCustomerOptions() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: invoiceKeys.customers(),
    queryFn: fetchCustomerOptions,
    enabled: isAuthenticated && !authLoading,
  })
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: InvoiceInput) => createInvoice(input),
    onSuccess: () => invalidateInvoiceQueries(queryClient),
  })
}

export function useCreateBill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBillInput) => createBill(input),
    onSuccess: () =>
      Promise.all([
        invalidateInvoiceQueries(queryClient),
        queryClient.invalidateQueries({ queryKey: customerKeys.all }),
      ]),
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: InvoiceInput }) =>
      updateInvoice(id, input),
    onSuccess: () => invalidateInvoiceQueries(queryClient),
  })
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => invalidateInvoiceQueries(queryClient),
  })
}
