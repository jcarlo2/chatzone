import React, { useEffect, useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

const Login = () => {
  const page = usePage().props
  const [message, setMessage] = useState(undefined)

  useEffect(()=> setMessage(page.success),[page])
  
  const { setData, processing, post, errors } = useForm({
    username: "",
    password: "",
    remember_me: false,
  });

  const handleLogin = (e) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <>
      <img src="images/logo.png" alt="" />
      {message && <div className="success">{message}</div>}
      <section className={"login-container"}>
        <form onSubmit={handleLogin}>
          {errors.username && (
            <div className={"invalid"}>{errors.username}</div>
          )}
          <input
            type="text"
            placeholder={"Username"}
            onChange={(e) => setData("username", e.target.value)}
          />
          {errors.password && (
            <div className={"invalid"}>{errors.password}</div>
          )}
          <input
            type="password"
            placeholder={"Password"}
            onChange={(e) => setData("password", e.target.value)}
          />
          <label>
            Remember Me
            <input
              type="checkbox"
              onChange={(e) => setData("remember_me", e.target.checked)}
            />
          </label>
          <input type="submit" defaultValue={"Login"} disabled={processing} />
        </form>
        <p>
          Does not have an account yet?{" "}
          <Link href={"/register"}>Register now</Link>
        </p>
        <Link href={"/forgot-password"}>Forgot password</Link>
      </section>
    </>
  );
};

export default Login;
