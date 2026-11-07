
import express from "express";
import { requireOpenRegistrations } from '../middleware/registrationStatus.js';
import { startAbstractUpload, uploadAbstractChunk } from '../controllers/abstractUploadController.js';

import {
  createRegistration,
  getPublicRegistrationCount,
} from "../controllers/registrationController.js";

const router = express.Router();

// POST /api/registrations
// POST /api/registrations/
//
// Also works under /registrations and /registrations/.
//
// The controller and all existing validation,
// email, and Google Sheets logic remain unchanged.

router.post("/", requireOpenRegistrations, createRegistration);
router.post('/abstract-uploads', requireOpenRegistrations, startAbstractUpload);
router.post('/abstract-uploads/chunk', requireOpenRegistrations, uploadAbstractChunk);
router.get("/counts/:eventId", getPublicRegistrationCount);

export default router;

