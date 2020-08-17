import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import connectToDatabase from './config/database';
// import authRoute from './routes/auth/auth';
// import usersRoute from './routes/users/users';

const PORT = process.env.PORT || 5000;

const app = express();
connectToDatabase();

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
// app.use(express.json({ extended: false }));
// app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => response.send('API Running'));
// app.use('/api/auth', authRoute);
// app.use('/api/users', usersRoute);

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`),
);
