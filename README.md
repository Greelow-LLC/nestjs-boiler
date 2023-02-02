<p align="center">
  <a href="https://greelow.com/" target="blank"><img src="https://avatars.githubusercontent.com/u/95771770?s=400&u=cb6af5afc520ee1033ea726defa2c04ab8470506&v=4" width="200" alt="Greelow Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Greelow boilerplate for incoming backend projects.
  <br />
  Developed with Nest JS; A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Installation

```bash
# With SSH
$ git clone git@github.com:Greelow-LLC/nestjs-boiler.git

# With HTTPS
$ git clone https://github.com/Greelow-LLC/nestjs-boiler.git

$ cd nestjs-boiler

$ yarn install

# Signin to dotenv-vault using greelownestboiler@gmail.com
$ yarn env:login

# Pull env variables to local
$ yarn env:pull
```

## Setting up database

```bash
# Must have docker-compose
$ yarn db:up

# Only development (also, do this every time a change on the schema is made)
$ yarn migrate
$ yarn generate

# Only production
$ yarn db:deploy

$ yarn seed
```

## Running the app

```bash
# development
$ yarn dev

# production mode
$ yarn build
$ yarn start:prod
```
