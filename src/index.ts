#!/usr/bin/env node
/* eslint-disable no-console */
import hapi from 'hapi';
import joi from 'joi';
import mongoose from 'mongoose';

const main = async () => {
  console.log('Starting Curse Server');

  const server = new hapi.Server({
    host: 'localhost',
    port: 3000,
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      return h.response({
        success: true,
        data: 'Hello I am  Curse Api',
        version: '0.0.1',
      });
    },
  });

  server.start();
};

main().catch((e) => console.log(e.message));
