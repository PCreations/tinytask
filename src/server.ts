import Fastify, {
  type FastifyInstance,
  type RouteShorthandOptions,
} from 'fastify';

const server: FastifyInstance = Fastify({});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string',
          },
        },
      },
    },
  },
};

server.get('/ping', opts, async (request, reply) => {
  return { pong: 'it worked!' };
});

const start = async () => {
  try {
    server.listen({ port: 3000 }, () => {
      console.log('Server listening at port 3000');
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

void start();
