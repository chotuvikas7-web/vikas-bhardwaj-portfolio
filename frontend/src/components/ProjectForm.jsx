import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ProjectForm = ({ initialProject, onSubmit, isSaving, onCancel, categories = [] }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      techStack: "",
      githubLink: "",
      liveLink: "",
      image: ""
    }
  });

  useEffect(() => {
    reset({
      title: initialProject?.title || "",
      description: initialProject?.description || "",
      category: initialProject?.category || categories[0] || "",
      techStack: initialProject?.techStack?.join(", ") || "",
      githubLink: initialProject?.githubLink || "",
      liveLink: initialProject?.liveLink || "",
      image: initialProject?.image || ""
    });
  }, [initialProject, reset, categories]);

  const submit = (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "imageFile") formData.append(key, value || "");
    });
    if (values.imageFile?.[0]) formData.append("imageFile", values.imageFile[0]);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>Title</span>
          <input className="input" {...register("title", { required: "Title is required" })} />
          {errors.title && <small className="text-red-600">{errors.title.message}</small>}
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>Tech stack</span>
          <input className="input" placeholder="React, Node, MongoDB" {...register("techStack", { required: "Tech stack is required" })} />
          {errors.techStack && <small className="text-red-600">{errors.techStack.message}</small>}
        </label>
      </div>
      <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
        <span>Category</span>
        <select className="input h-12" {...register("category", { required: "Category is required" })}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <small className="text-red-600">{errors.category.message}</small>}
      </label>
      <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
        <span>Description</span>
        <textarea className="input min-h-28" {...register("description", { required: "Description is required" })} />
        {errors.description && <small className="text-red-600">{errors.description.message}</small>}
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>GitHub link</span>
          <input className="input" type="url" {...register("githubLink")} />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>Live link</span>
          <input className="input" type="url" {...register("liveLink")} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>Image URL</span>
          <input className="input" {...register("image")} />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          <span>Upload image</span>
          <input className="input file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-1.5 file:text-white dark:file:bg-emerald-400 dark:file:text-slate-950" type="file" accept="image/*" {...register("imageFile")} />
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : initialProject ? "Update project" : "Add project"}
        </button>
        {initialProject && (
          <button className="btn-secondary" type="button" onClick={onCancel}>
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
