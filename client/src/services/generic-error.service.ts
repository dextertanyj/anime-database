import { createStandaloneToast } from "@chakra-ui/toast";
import { ClientError } from "graphql-request";

const { ToastContainer, toast } = createStandaloneToast({
  defaultOptions: { position: "top", status: "error" },
});

export const handleError = (error: ClientError): void => {
  switch (error.response.status) {
    case 401:
      toast({ description: "Not logged in." });
      break;
    case 403:
      toast({ description: "Unauthorized." });
      break;
    case 404:
      toast({ description: "Not found." });
      break;
    case 422:
      toast({ description: "Please try again later." });
      break;
    case 429:
      toast({ description: "Please try again later." });
      break;
    case 500:
    default:
      toast({ description: "Something went wrong." });
      break;
  }
};

export const GenericErrorToastContainer = ToastContainer;
