import express from 'express';
import {
    getPortfolio,
    upsertPortfolio,
    getPortfolios,
    deletePortfolio,
    updatePortfolio,
    postImage,
    updateImage,
    getImage,
    getImages,
    deleteImage,
    checkExistingImage
} from '../controllers/portfolio.controller.js';
import { checkGitCreated, checkExistingRepos, createRepo, getRepoContent, publishGithub, getGithubPageStatus } from '../controllers/github-api.controller.js';
import auth from '../middleware/auth.middleware.js';
import imageUploader from '../middleware/uploader.middleware.js';

/**
 * @openapi
 * tags:
 *  name: Portfolio
 *  description: API for various portfolio functionalities involving Github and MongoDB.
 * 
 */
const router = express.Router();

// publish includes pushing to github. Saving is only on backend
//NOTE: '/' MUST BE put at the END so it does not intercept the regex detection in the url
router.get('/status', auth, checkGitCreated);


/**
 * @openapi
 * portfolio/checkExistingRepos:
 *  get:
 *    summary: Authenticates user, then checks if user already owns a Github repository under the name specified in query parameters.
 *    tags: [Portfolio]
 *    description: 1. <br />Obtains and attempts to verify JWT from user cookies<br /><br />
 *                 2. Gets query parameter repo from user request and passes it as a query parameter in a GET request to Github API to check for existing Github repositories
 *                    by the same name.
 *    parameters:
 *    - in: cookie
 *      name: authorization
 *      schema:
 *      type: apiKey
 *      required: true
 *      description: Signed Cookie containing JWT encrypted access token.
 *    - in: query
 *      name: repo
 *      schema:
 *      type: string
 *      description: Github Repository name to be checked.
 *      required: true
 *    responses:
 *          200:
 *              description: A Github repository by the name specified in query parameters does not exist for the user.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: Repository does not exist.
 *          404:
 *              description: A Github repository by the name specified in query parameters exists for the user.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Repository exists.
 *          401:
 *              description:  Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user.
 */
router.get('/checkExistingRepos', auth, checkExistingRepos);

/**
 * @openapi
 * portfolio/createRepo:
 *  post:
 *    summary: Authenticates the user, then creates a Github repository for the user via Github API under name specified in query parameters.
 *    tags: [Portfolio]
 *    description: 1. <br />Obtains and attempts to verify JWT from user cookies<br /><br />
 *                 2. Gets repo name from user request and passes it in the body of a POST request to Github API to create a Github repository
 *                    under the repo name.
 *    parameters:
 *      - in: cookie
 *        name: connect.sid
 *        schema:
 *          type: apiKey
 *        required: true
 *        description: Signed Cookie containing session id.
 *    requestBody:
 *      description: Request body takes in the new Github repository's name.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              data:
 *                type: object
 *                properties:
 *                  repo:
 *                    type: string
 *                    description: Name of Github repository to be created.
 *                    example: testRepositoryName
 *    responses:
 *      200:
 *        description: User's access token is successfully invalidated via Github API and the cookie containing the access token is destroyed.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: logout successful
 *      401:
 *        description: Authorization information is missing or invalid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: unauthorized user
 */  
router.post("/createRepo", auth, createRepo);

//TODO shld remove since not being used.
router.get("/getRepoContent", auth, getRepoContent);

