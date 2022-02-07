import ProviderService, {
  QueryParams,
  CallFunctionParams,
  ViewAccessKeyParams,
} from "./ProviderService";
import { mock } from "jest-mock-extended";
import { JsonRpcProvider } from "near-api-js/lib/providers";
import { providers } from "near-api-js";
import { QueryResponseKind } from "near-api-js/lib/providers/provider";

const defaults = {
  url: "https://rpc.testnet.near.org",
};

const createQueryResponseMock = (): QueryResponseKind => ({
  block_height: 0,
  block_hash: "",
});

const createFunctionCallResponseMock = (data: unknown) => ({
  ...createQueryResponseMock(),
  result: JSON.stringify(data)
    .split("")
    .map((x) => x.charCodeAt(0)),
  logs: [],
});

const createViewAccessKeyResponseMock = () => ({
  ...createQueryResponseMock(),
  amount: "0",
  code_hash: "11111111111111111111111111111111",
  locked: "0",
  storage_paid_at: 0,
  storage_usage: 0,
});

const setup = (url: string) => {
  const provider = mock<JsonRpcProvider>();

  jest.spyOn(providers, "JsonRpcProvider").mockImplementation(() => provider);

  return {
    provider,
    service: new ProviderService(url),
  };
};

describe("query", () => {
  it("forwards params to the near-api-js JsonRpcProvider", async () => {
    const { service, provider } = setup(defaults.url);
    const params: QueryParams = {
      request_type: "call_function",
      finality: "final",
      account_id: "accountId",
      method_name: "methodName",
      args_base64: "e30=",
    };

    provider.query.mockResolvedValue(createQueryResponseMock());

    await service.query(params);

    expect(provider.query).toHaveBeenCalledWith(params);
  });

  it("correctly parses the response", async () => {
    const { service, provider } = setup(defaults.url);
    const data = createQueryResponseMock();

    provider.query.mockResolvedValue(data);

    const response = await service.query({
      request_type: "call_function",
      finality: "final",
      account_id: "accountId",
      method_name: "methodName",
      args_base64: "e30=",
    });

    expect(response).toEqual(data);
  });
});

describe("callFunction", () => {
  it("forwards params to the near-api-js JsonRpcProvider", async () => {
    const { service, provider } = setup(defaults.url);
    const params: CallFunctionParams = {
      accountId: "accountId",
      methodName: "methodName",
      args: {},
    };

    provider.query.mockResolvedValue(createFunctionCallResponseMock([]));

    await service.callFunction(params);

    expect(provider.query).toHaveBeenCalledWith({
      request_type: "call_function",
      finality: "final",
      account_id: params.accountId,
      method_name: params.methodName,
      args_base64: Buffer.from(JSON.stringify(params.args)).toString("base64"),
    });
  });

  it("correctly parses the response", async () => {
    const { service, provider } = setup(defaults.url);
    const data: Array<unknown> = [];

    provider.query.mockResolvedValue(createFunctionCallResponseMock(data));

    const response = await service.callFunction({
      accountId: "accountId",
      methodName: "methodName",
      args: {},
    });

    expect(response).toEqual(data);
  });
});

describe("viewAccessKey", () => {
  it("forwards params to the near-api-js JsonRpcProvider", async () => {
    const { service, provider } = setup(defaults.url);
    const params: ViewAccessKeyParams = {
      accountId: "accountId",
      publicKey: "publicKey",
    };

    provider.query.mockResolvedValue(createViewAccessKeyResponseMock());

    await service.viewAccessKey(params);

    expect(provider.query).toHaveBeenCalledWith({
      request_type: "view_access_key",
      finality: "final",
      account_id: params.accountId,
      public_key: params.publicKey,
    });
  });

  it("correctly parses the response", async () => {
    const { service, provider } = setup(defaults.url);
    const data = createViewAccessKeyResponseMock();

    provider.query.mockResolvedValue(data);

    const response = await service.viewAccessKey({
      accountId: "accountId",
      publicKey: "publicKey",
    });

    expect(response).toEqual(data);
  });
});
