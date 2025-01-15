'use client'
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ApiErrorResponseType {
    errors: any;
    message: string;
  }


export default function ApiErrorResponse(error: any) {
    console.log(error,"error");
    
    const axiosError = error as AxiosError<ApiErrorResponseType>;
    if (axiosError.response) {
        console.log(axiosError.response);
        const errorMessage =
            axiosError.response.data.errors?.[0]?.msg ||
            axiosError.response.data.message ||
            'An unexpected error occurred'
        toast.error(errorMessage);
    } else {
        toast.error('An unexpected error occurred');
    }
}