/**
 * @openapi
 * portfolio/publishGithub:
 *  put:
 *      summary: Authenticates the user, creates a Github repository if not existing, then pushes files to Github and deploys the Github Repository to ghpages.
 *      tags: [Portfolio]
 *      description: 1. <br />Obtains and attempts to verify JWT from user cookies<br /><br />
 *                   2. Gets repo name, content and route from user request. Files from the user's Github repository under the obtained repo name will be fetched
 *                      via a GET request sent to Github API.<br /><br />
 *                   3. The repository's content will be checked against the request body's content to determine if a SHA key is required to send a PUT request to
 *                      Github API to either create or update a file.
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *      requestBody:
 *          description: Request body takes in the Github Repositories name to be pushed to, the content to be pushed and the route relative to the Github repository root.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: object
 *                              properties:
 *                                  route:
 *                                      type: string
 *                                      description: Path within the Github repository where file content is either to be pulled from or pushed to.
 *                                  content:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              fileName:
 *                                                  type: string
 *                                                  description: Name of file to be created. Path to file must be prepended to it.
 *                                                  example: test/index.html
 *                                              fileContent:
 *                                                  type: string
 *                                                  description: Content of the file to be created. Must be base64 encoded.
 *                                                  example: <h1>hello world</h1>
 *                                  repo:
 *                                      type: string
 *                                      description: Name of Github repository to be either pulled from or pushed to.
 *                                      example: testRepositoryName
 *      responses:
 *          200:
 *              description: Files are successfully pushed to specified Github repository and the repository is deployed to ghpages is necessary.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: successfully pushed all files and deployed to ghpages at https://username.github.io. Please wait for ghpages to load and refresh your browser after loading is completed for changes to take place
 *          400:
 *              description: Either Github repository does not exist, push to Github failed or deployment to ghpages failed.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: ghpages deployment failed
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 *          
 */
router.put("/publishGithub", auth, publishGithub);

/**
 * @openapi
 * portfolio/pageStatus:
 *  get:
 *      summary: Authenticates user, then sends a request to github API to check the deployment status of the Github page of specified repository.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies<br /><br />
 *                   2. Gets Github repository name from query parameter repo and sends a GET request to Github API to fetch status of Github page of the repository.
 *      parameters:
 *      - in: cookie
 *        name: connect.sid
 *        schema:
 *        type: apiKey
 *        required: true
 *        description: Signed Cookie containing session id.
 *      - in: query
 *        name: repo
 *        schema:
 *        type: string
 *        description: Github Repository name whose Github Page is to be checked.
 *        required: true
 *      responses:
 *            200:
 *                description: Status of Github Page of specified Github repository.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: object
 *                            properties:
 *                                data:
 *                                    type: object
 *                                    properties:
 *                                        status:
 *                                            type: string
 *                                            description: Status of Github Page.
 *                                            example: built
 *                                        url:
 *                                            type: string
 *                                            description: Url of Github Page.
 *                                            example: https://username.github.io
 *            400:
 *                description: Error encountered.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: object
 *                            properties:
 *                                data:
 *                                    type: string
 *                                    example: error encountered
 *            401:
 *                description: Authorization information is missing or invalid.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: object
 *                            properties:
 *                                data:
 *                                    type: string
 *                                    example: unauthorized user
 */
router.get("/pageStatus", auth, getGithubPageStatus);

