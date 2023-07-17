import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import * as bcrypt from "bcryptjs";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    const id = event.target.email.value;
    const name = event.target.name.value;
    const email = event.target.email.value;
    const mobile = event.target.mobile.value;
    const password = event.target.password.value;

    // Mã hóa mật khẩu
    const hashedPassword = hash(password);

    // Tạo đối tượng user mới
    const newUser = {
      id,
      name,
      email,
      phone: mobile,
      password: hashedPassword,
      role: "Customer",
    };

    try {
      // Gửi yêu cầu đăng ký đến API backend
      const response = await fetch("http://localhost:9999/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        console.log(response.data);

        alert("Đăng ký thành công!");
        navigate("/login");
        // Các xử lý khác sau khi đăng ký thành công
      } else {
        throw new Error("Đăng ký thất bại.");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      // Các xử lý khác khi xảy ra lỗi
    }
  };

  const hash = (password) => {
    return bcrypt.hashSync(password, 10);
  };

  return (
    <>
      <Meta title={"Sign Up"} />
      <BreadCrumb title="Sign Up" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Sign Up</h3>
              <form onSubmit={handleSignUp} className="d-flex flex-column gap-15">
                <CustomInput type="text" name="name" placeholder="Name" />
                <CustomInput type="email" name="email" placeholder="Email" />
                <CustomInput
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                />
                <CustomInput
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                <div>
                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button type="submit" className="button border-0">
                      Sign Up
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Signup;
