#!/usr/bin/env node
/* eslint-disable no-console */

import dotenv from 'dotenv';
import { createConnection } from './db/connection';
import Curse from './db/model/curse';
import Person from './db/model/person';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createSha256Hash } from './utils';

const ENVFILE = '.env';

export interface CurseConfig {
  DB_CONNECTION_URL: string;
  PORT: string;
}

const error = (message: string) => {
  console.log(message);
  process.exit(1);
};

const main = async () => {
  console.log('Starting Curse Server');
  console.log('Reading Config');

  if (!fs.existsSync(path.resolve(ENVFILE))) {
    error('ConfigFile not exists');
  }

  const config: CurseConfig = (dotenv.parse(
    fs.readFileSync(path.resolve(ENVFILE)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any) as CurseConfig;

  const srv = express();
  srv.use(express.json());
  srv.use(cors());
  srv.get('/', (req: Request, res: Response) => {
    res.json('Hello I am the Curse Api!!');
  });

  srv.listen(config.PORT, () => {
    console.log(`Application is listening on port ${config.PORT}`);
  });

  srv.post('/curse', async (req: Request, res: Response) => {
    const now = new Date();
    try {
      await Curse.create({
        person: req.body.person,
        date: now,
      });
    } catch (e) {
      res.statusCode = 500;
      res.json({ error: e });
    }

    res.json(now.getTime());
  });

  srv.get('/curse/list/:person', async (req: Request, res: Response) => {
    if (!req.params.person) {
      res.statusCode = 400;
      res.json('Bad Request, Param Missing');
    }
    const person = req.params.person;
    const curseList = await Curse.find({ person }).exec();
    res.json(curseList);
  });

  srv.get('/curse', async (req: Request, res: Response) => {
    const curseList = await Curse.find({});
    res.json({ count: curseList.length });
  });

  srv.delete('/curse/:person/:id', async (req: Request, res: Response) => {
    console.log('delete', req.params);
    if (!req.params.person || !req.params.id) {
      res.statusCode = 400;
      res.json('Bad Request, Param Missing');
    }

    const curse = await Curse.findById(req.params.id);
    if (!curse) {
      res.statusCode = 400;
      res.json('Curse not found');
    } else {
      if (curse.person !== req.params.person) {
        res.statusCode = 401;
        res.json('Not allowed');
      } else {
        try {
          await curse.delete();
          res.json(new Date().getTime());
        } catch (e) {
          res.statusCode = 500;
          res.json(e);
        }
      }
    }
  });

  srv.get('/person', async (req: Request, res: Response) => {
    const personList = await Person.find({});
    res.json(personList);
  });

  srv.get('/person/:id', async (req: Request, res: Response) => {
    if (!req.params.id) {
      res.statusCode = 400;
      res.json('Bad Request, Param Missing');
    }
    const userHash = req.params.id;
    const person = await Curse.find({ userHash }).exec();
    res.json(person);
  });

  srv.post('/person', async (req: Request, res: Response) => {
    try {
      const userHash = createSha256Hash(req.body.name.toLowerCase());
      const search = await Person.find({ userHash });
      if (search.length === 1) {
        res.json(search[0]);
      } else if (search.length > 1) {
        res.statusCode = 500;
        res.json({ error: 'More than one user exists' });
      }

      const person = await Person.create({
        name: req.body.name,
        userHash: userHash,
        image: req.body.image,
      });

      res.json(person);
    } catch (e) {
      res.statusCode = 500;
      res.json({ error: e });
    }
  });

  await createConnection(config.DB_CONNECTION_URL);
};

main().catch((e) => console.log(e.message));
