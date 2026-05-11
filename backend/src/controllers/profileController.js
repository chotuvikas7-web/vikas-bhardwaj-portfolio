import Profile from "../models/Profile.js";
import { readProfile, writeProfile } from "../utils/fileProfileStore.js";

const profileFields = ["name", "role", "email", "bio", "linkedIn", "phone", "image", "resume"];

const normalizeProfile = (body, existing = {}) =>
  profileFields.reduce((profile, field) => {
    const value = Object.prototype.hasOwnProperty.call(body, field) ? body[field] : existing?.[field];
    profile[field] = typeof value === "string" ? value.trim() : "";
    return profile;
  }, {});

export const getProfile = async (req, res, next) => {
  try {
    if (process.env.DB_MODE === "file") {
      const profile = await readProfile();
      return res.json(profile || {});
    }

    const profile = await Profile.findOne().sort({ updatedAt: -1 });
    res.json(profile || {});
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateProfile = async (req, res, next) => {
  try {
    const imageFile = req.files?.image?.[0];
    const resumeFile = req.files?.resume?.[0];
    const updateBody = { ...req.body };
    if (imageFile) {
      updateBody.image = `/uploads/${imageFile.filename}`;
    }
    if (resumeFile) {
      updateBody.resume = `/uploads/${resumeFile.filename}`;
    }

    if (process.env.DB_MODE === "file") {
      const existingProfile = (await readProfile()) || {};
      const payload = normalizeProfile(updateBody, existingProfile);
      if (!payload.name) {
        res.status(400);
        throw new Error("Name is required");
      }

      const profile = await writeProfile(payload);
      return res.status(200).json(profile);
    }

    let profile = await Profile.findOne();
    const payload = normalizeProfile(updateBody, profile?.toObject());
    if (!payload.name) {
      res.status(400);
      throw new Error("Name is required");
    }

    if (profile) {
      profile.set(payload);
      await profile.save();
    } else {
      profile = await Profile.create(payload);
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    if (process.env.DB_MODE === "file") {
      await writeProfile(null);
      return res.json({ message: "Profile deleted" });
    }

    const profile = await Profile.findOne();
    if (profile) {
      await profile.deleteOne();
    }

    res.json({ message: "Profile deleted" });
  } catch (error) {
    next(error);
  }
};
