import Swal from "sweetalert2";
import { apiBaseUrl, apiKey } from "../utils/env";

interface LoginValues {
  email: string;
  password: string;
}

interface SignUpValues {
  name?: string;
  email: string;
  password: string;
}

interface Mission {
  title: string;
  status: string;
  description: string;
  joinLink: string;
}

export const postSignUp = async (uri: string, values: SignUpValues) => {
  try {
    const response = await fetch(`${apiBaseUrl}/${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    return response;
  } catch (error) {
    console.error("Error calling API:", error);
    return null;
  }
};

export const addMission = async (uri: string, values: Mission) => {
  try {
    if (!apiKey) {
      throw new Error("API key not found in environment variables");
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Access token not found");
    }

    const response = await fetch(`${apiBaseUrl}/${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
        "x-api-key": apiKey,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update dashboard: ${response.status} - ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error calling API:", error);
    return null;
  }
};

export const updateMission = async (uri: string, values: Mission) => {
  try {
    if (!apiKey) {
      throw new Error("API key not found in environment variables");
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Access token not found");
    }

    const response = await fetch(`${apiBaseUrl}/${uri}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
        "x-api-key": apiKey,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update dashboard: ${response.status} - ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error calling API:", error);
    return null;
  }
};

export const postLogin = async (uri: string, values: LoginValues) => {
  try {
    if (!apiKey) {
      throw new Error("API key not found in environment variables");
    }
    const response = await fetch(`${apiBaseUrl}/${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(values),
    });
    return response;
  } catch (error) {
    console.error("Error calling API:", error);
    return null;
  }
};

// export const getApi = async (uri: string) => {
//   try {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       throw new Error("Access token not found");
//     }
//     const response = await fetch(`${apiBaseUrl}/${uri}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//     });

//     return response;
//   } catch (error) {
//     console.error("Error calling API:", error);
//     return null;
//   }
// };

export const getApi = async (uri: string) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Access token not found");
    }

    const response = await fetch(`${apiBaseUrl}/${uri}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling API:", error);
    return null;
  }
};

export const createApi = async (uri: string, body: Record<string, any>) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Access token not found");
  }

  const response = await fetch(`${apiBaseUrl}/${uri}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return response;
};

export const patchApi = async (uri: string, body: Record<string, any>) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Access token not found");
  }

  const response = await fetch(`${apiBaseUrl}/${uri}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return response;
};

export const deleteApi = async (uri: string) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Access token not found");
  }

  const response = await fetch(`${apiBaseUrl}/${uri}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Optional: return a success message or response content
  return response;
};

export const deleteMission = async (uri: string) => {
  try {
    if (!apiKey) {
      throw new Error("API key not found in environment variables");
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Access token not found");
    }

    const response = await fetch(`${apiBaseUrl}/${uri}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete mission: ${response.status} - ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error calling API:", error);
    return null;
  }
};
