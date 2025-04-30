import React, { useState, FormEvent } from "react";
import { useAppDispatch } from "../redux/hooks";
import { loginUser } from "../redux/authSlice";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
