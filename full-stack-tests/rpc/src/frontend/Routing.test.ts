/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { assert } from "chai";
import { WebRoutingInterface } from "../common/TestRpcInterface";

describe("Web Routing", () => {
  it("should honor retry-after", async () => {
    const client = WebRoutingInterface.getClient();
    const sent = Date.now();

    return Promise.all([
      client.ping502(sent),
      client.ping503(sent),
      client.ping504(sent),
    ]).then((results) => results.forEach((result) => assert.isTrue(result)));
  });
});