import {GraphQLClient} from 'graphql-request';
import getPort, {makeRange} from 'get-port';
import {ServerInfo} from 'apollo-server';

import {server} from '../server';

type TestContext = {
  client: GraphQLClient
}

const graphqlTestContext = (): {
  before(): Promise<GraphQLClient>;
  after(): void;
} => {
  let serverInstance: ServerInfo | null = null;

  return {
    async before() {
      const port = await getPort({port: makeRange(4000, 6000)});

      serverInstance = await server.listen({port});   

      return new GraphQLClient(`http://localhost:${port}`);  
    },

    after() {
      serverInstance?.server.close();      
    },
  };
};

export const createTestContext = (): TestContext =>  {
  const ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext();

  beforeEach(async () => {
    const client = await graphqlCtx.before();

    Object.assign(ctx, {client});
  });

  afterEach(() => {
    graphqlCtx.after();
  });

  return ctx;
};
