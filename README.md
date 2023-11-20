# VISS (Vulnerability Impact Scoring System)
The Vulnerability Impact Scoring System (VISS) captures objective impact characteristics of software, hardware, and firmware vulnerabilities in relation to infrastructure, technology stack, and customer data security. Unlike the Common Vulnerability Scoring System (CVSS), which subjectively evaluates vulnerabilities primarily from an attacker's viewpoint and assumes the worst-case impact, VISS measures responsibly demonstrated impact from a defender's perspective. VISS focuses solely on actual exploitation demonstration, disregarding the theoretical possibility of exploitation. The resulting numerical scores indicate the severity of impact within a specific environment given the risk profile and tolerance of the environment owner. It's important to note that VISS doesn't replace CVSS but rather serves as a complementary evaluation system from a different standpoint.

VISS analysis evaluates thirteen impact aspects for each vulnerability, categorized into Platform, Infrastructure, and Data groups. The resulting VISS score ranges from 0 to 100 and can be adjusted using the Compensating Controls metric. Typically, the organization responsible for the system, environment, network, or product where the vulnerability is found calculates VISS scores. Alternatively, an external party like a bug bounty triage team may perform the evaluation on their behalf.

## Pre-req
VISS requires `node` and `npm` to be already installed.

1. Fetch this repository first:

```sh
git clone ... && cd ...
```

2. Install dependencies and the global `nx` utility: 

```sh
npm install && npm install -g nx
```

## Setup the database
By default, VISS uses the SQLite driver. In the `prisma/schema.prisma`, it's possible to select a different one – see https://www.prisma.io/docs/concepts/components/prisma-schema –.

3.1 Check the `.env` file and define the connection string:

```
DATABASE_URL=[DATABASE_URL]
```

3.2 Generate the database and seed it:

```shell
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Run Development (Local)
4. Run to produce the development releases:

```sh
nx run-many --parallel --target=serve --projects=calculator,configurator
```

## Run Production (Local)
5. Run to produce the production build releases: 

```sh
nx run calculator:build
nx run configurator:build
```

6. A new `dist` folder will be created
7. Run both apps: 
   
```
cd dist/apps/configurator/
PORT=4000 npm run start &
cd -1
cd dist/apps/calculator/
npm run start &
```

## Home & Specifications page
VISS comes with 2 static pages containing a brief description of the scoring system and its specifications.

Those pages are located under `apps/calculator/static` and can be **customized** or **not included** in final build.

Run the following command **only** if you prefer both pages to be shown:

```sh
cp apps/calculator/static dist/apps/calculator/
```

## API Endpoints
The **private configurator** application exposes 4 API endpoints:

| Method | Endpoint | Return |
|---|---|---|
| `GET` | `/api/configuration/all` | Full list of configurations |
| `GET` | `/api/configuration/active` | Active configuration |
| `GET` | `/api/configuration/:id` | Configuration details for a given configuration id |
| `GET` | `/api/configuration/:id/rules` | Ruleset details for a given configuration id |