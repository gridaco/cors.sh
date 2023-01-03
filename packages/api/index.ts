import Axios, { AxiosInstance } from "axios";

const HOST =
  process.env.NODE_ENV === "production"
    ? "https://services.cors.sh"
    : "http://localhost:4021";

const _signed_client = Axios.create({
  baseURL: HOST,
  withCredentials: true,
});

/**
 * client that is used for signing in the user.
 */
const _auth_client = Axios.create({
  baseURL: HOST,
  withCredentials: false,
});

/**
 * sign-in to cors.sh service. the authentication flow is..
 *
 * 1. user sign-in to grida.co (with first pary proxy authentication)
 * 2. user calles this function with the token.
 * 3. services.cors.sh will set the secure http only cookie.
 * 4. use the _signed_client to make future requests.
 * @returns
 */
export async function signin({ grida_token }: { grida_token: string }) {
  try {
    return await _auth_client.post("/auth/signin", {
      headers: {
        "Proxy-Authorization": `Bearer ${grida_token}`,
      },
    });
  } catch (e) {
    return false;
  }
}

export interface CreateApplicationRequest {
  name: string;
  allowedOrigins: string[];
}

export interface Application {
  name: string;
  id: string;
  allowedOrigins: string[];
}

export type ApplicationWithApiKey = Application & {
  apikey_test: string;
  apikey_live: string;
};

export type ApplicationDetail = ApplicationWithApiKey;

export type CreateAplicationResponse = ApplicationWithApiKey;

export type UpdateApplicationRequest = Application;

async function createApplication(
  payload: CreateApplicationRequest
): Promise<CreateAplicationResponse> {
  const { data } = await _signed_client.post<CreateAplicationResponse>(
    "/applications",
    payload
  );
  return data;
}

async function getApplication(id: string): Promise<ApplicationDetail> {
  return (await _signed_client.get<ApplicationDetail>(`/applications/${id}`))
    .data;
}

async function listApplications(): Promise<Application[]> {
  return (await _signed_client.get<Application[]>("/applications")).data;
}

async function deleteApplication(id: string) {
  await _signed_client.delete(`/applications/${id}`);
}

async function updateApplication(
  id: string,
  payload: UpdateApplicationRequest
) {
  await _signed_client.put(`/applications/${id}`, payload);
}

export default {
  ..._signed_client,
  createApplication,
  getApplication,
  listApplications,
  deleteApplication,
  updateApplication,
} as AxiosInstance & {
  createApplication: typeof createApplication;
  getApplication: typeof getApplication;
  listApplications: typeof listApplications;
  deleteApplication: typeof deleteApplication;
  updateApplication: typeof updateApplication;
};
