import Fastify, { type FastifyInstance } from 'fastify';
import { type Static, Type } from '@sinclair/typebox';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { tasks } from './db/schema';
import { tinyTaskDb } from './db/tinytask-db';
import { eq } from 'drizzle-orm';

const server: FastifyInstance = Fastify(
  {},
).withTypeProvider<TypeBoxTypeProvider>();

const CreateTaskRequestSchema = Type.Object({
  id: Type.String(),
  text: Type.String(),
});
type CreateTaskRequest = Static<typeof CreateTaskRequestSchema>;

server.post<{ Body: CreateTaskRequest }>(
  '/create-task',
  {
    schema: {
      body: CreateTaskRequestSchema,
    },
  },
  async (request, reply) => {
    const { id, text } = request.body;
    tinyTaskDb.insert(tasks).values({ id, text }).run();

    return await reply.status(201).send();
  },
);

const UpdateTaskRequestSchema = Type.Object({
  id: Type.String(),
  text: Type.String(),
});
type UpdateTaskRequest = Static<typeof UpdateTaskRequestSchema>;

server.put<{ Body: UpdateTaskRequest }>(
  '/update-task',
  {
    schema: {
      body: UpdateTaskRequestSchema,
    },
  },
  async (request, reply) => {
    const { id, text } = request.body;
    const runResult = tinyTaskDb
      .update(tasks)
      .set({ text })
      .where(eq(tasks.id, id))
      .run();
    if (runResult.changes !== 1) {
      return await reply.status(404).send();
    }

    return await reply.status(201).send();
  },
);

const DeleteTaskRequestSchema = Type.Object({
  id: Type.String(),
});
type DeleteTaskRequest = Static<typeof DeleteTaskRequestSchema>;
server.delete<{ Body: DeleteTaskRequest }>(
  '/delete-task',
  {
    schema: {
      body: DeleteTaskRequestSchema,
    },
  },
  async (request, reply) => {
    const { id } = request.body;
    const runResult = tinyTaskDb.delete(tasks).where(eq(tasks.id, id)).run();
    if (runResult.changes !== 1) {
      return await reply.status(404).send();
    }

    return await reply.send(204);
  },
);

const GetTaskResponseSchema = Type.Object({
  id: Type.String(),
  text: Type.String(),
});
type GetTaskResponse = Static<typeof GetTaskResponseSchema>;
server.get<{
  Querystring: { id: string };
  Reply: GetTaskResponse;
}>(
  '/get-task',
  {
    schema: {
      querystring: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: GetTaskResponseSchema,
      },
    },
  },
  async (request, reply) => {
    const { id } = request.query;
    const task = await tinyTaskDb.select().from(tasks).where(eq(tasks.id, id));

    if (task.length === 0) {
      return await reply.status(404).send();
    }

    return await reply.send(task[0]);
  },
);

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
