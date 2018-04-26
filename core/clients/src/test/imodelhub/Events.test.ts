/*---------------------------------------------------------------------------------------------
|  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
 *--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import chaiString = require("chai-string");
import * as chaiAsPromised from "chai-as-promised";

import { TestConfig } from "../TestConfig";

import { IModel, EventSubscription, CodeEvent, EventSAS, IModelQuery } from "../../imodelhub";
import { IModelHubClient } from "../../imodelhub/Client";
import { AuthorizationToken, AccessToken } from "../../Token";
import { ConnectClient, Project } from "../../ConnectClients";
import { ResponseBuilder, RequestType, ScopeType } from "../ResponseBuilder";
import { AzureFileHandler } from "../../imodelhub/AzureFileHandler";

chai.use(chaiString);
chai.use(chaiAsPromised);
chai.should();

describe("iModelHub EventHandler", () => {
  let accessToken: AccessToken;
  let projectId: string;
  let iModelId: string;
  let subscription: EventSubscription;
  const connectClient = new ConnectClient(TestConfig.deploymentEnv);
  const imodelHubClient: IModelHubClient = new IModelHubClient(TestConfig.deploymentEnv, new AzureFileHandler());
  const responseBuilder: ResponseBuilder = new ResponseBuilder();

  before(async () => {
    const authToken: AuthorizationToken = await TestConfig.login();
    accessToken = await connectClient.getAccessToken(authToken);

    const project: Project | undefined = await connectClient.getProject(accessToken, {
      $select: "*",
      $filter: "Name+eq+'" + TestConfig.projectName + "'",
    });
    chai.expect(project);

    projectId = project.wsgId;
    chai.expect(projectId);

    const requestPath = responseBuilder.createRequestUrl(ScopeType.Project, projectId, "iModel",
                                              "?$filter=Name+eq+%27" + TestConfig.iModelName + "%27");
    const requestResponse = responseBuilder.generateGetResponse<IModel>(responseBuilder.generateObject<IModel>(IModel,
                                            new Map<string, any>([
                                              ["wsgId", "b74b6451-cca3-40f1-9890-42c769a28f3e"],
                                              ["name", TestConfig.iModelName],
                                            ])));
    responseBuilder.MockResponse(RequestType.Get, requestPath, requestResponse);
    const iModels = await imodelHubClient.IModels().get(accessToken, projectId, new IModelQuery().byName(TestConfig.iModelName));

    if (!iModels[0].wsgId) {
      chai.assert(false);
      return;
    }

    iModelId = iModels[0].wsgId;
  });

  afterEach(() => {
    responseBuilder.clearMocks();
  });

  it("should subscribe to event subscription", async () => {
    const requestPath = responseBuilder.createRequestUrl(ScopeType.iModel, iModelId, "EventSubscription");
    const requestResponse = responseBuilder.generatePostResponse<EventSubscription>(responseBuilder.generateObject<EventSubscription>(EventSubscription,
                                            new Map<string, any>([["wsgId", "12345"], ["eventTypes", ["CodeEvent"]]])));
    const postBody = responseBuilder.generatePostBody<EventSubscription>(responseBuilder.generateObject<EventSubscription>(EventSubscription,
                                                        new Map<string, any>([["wsgId", undefined], ["eventTypes", ["CodeEvent"]]])));
    responseBuilder.MockResponse(RequestType.Post, requestPath, requestResponse, 1, postBody);

    subscription = await imodelHubClient.Events().Subscriptions().create(accessToken, iModelId, ["CodeEvent"]);
    chai.expect(subscription);
  });

  it("should receive code event", async () => {
    // This test attempts to receive at least one code event generated by the test above
    let requestPath = responseBuilder.createRequestUrl(ScopeType.iModel, iModelId, "EventSAS");
    const responseObject = responseBuilder.generateObject<EventSAS>(EventSAS, new Map<string, any>([
                     ["sasToken", "12345"],
                     ["baseAddres", "https://qa-imodelhubapi.bentley.com/v2.5/Repositories/iModel--" + iModelId + "/iModelScope"]]));
    let requestResponse = responseBuilder.generatePostResponse<EventSAS>(responseObject);
    const postBody = responseBuilder.generatePostBody<EventSAS>(responseBuilder.generateObject<EventSAS>(EventSAS));
    responseBuilder.MockResponse(RequestType.Post, requestPath, requestResponse, 1, postBody);
    const sas = await imodelHubClient.Events().getSASToken(accessToken, iModelId);

    requestPath = responseBuilder.createRequestUrl(ScopeType.iModel, iModelId, "Subscriptions", subscription.wsgId + "/messages/head");
    requestResponse = '{"EventTopic":"123","FromEventSubscriptionId":"456","ToEventSubscriptionId":"","BriefcaseId":1,"CodeScope":"0X100000000FF","CodeSpecId":"0xff","State":1,"Values":["TestCode143678383"]}';
    responseBuilder.MockResponse(RequestType.Delete, requestPath, requestResponse, 1, "", {"content-type": "CodeEvent"});
    const event = await imodelHubClient.Events().getEvent(sas.sasToken!, sas.baseAddres!, subscription.wsgId);

    requestPath = responseBuilder.createRequestUrl(ScopeType.iModel, iModelId, "EventSubscription", subscription.wsgId);
    responseBuilder.MockResponse(RequestType.Delete, requestPath, "");
    await imodelHubClient.Events().Subscriptions().delete(accessToken, iModelId, subscription.wsgId);
    chai.expect(event).instanceof(CodeEvent);
  });
});
