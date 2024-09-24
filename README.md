## Step 0

- create a .env.local from .env.local.example (do not delete .env.local.example!!!)
- Update MONGODB_URI="" in .env.local


## NextAuth
When deploying your site set the NEXTAUTH_URL environment variable to the canonical URL of the website.

```
NEXTAUTH_URL=https://example.com
````

## Task
- [x] Connect mongo

- [] setup NextAuth (Mahefa)
  - Google OAuth;
    - same google account that store the editos

- [] create edito api (Mahefa)
  - [] write endpoints logic
    - connect to google drive API
  - [] test

- [] create partners api (Tsiky)
  - [] create collections (table)
  - [] write endpoints logic
  - [] test

- [] Dynamic page generation page generation (Mahefa)
