/**
 * Swagger JSDoc API Specifications for Campaign Module
 */

/**
 * @swagger
 * tags:
 *   name: Campaign Management
 *   description: Manage email campaigns and leads
 */

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: List campaigns
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               campaignChannel:
 *                 type: string
 *                 enum: [Email, SMS, WhatsApp]
 *               category:
 *                 type: string
 *               serviceType:
 *                 type: string
 *               templateId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Campaign created
 */

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *   put:
 *     summary: Update campaign
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign updated
 *   delete:
 *     summary: Delete campaign
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign deleted
 */

/**
 * @swagger
 * /campaigns/{id}/start:
 *   post:
 *     summary: Start campaign
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign started
 */

/**
 * @swagger
 * /campaigns/{id}/pause:
 *   post:
 *     summary: Pause campaign
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign paused
 */

/**
 * @swagger
 * /campaigns/{id}/resume:
 *   post:
 *     summary: Resume campaign
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign resumed
 */

/**
 * @swagger
 * /campaigns/{id}/cancel:
 *   post:
 *     summary: Cancel campaign
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign cancelled
 */

/**
 * @swagger
 * /campaigns/{id}/analytics:
 *   get:
 *     summary: Get campaign analytics
 *     tags: [Campaign Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 */

/**
 * @swagger
 * tags:
 *   name: Campaign Webhooks
 *   description: Webhooks from n8n for campaign status
 */

/**
 * @swagger
 * /campaigns/email-status:
 *   patch:
 *     summary: Update email status from n8n webhook
 *     tags: [Campaign Webhooks]
 *     responses:
 *       200:
 *         description: Status updated
 */

/**
 * @swagger
 * /campaigns/reply:
 *   patch:
 *     summary: Update reply status from n8n webhook
 *     tags: [Campaign Webhooks]
 *     responses:
 *       200:
 *         description: Status updated
 */
