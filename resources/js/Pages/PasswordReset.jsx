import { Link, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState, useRef } from "react";

const PasswordReset = () => {
  const page = usePage().props;
  const reset = useRef();
  const [status, setStatus] = useState(undefined);
  const { setData, post, errors } = useForm({
    email: "",
  });

  useEffect(() => {
    console.log(status);
  }, [status]);

  useEffect(() => {
    setStatus(page.success);
    reset.current.disabled = false;
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/forgot-password", {
      onStart: () => (reset.current.disabled = true),
    });
  };

  return (
    <>
      <div className={"reset-container"}>
        <form method="POST" onSubmit={handleSubmit}>
          <img src="/images/logo.png" alt="ChatZone" className="logo" />
          {errors.email && <div className="invalid">{errors.email}</div>}
          {status && <div className="success">{status}</div>}
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setData("email", e.currentTarget.value)}
          />
          <input ref={reset} type="submit" value="Reset Password" />
        </form>
        <Link href="/login">
          Already have an account? <span>Sign in</span>
        </Link>
      </div>
    </>
  );
};

export default PasswordReset;
