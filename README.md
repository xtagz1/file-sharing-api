# file-sharing-api

### Steps


### Prerequisites

-   [Docker](https://www.docker.com/get-started)
-   [Node.js](https://nodejs.org/)
-   [npm](https://www.npmjs.com/)

1. **Set up the database**:

    ```sh
    docker-compose -f docker-compose.dev.yml up
    ```

2. **Set up Redis**:

    ```sh
    docker-compose up
    ```

    - This also starts the backend service. To save RAM, stop the `whipo` service:

        ```sh
        docker ps  # Find the container ID or name of the `whipo` service
        docker stop <container_id_or_name>
        ```

3. **Run the application**:

    ```sh
    npm install
    npm run migrate
    npm run dev/npm run start
    ```



## Environment Variables

Create a `.env` file in the root of your project with the following variables:

<!-- I added my values already for ease of use -->

FOLDER=uploads 
#  name of the folder where files are being uploaded in app directory

CONFIG="cloudinary" 
#  local or  specific cloud provider  google, aws, azure, cloudinary. But for now only local and cloudinary is supported

SIZE=10485760
# in bytes or 10mb ; size limit for uploading per day in same IP

INACTIVE_DAYS=2 
# days of inactivity before deletion

FILE_CLEANUP_CRON_EXPRESSION=0 0 * * *
#   0  0 * * *   (Minutes) (Hours) (Day of the Month) (Month) (Day of the Week) default is 12 midnight, scheduled time for file cleanup

NODE_ENV="dev"
#  just for dynamic environment dev or prod

PORT=8000
# port

APP_URL=""
#  use for cors to set the fe url in production environment

DATABASE_URL="postgresql://jonix:jonix@13.210.14.98:5433/jonix?schema=public" 
<!-- Please use this database if you are having a hard time setting up docker or local db-->
# db url you can use my deployed db server for ease of use


# I use cloudinary instead,  because I can't use google cloud
#  you can use my cloudinary account creds
CLOUDINARY_FOLDER=uploads
CLOUDINARY_CLOUD_NAME=jonixxx
CLOUDINARY_API_KEY=293145228755551
CLOUDINARY_API_SECRET=f5mk0n0ku6agxRp4lgDaFrC_0xY