import React, { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import PageShell from "../components/PageShell";
import { useProfile } from "../context/ProfileContext.jsx";
import { api } from "../api/client";

const countryCodes = [
  { country: "India", region: "IN", code: "+91" },
  { country: "United States", region: "US", code: "+1" },
  { country: "United Kingdom", region: "GB", code: "+44" },
  { country: "Canada", region: "CA", code: "+1" },
  { country: "Australia", region: "AU", code: "+61" },
  { country: "United Arab Emirates", region: "AE", code: "+971" },
  { country: "Singapore", region: "SG", code: "+65" }
];

const Contact = () => {
  const { profile } = useProfile();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const defaultCountryCode = "+91";
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      countryCode: defaultCountryCode
    }
  });
  const phoneValue = watch("phone");
  const sortedCountryCodes = useMemo(() => [...countryCodes].sort((a, b) => b.code.length - a.code.length), []);

  useEffect(() => {
    const normalizedPhone = phoneValue?.trim();
    if (!normalizedPhone?.startsWith("+")) return;

    const matchedCountry = sortedCountryCodes.find((item) => normalizedPhone.startsWith(item.code));
    if (matchedCountry) {
      setValue("countryCode", matchedCountry.code, { shouldValidate: true });
      setValue("phone", normalizedPhone.slice(matchedCountry.code.length).trimStart(), { shouldValidate: true });
    }
  }, [phoneValue, setValue, sortedCountryCodes]);

  const submit = async (data) => {
    setSending(true);
    setError("");
    try {
      await api.post("/messages", data);
      setSent(true);
      reset({ countryCode: defaultCountryCode, name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  const contactRows = [
    { id: 1, channel: "Email", value: profile?.email || "contact@vikasbhardwaj.com", icon: Mail },
    { id: 2, channel: "Phone", value: profile?.phone || "Remote and hybrid friendly", icon: Phone },
    ...(profile?.linkedIn ? [{ id: 3, channel: "LinkedIn", value: profile.linkedIn, icon: Mail }] : [])
  ];

  return (
    <PageShell>
      <Helmet>
        <title>Contact | Vikas Bhardwaj</title>
        <meta name="description" content="Contact Vikas Bhardwaj for UI development work." />
      </Helmet>

      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-800 dark:text-cyan-200">Contact</p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">Let's build something useful.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-slate-800 dark:text-white/70">
          Have a project, collaboration, or UI idea in mind? Share the details and I will get back to you with a thoughtful response.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          {contactRows.map((row, index) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="rounded-xl border border-slate-900/10 bg-white/75 p-6 shadow-2xl shadow-slate-400/20 backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-black/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-800 shadow-[0_0_26px_rgba(13,148,136,0.12)] dark:bg-cyan-100/15 dark:text-cyan-100 dark:shadow-[0_0_26px_rgba(165,243,252,0.16)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800 dark:text-cyan-100">{row.channel}</p>
                    {row.channel === "LinkedIn" ? (
                      <a className="mt-2 block break-all text-lg font-bold text-slate-950 underline decoration-slate-500/40 underline-offset-4 hover:text-teal-800 dark:text-white dark:decoration-white/30 dark:hover:text-cyan-100" href={row.value} target="_blank" rel="noreferrer">
                        {row.value}
                      </a>
                    ) : (
                      <p className="mt-2 break-all text-lg font-bold text-slate-950 dark:text-white">{row.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(submit)}
          className="space-y-4 rounded-xl border border-slate-900/10 bg-white/75 p-6 shadow-2xl shadow-slate-400/20 backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-black/20"
        >
          {sent && <div className="rounded-md bg-teal-100 p-3 text-sm font-medium text-teal-900 dark:bg-cyan-100/15 dark:text-cyan-50">Message sent successfully. I will reply to your email soon.</div>}
          {error && <div className="rounded-md bg-rose-100 p-3 text-sm font-medium text-rose-800 dark:bg-rose-500/15 dark:text-rose-100">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-950 dark:text-white">
              <span>Name</span>
              <input className="input border-slate-300 bg-white/85 text-slate-950 placeholder:text-slate-500 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40" {...register("name", { required: "Name is required" })} />
              {errors.name && <small className="text-rose-700 dark:text-rose-200">{errors.name.message}</small>}
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-950 dark:text-white">
              <span>Email</span>
              <input className="input border-slate-300 bg-white/85 text-slate-950 placeholder:text-slate-500 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40" type="email" {...register("email", { required: "Email is required" })} />
              {errors.email && <small className="text-rose-700 dark:text-rose-200">{errors.email.message}</small>}
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
            <label className="space-y-2 text-sm font-medium text-slate-950 dark:text-white">
              <span>Country code</span>
              <select className="input border-slate-300 bg-white/85 text-slate-950 dark:border-white/15 dark:bg-white/10 dark:text-white" {...register("countryCode", { required: "Country code is required" })}>
                {countryCodes.map((item) => (
                  <option key={`${item.region}-${item.code}`} value={item.code} className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
                    {item.code} {item.region}
                  </option>
                ))}
              </select>
              {errors.countryCode && <small className="text-rose-700 dark:text-rose-200">{errors.countryCode.message}</small>}
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-950 dark:text-white">
              <span>Phone number</span>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700 dark:text-cyan-100" />
                <input
                  className="input border-slate-300 bg-white/85 pl-10 text-slate-950 placeholder:text-slate-500 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
                  type="tel"
                  placeholder="Enter phone number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+?[0-9\s-]{6,30}$/,
                      message: "Enter a valid phone number"
                    }
                  })}
                />
              </div>
              {errors.phone && <small className="text-rose-700 dark:text-rose-200">{errors.phone.message}</small>}
            </label>
          </div>
          <label className="space-y-2 text-sm font-medium text-slate-950 dark:text-white">
            <span>Message</span>
            <textarea className="input min-h-40 border-slate-300 bg-white/85 text-slate-950 placeholder:text-slate-500 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40" {...register("message", { required: "Message is required", minLength: { value: 10, message: "Message should be at least 10 characters" } })} />
            {errors.message && <small className="text-rose-700 dark:text-rose-200">{errors.message.message}</small>}
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:opacity-60" type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send message"} <Send className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </PageShell>
  );
};

export default Contact;
