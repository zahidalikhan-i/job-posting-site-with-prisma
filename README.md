this is the source of this site 
https://www.youtube.com/watch?v=gimSKEsWYb4&t=9149s&pp=0gcJCdAJAYcqIYzv


run these commands

npm install

set up database online in neon.com

and past that link in .env file in   DATABASE_URL=''

and also create github connection by adding these lines in .env.local

AUTH_SECRET="" 

AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

then run

npx prisma migrate dev
npx prisma generate

npm run dev 