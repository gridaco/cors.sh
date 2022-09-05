import Axios from "axios";

const HOST =
  process.env.NODE_ENV === "production"
    ? "https://services.cors.sh"
    : "http://localhost:4012";

const _client = Axios.create({
  baseURL: HOST,
  withCredentials: true,
});

interface CreateApplicationRequest {
  name: string;
  allowedOrigins: string[];
}

interface Application {
  id: string;
  allowedOrigins: string[];
}

type ApplicationWithApiKey = Application & {
  apikey_test: string;
  apikey_live: string;
};

type CreateAplicationResponse = ApplicationWithApiKey;

type UpdateApplicationRequest = Application;

async function createApplication(
  payload: CreateApplicationRequest
): Promise<CreateAplicationResponse> {
  const { data } = await _client.post<CreateAplicationResponse>(
    "/applications",
    payload
  );
  return data;
}

async function getApplication(id: string): Promise<ApplicationWithApiKey> {
  return (await _client.get<ApplicationWithApiKey>(`/applications/${id}`)).data;
}

async function listApplications(): Promise<Application[]> {
  return (await _client.get<Application[]>("/applications")).data;
}

async function deleteApplication(id: string) {
  await _client.delete(`/applications/${id}`);
}

async function updateApplication(
  id: string,
  payload: UpdateApplicationRequest
) {
  await _client.put(`/applications/${id}`, payload);
}

export default {
  ..._client,
  createApplication,
  getApplication,
  listApplications,
  deleteApplication,
  updateApplication,
};
