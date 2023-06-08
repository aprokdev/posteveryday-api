<p align="center">
<img src="https://www.posteveryday.ca/_next/static/media/logo.614a4fab.svg" style="display: block; width: 200px; margin: 10px auto;" />
  <strong> API</strong>
</p>

<p align="center" style="text-align: center"> Powered by: </p>

<p align="center">
  <span>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png" style="width: 40px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  
  <span>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Node.js_logo_2015.svg/2560px-Node.js_logo_2015.svg.png" style="width: 100px; padding-right: 20px;" />&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  
  <span>
  <img src="https://cdn.cdnlogo.com/logos/a/34/amazon-s3.svg" style="width: 100px; padding-right: 20px;" />&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
</p>

<p align="center">
  
  <span>
  <img src="https://cdn.worldvectorlogo.com/logos/prisma-2.svg" style="width: 100px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  
  <span>
  <img src="https://miro.medium.com/v2/resize:fit:788/0*Qdg5QbuCGOI7qzsF.png" style="width: 100px; padding-right: 20px;" />&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
</p>

<br />

This is an additional REST API for a [POSTEVERYDAY](https://github.com/aprokdev/posteveryday) project. I have made it in addition to the main project, to get some practice with REST APIs development. Unlikely to build-in API in the [POSTEVERYDAY](https://github.com/aprokdev/posteveryday) project, for authentication this API uses JWT tokens, which you have to store additionally and use in all your requests to this API.

When you clone this repository, install all dependancies by running ```npm i```.

Then create .env file with necessary content:
```
DATABASE_URL="mysql://your-database-link"

TOKEN_SECRET="this-is-a-secret-value-with-at-least-32-characters"

AWS_ACCESS_KEY_ID="your-aws-access-key-id"

AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"

AWS_S3_BUCKET_NAME="your-aws-bucket-name"
```

Repository contains Prisma-related settings in /prisma folder and you can seed your empty database with random data by running 

```bash
# more here: https://www.prisma.io/docs/guides/migrate/seed-database
npx prisma db seed
```

Then you can run app in development mode by running ```npm run dev```

To *build* production Javascript version of app run ```npm run build```. You might need additionally install tsc-alias package to make aliases work during build time, you can read [here](https://www.npmjs.com/package/tsc-alias)

## Routes

App contains following routes and corresponding methods:

'/users/' (GET) - to get user info. You should sent an email in request body

'/users/register' (POST) - to create user. You should sent email, first_name, last_name, password fields in request body.

'/users/login' (POST) - to login user and get jwt. You should sent email and password fields in request body.

'/posts/' (GET) - to get list of posts. You can send offset, limit, author_id, order, order_field fields in request body.  'order' field value could be 'asc' or 'desc' (default), more here: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#orderby.  'order_field' field value is a value by witch ordering will be done, default is 'created' field in post data (date of post creation)

'/posts/create' (POST) - to create post. You should send string fields 'title', 'html' and image file in 'image' field. All fields are required. Use formdata for this request.

'/posts/update' (PUT) - to update post. Use the same fields as in '/posts/create' request, but fields aren't required.

'/posts/delete' (DELETE) - to delete particular post. 'image' and 'id' fields are required. For 'image' field use image link from post data, to delete it from S3.

