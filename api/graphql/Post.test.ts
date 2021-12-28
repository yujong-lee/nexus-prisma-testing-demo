import {createTestContext} from "../utils/createTestContext";

const ctx = createTestContext();

describe('Post', () => {
  it('ensures that a draft can be created and published', async () => {
    const draftResult = await ctx.client.request(`
      mutation {
        createDraft(title: "Nexus", body: "...") {
          id
          title
          body
          published
        }
      }
    `);

    expect(draftResult).toEqual({
      createDraft: {
        body: '...',
        id: 1,
        published: false,
        title: 'Nexus',
      },
    });      

    const publishResult = await ctx.client.request(`
      mutation publishDraft($draftId: Int!) {
        publish(draftId: $draftId) {
          id
          title
          body
          published
        }
      }
      `, {draftId: draftResult.createDraft.id},
    );

    expect(publishResult).toMatchInlineSnapshot(`
      Object {
        "publish": Object {
          "body": "...",
          "id": 1,
          "published": true,
          "title": "Nexus",
        },
      }
    `);
  });
});