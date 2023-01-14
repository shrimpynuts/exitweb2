# ExitWeb2

ExitWeb2 is a prototype for porting communities onto Ethereum.

Here's how something like this can be used:
1. A community is created based on some web2 shared state (e.g. members of r/ethereum, follower of @ethereum on Twitter, geth Github contributor)
2. Prospective members submit a link to prove their membership 
3. Trusted admin manually verify the membership to the web2 community
4. Approved members be able to mint an NFT without linking their web2 profile to their Ethereum address
5. NFT owners of the community have access to a private group chat (eventually coordinate actions like fundraise, distribute tokens, form a DAO)

## Motivation 

Bootstrapping web3 communities (for the purpose of targeting users for your product or fundraising, etc.) often involves airdropping tokens.

Bootstrapping process often involves using a product like guild.xyz or simply asking users to "drop your ENS" directly on Twitter. This works, but exposes the link between the NFT and your Twitter/Discord/etc. profile

If we can obfuscate the link between the web2 profile and the Ethereum address, you can have truly pseudonymous identities that can speak credibly without fear of risk to reputation. As these tokens are composable bits of your identity, you can also have varying degrees of pseudonymity.

These ideas are important to the concept coined ["The Pseudonymous Economy"](https://www.youtube.com/watch?v=urtXRg9Nl3k).

## How it works

This project borrows heavily from Sam Ragsdale's [zkp-merkle-airdrop project](https://github.com/a16z/zkp-merkle-airdrop-contracts/). When a prospective member submits their proof-of-membership link, a commitment is made and stored both on the client's web browser (localStorage) and the web server. When the admin decides the proof-of-membership matches the predicate for the community specified, the commitment gets included in a merkle tree. A transaction is then submitted to update root of the merkle tree on the Ethereum smart contract (one transaction can be submitted after all approvals in bulk).

## Problems

This project makes a huge compromise. Users must trust the admin, as they are able to see all of the submitted membership proof links. However, the admin still cannot trace the link between a particular NFT and the web2 profile of the person who redeemed the token. This is obviously a big trust assumption, but I'm yet not aware of any solution to completely private airdrops based on web2 communities without a trusted party.

## Related works

Inspired by the following:
- [zkp-merkle-airdrop](https://github.com/a16z/zkp-merkle-airdrop-contracts/) -  private airdrops using zkp
- [HeyAnon](https://www.heyanon.xyz/) - attaching pseudonymous reputation to speech
- [0xPARC](https://0xparc.org/) - applied zkp innovation


# Development

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
