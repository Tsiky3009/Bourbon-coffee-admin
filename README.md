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

- [x] create edito api (Mahefa)
  - [x] create collections (table)
  - [x] write endpoints logic
  - [x] test

- [x] create partner api (Tsiky)
  - [x] create collections (table)
  - [x] write endpoints logic
  - [x] test

- [] Dynamic page generation page generation (Mahefa)
  - [] backend: 
    - [] CRUD User Interface
      - /[id] with Static Site Generation
    - [] API
  - [] frontend:
    - dynamic update with Increment Static Rendering

