  app.use(cors(corsOpts));
  app.use(express.json());

  app.use(routes);

  //-----------------webhooks-----------------------
  app.get('/dynamicBot-webhook/ping', (req, res) => {
    console.log("---------------working--------------")
    res.send('PONG');
  });
  app.post('/dynamicBotWebhook/webhook', webhook)
  app.post('/dynamicBotWebhook/userVerificationWebhook', userVerificationWebhook)
//------------------------------------------------------
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: port }, resolve)
  );
  console.log(
    `🚀 GraphQl server ready at http://localhost:${port}${server.graphqlPath}`
  );
  console.log(`🚀 Express server ready at http://localhost:${port}`);
  return { server, app };
}

startApolloServer();
