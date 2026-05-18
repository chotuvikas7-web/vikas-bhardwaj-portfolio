import React, { useEffect, useRef, useState } from "react";

const ProjectForm = ({ initialProject, values, onChange, imageFile, onImageFileChange, onSubmit, isSaving, onCancel, onClear, categories = [] }) => {
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const hasDraftValues = Object.values(values).some((value) => String(value || "").trim());

  useEffect(() => {
    if (!imageFile && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imageFile]);

  const updateField = (field) => (event) => {
    if (field === "image" && imageFile) {
      onImageFileChange(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

    onChange({ ...values, [field]: event.target.value });
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: "" }));
    }
  };

  const updateImageFile = (file) => {
    onImageFileChange(file);
    if (file) {
      onChange({ ...values, image: "" });
      if (errors.imageFile) {
        setErrors((current) => ({ ...current, imageFile: "" }));
      }
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = "Title is required";
    if (!values.techStack.trim()) nextErrors.techStack = "Tech stack is required";
    if (!values.category.trim()) nextErrors.category = "Category is required";
    if (!values.description.trim()) nextErrors.description = "Description is required";
    if (!initialProject && !imageFile) nextErrors.imageFile = "Project image is required";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || "");
    });
    if (imageFile) formData.append("imageFile", imageFile);
    onSubmit(formData);
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>Title</span>
          <input className="input" value={values.title} onChange={updateField("title")} />
          {errors.title && <small className="text-red-600">{errors.title}</small>}
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>Tech stack</span>
          <input className="input" placeholder="React, Node, MongoDB" value={values.techStack} onChange={updateField("techStack")} />
          {errors.techStack && <small className="text-red-600">{errors.techStack}</small>}
        </label>
      </div>
      <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
        <span>Category</span>
        <select className="input h-12" value={values.category} onChange={updateField("category")}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <small className="text-red-600">{errors.category}</small>}
      </label>
      <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
        <span>Description</span>
        <textarea className="input min-h-28" value={values.description} onChange={updateField("description")} />
        {errors.description && <small className="text-red-600">{errors.description}</small>}
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>GitHub link</span>
          <input className="input" type="url" value={values.githubLink} onChange={updateField("githubLink")} />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>Live link</span>
          <input className="input" type="url" value={values.liveLink} onChange={updateField("liveLink")} />
        </label>
      </div>
      <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
        <span>Upload image</span>
        <input
          ref={fileInputRef}
          className="input file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-1.5 file:text-white dark:file:bg-emerald-400 dark:file:text-slate-950"
          type="file"
          accept="image/*"
          onChange={(event) => updateImageFile(event.target.files?.[0] || null)}
        />
        {errors.imageFile && <small className="text-red-600">{errors.imageFile}</small>}
      </label>
      {imageFile && <p className="text-sm text-slate-600 dark:text-slate-400">Selected image: {imageFile.name}</p>}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : initialProject ? "Update project" : "Add project"}
        </button>
        {initialProject && (
          <button className="btn-secondary" type="button" onClick={onCancel}>
            Cancel edit
          </button>
        )}
        {!initialProject && hasDraftValues && (
          <button className="btn-secondary" type="button" onClick={onClear}>
            Clear form
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
