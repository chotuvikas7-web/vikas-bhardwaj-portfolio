import Profile from "../models/Profile.js";
import { readProfile, writeProfile } from "../utils/fileProfileStore.js";

const normalizeProfile = (body) => ({
  name: typeof body.name === "string" ? body.name.trim() : "",
  role: typeof body.role === "string" ? body.role.trim() : "",
  email: typeof body.email === "string" ? body.email.trim() : "",
  bio: typeof body.bio === "string" ? body.bio.trim() : "",
  linkedIn: typeof body.linkedIn === "string" ? body.linkedIn.trim() : "",
  phone: typeof body.phone === "string" ? body.phone.trim() : "",
  image: typeof body.image === "string" ? body.image.trim() : "",
  resume: typeof body.resume === "string" ? body.resume.trim() : ""
});

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
    const image = imageFile ? `/uploads/${imageFile.filename}` : req.body.image;
    const resume = resumeFile ? `/uploads/${resumeFile.filename}` : req.body.resume;
    const payload = normalizeProfile({ ...req.body, image, resume });
    if (!payload.name) {
      res.status(400);
      throw new Error("Name is required");
    }

    if (process.env.DB_MODE === "file") {
      const profile = await writeProfile(payload);
      return res.status(200).json(profile);
    }

    let profile = await Profile.findOne();
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