/**
 * @openapi
 * portfolio/upsert:
 *  put:
 *      summary: Authenticates user, then either create a new portfolio document, or update an existing one in mongodb.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies<br /><br />
 *                   2. If user document does not exist in mongodb, a new one will be created and its portfolio refs array will be updated accordingly.<br /><br />
 *                   3. If portfolio document already exists in mongodb, its images ref array will be copied over.<br /><br />
 *                      Then page documents are checked with the page refs within incoming portfolio object and orphaned page documents will be deleted
 *                      along with the entries in its entries refs array.<br /><br />
 *                   4. For each page document within the incoming portfolio object, if the page document exists, the existing page document's
 *                      entries ref array will be checked against that of the incoming page object and orphaned entry documents will be deleted.<br /><br />
 *                   5. Finally, the directories object of each page document will be updated accordingly to reflect the correct directory structure.<br /><br />
 *                   6. The user, portfolio, page and entry documents are then saved in the same order.<br /><br />
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *      requestBody:
 *          description: Request body takes in the user and portfolio object.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: object
 *                              properties:
 *                                  user:
 *                                      type: object
 *                                  portfolio:
 *                                      type: object
 *      responses:
 *          200:
 *              description: portfolio upserted successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: user created and portfolio created for user.
 *                                      _id:
 *                                          type: object
 *                                          description: objectId of portfolio document upserted.
 *                                          example: mongoose objectId
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.put("/upsert", auth, upsertPortfolio);

/**
 * @openapi
 * portfolio/updatePortfolio:
 *  put:
 *      summary: Authenticates user, then updates an existing portfolio document in mongodb.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies.<br /><br />
 *                   2. Updates the existing Portfolio document with the incoming Portfolio object.
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *      requestBody:
 *          description: Request body takes in the user and portfolio object.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: object
 *                              properties:
 *                                  portfolio:
 *                                      type: object
 *      responses:
 *          200:
 *              description: portfolio updated successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: portfolio updated
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.put("/updatePortfolio", auth, updatePortfolio);

/**
 * @openapi
 * portfolio/delete/:id:
 *  delete:
 *      summary: Authenticates user, then deletes an existing portfolio document in mongodb.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies.<br /><br />
 *                   2. Obtains the _id of the portfolio to be deleted from url path and then deletes the portfolio document from mongodb.
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: _id of portfolio to be deleted.
 *      responses:
 *          200:
 *              description: portfolio deleted successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: Successfully deleted Portfolio by id 123456789123
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.delete("/delete/:id", auth, deletePortfolio);

/**
 * @openapi
 * portfolio/checkExistingImage:
 *  get:
 *    summary: Authenticates user, then checks if an image document already exists.
 *    tags: [Portfolio]
 *    description: 1. <br />Obtains and attempts to verify JWT from user cookies<br /><br />
 *                 2. Gets _id of portfolio from url parameter id and label from query parameter label to check if an image
 *                    document that has the same label field and is attached to the portfolio identified by the _id exists.
 *    parameters:
 *    - in: cookie
 *      name: authorization
 *      schema:
 *      type: apiKey
 *      required: true
 *      description: Signed Cookie containing JWT encrypted access token.
 *    - in: query
 *      name: label
 *      schema:
 *      type: string
 *      description: label of image document to be checked.
 *      required: true
 *    responses:
 *          200:
 *              description: Checking for existing image is successful.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      isExist:
 *                                          type: boolean
 *                                          description: true for exists, false for does not exist.
 *          400:
 *              description: error encountered
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description:  Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user.
 */
router.get("/checkExistingImage/:id", auth, checkExistingImage);

