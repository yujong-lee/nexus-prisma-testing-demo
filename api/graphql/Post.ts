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
        return context.db.post.findMany({where: {published: false}});
      },
    }),
    t.list.field('posts', {
      type: nonNull('Post'),
      resolve(parent, args, context) {
        return context.db.post.findMany({where: {published: true}});
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
          published: false,
          title,
          body,
        };

        return context.db.post.create({data: draft});
      },
    }),
    t.nonNull.field('publish', {
      type: 'Post',
      args: {
        draftId: nonNull(intArg()),
      },
      resolve(parent, args, context) {
        const {draftId} = args;

        return context.db.post.update({
          where: {id: draftId},
          data: {published: true},
        });
      },
    });
  },  
});
