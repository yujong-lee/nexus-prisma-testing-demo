/* eslint-disable @typescript-eslint/no-unused-expressions */
import {extendType, intArg, nonNull, objectType, stringArg} from "nexus";

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.boolean('published');
    t.nonNull.string('title');
    t.nonNull.string('body');
  },
});

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('drafts', {
      type: nonNull('Post'),
      resolve(parent, args, context) {
        const {db} = context;

        return db.posts.filter(({published}) => !published);
      },
    }),
    t.list.field('posts', {
      type: nonNull('Post'),
      resolve(parent, args, context) {
        const {db} = context;

        return db.posts.filter(({published}) => published);
      },
    });

  },
});

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createDraft', {
      type: 'Post',
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        const {title, body} = args;

        const draft = {
          id: context.db.posts.length + 1,
          published: false,
          title,
          body,
        };

        context.db.posts.push(draft);

        return draft;
      },
    }),
    t.nonNull.field('publish', {
      type: 'Post',
      args: {
        draftId: nonNull(intArg()),
      },
      resolve(parent, args, context) {
        const {db} = context;
        const {draftId} = args;

        const draftToPublish = db.posts.find(({id}) => id === draftId);

        if (!draftToPublish) {
          throw new Error(`Could not find draft with id ${args.draftId}`);
        }

        draftToPublish.published = true;

        return draftToPublish;
      },
    });
  },  
});