/**
 * @openapi
 * portfolio/uploadImage/:id:
 *  post:
 *      summary: Authenticates user, then saves a new Image document and its attached files in mongodb.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies.<br /><br />
 *                   2. Obtains image file and label from request body and _id of portfolio to save the image to from the url parameter id.<br /><br />
 *                   3. The image file will first be saved via uploader middleware, then the _id of the resulting file document will be
 *                      saved as a ref in a new image document containing the label as well.<br /><br />
 *                   4. The _id of the image document is then added to the images ref array of the portfolio document identified by the _id.
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: _id of portfolio to save image to.
 *      requestBody:
 *          description: Request body takes in the user and portfolio object.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: object
 *                              properties:
 *                                  file:
 *                                      type: object
 *                                      description: Javascript file object.
 *                                  label:
 *                                      type: string
 *                                      example: preview
 *      responses:
 *          200:
 *              description: image saved successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: image with label preview has been successfully saved with portfolio image refs updated accordingly
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.post("/uploadImage/:id", auth, imageUploader.single('file'), postImage);

/**
 * @openapi
 * portfolio/updateImage/:id:
 *  put:
 *      summary: Authenticates user, then updates an existing Image document by deleting the image file it currently references, followed by
 *               replacing the reference with that of a new saved image file.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies.<br /><br />
 *                   2. Obtains image file and label from request body and _id of portfolio to save the image to from the url parameter id.<br /><br />
 *                   3. The image file will first be saved via uploader middleware, then the existing image document with fields matching the label and _id
 *                      will be retrieved from mongodb.<br /><br />
 *                   4. The image file currently referenced by the retrieved image document will be deleted and the reference will then be replaced by the _id of
 *                      the newly saved file document. The image document is then saved to update it.
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: _id of portfolio to save image to.
 *      requestBody:
 *          description: Request body takes in the user and portfolio object.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: object
 *                              properties:
 *                                  file:
 *                                      type: object
 *                                      description: Javascript file object.
 *                                  label:
 *                                      type: string
 *                                      example: preview
 *      responses:
 *          200:
 *              description: image updated successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: successfully updated file for image with label preview
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.put("/updateImage/:id", auth, imageUploader.single('file'), updateImage);

/**
 * @openapi
 * portfolio/getImage/:id:
 *  get:
 *      summary: Authenticates user, then retrieves the requested file document and streams the file back as a response.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies.<br /><br />
 *                   2. Obtains label from the query parameter label and the _id of portfolio from url parameter id.<br /><br />
 *                   3. The image document with fields matching the label and portfolio _id is retrieved. The file document it references
 *                      will then be retrieved<br /><br />
 *                   4. Using GridFSBucket, a readable stream will be created from the file document to stream the file as the request response.
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: _id of portfolio from which the image to be retrieved belongs.
 *          - in: query
 *            name: label
 *            schema:
 *              type: string
 *            required: true
 *            description: label of image to be retrieved.
 *      responses:
 *          200:
 *              description: image successfully retrieved.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  format: binary
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.get("/getImage/:id", auth, getImage);

/**
 * @openapi
 * portfolio/getImageRefs/:id:
 *  get:
 *      summary: Authenticates user, then retrieves the images ref array of requested portfolio document.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies.<br /><br />
 *                   2. Obtains the _id of portfolio from url parameter id.<br /><br />
 *                   3. The portfolio document identified by the _id will then be retrieved and 
 *                      its images ref array will then be populated and returned as request response<br /><br />
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: _id of portfolio to retrieve images ref array from.
 *      responses:
 *          200:
 *              description: images ref array successfully retrieved.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: images ref array retrieved successfully
 *                                      images:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              example: image document
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.get("/getImageRefs/:id", auth, getImages);

/**
 * @openapi
 * portfolio/deleteImage/:id:
 *  delete:
 *      summary: Authenticates user, then deletes requested image document and the image file that it references.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies.<br /><br />
 *                   2. Obtains the _id of portfolio from url parameter id and label from request body.<br /><br />
 *                   3. The image document with fields matching the portfolio _id and the label will be retrieved.
 *                      The image document, along with the image file it references, will be deleted from mongodb<br /><br />
 *                   4. The portfolio document identified by the _id will be retrieved and its images ref array will be
 *                      updated to remove the _id of the image document removed. The portfolio document is then saved to update it.
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: _id of portfolio to delete image from.
 *      requestBody:
 *          description: Request body takes in the label of image to be deleted.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: object
 *                              properties:
 *                                  label:
 *                                      type: string
 *                                      example: preview
 *      responses:
 *          200:
 *              description: image successfully deleted.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: image with label preview has been successfully deleted and portfolio refs have been successfully updated
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.delete("/deleteImage/:id", auth, deleteImage);

/**
 * @openapi
 * portfolio/:id:
 *  get:
 *      summary: Authenticates user, then retrieves the requested portfolio document.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies.<br /><br />
 *                   2. Obtains the _id of portfolio from url parameter id.<br /><br />
 *                   3. The portfolio document identified by the _id will then be retrieved and its references will be deep populated<br /><br />
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: _id of portfolio to retrieve.
 *      responses:
 *          200:
 *              description: portfolio successfully retrieved.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      portfolio:
 *                                          type: object
 *                                          example: A deep populated portfolio document
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.get("/:id", auth, getPortfolio);

/**
 * @openapi
 * portfolio/:
 *  get:
 *      summary: Authenticates user, then retrieves the portfolios of the user.
 *      tags: [Portfolio]
 *      description: <br />1. Obtains and attempts to verify JWT from user cookies.<br /><br />
 *                   2. Obtains the _id of the user document from the query parameter id and retrieves the user document identified by the _id from mongodb.<br /><br />
 *                   3. The portfolios ref array of the user document will be populated and then returned as request response.<br /><br />
 *      parameters:
 *          - in: cookie
 *            name: connect.sid
 *            schema:
 *              type: apiKey
 *            required: true
 *            description: Signed Cookie containing session id.
 *          - in: query
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: _id of the user document from which portfolios are to be retrieved from.
 *      responses:
 *          200:
 *              description: portfolios successfully retrieved.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      portfolios:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              example: portfolio document
 *          400:
 *              description: Error encountered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: error encountered
 *          401:
 *              description: Authorization information is missing or invalid.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  example: unauthorized user
 */
router.get("/", auth, getPortfolios);


export default router;