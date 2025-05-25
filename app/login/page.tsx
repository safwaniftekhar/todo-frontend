"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { postSignUp } from "../api/api";
import { useAuth } from "../contexts";
import Swal from "sweetalert2";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const payload = {
        email: values?.email,
        password: values?.password,
      };
      const response = await postSignUp("auth/login", payload);
      const data = await response?.json();
      // return
      if (response?.ok) {
        console.log("data.access_token", data.access_token);
        localStorage.setItem("access_token", data.access_token);
        router.push("/dashboard");
        console.log("data", data);
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to login. Please try again.", "error");
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Title level={3}>Login to account</Title>
        </div>

        <Card>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="john@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter a password" }]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                {isLoading ? "login..." : "Login"}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
