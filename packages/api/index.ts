import Axios, { AxiosInstance, AxiosError } from "axios";

const HOST =
  process.env.NODE_ENV === "production"
    ? "https://cors.sh"
    : "http://localhost:8823";

export class Client {
  private _client: AxiosInstance;
  constructor(credentials: { "x-cors-service-checkout-session-id"?: string }) {
    this._client = Axios.create({
      baseURL: HOST + '/api',
      headers: {
        ...credentials,
      },
    });
  }

  async onboardingWithEmail({ email }: { email: string }) {
    try {
      return (
        await this._client.post<OnboardingApplication>(
          "/onboarding/with-email",
          { email }
        )
      ).data;
    } catch (e) {
      if (e instanceof AxiosError) {
        switch (e.response?.status) {
          case 409:
            throw new AlreadySignedUp();
          case 429:
            throw new OnboardingApiKeyAlreadyRequested();
        }
      }
    }
  }

  async onboardingWithForm({
    name,
    allowedOrigins = [],
    priceId,
  }: {
    name?: string;
    allowedOrigins?: string[];
    priceId?: string;
  }) {
    return (
      await this._client.post<OnboardingApplication>("/onboarding/with-form", {
        name: name,
        allowedOrigins: allowedOrigins,
        priceId: priceId,
      })
    ).data;
  }

  async getOnboardingApplication(id: string) {
    return (await this._client.get<OnboardingApplication>(`/onboarding/${id}`))
      .data;
  }

  async convertApplication(onboarding_id: string, checkout_session_id: string) {
    return (
      await this._client.post<ApplicationWithApiKey>(
        `/onboarding/${onboarding_id}/convert`,
        {
          checkout_session_id,
        }
      )
    ).data;
  }

  async createApplication(
    payload: CreateApplicationRequest
  ): Promise<CreateAplicationResponse> {
    const { data } = await this._client.post<CreateAplicationResponse>(
      "/applications",
      payload
    );
    return data;
  }

  async getApplication(id: string): Promise<ApplicationDetail> {
    return (await this._client.get<ApplicationDetail>(`/applications/${id}`))
      .data;
  }

  async listApplications(): Promise<Application[]> {
    return (await this._client.get<Application[]>("/applications")).data;
  }

  async deleteApplication(id: string) {
    await this._client.delete(`/applications/${id}`);
  }

  async updateApplication(id: string, payload: UpdateApplicationRequest) {
    await this._client.put(`/applications/${id}`, payload);
  }
}

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

export class AlreadySignedUp extends Error {
  constructor() {
    super("already signed up");
  }
}

export class OnboardingApiKeyAlreadyRequested extends Error {
  constructor() {
    super("onboarding api key already requested");
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

export interface OnboardingApplication {
  id: string;
  email: string;
  name?: string;
  allowedOrigins: string[];
  priceId?: string;
}

export type ApplicationWithApiKey = Application & {
  apikey_test: string;
  apikey_live: string;
};

export type ApplicationDetail = ApplicationWithApiKey;

export type CreateAplicationResponse = ApplicationWithApiKey;

export type UpdateApplicationRequest = Application;

export default new Client({});
