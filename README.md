
## How do I run the frontend locally?

1. From the root directory, run `yarn` to install dependencies.
2. Download the `.env` file and place it at `packages/www/.env`.
3. Then run `yarn www dev`, and go to http://localhost:3000/.


## Where is the backend hosted?

It's hosted on a Heroku instance at https://exitweb2.herokuapp.com/.
You will need to use the admin secret (environment variable HASURA_GRAPHQL_ADMIN_SECRET) to login to the console.


<!-- ## How do I start the hasura console?

1. Go to `hasura/config.yaml` and commment in the staging `admin_secret` & `endpoint` values.

2. Go to `hasura/metadata/databases/databases.yaml` and comment in the staging `database_url` value.

From inside the `/hasura` directory, run the following command:

```bash
$ hasura console
```

## How do I run migrations on production?

1. Go to `hasura/config.yaml` and commment in the production `admin_secret` & `endpoint` values.

2. Go to `hasura/metadata/databases/databases.yaml` and comment in the `database_url` value.

3. Run this command to apply migrations

```bash
$ hasura migrate apply --all-databases
```

4. Run the following two commands to apply metadata/permissions

```bash
$ hasura metadata apply --endpoint 'https://apemonitor-production.herokuapp.com/'
$ hasura metadata reload --endpoint 'https://apemonitor-production.herokuapp.com/'
``` -->
