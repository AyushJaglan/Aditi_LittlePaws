import { useQueryClient } from "@tanstack/react-query";
import { 
  useCreateReport, getGetReportsQueryKey, 
  useUpdateReport,
  useCreateAdoption, getGetAdoptionsQueryKey,
  useCreateAnimal, getGetAnimalsQueryKey,
  useCreateProduct, getGetProductsQueryKey,
  useRegisterVolunteer, getGetVolunteersQueryKey,
  useUpdateCase, getGetCasesQueryKey,
  useCreateHospital, getGetHospitalsQueryKey,
  useCreateVet, getGetVetsQueryKey
} from "@workspace/api-client-react";

// Wrappers to add automatic cache invalidation
export function useCreateReportMutation() {
  const qc = useQueryClient();
  return useCreateReport({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetReportsQueryKey() })
    }
  });
}

export function useUpdateReportMutation() {
  const qc = useQueryClient();
  return useUpdateReport({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetReportsQueryKey() })
    }
  });
}

export function useCreateAdoptionMutation() {
  const qc = useQueryClient();
  return useCreateAdoption({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetAdoptionsQueryKey() })
    }
  });
}

export function useCreateAnimalMutation() {
  const qc = useQueryClient();
  return useCreateAnimal({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetAnimalsQueryKey() })
    }
  });
}

export function useCreateProductMutation() {
  const qc = useQueryClient();
  return useCreateProduct({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetProductsQueryKey() })
    }
  });
}

export function useRegisterVolunteerMutation() {
  const qc = useQueryClient();
  return useRegisterVolunteer({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetVolunteersQueryKey() })
    }
  });
}

export function useUpdateCaseMutation() {
  const qc = useQueryClient();
  return useUpdateCase({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetCasesQueryKey() })
    }
  });
}

export function useCreateHospitalMutation() {
  const qc = useQueryClient();
  return useCreateHospital({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetHospitalsQueryKey() })
    }
  });
}

export function useCreateVetMutation() {
  const qc = useQueryClient();
  return useCreateVet({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetVetsQueryKey() })
    }
  });
}
