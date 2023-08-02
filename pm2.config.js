module.exports = {
  apps: [
    {
      name: "Cosmic Odyssey-jobs",
      script: "npm",
      args: "run start-jobs:dev",
      cwd: "server",
      watch: false,
    },
    {
      name: "Cosmic Odyssey-api",
      script: "npm",
      args: "run start-api:dev",
      cwd: "server",
      watch: false,
    },
    {
      name: "Cosmic Odyssey-client",
      script: "npm run serve",
      cwd: "client",
      watch: false,
    },
  ],
};
