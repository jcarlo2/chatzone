import { router, usePage, useForm, Link } from "@inertiajs/react";
import React, { useEffect } from "react";

const ChangePassword = () => {
  const { setData, post, errors } = useForm({
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/user/change-password");
  };

  return (
    <form className="change-password" onSubmit={handleSubmit}>
      <Link href={"/profile"}>Back</Link>
      <img src="/images/logo.png" alt="ChatZone" />
      {errors.password && <div className="invalid">{errors.password}</div>}
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setData("password", e.currentTarget.value)}
      />
      {errors.password_confirmation && (
        <div className="invalid">{errors.password_confirmation}</div>
      )}
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) =>
          setData("password_confirmation", e.currentTarget.value)
        }
      />
      <input type="submit" value={"Change Password"} />
    </form>
  );
};

export default ChangePassword;
